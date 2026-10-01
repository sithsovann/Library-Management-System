# Library Management System

A full-stack library management app built as a school project. The backend is a Laravel REST API, and the frontend is a separate React (Vite) single-page app that talks to it purely through HTTP requests — no Blade templates involved.

## Features

- **Auth** — register, login, and logout using Laravel Sanctum (token-based API auth). The frontend is fully gated: you must log in before you can see or use any part of the app.
- **Books** — add, view, and delete books, each linked to a category, with tracked total/available copy counts.
- **Borrowers** — add, view, and delete borrower records.
- **Loans** — check out a book to a borrower (with a due date), return a book, and view a list of currently overdue loans. Checking out a book automatically decrements its available copy count; returning it increments that count back.

## Tech Stack

**Backend**
- Laravel 12
- PHP 8.2.12
- PostgreSQL 17
- Laravel Sanctum (API token authentication)

**Frontend**
- React + Vite
- Plain CSS (no Tailwind)
- Calls the backend exclusively via `fetch` against the REST API

**Tools used during development**
- Postman (API testing)
- VS Code
- pgAdmin

## Project Structure

```
Library-Management-System/
├── backend/     # Laravel API
└── frontend/    # React + Vite SPA
```

## Getting Started

### Backend setup

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Update `.env` with your PostgreSQL connection details, then run:

```bash
php artisan migrate
php artisan db:seed
php artisan serve
```

The API will run at `http://127.0.0.1:8000`.

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:5173` (or wherever Vite prints).

`frontend/src/config.js` points the frontend at the backend API:

```js
export const API_URL = 'http://127.0.0.1:8000/api';
```

Update this if your backend runs on a different host/port.

### Running both together

Keep two terminals open — one running `php artisan serve` inside `backend/`, and one running `npm run dev` inside `frontend/`. Both need to stay running for the app to work.

## Database

Four main tables, plus Laravel's defaults and Sanctum's `personal_access_tokens`:

- `categories`
- `books` (belongs to a category, has many loans)
- `borrowers` (has many loans)
- `loans` (belongs to a book and a borrower)

Running `php artisan db:seed` populates 8 starter categories and a test user.

## API Endpoints

**Auth**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Create a new account |
| POST | `/api/login` | Log in, returns a Sanctum token |
| POST | `/api/logout` | Log out (requires auth) |
| GET | `/api/me` | Get the current logged-in user (requires auth) |

**Categories / Books / Borrowers**
Standard REST resource routes (`index`, `store`, `show`, `update`, `destroy`) at `/api/categories`, `/api/books`, `/api/borrowers`.

**Loans**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/loans` | List all loans |
| POST | `/api/loans` | Check out a book (`book_id`, `borrower_id`, `due_at`) |
| GET | `/api/loans/overdue` | List loans past their due date and not yet returned |
| PUT | `/api/loans/{loan}/return` | Mark a loan as returned |

## Notes / Known Limitations

- Auth currently gates the **frontend UI only** — the API routes themselves aren't yet protected with `auth:sanctum` middleware, so they could still be reached directly (e.g. via Postman) without a token.
- There's a single account type — no distinction between an admin role and a regular user.

## Authors

- [Thitraksa Phorn]
- [Sovann Sith]

Built for [Library-Management-System / Back-End-Project].
