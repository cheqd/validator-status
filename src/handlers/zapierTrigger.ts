import { fetchStatuses } from './validators';
import ky from "ky";

export function zapierTrigger(event: Event) {
    (async () => {
        const statuses = fetchStatuses();

        try {
            const res = await ky.post(ZAPIER_WEBHOOK_URL, { json: statuses }).json;

            console.log('Res: ', res);
        } catch (err) {
            console.error(err);
        }
    })()
}
