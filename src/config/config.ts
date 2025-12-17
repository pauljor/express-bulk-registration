import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  auth0: {
    domain: string;
    clientId: string;
    clientSecret: string;
    audience: string;
    issuerBaseUrl: string;
    managementApi: {
      clientId: string;
      clientSecret: string;
      audience: string;
    };
    roles: {
      staff: string;
      teacher: string;
      student: string;
    };
  };
  upload: {
    maxFileSize: number;
    allowedFileTypes: string[];
    uploadDir: string;
  };
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseUrl: process.env.AUTH0_ISSUER_BASE_URL,
    managementApi: {
      clientId: process.env.AUTH0_MANAGEMENT_API_CLIENT_ID,
      clientSecret: process.env.AUTH0_MANAGEMENT_API_CLIENT_SECRET,
      audience: process.env.AUTH0_MANAGEMENT_API_AUDIENCE,
    },
    roles: {
      staff: process.env.ROLE_ID_STAFF || '',
      teacher: process.env.ROLE_ID_TEACHER || '',
      student: process.env.ROLE_ID_STUDENT || '',
    },
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'text/csv',
      'application/vnd.ms-excel',
    ],
    uploadDir: path.resolve(__dirname, '../../uploads'),
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'AUTH0_CLIENT_SECRET',
  'AUTH0_AUDIENCE',
  'AUTH0_ISSUER_BASE_URL',
  'AUTH0_MANAGEMENT_API_CLIENT_ID',
  'AUTH0_MANAGEMENT_API_CLIENT_SECRET',
  'AUTH0_MANAGEMENT_API_AUDIENCE',
];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars.join(', '));
  if (config.nodeEnv !== 'test') {
    console.error('Please check your .env file and ensure all required variables are set.');
  }
}

export default config;
