import { fetchStatuses } from './validators';
import { request } from "request";
import { ServerResponse } from "http";

export function zapierTrigger(event: Event) {
    (async () => {
        const statuses = fetchStatuses();

        const res = request.post(
            ZAPIER_WEBHOOK_URL,
            statuses,
            function (error: any, response: ServerResponse, body: string) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            }
        );

        console.log({ statuses, res })
    })()
}
