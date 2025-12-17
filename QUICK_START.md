# Quick Start Guide

Get your Express + Auth0 User Management API up and running in minutes!

## Prerequisites Check

Before you begin, ensure you have:
- [ ] Node.js v16+ installed (`node --version`)
- [ ] An Auth0 account (free at https://auth0.com)
- [ ] Git (optional)

## Step 1: Project Setup (2 minutes)

Run the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

Wait for all dependencies to install.

## Step 2: Auth0 Configuration (5 minutes)

### A. Create Machine-to-Machine Application

1. Login to [Auth0 Dashboard](https://manage.auth0.com/)
2. Go to **Applications** > **Applications** > **Create Application**
3. Name it "User Management API"
4. Select **Machine to Machine Applications**
5. Authorize it for **Auth0 Management API**
6. Grant these permissions:
   ```
   read:users
   create:users
   update:users
   delete:users
   read:roles
   create:role_members
   delete:role_members
   ```
7. **Save** and copy the **Client ID** and **Client Secret**

### B. Create API

1. Go to **Applications** > **APIs** > **Create API**
2. Set:
   - **Name**: User Management API
   - **Identifier**: `https://user-management-api` (or your preferred identifier)
   - **Signing Algorithm**: RS256
3. Under **Settings**:
   - Enable **RBAC**
   - Enable **Add Permissions in the Access Token**
4. **Save**

### C. Create Roles

1. Go to **User Management** > **Roles**
2. Create three roles (one by one):
   - **staff** - Description: "Administrative staff"
   - **teacher** - Description: "Teaching staff"
   - **student** - Description: "Students"
3. For each role, copy its **Role ID** (looks like `rol_xxxxxxxxxxxx`)

## Step 3: Environment Configuration (2 minutes)

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` in your favorite editor and fill in:

```env
# From your Machine-to-Machine Application
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_MANAGEMENT_API_CLIENT_ID=abc123...
AUTH0_MANAGEMENT_API_CLIENT_SECRET=xyz789...
AUTH0_MANAGEMENT_API_AUDIENCE=https://your-tenant.auth0.com/api/v2/

# From your API
AUTH0_AUDIENCE=https://user-management-api
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com

# You can use the same credentials for both if you prefer
AUTH0_CLIENT_ID=abc123...
AUTH0_CLIENT_SECRET=xyz789...

# From your Roles
ROLE_ID_STAFF=rol_xxxxxxxxxxxx
ROLE_ID_TEACHER=rol_xxxxxxxxxxxx
ROLE_ID_STUDENT=rol_xxxxxxxxxxxx
```

## Step 4: Start the Server (30 seconds)

```bash
npm run dev
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  Express Auth0 User Management API                        ║
║                                                           ║
║  Server is running on port 3000                           ║
║  Environment: development                                 ║
║                                                           ║
║  API Documentation: http://localhost:3000/api-docs        ║
║  Health Check: http://localhost:3000/api/health           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

## Step 5: Get an Access Token (1 minute)

You need an access token to call the API. Here's the easiest way:

### Option 1: Using cURL

```bash
curl --request POST \
  --url https://YOUR_DOMAIN.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id":"YOUR_MANAGEMENT_CLIENT_ID",
    "client_secret":"YOUR_MANAGEMENT_CLIENT_SECRET",
    "audience":"YOUR_API_IDENTIFIER",
    "grant_type":"client_credentials"
  }'
```

Copy the `access_token` from the response.

### Option 2: Using Auth0 Dashboard

1. Go to your API in Auth0 Dashboard
2. Click the **Test** tab
3. Copy the access token

## Step 6: Test the API (2 minutes)

### Option A: Using Swagger UI (Recommended)

1. Open http://localhost:3000/api-docs
2. Click **Authorize** button (top right)
3. Paste your access token
4. Click **Authorize**
5. Try the **POST /api/users** endpoint to create a test user

### Option B: Using cURL

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "role": "student",
    "given_name": "Test",
    "family_name": "User"
  }'
```

### Option C: Using Postman

1. Import the API from http://localhost:3000/api-docs
2. Add Authorization header: `Bearer YOUR_ACCESS_TOKEN`
3. Send requests

## Step 7: Try Bulk Upload (1 minute)

A sample CSV file `sample-users.csv` is included. Test bulk upload:

1. Open Swagger UI: http://localhost:3000/api-docs
2. Find **POST /api/users/bulk**
3. Click **Try it out**
4. Upload `sample-users.csv`
5. Click **Execute**

## Common Issues

### "Missing required environment variables"
- Check your `.env` file has all required values
- Restart the server after updating `.env`

### "Unauthorized" errors
- Verify your access token is not expired
- Check the token includes the correct audience
- Ensure API identifier matches between Auth0 and `.env`

### "Failed to create user"
- Check Auth0 Management API permissions
- Verify role IDs are correct
- Check Auth0 password policy settings

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore all endpoints in the Swagger UI
- Customize the roles and permissions
- Add additional user fields
- Set up production deployment

## Need Help?

- Check the [README.md](README.md) for troubleshooting
- Review [Auth0 Documentation](https://auth0.com/docs)
- Check server logs in `logs/combined.log`

---

**Congratulations! Your API is ready to use!** 🎉
