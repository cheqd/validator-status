import { Request } from "itty-router";
import { GraphQLClient } from "../helpers/graphql";
import { BigDipperApi } from "../api/bigDipperApi";
// import { GRAPHQL_API } from "../helpers/constants";

export async function handler(request: Request): Promise<Response> {
    let gql_client = new GraphQLClient(GRAPHQL_API);
    let bd_api = new BigDipperApi(gql_client);
    let validators = await bd_api.get_validators();
    let slashing_params = await bd_api.get_slashing_params();
    let signed_blocks_window = slashing_params[0].params.signed_blocks_window;

    for (var i = 0; i < validators.length; i++) {
        console.log("i is: " + i)
        if (Object.keys(validators[i].validatorSigningInfos).length === 0) {
            missed_blocks_counter = 999;
        } else {
            missed_blocks_counter = validators[i].validatorSigningInfos[0].missedBlocksCounter;
        }
        console.log("Missed blocks: " + missed_blocks_counter);
        validators[i].validatorCondition = (1 - (missed_blocks_counter / signed_blocks_window)) * 100;

        console.log(validators)
    }

    return new Response(JSON.stringify(validators));
}
