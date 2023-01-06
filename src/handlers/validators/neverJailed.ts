import { IRequest } from "itty-router";
import { fetchStatusesByState } from "../validators";

export async function handlerNeverJailed(request: IRequest): Promise<Response> {
    const neverJailed = await fetchStatusesByState("never-jailed")

    return new Response(JSON.stringify(neverJailed), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
