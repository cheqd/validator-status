import { fetchStatuses } from './validators';
import ky from "ky";

export async function zapierTriggers(event: Event) {
    await sendValidatorStatuses();
}

async function sendValidatorStatuses() {
    const statuses = await fetchStatuses();

    try {
        const res = await ky.post(WEBHOOK_URL, {
            body: JSON.stringify(statuses)
        }).json()

        console.log('Res: ', res);
    } catch (err: any) {
        console.error(err)
    }
}
