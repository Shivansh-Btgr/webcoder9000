# theIDEproject

A modern, full-stack Online IDE for collaborative coding, code execution, and project management—right in your browser.

---

## 🚀 Features

- **Authentication:** Secure registration, login, logout, and password reset (JWT-based)
- **Monaco Editor:** Syntax highlighting, language selection (Python, C++, JS, Java), theme toggle, and instant autocomplete/linting
- **Code Execution:** Safe, Docker-powered execution with output/error capture, time/memory limits
- **File & Project Management:** Create, edit, delete, and organize files/projects
- **Output Panel:** Clear display of results and errors, with reset/clear option
- **Social Login:** Google OAuth integration
- **Sharable Code Snippets:** Instantly generate public/private links to share code with anyone
- **RESTful API:** Built with Django REST Framework, secured with JWT

---

## 🛠️ Technology Stack
- **Backend:** Django, Django REST Framework, Docker
- **Frontend:** React.js (SPA, Vite), Monaco Editor
- **Database:** SQLite (dev), PostgreSQL (recommended for production)
- **Authentication:** JWT (SimpleJWT)

---

## ⚡ Quickstart

### Backend (ScriptSpace)
```sh
pip install -r requirements.txt
# Edit backend/settings.py for your DB (Postgres recommended)
python manage.py migrate
python manage.py runserver
```

### Frontend (Frontend)
```sh
npm install
# Add your Google OAuth client ID to Frontend/.env
# VITE_GOOGLE_CLIENT_ID=your-google-client-id
npm run dev
```

---

## 🌐 API Highlights
- All endpoints under `/api/` (see backend for full docs)
- JWT required for most endpoints
- Social login: POST Google access token to `/api/auth/social/login/`
- Snippet sharing: Generate and access code via unique URLs

---

## 📁 Project Structure
- `ScriptSpace/` — Django backend (APIs, code execution, user/project/file management)
- `Frontend/` — React SPA (UI, Monaco Editor, API integration)

---

## 💡 Notes
- Use PostgreSQL and environment variables for production
- To enable real email sending, update Django email backend settings
- All code is clean, secure, and ready for deployment—no sensitive data or unnecessary files are tracked

---

## 🏆 Impress Your Team
- Real-time code editing and execution
- Share code instantly with unique links
- Modern, responsive UI with dark/light themes
- Built for extensibility and security

---

## License
MIT
