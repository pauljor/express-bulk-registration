declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;

      // Auth0 Configuration
      AUTH0_DOMAIN: string;
      AUTH0_CLIENT_ID: string;
      AUTH0_CLIENT_SECRET: string;
      AUTH0_AUDIENCE: string;
      AUTH0_ISSUER_BASE_URL: string;

      // Auth0 Management API
      AUTH0_MANAGEMENT_API_CLIENT_ID: string;
      AUTH0_MANAGEMENT_API_CLIENT_SECRET: string;
      AUTH0_MANAGEMENT_API_AUDIENCE: string;

      // Role IDs
      ROLE_ID_STAFF: string;
      ROLE_ID_TEACHER: string;
      ROLE_ID_STUDENT: string;

      // Upload Configuration
      MAX_FILE_SIZE: string;
      ALLOWED_FILE_TYPES: string;
    }
  }
}

export {};
