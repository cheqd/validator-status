import { fetchStatuses } from './validators';
import axios from "axios";

export function zapierTrigger(event: Event) {
    (async () => {
        const callZapierWebhook = async () => {
            const statuses = fetchStatuses();
            
            try {
                const res = await axios.post(ZAPIER_WEBHOOK_URL, statuses);

                console.log(`Status: ${res.status}`);
                console.log('Body: ', res.data);
            } catch (err) {
                console.error(err);
            }
        };

        await callZapierWebhook();
    })()
}
