export interface ValidatorsResponse {
    validators: CosmosValidator[];
    pagination: Pagination | null;
}

export interface CosmosValidator {
    operator_address: string;
    consensus_pubkey: ConsensusPubkey;
    jailed: boolean;
    status: string;
    tokens: string;
    delegator_shares: string;
    description: Description;
    unbonding_height: string;
    unbonding_time: string;
    commission: Commission;
    min_self_delegation: string;
}

export interface ConsensusPubkey {
    type: string;
    key: string;
}

export interface Description {
    moniker: string;
    identity: string;
    website: string;
    security_contact: string;
    details: string;
}

export interface Commission {
    commission_rates: CommissionRates;
    update_time: string;
}

export interface CommissionRates {
    rate: string;
    max_rate: string;
    max_change_rate: string;
}

export interface Pagination {
    next_key?: null;
    total: string;
}

export class CosmosClient {
    constructor(public readonly apiUrl: string) {
    }

    async getValidators(): Promise<ValidatorsResponse> {
        try {
            const init = {
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                },
            };

            const url = `${this.apiUrl}/staking/v1beta1/validators`;
            console.log(`Requesting validators from Cosmos api (${url})...`)

            const res = await fetch(url, init);

            return await res.json();
        } catch (err: any) {
            console.error(err)
        }

        return {} as ValidatorsResponse;
    }
}
