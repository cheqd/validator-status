import { Request } from "itty-router";
import { fetchStatusesByState } from "../validators";

export async function handlerJailed(request: Request): Promise<Response> {
    const jailed = await fetchStatusesByState("jailed")

    return new Response(JSON.stringify(jailed), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
