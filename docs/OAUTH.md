# OAuth 2.0 Implementation

This application implements OAuth 2.0 authorization code flow for secure third-party integrations.

## Endpoints

### Authorization Endpoint
**URL:** `/oauth/consent`

User-facing page where users authorize applications.

**Query Parameters:**
- `client_id` (required) - The client application identifier
- `redirect_uri` (required) - Where to redirect after authorization
- `scope` (optional) - Space-separated list of permissions (default: `read`)
- `state` (optional) - CSRF protection token
- `response_type` (required) - Must be `code`

**Example:**
```
https://your-app.netlify.app/oauth/consent?client_id=my_app&redirect_uri=https://example.com/callback&scope=read%20projects:read&state=xyz123&response_type=code
```

### Token Endpoint
**URL:** `/api/oauth/token`  
**Method:** `POST`

Exchange authorization code for access token.

**Request Body:**
```json
{
  "grant_type": "authorization_code",
  "code": "authorization_code_from_consent",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "redirect_uri": "https://example.com/callback"
}
```

**Response:**
```json
{
  "access_token": "token_here",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here",
  "scope": "read projects:read"
}
```

### UserInfo Endpoint
**URL:** `/api/oauth/userinfo`  
**Method:** `GET`

Get authenticated user information.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://avatar.url"
}
```

## Scopes

Available OAuth scopes:

- `read` - View profile and basic information
- `write` - Modify data on user's behalf
- `projects:read` - View projects
- `projects:write` - Create/update projects
- `files:read` - View files and assets
- `files:write` - Upload and manage files
- `notifications:send` - Send notifications

## Integration Flow

### 1. Register OAuth Client

Add your client application to the database:

```sql
INSERT INTO oauth_clients (
  client_id,
  client_secret,
  name,
  description,
  redirect_uris,
  allowed_scopes
) VALUES (
  'my_app',
  'generate_secure_secret_here',
  'My Application',
  'Integration with Cardiology Edge Engage',
  ARRAY['https://example.com/callback'],
  ARRAY['read', 'projects:read']
);
```

### 2. Authorization Request

Direct users to the consent page:

```
https://cardiology-edge-engage.netlify.app/oauth/consent?
  client_id=my_app&
  redirect_uri=https://example.com/callback&
  scope=read projects:read&
  state=random_csrf_token&
  response_type=code
```

### 3. Handle Callback

After user authorizes, they're redirected to your `redirect_uri` with:
- `code` - Authorization code (valid 10 minutes)
- `state` - Your CSRF token (validate it matches)

### 4. Exchange Code for Token

Make a POST request to `/api/oauth/token`:

```javascript
const response = await fetch('https://cardiology-edge-engage.netlify.app/api/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    grant_type: 'authorization_code',
    code: authorizationCode,
    client_id: 'my_app',
    client_secret: 'your_client_secret',
    redirect_uri: 'https://example.com/callback'
  })
});

const { access_token } = await response.json();
```

### 5. Make API Calls

Use the access token to make authenticated requests:

```javascript
const userInfo = await fetch('https://cardiology-edge-engage.netlify.app/api/oauth/userinfo', {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

## Security Considerations

1. **HTTPS Only** - All OAuth flows must use HTTPS in production
2. **State Parameter** - Always include and validate state for CSRF protection
3. **Client Secret** - Keep client secrets secure, never expose in client-side code
4. **Token Expiration** - Access tokens expire after 1 hour
5. **Redirect URI Validation** - Only registered redirect URIs are allowed

## Database Tables

### oauth_authorizations
Stores temporary authorization codes (10 minute expiry)

### oauth_tokens
Stores access and refresh tokens

### oauth_clients
Registered client applications

## Testing

### Test Authorization Flow

1. Navigate to:
```
http://localhost:3001/oauth/consent?client_id=test_app&redirect_uri=http://localhost:3000/callback&scope=read&state=test123&response_type=code
```

2. Log in if prompted
3. Click "Authorize"
4. You'll be redirected with an authorization code

### Test Token Exchange

```bash
curl -X POST http://localhost:3001/api/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "authorization_code",
    "code": "your_auth_code",
    "client_id": "test_app",
    "client_secret": "test_secret",
    "redirect_uri": "http://localhost:3000/callback"
  }'
```

## Example Integration

See [examples/oauth-integration.md](./examples/oauth-integration.md) for complete integration examples in various languages.
