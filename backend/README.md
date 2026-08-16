# KalaSetu Backend

REST API for the KalaSetu handcrafted artifacts marketplace.  
Built with **Node.js**, **Express 5**, **MongoDB / Mongoose**, **JWT auth**, and **Google OAuth 2.0**.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| MongoDB | ≥ 6 (local or Atlas) |
| npm | ≥ 9 |

---

## Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Then edit .env with your real values (MongoDB URI, JWT secrets, Google OAuth keys)

# 4. (Optional) Seed the database with sample products
npm run seed

# 5. Start the dev server (with hot-reload via nodemon)
npm run dev
```

The server will start on `http://localhost:5000` by default.

---

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | `development` or `production` | No (default: development) |
| `MONGODB_URI` | MongoDB connection string | **Yes** |
| `JWT_ACCESS_SECRET` | Secret for access tokens | **Yes** |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | **Yes** |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL | No (default: 15m) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | No (default: 7d) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | **Yes** |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | **Yes** |
| `GOOGLE_CALLBACK_URL` | Google OAuth redirect URI | **Yes** |
| `FRONTEND_ORIGIN` | Allowed CORS origin | No (default: http://localhost:5173) |

---

## API Routes

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | Public | Register with email/password |
| POST | `/signin` | Public | Login, sets httpOnly cookies |
| GET | `/google` | Public | Redirect to Google consent |
| GET | `/google/callback` | Public | Google OAuth callback |
| POST | `/refresh` | Cookie | Rotate access token |
| POST | `/logout` | Auth | Clear cookies & session |
| GET | `/me` | Auth | Get current user |

### Profile (`/api/profile`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Auth | Get profile |
| PUT | `/` | Auth | Update name/avatar/phone/address |
| PUT | `/password` | Auth | Change password (email accounts only) |
| DELETE | `/` | Auth | Delete account |

### Products (`/api/products`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | List (pagination, filter, search) |
| GET | `/:id` | Public | Get single product |
| POST | `/` | Admin | Create product |
| PUT | `/:id` | Admin | Update product |
| DELETE | `/:id` | Admin | Delete product |

### Cart (`/api/cart`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Auth | Get cart with total |
| POST | `/add` | Auth | Add item (validates stock) |
| PUT | `/update/:productId` | Auth | Update item quantity |
| DELETE | `/remove/:productId` | Auth | Remove item |
| DELETE | `/clear` | Auth | Clear cart |

### Wishlist (`/api/wishlist`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Auth | Get wishlist |
| POST | `/add/:productId` | Auth | Add product (no duplicates) |
| DELETE | `/remove/:productId` | Auth | Remove product |

---

## Response Format

All responses follow this shape:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (hot-reload) |
| `npm start` | Start in production mode |
| `npm run seed` | Seed database with sample products |
