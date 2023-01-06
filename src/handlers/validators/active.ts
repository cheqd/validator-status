import { Request } from "itty-router";
import { fetchStatusesByState } from "../validators";

export async function handlerActive(request: Request): Promise<Response> {
    const active = await fetchStatusesByState("active")

    return new Response(JSON.stringify(active), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
