# theIDEproject Frontend

## Features
- Modern React SPA with Vite
- Login, registration, password reset/change, and profile management
- Dashboard with project and file navigation
- Monaco Editor with language/theme selection, JS/TS linting/autocomplete, and code execution
- File/project CRUD, run, and save actions
- Google OAuth login using @react-oauth/google
- Environment variable support for Google Client ID
- Backend integration for all actions

## Getting Started

### 1. Clone and Install
```
npm install
```

### 2. Set up Environment Variables
Create a `.env` file in the project root:
```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```
Replace with your actual Google OAuth Client ID.

### 3. Run the App
```
npm run dev
```

### 4. Social Login
- Only Google login is enabled. When a user logs in with Google, the access token is sent to `/api/auth/social/login/` as:
  ```json
  {
    "provider": "google",
    "access_token": "<OAUTH2_ACCESS_TOKEN_FROM_PROVIDER>"
  }
  ```

### 5. Monaco Editor LSP (Python)
- For Python autocomplete/linting, a Pyright LSP proxy is provided. See `pyright-ws-proxy.cjs` for setup.
- Install Pyright globally: `npm install -g pyright`
- Run the proxy: `node pyright-ws-proxy.cjs`

## Project Structure
- `src/components/auth/` — Auth forms (login, register, forgot/reset/change password, profile)
- `src/components/dashboard/` — Dashboard UI
- `src/components/project/` — Project CRUD and detail
- `src/components/file/` — File CRUD and Monaco editor
- `src/components/common/SocialLogin.jsx` — Google OAuth login
- `public/` — Static assets (Google logo, etc.)

## Notes
- All sensitive config (like Google Client ID) is managed via `.env` and Vite env variables.
- Only Google login is enabled (no Apple/GitHub).
- For backend endpoints, see `/api/auth/social/login/`, `/api/users/login/`, `/api/files/`, etc.

---
Happy coding!