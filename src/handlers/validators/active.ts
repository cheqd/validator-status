import { Request } from "itty-router";
import { fetchStatuses, fetchStatusesByState } from "../validators";
import { Validator, ValidatorStatusRecord } from "../../types/types";

export async function handlerActive(request: Request): Promise<Response> {
    const active = await fetchStatusesByState("active")

    return new Response(JSON.stringify(active), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
