import { fetchStatuses } from './validators';
import ky from "ky";

export function zapierTrigger(event: Event) {
    const statuses = fetchStatuses();

    ky.post(ZAPIER_WEBHOOK_URL, { body: JSON.stringify(statuses) }).json().then(res => {
        console.log('Res: ', res);
    }).catch(err => {
        console.error(err);
    });
}
