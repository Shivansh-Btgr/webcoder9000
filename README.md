# theIDEproject

A full-stack online IDE platform with real-time code editing, execution, and project management. Built with Django (backend) and React (frontend).

---

## Features

- **User Authentication:** Register, login, logout, password reset via email (JWT-secured)
- **Code Editor:** Monaco Editor with syntax highlighting, language selection, theme toggle, and built-in autocomplete/linting
- **Code Execution:** Secure, Docker-based code execution for Python, C++, JavaScript, and Java with output/error capture and resource limits
- **File & Project Management:** Create, edit, delete, and rename files/projects
- **Output Panel:** Displays code output/errors, with reset/clear option
- **API:** RESTful endpoints via Django REST Framework
- **Social Login:** Google OAuth (frontend)

---

## Technology Stack
- **Backend:** Django, Django REST Framework, Docker
- **Frontend:** React.js (SPA, Vite), Monaco Editor
- **Database:** SQLite (default), PostgreSQL recommended
- **Auth:** JWT (SimpleJWT)

---

## Getting Started

### Backend (ScriptSpace)
1. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
2. Configure your database in `backend/settings.py` (SQLite by default, use PostgreSQL for production)
3. Run migrations:
   ```sh
   python manage.py migrate
   ```
4. Start the backend server:
   ```sh
   python manage.py runserver
   ```

### Frontend (Frontend)
1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in `Frontend/`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```
3. Start the frontend dev server:
   ```sh
   npm run dev
   ```

---

## API Overview
- All endpoints under `/api/` (see backend README for full list)
- JWT required for most endpoints
- Social login: POST Google access token to `/api/auth/social/login/`

---

## Directory Structure
- `ScriptSpace/` — Django backend (APIs, code execution, user/project/file management)
- `Frontend/` — React SPA (UI, Monaco Editor, API integration)

---

## Notes
- For production, use PostgreSQL and configure environment variables for secrets
- To enable email sending, update email backend in Django settings
- See individual READMEs in `Frontend/` and `ScriptSpace/` for more details

---

## License
MIT
