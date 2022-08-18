declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GRAPHQL_API: string;
            ZAPIER_WEBHOOK_URL: string;
        }
    }
}

export {}
