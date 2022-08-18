declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GRAPHQL_API: string;
            STATUS_URL: string;
            ZAPIER_WEBHOOK_URL: string;
        }
    }
}

export {}
