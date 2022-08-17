import { Request } from "itty-router";
import { GraphQLClient } from "../helpers/graphql";
import { BigDipperApi } from "../api/bigDipperApi";
import { ValidatorModified } from "../types/types";

export async function handler(request: Request): Promise<Response> {
    let gql_client = new GraphQLClient(GRAPHQL_API);
    let bd_api = new BigDipperApi(gql_client);
    let validators = await bd_api.get_validators();
    let slashing_params = await bd_api.get_slashing_params();
    let signed_blocks_window = slashing_params[0].params.signed_blocks_window;
    let validators_modified: ValidatorModified[] = [];
    let missed_blocks_counter = 0;

    for (var i = 0; i < validators.length; i++) {
        if ((Object.keys(validators[i].validatorSigningInfos).length !== 0) && (Object.keys(validators[i].validatorStatuses).length !== 0)) {
            missed_blocks_counter = validators[i].validatorSigningInfos[0].missedBlocksCounter;
            validators[i].validatorCondition = (1 - (missed_blocks_counter / signed_blocks_window)) * 100;
            validators_modified.push({
                operatorAddress: validators[i].validatorInfo.operatorAddress,
                jailed: validators[i].validatorStatuses[0].jailed,
                status: validators[i].validatorStatuses[0].status,
                moniker: validators[i].validatorDescriptions[0].moniker,
                condition: validators[i].validatorCondition,
            });
        } else {
            continue;
        }

        validators_modified.sort((a,b) => (a.operatorAddress > b.operatorAddress) ? 1 : ((b.operatorAddress > a.operatorAddress) ? -1 : 0));

    }

    return new Response(JSON.stringify(validators_modified));
}
