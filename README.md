# FoodApp Monorepo

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v8+ recommended)
- [Docker](https://www.docker.com/) and Docker Compose

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/foodapp.git
cd foodapp
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Each service has its own `.env.development` and `.env.production` files in their respective `apps/<service>/` directories.  
Edit these files as needed for your local or production setup.

Example for `apps/api-gateway/.env.development`:
```
PORT=3000
ORDER_GRPC_URL=localhost:50051
RESTAURANT_GRPC_URL=localhost:50052
PAYMENT_GRPC_URL=localhost:50053
AUTH_GRPC_URL=localhost:50054
USER_GRPC_URL=localhost:50055
```

### 4. Start Infrastructure (Databases, etc.)

Run the setup script to start Docker Compose from the correct infra directory:

```bash
./dev-setup.sh
```

This will bring up all required infrastructure containers (databases, etc.) using Docker Compose.

### 5. Build All Services

```bash
pnpm build
```
Or, if using TurboRepo:
```bash
pnpm turbo run build
```

### 6. Start All Services in Development Mode

You can start each service individually:

```bash
cd apps/api-gateway
pnpm dev
# In a new terminal:
cd ../auth-service
pnpm dev
# ...repeat for other services
```

Or use TurboRepo to run all dev scripts in parallel:

```bash
pnpm turbo run dev --parallel
```

### 7. Accessing the API Gateway

By default, the API Gateway runs on [http://localhost:3000](http://localhost:3000) (or the port specified in your `.env.development`).

---

## Additional Notes

- **Environment Selection:**  
  The services use `.env.development` when `NODE_ENV=development` and `.env.production` when `NODE_ENV=production`.  
  Set `NODE_ENV` before starting a service to control which environment file is loaded.

- **Stopping Infrastructure:**  
  To stop all Docker containers:
  ```bash
  cd infra/_dev
  docker compose down
  ```

- **Adding New Services:**  
  Duplicate the `.env.development` and `.env.production` files for any new service you add.

---

## Troubleshooting

- If a service does not pick up the correct environment variables, ensure you are running from the monorepo root and that `NODE_ENV` is set appropriately.
- If Docker containers fail to start, check Docker Desktop is running and you have sufficient resources allocated.

---

## Project Structure

```
foodapp/
├── apps/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── order-service/
│   ├── user-service/
│   ├── restaurant-service/
│   └── payment-service/
├── packages/
│   ├── proto/
│   ├── utils/
│   └── config/
├── infra/
│   └── _dev/
├── dev-setup.sh
└── README.md
```

---

For more details, see the documentation in each service's directory or contact the maintainers.