import { Request } from "itty-router";

export async function handlerJailed(request: Request): Promise<Response> {
    return new Response(JSON.stringify([]), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
