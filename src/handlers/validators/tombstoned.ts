import { Request } from "itty-router";

export async function handlerTombstoned(request: Request): Promise<Response> {
    let statuses = await KVValidators.list({
        prefix: "tombstoned.",
    });

    return new Response(JSON.stringify(statuses.keys), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
}