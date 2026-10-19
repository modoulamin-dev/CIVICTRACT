# CivicTract

Public complaints platform for The Gambia. Citizens report problems, receive a tracking number, and follow progress in the open. Institutions route, prioritize, and update complaints from one dashboard.

## Stack

- Frontend: React (Vite), React Router, vanilla CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT + bcrypt

## Setup

1. Install [MongoDB](https://www.mongodb.com/try/download/community) and start it locally.
2. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

3. Copy environment files:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

4. Seed departments, a super admin, staff accounts, and sample complaints:

```bash
cd backend
npm run seed
```

5. Run the API and the web app (two terminals):

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

- Citizen portal: http://localhost:5173
- API: http://localhost:5000/api/v1

## Seeded logins

| Role | Email | Password |
| --- | --- | --- |
| Super admin | admin@civictract.gm | CivicTract2026! |
| Roads staff | roads@civictract.gm | Staff123! |
| Waste staff | waste@civictract.gm | Staff123! |
| Water staff | water@civictract.gm | Staff123! |
| Public safety staff | safety@civictract.gm | Staff123! |
| General desk staff | desk@civictract.gm | Staff123! |

Reporting a complaint does **not** require an account. Use the tracking number shown after submit.
