# Ampflick Backend — Node + Express + MongoDB

This is the backend API for the Ampflick Operations Dashboard. It provides real CRUD (Create, Read, Update, Delete) endpoints for orders, backed by MongoDB — so the frontend's Add/Edit/Delete/Import features can eventually talk to a real database instead of in-memory state.

## Folder structure

```
ampflick-backend/
  src/
    config/
      db.js               MongoDB connection setup (Mongoose)
    models/
      Order.js             The Order schema — shape of an order document in the database
    controllers/
      orderController.js   All the logic: list, get one, create, update, delete, bulk import, KPI summary
    routes/
      orderRoutes.js        Maps URLs (e.g. GET /api/orders) to controller functions
    middleware/
      errorHandler.js       Turns errors into clean JSON responses
    app.js                  Express app: middleware, routes, health check
    server.js               Entry point — loads .env, connects to MongoDB, starts the server
  .env.example              Template for your environment variables
  .gitignore
  package.json
```

## Step 1 — Create a free MongoDB Atlas database

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free **M0 cluster** (no credit card needed).
3. Under **Database Access**, create a database user (username + password) — save these, you'll need them.
4. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) — fine for development, tighten this later for production.
5. Click **Connect** on your cluster → **Drivers** → copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 2 — Configure environment variables

1. Copy `.env.example` to a new file called `.env` in this same folder.
2. Paste your connection string into `MONGO_URI`, replacing `<username>` and `<password>` with your actual database user credentials, and add a database name before the `?` (e.g. `/ampflick?`):
   ```
   MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/ampflick?retryWrites=true&w=majority
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   ```
3. **Never commit `.env` to GitHub** — it's already listed in `.gitignore`.

## Step 3 — Install dependencies & run the server

```bash
cd ampflick-backend
npm install
npm run dev       # starts with nodemon (auto-restarts on file changes)
# or: npm start    # plain node, no auto-restart
```

If everything is configured correctly, you'll see:
```
✅ MongoDB connected: cluster0-shard-00-01.xxxxx.mongodb.net
🚀 Ampflick backend running at http://localhost:5000
```

## Step 4 — Test the API

Open a browser or use Postman/curl:

- `GET http://localhost:5000/api/health` → confirms the server is alive
- `GET http://localhost:5000/api/orders` → list all orders (empty array at first — the database starts empty)
- `POST http://localhost:5000/api/orders` with a JSON body:
  ```json
  {
    "customer": "Zainab Malik",
    "email": "z.malik@email.com",
    "city": "Lahore",
    "product": "Wireless Earbuds",
    "amount": 4500,
    "courier": "TCS",
    "status": "Delivered",
    "payment": "Paid",
    "method": "Easypaisa"
  }
  ```
- `PUT http://localhost:5000/api/orders/<the _id from the created order>` to update it
- `DELETE http://localhost:5000/api/orders/<_id>` to delete it
- `GET http://localhost:5000/api/orders/summary` → aggregated KPI numbers (total orders, delivered, revenue, etc.)
- `POST http://localhost:5000/api/orders/import` with body `{ "orders": [ {...}, {...} ] }` → bulk insert, used by the CSV import feature

## Step 5 — Connect the React frontend (next step, not done yet)

Right now, the frontend (`ampflick-dashboard`) still uses `OrdersContext.jsx` with local in-memory state. To connect it to this backend:

1. In `OrdersContext.jsx`, replace the `useState(initialOrders)` with an empty array, and fetch real data on load:
   ```js
   useEffect(() => {
     fetch('http://localhost:5000/api/orders')
       .then((res) => res.json())
       .then(setOrders)
   }, [])
   ```
2. Change `addOrder`, `updateOrder`, `deleteOrder`, `importOrders` to call the matching API endpoints (`POST`, `PUT`, `DELETE`, `POST /import`) instead of updating local state directly — then update state from the API's response.
3. Everything else (components, pages, UI) stays exactly the same — they don't know or care whether the data came from mock data or a real API.

Ask for this next step whenever you're ready — the frontend wiring is a separate, smaller task once this backend is confirmed working.
