# Firebase Authentication Middleware Setup

## Overview
This middleware verifies Firebase ID tokens from request headers and attaches the decoded user information to the request object.

## Environment Variables

Add these to your `.env` file:

```env
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### How to Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. A JSON file will be downloaded with your credentials
6. Copy the values from the JSON file to your `.env` file:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## Usage

### Basic Usage - Protect a Route

```typescript
import { Router } from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { getUsers, getUser } from '../controllers/user.js';

const router = Router();

// Protected routes - require authentication
router.get('/', authenticateUser, getUsers);
router.get('/:id', authenticateUser, getUser);

export default router;
```

### Access User Information in Controllers

Once authenticated, the decoded token is available in `req.user`:

```typescript
import { Request, Response } from 'express';

export const getUser = async (req: Request, res: Response) => {
  // Access the authenticated user's information
  const userId = req.user?.uid; // Firebase user ID
  const email = req.user?.email; // User's email
  const emailVerified = req.user?.email_verified; // Email verification status
  
  console.log('Authenticated user:', userId, email);
  
  // Your controller logic here
  res.json({ userId, email });
};
```

### Optional Authentication

For routes that work with or without authentication:

```typescript
import { optionalAuth } from '../middleware/auth.js';

router.get('/public-with-optional-auth', optionalAuth, (req, res) => {
  if (req.user) {
    // User is authenticated
    res.json({ message: 'Hello ' + req.user.email });
  } else {
    // User is not authenticated
    res.json({ message: 'Hello guest' });
  }
});
```

## Client-Side Usage

From your client application, send the Firebase ID token in the Authorization header:

```typescript
// Get the ID token from Firebase Authentication
const idToken = await firebaseAuth.currentUser?.getIdToken();

// Make API request with token
const response = await fetch('http://localhost:3000/api/v1/users', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json',
  },
});
```

## Decoded Token Properties

The `req.user` object contains:

- `uid`: User's unique Firebase ID
- `email`: User's email address
- `email_verified`: Boolean indicating if email is verified
- `name`: User's display name (if set)
- `picture`: User's profile picture URL (if set)
- `auth_time`: Time when user authenticated
- `exp`: Token expiration time
- `iat`: Token issued at time

## Error Responses

### 401 - No Authorization Header
```json
{
  "status": "error",
  "message": "No authorization header provided"
}
```

### 401 - Token Expired
```json
{
  "status": "error",
  "message": "Token has expired"
}
```

### 401 - Invalid Token
```json
{
  "status": "error",
  "message": "Invalid token format"
}
```

### 401 - Authentication Failed
```json
{
  "status": "error",
  "message": "Authentication failed",
  "error": "detailed error message"
}
```

## Testing with cURL

```bash
# Get a valid Firebase ID token from your frontend app first
TOKEN="your-firebase-id-token-here"

# Make authenticated request
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

## Security Best Practices

1. **Always use HTTPS in production** - Never send tokens over unencrypted connections
2. **Token expiration** - Firebase tokens expire after 1 hour by default
3. **Refresh tokens** - Implement token refresh on the client side
4. **Verify tokens on every request** - Don't cache verification results
5. **Keep private key secure** - Never commit your `.env` file or private key to version control

