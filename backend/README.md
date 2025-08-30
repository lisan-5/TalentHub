(The file `c:\Users\lisan\Desktop\talenthub-backend\README.md` exists, but is empty)
# TalentHub Backend (local dev)

Small Laravel backend used for the TalentHub jobs board. This repository contains migrations, models, controllers, Sanctum token auth, resume uploads, seeders and a small Postman collection for API exploration.

## Quickstart (local)

1. Install PHP / Composer / Node.js.
2. Install PHP deps and JS deps:

```powershell
composer install
npm install
```

3. Copy env and generate key:

```powershell
cp .env.example .env
php artisan key:generate
```

4. Run migrations + seed demo data:

```powershell
php artisan migrate --seed
```

5. Start dev servers:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
npm run dev
```

Frontend (Vite) expects the backend at `http://127.0.0.1:8000` and the frontend dev server runs at `http://localhost:5173` by default.


These are created by the `DatabaseSeeder` when you run the seeds.

## API notes

- Base API: `http://127.0.0.1:8000/api`
- Important: API callers must include `Accept: application/json` to receive JSON auth error responses rather than HTML redirects.
- Auth: `/api/auth/register`, `/api/auth/login` (returns token). Use `Authorization: Bearer <token>` for protected endpoints.
- Jobs: `GET /api/jobs` (public), `POST /api/jobs` (employer), `GET /api/user/jobs` (employer dashboard), `GET /api/jobs/{id}` (details).
- Applications & resume download endpoints are available under `/api/applications` and `/api/applications/{id}/resume`.

Postman collection: `postman/talenthub-api.postman_collection.json`

## Tests

Run unit/feature tests with PHPUnit:

```powershell
./vendor/bin/phpunit
```

## Notes and troubleshooting

- If the frontend shows a "network error" during auth/registration, ensure CORS is configured and the client sets `Accept: application/json`.
- Local SQLite DB is used by default for quick dev. See `config/database.php`.

If you want me to expand this README (examples for axios/AuthContext, Postman usage, or CI steps) tell me which section to add.
