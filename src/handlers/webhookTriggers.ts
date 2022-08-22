import { fetchStatuses } from './validators';

export async function webhookTriggers(event: Event, env: any) {
    await sendValidatorStatuses(env);
}

async function sendValidatorStatuses(env: any) {
    const statuses = await fetchStatuses();
    try {
        const init = {
            body: JSON.stringify(statuses),
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
        };
        const response = await fetch(env.WEBHOOK_URL, init);
        console.log('Res: ', response);
    } catch (err: any) {
        console.error(err)
    }
}
