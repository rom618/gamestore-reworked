# GameStore — Architecture Overview

This document describes the architecture of the GameStore application: a full-stack digital game store built with a Spring Boot backend and a React + TypeScript frontend.

---

## What the App Does

Endgoal: The GameStore lets customers browse a game catalog, manage a cart, write reviews, and complete purchases with saved payment info and addresses. Staff and managers have a separate portal to manage inventory and run promotions.

Currently: Only lets users login and browse games already in the database.

The main domains are:

- Customer and staff account management
- Game catalog with categories and platform support
- Shopping cart and transaction processing
- Payment information and address book
- Review system with like/dislike voting
- Promotion codes with percentage discounts

---

## Backend — Spring Boot

The backend follows a classic layered architecture. Each layer has one responsibility, and dependencies only flow downward.

```
HTTP Request
     ↓
Controller Layer     — receives the request, validates input shape, returns HTTP responses
     ↓
Service Layer        — enforces business rules, handles validation logic
     ↓
Repository (DAO)     — talks to the database via Spring Data JPA
     ↓
PostgreSQL Database
```

### Layer Breakdown

**Controller** (`controller/`)
Handles routing and HTTP. Each resource has its own controller class — `CustomerAccountController`, `GameController`, etc. Controllers don't contain business logic; they delegate to services and wrap results in DTOs before responding. Error handling uses `ResponseEntity<?>` so each endpoint can return appropriate status codes (200, 201, 400, 401, 404...).

Authentication state is managed through `AuthenticationUtility`, a utility class that reads from the active `HttpSession`. It exposes helpers like `isLoggedIn()`, `isStaff()`, and `isManager()` that controllers call to gate access.

**Service** (`service/`)
Where the real logic lives. Services validate business rules (e.g. email uniqueness, password matching), hash passwords with a per-account salt before storing them, and throw `IllegalArgumentException` with descriptive messages that bubble up to the controller layer.

**DAO** (`dao/`)
Spring Data JPA repositories. Mostly interface declarations — Spring generates the implementation at runtime. Custom finder methods like `findByEmailAddress` are declared here.

**Model** (`model/`)
JPA-annotated domain entities that map to database tables. The class hierarchy mirrors the UML: `Account` is the base, `CustomerAccount` and `StaffAccount` extend it, `ManagerAccount` is a singleton staff account. Relationships (one-to-many, many-to-one) are declared here.

**DTO** (`dto/`)
Request and response objects that form the public API contract. Keeps internal model details (like password hashes) from leaking into responses. Every controller method takes a `*RequestDto` and returns a `*ResponseDto`.

### Backend Folder Structure

```
src/main/java/ca/mcgill/ecse321/gamestore/
├── controller/       REST endpoints + AuthenticationUtility
├── service/          Business logic and validation
├── dao/              Spring Data JPA repositories
├── dto/              Request and response objects
└── model/            Domain entities (JPA)
```

---

## Frontend — React + TypeScript

The frontend is a Vite + React + TypeScript single-page application. It communicates with the Spring backend over REST, and uses the `JSESSIONID` cookie (set at login) for session authentication — `credentials: "include"` is set on every fetch so the cookie travels automatically.

The structure is split into focused layers that mirror the backend separation of concerns.

### How a User Action Flows

```
User interaction (click, form submit)
        ↓
Page component (pages/)
        ↓
Custom hook (hooks/)          — manages loading/error state
        ↓
API wrapper (api/)            — constructs and fires the fetch
        ↓
Spring Boot controller
        ↓
Service → Repository → PostgreSQL
        ↓
Response flows back up through hook → component → UI
```

### Layer Breakdown

**`api/`**
One file per backend resource. Each file exports a typed object with methods that map directly to backend endpoints — e.g. `gamesApi.getAll()` calls `GET /api/games/get/allgames`. All calls go through `client.ts`, a shared `fetch` wrapper that handles base URL, JSON headers, `credentials: "include"`, and error throwing.

**`types/index.ts`**
All TypeScript interfaces and enums for the domain — `CustomerAccount`, `Game`, `Transaction`, `CardType`, `Category`, `GameConsole`, and so on. Also contains typed request shapes like `CreateGameRequest`. Single file for a project of this size; import from `"../types"` anywhere.

**`context/`**
Global React state shared across the component tree.
- `AuthContext` — holds the logged-in `CustomerAccount`, exposes `login()` and `logout()`. On login, stores the user in `sessionStorage` so a page refresh doesn't log the user out. On logout, fires `POST /api/customer-account/logout` to invalidate the Spring session.
- `CartContext` — in-memory cart with `addItem`, `removeItem`, `updateQty`, and computed `totalPrice`.

**`hooks/`**
Custom hooks that own all data-fetching logic. Pages call hooks, never the API layer directly. Each hook manages its own `isLoading` and `error` state, and exposes a `refetch()` trigger where needed.

| Hook | What it does |
|---|---|
| `useAuth` | Reads from `AuthContext` |
| `useCart` | Reads from `CartContext` |
| `useGames` | Fetches all games |
| `useGame(id)` | Fetches a single game |
| `useReviews(gameId)` | Fetches reviews for a game |
| `useTransactions(customerId)` | Fetches a customer's transaction history |

**`components/`**
Reusable UI pieces. `ui/` contains primitives (Button, Input, Spinner, Modal) that carry no domain knowledge. Domain components like `GameCard` and `ReviewCard` know about the data model but not about pages.

**`pages/`**
Route-level components. Each page corresponds to one URL and composes hooks + components together.

| Page | Route | Access |
|---|---|---|
| `DiscoveryPage` | `/` | Public |
| `ProductPage` | `/game/:id` | Public |
| `LoginPage` | `/login` | Public (redirects if already logged in) |
| `CustomerDashboard` | `/dashboard` | Logged-in customers only |
| `StaffPortal` | `/staff` | Staff only |

Route protection is handled in `App.tsx` via `ProtectedRoute` and `StaffRoute` wrapper components. Both redirect to `/login` if the session check fails, passing `{ from: location }` state so the user lands back where they started after signing in.

**`utils/`**
Pure formatting helpers with no side effects. `formatPrice` formats integers as CAD currency. `formatDate` and `formatRelativeTime` handle ISO date strings. `getRatingStars` converts a float rating into a star breakdown object for rendering.

### Frontend Folder Structure

```
src/
├── main.tsx                  Entry point — mounts App, imports global CSS
├── index.css                 CSS variables, dark theme, global reset
├── App.tsx                   Router, providers, protected route wrappers
│
├── api/
│   ├── client.ts             Shared fetch wrapper (base URL, credentials, errors)
│   ├── index.ts              Barrel export
│   ├── customerAccount.ts
│   ├── staffAccount.ts
│   ├── games.ts
│   ├── gameQty.ts
│   ├── addresses.ts
│   ├── paymentInformation.ts
│   ├── promotionCode.ts
│   ├── reviews.ts
│   ├── transactions.ts
│   └── gameStoreObject.ts
│
├── types/
│   └── index.ts              All interfaces and enums
│
├── context/
│   ├── AuthContext.tsx        Logged-in user state + login/logout
│   └── CartContext.tsx        In-memory cart state
│
├── hooks/
│   ├── useAuth.ts
│   ├── useCart.ts
│   ├── useGame.ts
│   ├── useGames.ts
│   ├── useReviews.ts
│   └── useTransactions.ts
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Spinner.tsx
│   │   └── Modal.tsx
│   ├── Navbar.tsx
│   ├── GameCard.tsx
│   └── ReviewCard.tsx
│
├── pages/
│   ├── DiscoveryPage.tsx     Searchable game grid with category/platform filters
│   ├── ProductPage.tsx       Game detail, reviews, add-to-cart
│   ├── LoginPage.tsx         Sign in + create account (two-tab form)
│   ├── CustomerDashboard.tsx Settings, address book, transaction history
│   └── StaffPortal.tsx       Inventory management, promo code manager
│
└── utils/
    ├── formatPrice.ts
    ├── formatDate.ts
    ├── getRatingStars.ts
    └── index.ts
```

---

## Authentication Flow

Session auth is handled by Spring's `HttpSession` on the backend and a cookie on the frontend. No JWTs.

```
1. User submits email + password on LoginPage
2. POST /api/customer-account/login
3. Spring calls authenticateWithEmail() — verifies hashed password
4. On success: session.setAttribute("accountId", ...) + session.setAttribute("role", ...)
5. Browser receives JSESSIONID cookie
6. All subsequent fetch calls include credentials: "include" → cookie sent automatically
7. Controllers call AuthenticationUtility.isLoggedIn() / isStaff() to gate endpoints
8. On logout: POST /api/customer-account/logout → session.invalidate() + client state cleared
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Routing | React Router v6 |
| Styling | Plain CSS with CSS custom properties |
| Backend | Spring Boot 3, Java |
| Persistence | Spring Data JPA + Hibernate |
| Database | PostgreSQL |
| Auth | Spring HttpSession (cookie-based) |
