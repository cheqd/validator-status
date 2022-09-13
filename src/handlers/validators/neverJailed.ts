import { Request } from "itty-router";
import { fetchStatusesByState } from "../validators";

export async function handlerNeverJailed(request: Request): Promise<Response> {
    const neverJailed = await fetchStatusesByState("never-jailed")

    return new Response(JSON.stringify(neverJailed), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
