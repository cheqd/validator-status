import { Request } from "itty-router";
import { GraphQLClient } from "../helpers/graphql";
import { BigDipperApi } from "../api/bigDipperApi";
import { ValidatorState, ValidatorStatusRecord } from "../types/types";
import { getValidatorStatus } from "../helpers/validators";

const util = require('util')

const epoch = new Date("2016-3-17");

export async function fetchStatuses() {
    let gql_client = new GraphQLClient(GRAPHQL_API);
    let bd_api = new BigDipperApi(gql_client);
    let validators: any = await bd_api.get_validators();
    let slashing_params: any = await bd_api.get_slashing_params();
    let signed_blocks_window = slashing_params[0].params.signed_blocks_window;

    let statuses: ValidatorStatusRecord[] = [];
    for (let i = 0; i < validators.length; i++) {
        let s = validators[i];
        let missed_blocks_counter = s.validatorSigningInfos[0].missedBlocksCounter;
        s.validatorCondition = (1 - (missed_blocks_counter / signed_blocks_window)) * 100;

        if ((Object.keys(validators[i].validatorSigningInfos).length !== 0) && (Object.keys(validators[i].validatorStatuses).length !== 0)) {
            let rec = await buildStatus(s)
            statuses.push(rec);
            await KVValidator.put(rec.operatorAddress, JSON.stringify(rec))
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

async function buildStatus(v: any): Promise<ValidatorStatusRecord> {
    let validatorStatus = getValidatorStatus(v.validatorStatuses[0], v.validatorSigningInfos.tombstoned)

    let s: string

    if (v.validatorSigningInfos[0].tombstoned) {
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

    let jailedCount = 0
    if (v.lastJailed != epoch) {
        let rec = await KVValidator.get(v.operatorAddress)
        if (rec) {
            let val: ValidatorStatusRecord = JSON.parse(rec)

            jailedCount = val.jailedCount
        }

        jailedCount++
    }

    return {
        _: v.validatorSigningInfos,
        operatorAddress: v.validatorInfo.operatorAddress,
        moniker: v.validatorDescriptions.moniker,
        status: s.toLowerCase(),
        explorerUrl: `https://explorer.cheqd.io/validators/${v.validatorInfo.operatorAddress}`,
        activeBlocks: parseFloat(v.validatorCondition.toFixed(2)),
        lastChecked: new Date(),
        lastJailed: epoch,
        jailedCount: 0
    };
}

export async function handler(request: Request): Promise<Response> {
    let statuses = await fetchStatuses();

    return new Response(JSON.stringify(statuses), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
