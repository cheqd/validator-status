import { Request } from "itty-router";
import { fetchStatusesByStatus } from "../validators";

export async function handlerJailed(request: Request): Promise<Response> {
    const statuses = await fetchStatusesByStatus("jailed.")

    return new Response(JSON.stringify(statuses), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
