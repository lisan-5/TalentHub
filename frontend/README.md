# TalentHub Frontend

React + TypeScript frontend for the TalentHub demo project.

This project uses Vite, Tailwind CSS and a small local mock API for demo purposes.

## Development

1. Install dependencies

```powershell
npm install
```

2. Start the dev server

```powershell
npm run dev
```

3. Tailwind is compiled during dev via the Vite plugin. If you run a separate Tailwind build, ensure the `src/index.css` entry is used.

## Features

- Jobs listing and search
- Employer dashboard with job posting and application management
- Dark mode toggle (stored in localStorage)

## Notes and troubleshooting

- Auth: the app expects an authentication token in localStorage (handled by login/register flows). If you see unexpected redirects, check that the token is present and valid.
- Jobs endpoints:
  - Public jobs list: GET http://127.0.0.1:8000/api/jobs
  - Employer jobs: GET http://127.0.0.1:8000/api/user/jobs
  - Create job: POST http://127.0.0.1:8000/api/jobs

- When creating jobs:
  - The UI performs an optimistic insert if the create API returns the created object. Otherwise the app refreshes the public and user job lists after the create.

## Linting / Tests

- Run TypeScript checks and linting with your editor or:

```powershell
npm run build
npm run lint
npm test
```

## Contributing

Open a PR with a clear description. Keep types and API mappings consistent (IDs are normalized as strings in the frontend).
