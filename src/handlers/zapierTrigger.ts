import { fetchStatuses } from './validators';
import ky from "ky";

export async function zapierTrigger(event: Event) {
    const statuses = await fetchStatuses();
    console.log({ statuses })
    ky.post(ZAPIER_WEBHOOK_URL, { body: JSON.stringify(statuses) }).json().then(res => {
        console.log('Res: ', res);
    }).catch(err => {
        console.error(err);
    });
}
