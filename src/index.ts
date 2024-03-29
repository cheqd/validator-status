import { Router, RouterType } from 'itty-router';
import { handler as validators } from './handlers/validators';
import { handlerActive } from './handlers/validators/active';
import { handlerJailed } from './handlers/validators/jailed';
import { webhookTriggers } from './handlers/webhookTriggers';
import { handlerDegraded } from './handlers/validators/degraded';
import { handlerTombstoned } from './handlers/validators/tombstoned';
import { handlerNeverJailed } from './handlers/validators/neverJailed';

addEventListener('scheduled', (event: any) => {
	event.waitUntil(webhookTriggers(event));
});

addEventListener('fetch', (event: any) => {
	const router = Router();
	registerRoutes(router);
	event.respondWith(router.handle(event.request).catch(handleError));
});

function registerRoutes(router: RouterType) {
	router.get('/', validators);
	router.get('/active', handlerActive);
	router.get('/jailed', handlerJailed);
	router.get('/degraded', handlerDegraded);
	router.get('/tombstoned', handlerTombstoned);
	// router.get('/never-jailed', handlerNeverJailed);

	// 404 for all other requests
	router.all('*', () => new Response('Not Found.', { status: 404 }));
}

function handleError(error: Error): Response {
	return new Response(error.message || 'Server Error', { status: 500 });
}
