import { GraphQLClient } from '../helpers/graphql';
import { SlashingParams, Validator } from '../types/types';

export class BigDipperApi {
	constructor(public readonly graphql_client: GraphQLClient) {}

	async get_validators(): Promise<Validator> {
		let query = `
query Validator {
  validator {
    validatorStatuses: validator_statuses(order_by: {height: desc}, limit: 1) {
      status
      jailed
      height
    }
    validatorSigningInfos: validator_signing_infos(order_by: {height: desc}, limit: 1) {
      missedBlocksCounter: missed_blocks_counter
      tombstoned
    }
    validatorInfo: validator_info {
      operatorAddress: operator_address
    }
    validatorDescriptions: validator_descriptions(order_by: {height: desc}, limit: 1) {
      moniker
    }
  }
}`;

		let resp = await this.graphql_client.query<{ validator: Validator }>(query);
		return resp.validator;
	}

	async get_slashing_params(): Promise<SlashingParams> {
		let query = `
query Params {
   slashingParams: slashing_params(limit: 1, order_by: {height: desc}) {
       params
   }
}
       `;

		let resp = await this.graphql_client.query<{ slashingParams: SlashingParams }>(query);
		return resp.slashingParams;
	}

	async get_validator(validator: Validator): Promise<Validator> {
		let accounts = await this.get_validators();
		return validator;
	}
}
