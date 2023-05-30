import { IRequest } from "itty-router";
import { GraphQLClient } from "../helpers/graphql";
import { BigDipperApi } from "../api/bigDipperApi";
import { ValidatorState, ValidatorStatusRecord } from "../types/types";
import { getValidatorStatus } from "../helpers/validators";
import { CosmosClient, CosmosValidator } from "../api/cosmosApi";

const epoch = new Date();

export async function fetchStatuses() {
    let gql_client = new GraphQLClient(GRAPHQL_API);
    let cosmos_api = new CosmosClient(COSMOS_API);
    let bd_api = new BigDipperApi(gql_client);
    let validators: any = await bd_api.get_validators();
    let slashing_params: any = await bd_api.get_slashing_params();
    let signed_blocks_window = slashing_params[0].params.signed_blocks_window;

    const res = await cosmos_api.getValidators();
    let cosmosValidators = new Map<string, CosmosValidator>();
    for (let i = 0; i < res.validators?.length; i++) {
        const val = res.validators[i];
        cosmosValidators.set(val.operator_address.toString(), val)
    }

    let statuses: ValidatorStatusRecord[] = [];
    for (let i = 0; i < validators.length; i++) {
        let s = validators[i];
        let addr = s.operatorAddress;
        let missed_blocks_counter = s.validatorSigningInfos[0].missedBlocksCounter;
        s.validatorCondition = (1 - (missed_blocks_counter / signed_blocks_window)) * 100;

        if ((Object.keys(validators[i].validatorSigningInfos).length !== 0) && (Object.keys(validators[i].validatorStatuses).length !== 0)) {
            let validator = addr ? cosmosValidators.get(addr) : null;
            let rec = await buildStatus(validator ?? null, s)

            statuses.push(rec);
            await VALIDATOR_CONDITION.put(rec.operatorAddress, JSON.stringify(rec))
        }
    }

    statuses.sort((a, b) => (a.operatorAddress > b.operatorAddress) ? 1 : ((b.operatorAddress > a.operatorAddress) ? -1 : 0));

    return statuses;
}

export async function fetchStatusesByState(state: string): Promise<Array<ValidatorStatusRecord>> {
    const statuses = await fetchStatuses()
    let filtered = new Array<ValidatorStatusRecord>();

    for (const status of statuses) {
        if (status.status === state) {
            filtered.push(status)
        }
    }

    return filtered;
}

async function buildStatus(validator: CosmosValidator | null, status: any): Promise<ValidatorStatusRecord> {
    let validatorStatus = getValidatorStatus(status.validatorStatuses[0], status.validatorSigningInfos.tombstoned)

    let s: string

    if (status.validatorSigningInfos[0].tombstoned) {
        s = ValidatorState[ValidatorState.Tombstoned]
    } else {
        switch (validatorStatus.status) {
            case 'jailed':
                s = ValidatorState[ValidatorState.Jailed]
                break;
            case 'tombstoned':
                s = ValidatorState[ValidatorState.Tombstoned]
                break;
            default:
            case 'active':
                s = ValidatorState[ValidatorState.Active]
        }
    }

    let lastJailed = epoch;
    if (validator) {
        if (validator.unbonding_height !== "0") {
            lastJailed = new Date(validator.unbonding_time.toString())
        }
    }

    return {
        operatorAddress: status.validatorInfo.operatorAddress,
        moniker: status?.validatorDescriptions?.[0]?.moniker ?? '',
        status: s.toLowerCase(),
        explorerUrl: `https://bigdipper.live/cheqd/validators/${status.validatorInfo.operatorAddress}`,
        activeBlocks: parseFloat(status.validatorCondition.toFixed(2)),
        lastChecked: new Date(),
        lastJailed: lastJailed,
    };
}

export async function handler(request: IRequest): Promise<Response> {
    let statuses = await fetchStatuses();

    return new Response(JSON.stringify(statuses), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
