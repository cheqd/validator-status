import { fetchStatuses, fetchStatusesByState } from './validators';

export async function webhookTriggers(event: Event) {
    console.log("triggering webhooks...")
    await sendValidatorStatuses();
}

async function sendValidatorStatuses() {
    console.log("sending degraded status alerts...")
    const statuses = await fetchStatusesByState("degraded");

    if (statuses.length > 0) {
        try {
            const init = {
                body: JSON.stringify(statuses),
                method: 'POST',
                headers: {
                    'content-type': 'application/json;charset=UTF-8',
                },
            };

            console.log({WEBHOOK_URL: WEBHOOK_URL})
            const response = await fetch(WEBHOOK_URL, init);
            console.log('Res: ', response);
        } catch (err: any) {
            console.error(err)
        }
    }
}
