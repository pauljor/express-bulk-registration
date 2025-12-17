import swaggerJsdoc from 'swagger-jsdoc';
import config from './config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express Auth0 User Management API',
    version: '1.0.0',
    description:
      'A production-ready Express + TypeScript API with Auth0 integration for user registration and management. Supports single and bulk user operations with role-based access control.',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: 'Development server',
    },
    {
      url: 'https://your-production-domain.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Enter your Auth0 access token. To get a token:\n\n' +
          '1. Go to your Auth0 Dashboard\n' +
          '2. Navigate to Applications > APIs\n' +
          '3. Select your API\n' +
          '4. Use the "Test" tab to get an access token\n' +
          '5. Or use the Auth0 Authentication API to obtain a token programmatically',
      },
    },
    schemas: {
      UserRole: {
        type: 'string',
        enum: ['staff', 'teacher', 'student'],
        description: 'User role in the system',
      },
      CreateUserRequest: {
        type: 'object',
        required: ['email', 'password', 'role'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
          password: {
            type: 'string',
            minLength: 8,
            example: 'SecurePass123!',
            description: 'Must be at least 8 characters',
          },
          role: {
            $ref: '#/components/schemas/UserRole',
          },
          given_name: {
            type: 'string',
            example: 'John',
          },
          family_name: {
            type: 'string',
            example: 'Doe',
          },
          name: {
            type: 'string',
            example: 'John Doe',
          },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
          given_name: {
            type: 'string',
            example: 'John',
          },
          family_name: {
            type: 'string',
            example: 'Doe',
          },
          name: {
            type: 'string',
            example: 'John Doe',
          },
          role: {
            $ref: '#/components/schemas/UserRole',
          },
          password: {
            type: 'string',
            minLength: 8,
            example: 'NewSecurePass123!',
          },
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
          user_id: {
            type: 'string',
            example: 'auth0|507f1f77bcf86cd799439011',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
          name: {
            type: 'string',
            example: 'John Doe',
          },
          given_name: {
            type: 'string',
            example: 'John',
          },
          family_name: {
            type: 'string',
            example: 'Doe',
          },
          role: {
            $ref: '#/components/schemas/UserRole',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
          },
          email_verified: {
            type: 'boolean',
            example: false,
          },
        },
      },
      BulkUploadResult: {
        type: 'object',
        properties: {
          totalRows: {
            type: 'integer',
            example: 100,
          },
          successCount: {
            type: 'integer',
            example: 95,
          },
          failureCount: {
            type: 'integer',
            example: 5,
          },
          errors: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/BulkUploadError',
            },
          },
        },
      },
      BulkUploadError: {
        type: 'object',
        properties: {
          row: {
            type: 'integer',
            example: 42,
          },
          email: {
            type: 'string',
            example: 'invalid@example.com',
          },
          error: {
            type: 'string',
            example: 'Email already exists',
          },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          data: {
            type: 'object',
          },
          message: {
            type: 'string',
          },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            example: 'An error occurred',
          },
          message: {
            type: 'string',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options: swaggerJsdoc.Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
