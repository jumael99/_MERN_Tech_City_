# Tech City API Reference

Base URL: `http://localhost:8989`
Auth: Cookie-based JWT (`Set-Cookie: jwt=...`). Use the login endpoint to obtain a session cookie, then include it automatically (Postman cookie jar) in subsequent requests.

Note on roles:
- Admin: `isAdmin: true`
- Seller: `role: "seller"`
- Regular user: default

---

## Auth & Users
- POST `/api/users` — Register
  - Body: `{ "name": "Jane", "email": "jane@example.com", "password": "123456", "role": "user|seller" }`
- POST `/api/users/auth` — Login (sets HTTP-only cookie)
  - Body: `{ "email": "jane@example.com", "password": "123456" }`
- POST `/api/users/logout` — Logout (clears cookie)
- GET `/api/users/profile` — Get my profile (auth)
- PUT `/api/users/profile` — Update my profile (auth)
- GET `/api/users` — List users (admin)
- GET `/api/users/:id` — Get user by id (admin)
- PUT `/api/users/:id` — Update user (admin; can set `isAdmin` and `role`)
- DELETE `/api/users/:id` — Delete user (admin; cannot delete an admin)

Example: login then get profile
```bash
curl -i -X POST http://localhost:8989/api/users/auth \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@email.com","password":"123456"}'
# Grab the Set-Cookie: jwt=... header; Postman does this automatically.

curl -i http://localhost:8989/api/users/profile \
  -H 'Cookie: jwt=YOUR_COOKIE_VALUE'
```

---

## Products
- GET `/api/products` — List (public)
  - Query: `keyword`, `pageNumber`
- GET `/api/products/top` — Top rated (public)
- GET `/api/products/seller` — Current seller's products (seller)
- GET `/api/products/:id` — Get one (public)
- POST `/api/products` — Create sample product (admin or seller)
- PUT `/api/products/:id` — Update (admin or seller)
- DELETE `/api/products/:id` — Delete (admin or seller)
- POST `/api/products/:id/reviews` — Add review (auth; must have a paid order for the product)
- PUT `/api/products/:id/reviews/:reviewId` — Update own review (auth)
- DELETE `/api/products/:id/reviews/:reviewId` — Delete own review (auth)

Examples
```bash
# Public list
curl -s http://localhost:8989/api/products | jq

# Create (seller/admin)
curl -i -X POST http://localhost:8989/api/products \
  -H 'Content-Type: application/json' \
  -H 'Cookie: jwt=YOUR_COOKIE' \
  -d '{}'
```

---

## Orders
- POST `/api/orders` — Create order (auth)
- GET `/api/orders/mine` — My orders (auth)
- GET `/api/orders/:id` — Get one (auth)
- POST `/api/orders/:id/pay` — Init SSLCommerz payment (auth, order owner)
- PUT `/api/orders/:id/deliver` — Mark delivered (admin)
- GET `/api/orders` — List all (admin)
- GET `/api/orders/revenue` — Total revenue (admin)
- GET `/api/orders/seller` — Current seller's orders (seller)
- GET `/api/orders/seller/revenue` — Current seller's revenue (seller)
- POST `/api/orders/payment-online/success/:tranId` — SSLCommerz success callback
- POST `/api/orders/payment-online/failure/:tranId` — SSLCommerz failure callback

Example: create order
```bash
curl -i -X POST http://localhost:8989/api/orders \
  -H 'Content-Type: application/json' \
  -H 'Cookie: jwt=YOUR_COOKIE' \
  -d '{
    "orderItems": [
      {"_id": "<productId>", "qty": 1}
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Dhaka",
      "postalCode": "1205",
      "country": "BD"
    },
    "paymentMethod": "cod"
  }'
```

---

## Uploads
- POST `/api/upload` — Upload single image field `image` (public). Returns `{ image: "/uploads/<file>" }`.

Example
```bash
curl -i -X POST http://localhost:8989/api/upload \
  -F image=@/absolute/path/to/file.png
```

---

## Seller Routes (extra)
- DELETE `/api/seller/:id` — Delete product by id (seller)

---

## Seeding Data
- Import seed data (users + products; wipes existing):
  - `npm run data:import`
- Destroy all seed data (users, products, orders):
  - `npm run data:destroy`

Seed notes
- Inserts 3 users by default (1 admin, 2 regular) from `backend/data/users.js`.
- All seeded products are owned by the first created user (admin).

---

## Creating Users Directly (Admin/Seller)
Use the helper script to create or update a user without touching other data.

Create admin
```bash
node backend/scripts/createUser.js \
  --name "Shop Admin" \
  --email admin2@example.com \
  --password 123456 \
  --admin
```

Create seller
```bash
node backend/scripts/createUser.js \
  --name "Seller One" \
  --email seller1@example.com \
  --password 123456 \
  --role seller
```

Update existing user (by email) and reset password
```bash
node backend/scripts/createUser.js \
  --name "Seller One" \
  --email seller1@example.com \
  --password newpass \
  --role seller \
  --reset
```

The script connects via `MONGODB_URI` and respects model hooks for password hashing.

---

## Postman Tips
- Use a single base `{{api}}` environment var set to `http://localhost:8989`.
- After logging in, Postman automatically stores the `jwt` cookie; subsequent requests will be authenticated.
- For seller-only routes, log in as a seller. For admin-only routes, log in as an admin.

