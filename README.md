# Express + Auth0 User Management MVP

A production-ready Express.js backend with TypeScript and Auth0 integration for comprehensive user registration and management. Supports single and bulk user operations with role-based access control.

## Features

- **Express.js + TypeScript** - Modern, type-safe backend
- **Auth0 Integration** - Complete user authentication and management
- **Role-Based Access Control (RBAC)** - Three user roles: `staff`, `teacher`, `student`
- **Full CRUD Operations** - Create, Read, Update, Delete users
- **Single Registration** - Register individual users via REST API
- **Bulk Registration** - Upload CSV files to register multiple users at once
- **Swagger Documentation** - Interactive API documentation with JWT authentication
- **Production Ready** - Comprehensive error handling, logging, and security

## Project Structure

```
express-auth0-mvp/
├── src/
│   ├── config/
│   │   ├── config.ts           # Environment configuration
│   │   └── swagger.ts          # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   └── user.controller.ts  # User CRUD operations
│   ├── middlewares/
│   │   ├── auth.middleware.ts  # JWT authentication
│   │   ├── error.middleware.ts # Error handling
│   │   └── upload.middleware.ts # File upload handling
│   ├── routes/
│   │   ├── index.ts            # Route aggregator
│   │   └── user.routes.ts      # User routes
│   ├── services/
│   │   ├── auth0.service.ts    # Auth0 Management API wrapper
│   │   └── csv.service.ts      # CSV parsing and processing
│   ├── types/
│   │   ├── api.types.ts        # API response types
│   │   ├── user.types.ts       # User-related types
│   │   ├── environment.d.ts    # Environment variable types
│   │   └── index.ts            # Type exports
│   ├── utils/
│   │   ├── logger.ts           # Winston logger
│   │   └── validators.ts       # Request validators
│   ├── app.ts                  # Express app configuration
│   └── server.ts               # Server entry point
├── uploads/                    # Temporary file uploads
├── logs/                       # Application logs
├── .env.example               # Environment variables template
├── .gitignore
├── tsconfig.json
├── package.json
└── setup.sh                   # Project setup script
```

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Auth0 Account** with:
  - A configured Auth0 Application
  - Auth0 Management API credentials
  - Three roles created: `staff`, `teacher`, `student`

## Setup Instructions

### 1. Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

This script will:
- Initialize `package.json`
- Install all dependencies
- Create TypeScript configuration
- Set up folder structure
- Create configuration files

### 2. Configure Auth0

#### A. Create Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** > **Applications**
3. Click **Create Application**
4. Choose **Machine to Machine Application**
5. Select the **Auth0 Management API**
6. Grant the following permissions:
   - `read:users`
   - `create:users`
   - `update:users`
   - `delete:users`
   - `read:roles`
   - `create:role_members`
   - `delete:role_members`

#### B. Create Roles

1. Navigate to **User Management** > **Roles**
2. Create three roles:
   - `staff`
   - `teacher`
   - `student`
3. Note down the **Role IDs** (you'll need these for `.env`)

#### C. Create API

1. Navigate to **Applications** > **APIs**
2. Click **Create API**
3. Set:
   - **Name**: Your API Name (e.g., "User Management API")
   - **Identifier**: Your API identifier (e.g., `https://your-api-identifier`)
   - **Signing Algorithm**: RS256
4. Enable RBAC and Add Permissions in Access Token

### 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update `.env` with your Auth0 credentials:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://your-api-identifier
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com

# Auth0 Management API
AUTH0_MANAGEMENT_API_CLIENT_ID=your-management-client-id
AUTH0_MANAGEMENT_API_CLIENT_SECRET=your-management-client-secret
AUTH0_MANAGEMENT_API_AUDIENCE=https://your-tenant.auth0.com/api/v2/

# Role IDs (from Auth0 Dashboard)
ROLE_ID_STAFF=rol_xxxxxxxxxxxxx
ROLE_ID_TEACHER=rol_xxxxxxxxxxxxx
ROLE_ID_STUDENT=rol_xxxxxxxxxxxxx

# Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=text/csv,application/vnd.ms-excel
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Documentation

Once the server is running, access the interactive Swagger documentation at:

**http://localhost:3000/api-docs**

### Getting an Access Token for Swagger

To use the Swagger UI for testing:

1. **Option 1: Auth0 Dashboard Test Tab**
   - Go to your API in Auth0 Dashboard
   - Click the "Test" tab
   - Copy the access token

2. **Option 2: Using cURL**
   ```bash
   curl --request POST \
     --url https://YOUR_DOMAIN.auth0.com/oauth/token \
     --header 'content-type: application/json' \
     --data '{
       "client_id":"YOUR_CLIENT_ID",
       "client_secret":"YOUR_CLIENT_SECRET",
       "audience":"YOUR_API_IDENTIFIER",
       "grant_type":"client_credentials"
     }'
   ```

3. **Enter Token in Swagger**
   - Click the "Authorize" button in Swagger UI
   - Enter your access token
   - Click "Authorize"

## API Endpoints

### Health Check
- `GET /api/health` - Check server status (no auth required)

### User Management

All endpoints require JWT authentication via Bearer token.

#### Create Single User
- **POST** `/api/users`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!",
    "role": "student",
    "given_name": "John",
    "family_name": "Doe",
    "name": "John Doe"
  }
  ```

#### Bulk User Registration
- **POST** `/api/users/bulk`
- **Content-Type**: `multipart/form-data`
- **File**: CSV file with columns:
  - `email` (required)
  - `password` (optional - will be auto-generated if not provided)
  - `role` (required: staff | teacher | student)
  - `given_name` (optional)
  - `family_name` (optional)
  - `name` (optional)

**Example CSV**:
```csv
email,password,role,given_name,family_name,name
john.doe@example.com,SecurePass123!,student,John,Doe,John Doe
jane.smith@example.com,,teacher,Jane,Smith,Jane Smith
admin@example.com,AdminPass456!,staff,Admin,User,Admin User
```

#### Get All Users
- **GET** `/api/users?page=0&per_page=50`
- **Query Parameters**:
  - `page` (default: 0)
  - `per_page` (default: 50)

#### Get User by Email
- **GET** `/api/users/:email`

#### Update User
- **PUT** `/api/users/:email`
- **Body**:
  ```json
  {
    "given_name": "Jane",
    "family_name": "Smith",
    "role": "teacher"
  }
  ```

#### Delete User
- **DELETE** `/api/users/:email`

## CSV Bulk Upload

### CSV Format

Create a CSV file with the following structure:

```csv
email,password,role,given_name,family_name,name
user1@example.com,Pass123!,student,John,Doe,John Doe
user2@example.com,,teacher,Jane,Smith,Jane Smith
```

### Important Notes

- **email** and **role** are required
- **password** is optional (auto-generated if not provided)
- Passwords must be at least 8 characters
- Valid roles: `staff`, `teacher`, `student`
- The CSV file will be automatically deleted after processing
- Partial failures are handled gracefully
- Response includes detailed error information for failed rows

### Example Response

```json
{
  "success": true,
  "data": {
    "totalRows": 100,
    "successCount": 95,
    "failureCount": 5,
    "errors": [
      {
        "row": 42,
        "email": "invalid@example.com",
        "error": "Email already exists"
      }
    ]
  },
  "message": "Bulk upload completed: 95 succeeded, 5 failed"
}
```

## User Roles

The system supports three user roles:

1. **staff** - Administrative users with full access
2. **teacher** - Educators with elevated privileges
3. **student** - Standard users with basic access

Roles are stored in Auth0's `app_metadata` and assigned via Auth0's RBAC system.

## Security Features

- **JWT Authentication** - All endpoints protected with Auth0 JWT
- **HTTPS Recommended** - Use HTTPS in production
- **Helmet.js** - Security headers
- **CORS** - Configurable cross-origin resource sharing
- **Input Validation** - Express-validator for request validation
- **Rate Limiting** - JWKS rate limiting built-in
- **Error Handling** - Comprehensive error handling and logging

## Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run type-check   # Check TypeScript types
npm run lint         # Lint TypeScript files
npm run format       # Format code with Prettier
```

## Error Handling

All API responses follow a consistent format:

**Success Response**:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details"
}
```

## Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error level logs
- `combined.log` - All logs

Console logging is enabled in development mode.

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Update CORS configuration in `src/app.ts`
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   npm run build
   pm2 start dist/server.js --name "auth0-api"
   ```
4. Set up reverse proxy (nginx/Apache)
5. Enable HTTPS with SSL certificates
6. Configure environment variables on your server
7. Set up monitoring and alerts

## Troubleshooting

### Common Issues

**1. Missing Environment Variables**
- Ensure all required variables in `.env` are set
- Check Auth0 credentials are correct

**2. JWT Authentication Fails**
- Verify Auth0 domain and audience
- Check token is valid and not expired
- Ensure API identifier matches

**3. User Creation Fails**
- Check Auth0 Management API permissions
- Verify role IDs are correct
- Check password meets Auth0 password policy

**4. CSV Upload Errors**
- Verify CSV format matches template
- Check file size doesn't exceed limit
- Ensure file type is CSV

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues and questions:
- Check the [Auth0 Documentation](https://auth0.com/docs)
- Review the Swagger API documentation at `/api-docs`
- Check application logs in the `logs/` directory

---

**Built with Express.js, TypeScript, and Auth0**
