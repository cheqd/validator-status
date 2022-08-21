import { Request } from "itty-router";
import { fetchStatuses } from "../validators";

export async function handler(request: Request): Promise<Response> {
    let statuses = await KVValidatorStatuses.list({
        prefix: "jailed",
    });

    return new Response(JSON.stringify(statuses));
}
