import { fetchStatusesByState } from './validators';
import { ValidatorStatusRecord } from '../types/types';

export async function webhookTriggers(event: Event) {
	console.log('Triggering webhook...');
	await sendValidatorStatuses();
}

async function sendValidatorStatuses() {
	console.log('Sending degraded status alerts...');
	let filtered = new Array<ValidatorStatusRecord>();
	for (const a of await fetchStatusesByState('active')) {
		if (a.activeBlocks < parseInt(DEGRADED_THRESHOLD)) {
			filtered.push(a);
		}
	}

	console.log(`Alerting ${filtered.length} degraded validators... (${WEBHOOK_URL})`);

	if (filtered.length > 0) {
		try {
			const init = {
				body: JSON.stringify(filtered),
				method: 'POST',
				headers: {
					'content-type': 'application/json;charset=UTF-8',
				},
			};

			const response = await fetch(WEBHOOK_URL, init);
		} catch (err: any) {
			console.log(err);
		}
	}
}
