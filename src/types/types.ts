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

export type ValidatorStatuses = {
    status: number;
    jailed: boolean;
    height: number;
}

export type ValidatorSigningInfos = {
    missedBlocksCounter: number;
    tombstoned: boolean;
}

export type ValidatorDescriptions = {
    moniker: string;
}

export type ValidatorCondition = {
    condition?: number;
}

export type Validator = {
    validatorStatuses: ValidatorStatuses;
    validatorSigningInfos: ValidatorSigningInfos;
    validatorDescriptions: ValidatorDescriptions;
    validatorCondition?: number;
}
