import { Router, Request, IHTTPMethods } from 'itty-router'
import { handler as validators } from './handlers/validators';

addEventListener('fetch', (event: FetchEvent) => {
    const router = Router<Request, IHTTPMethods>()
    registerRoutes(router);

    event.respondWith(router.handle(event.request).catch(handleError))
})

function registerRoutes(router: Router) {
    router.get('/', validators);

    // 404 for all other requests
    router.all('*', () => new Response('Not Found.', {status: 404}))
}

function handleError(error: Error): Response {
    return new Response(error.message || 'Server Error', {status: 500})
}
