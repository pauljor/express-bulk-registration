# API Examples

Complete examples for all API endpoints with cURL, JavaScript/TypeScript, and Python.

## Authentication

All endpoints require a Bearer token in the Authorization header.

### Get Access Token

#### cURL
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

#### JavaScript/TypeScript
```typescript
const response = await fetch('https://YOUR_DOMAIN.auth0.com/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    audience: 'YOUR_API_IDENTIFIER',
    grant_type: 'client_credentials',
  }),
});

const { access_token } = await response.json();
```

#### Python
```python
import requests

response = requests.post(
    'https://YOUR_DOMAIN.auth0.com/oauth/token',
    json={
        'client_id': 'YOUR_CLIENT_ID',
        'client_secret': 'YOUR_CLIENT_SECRET',
        'audience': 'YOUR_API_IDENTIFIER',
        'grant_type': 'client_credentials'
    }
)

access_token = response.json()['access_token']
```

---

## Health Check

### GET /api/health

#### cURL
```bash
curl http://localhost:3000/api/health
```

#### JavaScript/TypeScript
```typescript
const response = await fetch('http://localhost:3000/api/health');
const data = await response.json();
console.log(data);
```

#### Python
```python
import requests

response = requests.get('http://localhost:3000/api/health')
print(response.json())
```

---

## Create User

### POST /api/users

#### cURL
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "role": "student",
    "given_name": "John",
    "family_name": "Doe",
    "name": "John Doe"
  }'
```

#### JavaScript/TypeScript
```typescript
const createUser = async (accessToken: string) => {
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
      role: 'student',
      given_name: 'John',
      family_name: 'Doe',
      name: 'John Doe',
    }),
  });

  const data = await response.json();
  return data;
};

// Usage
const result = await createUser(accessToken);
console.log(result);
```

#### Python
```python
import requests

def create_user(access_token):
    response = requests.post(
        'http://localhost:3000/api/users',
        headers={
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        },
        json={
            'email': 'john.doe@example.com',
            'password': 'SecurePass123!',
            'role': 'student',
            'given_name': 'John',
            'family_name': 'Doe',
            'name': 'John Doe'
        }
    )
    return response.json()

# Usage
result = create_user(access_token)
print(result)
```

---

## Get All Users

### GET /api/users

#### cURL
```bash
curl -X GET "http://localhost:3000/api/users?page=0&per_page=50" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### JavaScript/TypeScript
```typescript
const getUsers = async (accessToken: string, page = 0, perPage = 50) => {
  const response = await fetch(
    `http://localhost:3000/api/users?page=${page}&per_page=${perPage}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

// Usage
const users = await getUsers(accessToken, 0, 50);
console.log(users);
```

#### Python
```python
import requests

def get_users(access_token, page=0, per_page=50):
    response = requests.get(
        f'http://localhost:3000/api/users?page={page}&per_page={per_page}',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    return response.json()

# Usage
users = get_users(access_token, page=0, per_page=50)
print(users)
```

---

## Get User by Email

### GET /api/users/:email

#### cURL
```bash
curl -X GET "http://localhost:3000/api/users/john.doe@example.com" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### JavaScript/TypeScript
```typescript
const getUserByEmail = async (accessToken: string, email: string) => {
  const response = await fetch(
    `http://localhost:3000/api/users/${encodeURIComponent(email)}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

// Usage
const user = await getUserByEmail(accessToken, 'john.doe@example.com');
console.log(user);
```

#### Python
```python
import requests
from urllib.parse import quote

def get_user_by_email(access_token, email):
    response = requests.get(
        f'http://localhost:3000/api/users/{quote(email)}',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    return response.json()

# Usage
user = get_user_by_email(access_token, 'john.doe@example.com')
print(user)
```

---

## Update User

### PUT /api/users/:email

#### cURL
```bash
curl -X PUT "http://localhost:3000/api/users/john.doe@example.com" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "given_name": "Jane",
    "family_name": "Smith",
    "role": "teacher"
  }'
```

#### JavaScript/TypeScript
```typescript
const updateUser = async (
  accessToken: string,
  email: string,
  updates: {
    given_name?: string;
    family_name?: string;
    name?: string;
    role?: 'staff' | 'teacher' | 'student';
    password?: string;
  }
) => {
  const response = await fetch(
    `http://localhost:3000/api/users/${encodeURIComponent(email)}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    }
  );

  const data = await response.json();
  return data;
};

// Usage
const updated = await updateUser(accessToken, 'john.doe@example.com', {
  given_name: 'Jane',
  family_name: 'Smith',
  role: 'teacher',
});
console.log(updated);
```

#### Python
```python
import requests
from urllib.parse import quote

def update_user(access_token, email, updates):
    response = requests.put(
        f'http://localhost:3000/api/users/{quote(email)}',
        headers={
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        },
        json=updates
    )
    return response.json()

# Usage
updated = update_user(
    access_token,
    'john.doe@example.com',
    {
        'given_name': 'Jane',
        'family_name': 'Smith',
        'role': 'teacher'
    }
)
print(updated)
```

---

## Delete User

### DELETE /api/users/:email

#### cURL
```bash
curl -X DELETE "http://localhost:3000/api/users/john.doe@example.com" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### JavaScript/TypeScript
```typescript
const deleteUser = async (accessToken: string, email: string) => {
  const response = await fetch(
    `http://localhost:3000/api/users/${encodeURIComponent(email)}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
};

// Usage
const result = await deleteUser(accessToken, 'john.doe@example.com');
console.log(result);
```

#### Python
```python
import requests
from urllib.parse import quote

def delete_user(access_token, email):
    response = requests.delete(
        f'http://localhost:3000/api/users/{quote(email)}',
        headers={'Authorization': f'Bearer {access_token}'}
    )
    return response.json()

# Usage
result = delete_user(access_token, 'john.doe@example.com')
print(result)
```

---

## Bulk User Upload

### POST /api/users/bulk

#### cURL
```bash
curl -X POST http://localhost:3000/api/users/bulk \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@sample-users.csv"
```

#### JavaScript/TypeScript
```typescript
const bulkUploadUsers = async (accessToken: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:3000/api/users/bulk', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await response.json();
  return data;
};

// Usage (in browser)
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const result = await bulkUploadUsers(accessToken, file);
console.log(result);

// Usage (in Node.js)
import FormData from 'form-data';
import fs from 'fs';

const formData = new FormData();
formData.append('file', fs.createReadStream('sample-users.csv'));

const result = await fetch('http://localhost:3000/api/users/bulk', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    ...formData.getHeaders(),
  },
  body: formData,
});

console.log(await result.json());
```

#### Python
```python
import requests

def bulk_upload_users(access_token, file_path):
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(
            'http://localhost:3000/api/users/bulk',
            headers={'Authorization': f'Bearer {access_token}'},
            files=files
        )
    return response.json()

# Usage
result = bulk_upload_users(access_token, 'sample-users.csv')
print(result)
```

---

## Complete Example: Full User Lifecycle

### JavaScript/TypeScript
```typescript
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000';
const AUTH0_DOMAIN = 'your-domain.auth0.com';
const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';
const AUDIENCE = 'your-api-identifier';

// 1. Get access token
async function getAccessToken() {
  const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience: AUDIENCE,
      grant_type: 'client_credentials',
    }),
  });
  const { access_token } = await response.json();
  return access_token;
}

// 2. Complete workflow
async function userManagementWorkflow() {
  const token = await getAccessToken();

  // Create user
  const newUser = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'demo@example.com',
      password: 'DemoPass123!',
      role: 'student',
      given_name: 'Demo',
      family_name: 'User',
    }),
  }).then(r => r.json());

  console.log('Created user:', newUser);

  // Get user
  const user = await fetch(
    `${API_BASE}/api/users/demo@example.com`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  ).then(r => r.json());

  console.log('Retrieved user:', user);

  // Update user
  const updated = await fetch(
    `${API_BASE}/api/users/demo@example.com`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: 'teacher' }),
    }
  ).then(r => r.json());

  console.log('Updated user:', updated);

  // Delete user
  const deleted = await fetch(
    `${API_BASE}/api/users/demo@example.com`,
    {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }
  ).then(r => r.json());

  console.log('Deleted user:', deleted);
}

userManagementWorkflow().catch(console.error);
```

### Python
```python
import requests

API_BASE = 'http://localhost:3000'
AUTH0_DOMAIN = 'your-domain.auth0.com'
CLIENT_ID = 'your-client-id'
CLIENT_SECRET = 'your-client-secret'
AUDIENCE = 'your-api-identifier'

def get_access_token():
    response = requests.post(
        f'https://{AUTH0_DOMAIN}/oauth/token',
        json={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'audience': AUDIENCE,
            'grant_type': 'client_credentials'
        }
    )
    return response.json()['access_token']

def user_management_workflow():
    token = get_access_token()
    headers = {'Authorization': f'Bearer {token}'}

    # Create user
    new_user = requests.post(
        f'{API_BASE}/api/users',
        headers={**headers, 'Content-Type': 'application/json'},
        json={
            'email': 'demo@example.com',
            'password': 'DemoPass123!',
            'role': 'student',
            'given_name': 'Demo',
            'family_name': 'User'
        }
    ).json()
    print('Created user:', new_user)

    # Get user
    user = requests.get(
        f'{API_BASE}/api/users/demo@example.com',
        headers=headers
    ).json()
    print('Retrieved user:', user)

    # Update user
    updated = requests.put(
        f'{API_BASE}/api/users/demo@example.com',
        headers={**headers, 'Content-Type': 'application/json'},
        json={'role': 'teacher'}
    ).json()
    print('Updated user:', updated)

    # Delete user
    deleted = requests.delete(
        f'{API_BASE}/api/users/demo@example.com',
        headers=headers
    ).json()
    print('Deleted user:', deleted)

if __name__ == '__main__':
    user_management_workflow()
```

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Additional details"
}
```

### Example: Handling Errors

#### JavaScript/TypeScript
```typescript
try {
  const response = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
} catch (error) {
  console.error('Error creating user:', error.message);
  throw error;
}
```

#### Python
```python
try:
    response = requests.post(
        f'{API_BASE}/api/users',
        headers=headers,
        json=user_data
    )
    response.raise_for_status()
    data = response.json()

    if not data.get('success'):
        raise Exception(data.get('error', 'Request failed'))

    return data
except requests.exceptions.RequestException as e:
    print(f'Error creating user: {e}')
    raise
```

---

**Need more examples?** Check the Swagger documentation at `/api-docs` for interactive testing!
