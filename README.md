# TalentHub: Mini Job Portal

A simple job portal platform where employers can post jobs, applicants can apply (with resume uploads), admins and employers can review applications, and users and employers can manage their dashboards. Built as a test project for MO Business PLC.

This repository contains two main folders:
- `frontend`: React + TypeScript application for the user interface.
- `backend`: Laravel API for handling data, authentication, and business logic.

## Features

### Core Features
- **Landing Page**: Displays available job listings with search functionality.
- **Job Posting**: Employers can create new job postings via a form.
- **Job Applications**: Applicants can apply to jobs, including resume uploads.
- **Dashboards**:
  - Applicant dashboard: View applied jobs.
  - Employer dashboard: View posted jobs and manage applications (view, download resumes).
  - Admin dashboard: Review all applications.
- **Authentication**: User registration and login with role-based access (employer/applicant/admin).
- **Validation**: Prevents duplicate applications; secure endpoints with token auth.
- **Database**: Stores users, jobs, and applications with relationships using MySQL.

### Bonus Features
- **Search/Filter**: Job search by keyword.
- **File Upload**: Resume uploads stored locally (with download support for employers and admins).
- **Dark Mode Toggle**: Frontend dark mode persisted in localStorage.
- **Analytics**: Basic count of applications per job (visible in employer and admin dashboards).

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS.
- **Backend**: Laravel (PHP), Sanctum for authentication.
- **Database**: MySQL.
- **Other**: JWT-like token auth, resume storage, optimistic UI updates.

## Prerequisites
- Node.js (v18+)
- PHP (v8.1+)
- Composer
- MySQL
- Git

## Installation and Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd TalentHub
```

### 2. Set Up Backend
Navigate to the backend folder:
```bash
cd backend
```

Install dependencies:
```bash
composer install
npm install  # For any JS assets, if needed
```

Copy environment file and generate app key:
```bash
cp .env.example .env
php artisan key:generate
```

Update `.env` with your MySQL credentials (e.g., DB_DATABASE, DB_USERNAME, DB_PASSWORD).

Run migrations and seed demo data:
```bash
php artisan migrate --seed
```

Start the backend server:
```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Demo users are seeded (check backend README for details, including admin role).

### 3. Set Up Frontend
Navigate to the frontend folder:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API requests to the backend at `http://127.0.0.1:8000`.

### 4. Full Local Development
- Ensure backend is running at `http://127.0.0.1:8000`.
- Frontend dev server at `http://localhost:5173`.
- Register/login via the app to get an auth token (stored in localStorage).
- Use employer role to post jobs, applicant role to apply, and admin role to review applications.

## Usage

### Frontend
- **Jobs Listing**: Browse and search jobs on the landing page.
- **Apply**: Logged-in applicants can submit applications with resumes.
- **Employer Dashboard**: Post jobs, view applications, download resumes.
- **Admin Dashboard**: Review all applications.
- **Dark Mode**: Toggle in the UI (persists across sessions).

### Backend API
Base URL: `http://127.0.0.1:8000/api`

Include `Accept: application/json` in headers for JSON responses.

#### Authentication
- `POST /auth/register`: { name, email, password, role } → Returns user and token.
- `POST /auth/login`: { email, password } → Returns token.

Use `Authorization: Bearer <token>` for protected routes.

#### Jobs
- `GET /jobs`: List all public jobs.
- `GET /jobs/{id}`: Job details.
- `POST /jobs`: Create job (employer only) – { title, description }.
- `GET /user/jobs`: Employer's posted jobs.

#### Applications
- `POST /applications`: Apply (applicant only) – { jobId, resume (file) }.
- `GET /applications/:userId`: View user's applications.
- `GET /applications/{id}/resume`: Download resume (employer/admin only).

For full API exploration, use the included Postman collection in the backend folder.

## Notes and Troubleshooting
- **Auth Issues**: Ensure token is in localStorage; check console for errors. API returns JSON errors with `Accept: application/json`.
- **Resume Uploads**: Stored locally in backend; ensure storage permissions.
- **Optimistic Updates**: Frontend refreshes job lists after creates if needed.
- **Testing**: Run `npm test` in frontend; use seeders for backend data.
- **Deployment (Bonus)**: Frontend can be deployed to Vercel; backend to Render/Heroku. Update API URLs accordingly.

## Contributing
- Open a PR with clear descriptions.
- Maintain consistent types (e.g., string IDs in frontend).
- Commit regularly with meaningful messages.
- Run linting: `npm run lint` (frontend).

For folder-specific details:
- See `frontend/README.md` for frontend-specific notes.
- See `backend/README.md` for backend-specific notes.

This project was completed in ~4 days for MO Business PLC, incorporating bonus features like search, uploads, dark mode, and admin functionality to showcase extended capabilities.
