import { fetchStatuses } from './validators';

export async function webhookTriggers(event: Event) {
    await sendValidatorStatuses();
}

async function sendValidatorStatuses() {
    const statuses = await fetchStatuses();
    try {
        const init = {
            body: JSON.stringify(statuses),
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        };
        const response = await fetch(WEBHOOK_URL, init);
        console.log('Res: ', response);
    } catch (err: any) {
        console.error(err)
    }
}
