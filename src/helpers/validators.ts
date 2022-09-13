import { Statuses } from "../types/types";

export const getValidatorStatus = (s: Statuses, tombstoned: boolean) => {
    const { status, jailed,  } = s;

    const results = {
        status: 'na',
        theme: 'zero',
    };

    // jailed and tombstone statuses are prioritised over their unbonding state
    if (tombstoned) {
        results.status = 'tombstoned';
        results.theme = 'two';
        return results;
    }

    if (jailed) {
        results.status = 'jailed';
        results.theme = 'two';
        return results;
    }

    if (status === 3) {
        results.status = 'active';
        results.theme = 'one';
    } else if (status === 2) {
        results.status = 'unbonding';
        results.theme = 'three';
    } else if (status === 1) {
        results.status = 'unbonded';
        results.theme = 'zero';
    } else {
        results.status = 'unknown';
        results.theme = 'zero';
    }

    return results;
};
