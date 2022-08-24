import { Request } from "itty-router";
import { fetchStatusesByState } from "../validators";
import { ValidatorStatus } from "../../types/types";

export async function handlerDegraded(request: Request): Promise<Response> {
    let filtered = new Array<ValidatorStatus>();
    for (const a of await fetchStatusesByState("active")) {
        if (a.activeBlocks < 80) {
            filtered.push(a)
        }
    }

    return new Response(JSON.stringify(filtered), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
