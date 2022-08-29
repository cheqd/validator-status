export type Params = {
    signed_block_window: number;
    min_signed_per_window: number;
    downtime_jail_duration: number;
    slash_fraction_downtime: number;
    slash_fraction_double_sign: number;
}

export type SlashingParams = {
    params: Params;
}

export enum ValidatorState {
    Active,
    Jailed,
    Tombstoned,
    Degraded,
    NeverJailed,
}

export type Statuses = {
    status: number;
    jailed: boolean;
    height: number;
}

export type SigningInfos = {
    missedBlocksCounter: number;
    tombstoned: boolean;
}

export type Descriptions = {
    moniker: string;
}

export type Info = {
    operatorAddress: string;
}

export type Validator = {
    validatorStatuses: Statuses;
    validatorSigningInfos: SigningInfos;
    validatorDescriptions: Descriptions;
    validatorInfo: Info;
    validatorCondition?: number;
}

export type ValidatorStatusRecord = {
    // _: any,
    operatorAddress: string,
    moniker: string,
    status: string,
    explorerUrl: string
    activeBlocks: number,
    lastChecked: Date,
    lastJailed: Date,
    jailedCount: number,
};
