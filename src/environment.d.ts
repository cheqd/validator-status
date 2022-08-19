declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GRAPHQL_API: string;
            WEBHOOK_URL: string;
        }
    }
}

export {}
