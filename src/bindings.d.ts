import { webhookTriggers } from "./handlers/webhookTriggers";

export default {
    async scheduled(event: any, env: any, ctx: any) {
        ctx.waitUntil(webhookTriggers(event, env));
    },
}

declare global {
    const GRAPHQL_API: string;
    const KVValidatorStatuses: KVNamespace;
}
