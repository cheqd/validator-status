import { IHTTPMethods, Request, Router } from 'itty-router'
import { handler as validators } from './handlers/validators';
import { webhookTriggers } from "./handlers/webhookTriggers";

addEventListener('scheduled', (event: any) => {
    event.waitUntil(webhookTriggers(event));
})

addEventListener('fetch', (event: any) => {
    const router = Router<Request, IHTTPMethods>()
    registerRoutes(router);
    event.respondWith(router.handle(event.request).catch(handleError))
})

function registerRoutes(router: Router) {
    router.get('/', validators);
    router.get('/active', validators);
    router.get('/jailed', validators);
    router.get('/tombstoned', validators);
    router.get('/never-jailed', validators);
    router.get('/never-jailed', validators);

    // 404 for all other requests
    router.all('*', () => new Response('Not Found.', { status: 404 }))
}

function handleError(error: Error): Response {
    return new Response(error.message || 'Server Error', { status: 500 })
}
