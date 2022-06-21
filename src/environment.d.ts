declare global {
    namespace NodeJS {
      interface ProcessEnv {
          GRAPHQL_API: string;
      }
    }
  }
  
  export {}
