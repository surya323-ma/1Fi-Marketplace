# 1Fi Marketplace

A full-stack "1Fi Marketplace" section for the 1Fi app's Shop page — displays smartphones with
multiple EMI plans backed by mutual funds, loaded dynamically from a MongoDB-backed API.

The Shop page has three tabs: **Top Brands** and **Nearby Stores** (placeholders, per the
assignment brief) and **1Fi Marketplace** (fully implemented here).

## Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose ODM)

## Design Consistency

Colors, typography, and component shapes are matched to 1Fi's existing brand (from the live
site): indigo/violet primary (`#5B3FE0`), light-lavender surfaces (`#F5F3FE`), rounded product
cards with a tinted purple background (`#EEE8FC`), Inter typeface, and pill-shaped tabs/buttons
consistent with the "Shop Now" / "Start Shopping" CTAs seen across the app.

## Project Structure

```
1fi-marketplace/
├── backend/
│   ├── models/Product.js       # Mongoose schema
│   ├── routes/products.js      # /api/products routes
│   ├── seed.js                 # Seed script (3 products, variants, EMI plans)
│   ├── server.js                # Express app entrypoint
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── pages/ShopPage.jsx     # Shop tabs + marketplace grid
    │   ├── pages/ProductPage.jsx  # Product detail: variants + EMI plans + proceed
    │   ├── components/ProductCard.jsx
    │   ├── components/EMIPlanList.jsx
    │   └── api.js                 # fetch helpers
    └── .env.example
```

## Setup & Run Instructions

### Prerequisites
- Node.js 18+
- A MongoDB instance (local `mongod`, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env and set MONGO_URI to your MongoDB connection string
npm install
npm run seed      # populates the database with 3 products + variants + EMI plans
npm run dev        # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# edit .env if your API is not on http://localhost:5000
npm install
npm run dev        # starts the app on http://localhost:5173
```

Open `http://localhost:5173`, go to the Shop page, and select the **1Fi Marketplace** tab.

## Database Schema

Each product document embeds its variants, and each variant embeds its own EMI plan ladder
(this avoids extra joins/lookups for a read-heavy product page).

```js
Product {
  slug: String            // unique, used for the route /products/:slug
  name: String
  brand: String
  tag: String             // e.g. "NEW"
  description: String
  variants: [
    {
      variantId: String    // e.g. "256gb-silver"
      label: String        // e.g. "256GB / Silver"
      storage: String
      color: String
      mrp: Number
      price: Number
      image: String
      emiPlans: [
        {
          tenureMonths: Number   // 3, 6, 12, 24, 36, 48, 60
          monthlyAmount: Number
          interestRate: Number   // 0 or 10.5
          cashback: Number
        }
      ]
    }
  ]
  createdAt: Date
  updatedAt: Date
}
```

Seed data ships with 3 products (iPhone 17 Pro, Samsung Galaxy S24 Ultra, Google Pixel 9 Pro),
each with 2–3 variants (storage/color combinations), each with a 7-tier EMI ladder (0% interest
for 3/6/12/24 months, 10.5% interest for 36/48/60 months, plus cashback).

## API Endpoints

### `GET /api/products`
Returns a summary of all products (default variant's price/image only — used for the marketplace grid).

**Example response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "slug": "iphone-17-pro",
      "name": "iPhone 17 Pro",
      "brand": "Apple",
      "tag": "NEW",
      "image": "https://images.unsplash.com/...",
      "mrp": 134900,
      "price": 127400,
      "variantCount": 3
    }
  ]
}
```

### `GET /api/products/:slug`
Returns full product detail: all variants, each with its full EMI plan ladder.

**Example response:**
```json
{
  "success": true,
  "data": {
    "slug": "iphone-17-pro",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "tag": "NEW",
    "variants": [
      {
        "variantId": "256gb-silver",
        "label": "256GB / Silver",
        "storage": "256GB",
        "color": "Silver",
        "mrp": 134900,
        "price": 127400,
        "image": "https://images.unsplash.com/...",
        "emiPlans": [
          { "tenureMonths": 3, "monthlyAmount": 42467, "interestRate": 0, "cashback": 7500 },
          { "tenureMonths": 36, "monthlyAmount": 4218, "interestRate": 10.5, "cashback": 7500 }
        ]
      }
    ]
  }
}
```

If the slug doesn't exist, this returns `404` with `{ "success": false, "message": "Product not found" }`.

## Deployment

- **Backend:** Deploy `backend/` to Render (Web Service) or Railway. Set `MONGO_URI`, `PORT`,
  and `CORS_ORIGIN` (your deployed frontend URL) as environment variables. Use a MongoDB Atlas
  connection string in production.
- **Frontend:** Deploy `frontend/` to Vercel. Set `VITE_API_BASE_URL` to your deployed backend's
  `/api` URL.
