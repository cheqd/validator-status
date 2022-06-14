import { GraphQLClient } from "../helpers/graphql";
import { Validator, SlashingParams } from "../types/types";

export class BigDipperApi {
    constructor(public readonly graphql_client: GraphQLClient) {
    }

    async get_validators(): Promise<Validator> {
        let query = "query Validators {\n" +
            "  validator {\n" +
            "    validatorStatuses: validator_statuses(order_by: {height: desc}, limit: 1) {\n" +   
            "      status\n" +
            "      jailed\n" +
            "      height\n" +
            "    }\n" +
            "    validatorSigningInfos: validator_signing_infos(order_by: {height: desc}, limit: 1) {\n" +
            "      missedBlocksCounter: missed_blocks_counter\n" +
            "      tombstoned\n" +
            "    }\n" +
            "    validatorInfo: validator_info {\n" +
            "      operatorAddress: operator_address\n" +
            "    }\n" +
            "    validatorDescriptions: validator_descriptions(order_by: {height: desc}, limit: 1) {\n" +
            "      moniker\n" +
            "    }\n" +
            "  }\n" +
            "}\n";

        let resp = await this.graphql_client.query<{ validator: Validator }>(query);
        return resp.validator;
    }

    async get_slashing_params(): Promise<SlashingParams> {
        let query = "query Params {\n" +
        "               slashingParams: slashing_params(limit: 1, order_by: {height: desc}) {\n" +
        "                   params\n" +
        "               }\n" +
        "           }\n";

        let resp = await this.graphql_client.query<{ slashingParams: SlashingParams }>(query);
        return resp.slashingParams;
    }

    async get_validator(validator: Validator): Promise<Validator> {
        let accounts =  await this.get_validators();
        return validator;
    }
}
