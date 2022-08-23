import { Request } from "itty-router";

export async function handlerActive(request: Request): Promise<Response> {
    // const statuses = await fetchByStatus("active.")

    return new Response(JSON.stringify([]), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}
