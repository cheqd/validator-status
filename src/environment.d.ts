declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GRAPHQL_API: string;
            WEBHOOK_URL: string;
            VALIDATOR_CONDITION: string;
            DEGRADED_THRESHOLD: string;
        }
    }
}

export {}
