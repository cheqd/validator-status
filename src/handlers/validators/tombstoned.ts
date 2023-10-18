import { IRequest } from 'itty-router';
import { fetchStatusesByState } from '../validators';

export async function handlerTombstoned(request: IRequest): Promise<Response> {
	const tombstoned = await fetchStatusesByState('tombstoned');

	return new Response(JSON.stringify(tombstoned), {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
	});
}
