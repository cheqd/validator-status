import { Request } from "itty-router";
import { GraphQLClient } from "../helpers/graphql";
import { BigDipperApi } from "../api/bigDipperApi";
import { ValidatorModified, ValidatorStatus } from "../types/types";

export async function fetchStatuses() {
    let gql_client = new GraphQLClient(GRAPHQL_API);
    let bd_api = new BigDipperApi(gql_client);
    let validators: any = await bd_api.get_validators();
    let slashing_params: any = await bd_api.get_slashing_params();
    let signed_blocks_window = slashing_params[0].params.signed_blocks_window;
    let statuses: ValidatorModified[] = [];
    let missed_blocks_counter = 0;

    for (let i = 0; i < validators.length; i++) {
        if ((Object.keys(validators[i].validatorSigningInfos).length !== 0) && (Object.keys(validators[i].validatorStatuses).length !== 0)) {
            missed_blocks_counter = validators[i].validatorSigningInfos[0].missedBlocksCounter;
            validators[i].validatorCondition = (1 - (missed_blocks_counter / signed_blocks_window)) * 100;
            let status: any = {
                operatorAddress: validators[i].validatorInfo.operatorAddress,
                hasBeenJailed: validators[i].validatorStatuses[0].jailed,
                status: validators[i].validatorStatuses[0].status,
                moniker: validators[i].validatorDescriptions[0].moniker,
                condition: validators[i].validatorCondition.toFixed(2),
            };

            let statusText = "active";
            if (status.hasBeenJailed) {
                statusText = "jailed";
            } else {
                if (status.status === ValidatorStatus.Tombstoned) {
                    statusText = "tombstoned";
                }
            }

            let key = `${statusText}.${status.operatorAddress}`;
            let bytes = new TextEncoder().encode(JSON.stringify(status));

            // always update kv store with the latest validator status
            const res = await KVValidators.put(key, bytes);

            statuses.push(status);
        }
    }

    statuses.sort((a, b) => (a.operatorAddress > b.operatorAddress) ? 1 : ((b.operatorAddress > a.operatorAddress) ? -1 : 0));

    return statuses;
}

export async function handler(request: Request): Promise<Response> {
    let statuses = await fetchStatuses();

    return new Response(JSON.stringify(statuses));
}
