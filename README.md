# Flora API — backend

REST API for the **Flora** flower boutique: a **bouquets** catalogue with image
upload (Cloudinary), customer **feedbacks** and **orders**.

Final project for lessons 21–30 (backend deployment → PostgreSQL → REST API →
file & image handling → Swagger → deploy).

- **Runtime:** Node.js 20+ (developed on 24), ES modules
- **Framework:** Express 5
- **Database:** PostgreSQL via **Prisma 7** (`@prisma/adapter-pg` driver)
- **Validation:** Joi (separate schema files + reusable middleware)
- **Images:** Multer + **Cloudinary**
- **Docs:** Swagger UI (OpenAPI 3) at `/api-docs`
- **Security:** Helmet, CORS allow-list

---

## Architecture

Layered, feature-module structure (routes → controller → service → repository):

```
src/
├── server.js                # entry: connect DB ("Database connection successful"), start HTTP, graceful shutdown
├── app.js                   # express app: helmet, cors, json, docs, routes, error handling
├── config/
│   ├── env.js               # validated environment configuration
│   └── cloudinary.js        # Cloudinary SDK init
├── lib/prisma.js            # shared Prisma client (adapter-pg)
├── constants/               # httpStatus, messages
├── utils/                   # HttpError, asyncHandler, pagination, formatJoiError, commonSchemas
├── middlewares/             # validate (body/query/params), errorHandler, notFound, upload (multer)
├── storage/cloudinaryStorage.js   # uploadImage / deleteImage (provider-agnostic interface)
├── docs/openapi.js          # OpenAPI 3 spec (Swagger UI)
├── routes/index.js          # mounts modules under /api
└── modules/
    ├── bouquets/            # bouquet.{routes,controller,service,repository,schemas}.js
    ├── feedbacks/
    └── orders/
```

- **Controller** — HTTP only. **Service** — business rules + image lifecycle.
  **Repository** — the only layer that talks to Prisma.
- Every error returns one shape: `{ "message": "..." }`.

## Data model (Prisma → PostgreSQL)

| Table | Fields | Notes |
|---|---|---|
| **Bouquet** | id, title, description, price `Int`, **photoURL**, photoURL2x?, alt?, descriptionLong?, **favorite** `Boolean`, createdAt, updatedAt | indexes on `favorite`, `createdAt` |
| **Feedback** | id, text, author, location, createdAt | index on `createdAt` |
| **Order** | id, name, phone, address?, message, quantity, bouquetId?, createdAt | FK → Bouquet `onDelete: SetNull` (keeps order history) |

Field names are unified across the Prisma model, Joi schemas, Swagger and API
responses (`photoURL`, `favorite`).

## API

Base path: `/api`. Interactive docs at `/api-docs`. Errors: `{ message }`.
Status codes: **200, 201, 400, 404** (+ 500).

### Bouquets

| Method | Path | Description |
|---|---|---|
| GET | `/api/bouquets` | List (all; or paginated with `?page=&perPage=`; `?search=`, `?favorite=`) → 200 |
| GET | `/api/bouquets/favorites` | All favorite bouquets (homepage carousel) → 200 |
| GET | `/api/bouquets/:id` | One bouquet → 200 / 404 |
| POST | `/api/bouquets` | Create — `multipart/form-data`, field `photo` (Cloudinary) → 201 / 400 |
| PUT | `/api/bouquets/:id` | Update passed fields; empty body → 400 → 200 / 404 |
| DELETE | `/api/bouquets/:id` | Delete (+ removes Cloudinary image) → 200 / 404 |
| PATCH | `/api/bouquets/:id/favorite` | Toggle/set favorite → 200 / 404 |
| PATCH | `/api/bouquets/:id/photo` | Replace photo — `multipart/form-data`, field `photo` → 200 / 400 / 404 |

### Feedbacks

| Method | Path | Description |
|---|---|---|
| GET | `/api/feedbacks` | All feedbacks → 200 |
| GET | `/api/feedbacks/:id` | One → 200 / 404 |
| POST | `/api/feedbacks` | Create → 201 / 400 |
| PUT | `/api/feedbacks/:id` | Update → 200 / 400 / 404 |
| DELETE | `/api/feedbacks/:id` | Delete → 200 / 404 |

### Orders

| Method | Path | Description |
|---|---|---|
| POST | `/api/orders` | Place an order (storefront form) → 201 / 400 |
| GET | `/api/orders` | List (`?page=&perPage=`) → 200 |
| GET | `/api/orders/:id` | One → 200 / 404 |
| PUT | `/api/orders/:id` | Update → 200 / 400 / 404 |
| DELETE | `/api/orders/:id` | Delete → 200 / 404 |

---

## Prerequisites

- Node.js **20+**
- Docker + Docker Compose (for the local database) — or any PostgreSQL 14+
- A **Cloudinary** account (free tier) for image upload

## Installation

```bash
npm install          # postinstall runs `prisma generate`
```

## Environment (`.env`)

```bash
cp .env.example .env
```

```dotenv
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:4000,http://localhost:3000
DATABASE_URL="postgresql://flora:flora@localhost:5435/flora?schema=public"
MAX_FILE_SIZE_MB=6
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=flora
```

## PostgreSQL (local)

`docker-compose` maps the DB to host port **5435** (avoids clashing with a
Postgres already on 5432/5433):

```bash
npm run db:up        # docker compose up -d postgres
npm run db:down      # stop & remove
```

## Migrations & seed

```bash
npm run migrate          # prisma migrate dev (creates + applies)
npm run migrate:deploy   # production: apply existing migrations
npm run seed             # 107 bouquets (18 favorites) + 25 feedbacks
```

## Run

```bash
npm run dev      # nodemon, http://localhost:3001
npm start        # production mode
```

- API: `http://localhost:3001/api`
- Swagger UI: `http://localhost:3001/api-docs`
- Health: `http://localhost:3001/health`

## Run the frontend

```bash
cd ../UMT-markup-practice-KovalchukNazar
npm install
cp .env.example .env      # VITE_API_BASE_URL="/api"
npm run dev               # http://localhost:4000 (Vite proxies /api → :3001)
```

## Docker (full stack)

```bash
docker compose up --build                  # Postgres (5435) + API (3001)
docker compose exec backend npm run seed   # one-time seed
```

## Deploy to Render

This repo includes a **`render.yaml`** blueprint (web service + managed
PostgreSQL):

1. Push the repo to GitHub.
2. Render → **New → Blueprint** → select the repo.
3. After the first deploy, set the dashboard secrets: `CLOUDINARY_CLOUD_NAME`,
   `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `CORS_ORIGIN`
   (your GitHub Pages URL). `DATABASE_URL` is wired automatically.
4. Build runs `prisma migrate deploy`; seed once from the Render shell:
   `npm run seed`.

The live API will be at `https://<service>.onrender.com/api` and Swagger at
`/api-docs`.

### Frontend on GitHub Pages with the live API

Build the frontend with the Render URL so the deployed site calls the real API:

```bash
VITE_API_BASE_URL="https://<service>.onrender.com/api" npm run build
```

Make sure the backend `CORS_ORIGIN` includes the Pages origin
(`https://<user>.github.io`).

## Full from-scratch walkthrough

```bash
# Backend
cd UMT-backend-practice-KovalchukNazar
npm install
cp .env.example .env          # fill Cloudinary keys
npm run db:up                 # Postgres in Docker (:5435)
npm run migrate               # name it "init"
npm run seed                  # demo data
npm run dev                   # http://localhost:3001  (Swagger: /api-docs)

# Frontend (second terminal)
cd ../UMT-markup-practice-KovalchukNazar
npm install
cp .env.example .env
npm run dev                   # http://localhost:4000
```

Open `http://localhost:4000` — the catalogue, favorites carousel and
testimonials load from the API, and the order form submits real orders.
