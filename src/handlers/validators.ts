import { Request } from "itty-router";
import { GraphQLClient } from "../helpers/graphql";
import { BigDipperApi } from "../api/bigDipperApi";
import { ValidatorStatus } from "../types/types";

const epoch = new Date("2016-3-17");

type Status = {
    _: any;
    operatorAddress: string,
    moniker: string,
    jailed: boolean,
    status: ValidatorStatus,
    explorerUrl: string
    activeBlocks: number,
    lastChecked: Date,
    lastJailed: Date,
    jailedCount: number,
};

export async function fetchStatuses() {
    let gql_client = new GraphQLClient(GRAPHQL_API);
    let bd_api = new BigDipperApi(gql_client);
    let validators: any = await bd_api.get_validators();
    let slashing_params: any = await bd_api.get_slashing_params();
    let signed_blocks_window = slashing_params[0].params.signed_blocks_window;

    let statuses: Status[] = [];
    for (let i = 0; i < validators.length; i++) {
        let s = validators[i];
        let missed_blocks_counter = s.validatorSigningInfos[0].missedBlocksCounter;
        s.validatorCondition = (1 - (missed_blocks_counter / signed_blocks_window)) * 100;

        if ((Object.keys(validators[i].validatorSigningInfos).length !== 0) && (Object.keys(validators[i].validatorStatuses).length !== 0)) {
            statuses.push(await buildStatus(s));
        }
    }

    statuses.sort((a, b) => (a.operatorAddress > b.operatorAddress) ? 1 : ((b.operatorAddress > a.operatorAddress) ? -1 : 0));

    return statuses;
}

async function buildStatus(s: any): Promise<Status> {
    let state: ValidatorStatus = s.state;

    return {
        _: s,
        operatorAddress: s.validatorInfo.operatorAddress,
        moniker: s.validatorDescriptions.moniker,
        jailed: s.validatorStatuses.jailed,
        status: state,
        explorerUrl: `https://explorer.cheqd.io/validators/${s.validatorInfo.operatorAddress}`,
        activeBlocks: parseFloat(s.validatorCondition.toFixed(2)),
        lastChecked: epoch,
        lastJailed: epoch,
        jailedCount: 0
    };

}

export async function handler(request: Request): Promise<Response> {
    let statuses = await fetchStatuses();

    return new Response(JSON.stringify(statuses));
}
