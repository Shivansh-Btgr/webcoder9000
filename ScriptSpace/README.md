# ScriptSpace Django Project

ScriptSpace is a Django backend for a collaborative coding platform, designed to work seamlessly with a modern React frontend. It provides robust APIs for user authentication, project management, file handling, and code execution in a secure environment.

## Features
- Django REST Framework (DRF) for API development
- JWT authentication using SimpleJWT
- Modular app structure: `users`, `executor`, `projects`
- Static file support for assets
- User registration, login, logout, and profile endpoints
- Password reset via email (console backend by default)
- Project CRUD (create, list, update, delete)
- File CRUD (create, list, update, delete, per project)
- Secure code execution for multiple languages (Python, C++, JavaScript, Java)
- Run code snippets or saved files, with output and error capture
- Owner-only access for all project and file operations
- RESTful API design for easy frontend integration

## Setup
1. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```
2. **Run migrations:**
   ```sh
   python manage.py migrate
   ```
3. **Start the development server:**
   ```sh
   python manage.py runserver
   ```

## Directory Structure
- `backend/` — Django project settings and root URLs
- `users/` — User registration, authentication, password reset, and profile APIs
- `executor/` — Code execution logic and endpoints
- `projects/` — Project and file management APIs
- `static/` — Static files (CSS, JS, images)

## Authentication
All authentication is handled via JWT tokens using SimpleJWT. Obtain a token via the login endpoint and include it in the `Authorization: Bearer <token>` header for protected routes.

## API Endpoints

### Users & Authentication
- `POST   /api/users/register/`                — Register a new user
- `POST   /api/users/login/`                 — Obtain JWT token (login)
- `POST   /api/users/logout/`                  — Logout (blacklist refresh token)
- `GET    /api/users/me/`                     — Get current authenticated user's info (JWT required)
- `POST   /api/users/password-reset/` ✅         — Request a password reset (send email with link)
- `POST   /api/users/password-reset-confirm/`✅  — Confirm password reset (provide `uid`, `token`, `new_password`)
- `PATCH  /api/users/update/`                  — Update current user's profile (username, email, first_name, last_name; JWT required)

### Projects
- `GET    /api/projects/`                      — List all projects for the authenticated user
- `POST   /api/projects/`                      — Create a new project
- `GET    /api/projects/<id>/`                — Retrieve a specific project (owner only)
- `PUT    /api/projects/<id>/`                 — Update/rename a project (owner only)
- `PATCH  /api/projects/<id>/`                 — Partially update a project (owner only)
- `DELETE /api/projects/<id>/`                 — Delete a project (owner only)

### Files
- `GET    /api/files/`                         — List all files for the authenticated user
- `GET    /api/files/?project=<id>`            — List all files belonging to a specific project (for the authenticated user; only files from that project will be returned)
- `POST   /api/files/`                         — Create a new file (must specify project)
- `GET    /api/files/<id>/`                    — Retrieve a specific file (owner only)
- `PUT    /api/files/<id>/`                    — Update file content (owner only)
- `PATCH  /api/files/<id>/`                    — Partially update a file (owner only)
- `DELETE /api/files/<id>/`                    — Delete a file (owner only)

### Code Execution
- `POST   /api/run-file/`            ✅          — Run a saved file (provide `file_id`)
- `POST   /api/execute/`             ✅          — Run code snippet (provide `code`, `language`, optional `input`)

### API Documentation
- `GET    /api/docs/`                          — Swagger/OpenAPI interactive docs
- `GET    /api/schema/`                       — Raw OpenAPI schema (JSON)

---

- All endpoints (except registration, login, and password reset) require JWT authentication.
- All project and file endpoints are owner-restricted: users can only access their own data.
- Use the `project` query parameter to filter files by project: `/api/files/?project=<project_id>`
- For password reset confirm, extract `uid` and `token` from the reset link sent to the user's email.

## Password Reset (via Email)
- `POST /api/users/password-reset/` — Request a password reset (send email with link)
    - Body: `{ "email": "user@example.com" }`
    - Response: Always returns 200 OK for security, even if email does not exist.
- `POST /api/users/password-reset-confirm/` — Confirm password reset
    - Body: `{ "uid": "<uid>", "token": "<token>", "new_password": "your_new_password" }`
    - The reset link sent to the user will be in the format: `https://your-frontend-domain/reset-password?uid=<uid>&token=<token>`

**Email Backend:**
- By default, password reset emails are printed to the console for development.
- To use real email sending, configure SMTP settings in `backend/settings.py` by changing `EMAIL_BACKEND` and adding SMTP config.

```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
DEFAULT_FROM_EMAIL = 'noreply@scriptspace.local'
```

---

## Supported Languages for Code Execution
- Python
- C++
- JavaScript (Node.js)
- Java

You can add more languages by editing `LANGUAGE_CONFIG` in `executor/docker_runner.py`.

---

## Development Notes
- This backend is designed to be used with a React frontend (no server-side templates).
- Static files are served from the `static/` directory.
- All business logic is handled via RESTful APIs.

---

For more details, see the code in each app or open an issue for questions.
