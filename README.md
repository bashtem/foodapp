# FoodApp Monorepo

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (v8+ recommended)
- [Docker](https://www.docker.com/) and Docker Compose

## Getting Started

Monorepo Structure: This project is organized as a monorepo using Turborepo, which allows for efficient management of multiple NestJS microservices and shared packages.

Environment Configuration: Each microservice has its own .env.production file for production environment variables, ensuring that sensitive information and configurations are managed separately.

Build and Start Scripts: The package.json files for each microservice include scripts for development (dev), building (build), and starting in production mode (start:prod). This standardization simplifies the development and deployment processes.

Shared Utilities: This project utilizes a shared utilities package (@foodapp/utils) to promote code reuse across different microservices.

Important Considerations:
Port Conflicts: Ensure each NestJS microservice is configured to run on a different port to avoid conflicts when running multiple services concurrently.

Inter-service Communication: For microservices to communicate, we implemented a gRPC communication strategy for sync service to service while we use NATS for async communications and Redis for caching and background jobs.

Shared Code: Utilize the packages/ directory for shared modules, DTOs, or utility functions that can be used by multiple microservices.

Dockerization: For deployment, consider using Docker and Docker Compose to containerize your microservices and manage their dependencies. You can create a dynamic Dockerfile that builds specific microservices based on arguments.

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

## Commit Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification to ensure consistent and meaningful commit messages. All commits are automatically validated using Commitlint.

### Commit Message Format

```
<type>: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type       | Description                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| `feat`     | A new feature                                                                                          |
| `fix`      | A bug fix                                                                                              |
| `docs`     | Documentation only changes                                                                             |
| `style`    | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) |
| `refactor` | A code change that neither fixes a bug nor adds a feature                                              |
| `perf`     | A code change that improves performance                                                                |
| `test`     | Adding missing tests or correcting existing tests                                                      |
| `chore`    | Changes to the build process or auxiliary tools and libraries                                          |
| `ci`       | Changes to CI configuration files and scripts                                                          |
| `build`    | Changes that affect the build system or external dependencies                                          |
| `revert`   | Reverts a previous commit                                                                              |

### Examples

**Good commit messages:**

```bash
feat: add user authentication endpoint
fix: resolve login button validation issue
docs: update API documentation for orders service
chore: update dependencies to latest versions
refactor: simplify user validation logic
test: add unit tests for payment service
```

**Bad commit messages:**

```bash
# Too vague
fix: bug

# Not following convention
Update README

# Missing type
add new feature
```

### Rules

1. **Type is required**: Every commit must start with a valid type
2. **Description is required**: Provide a clear, concise description
3. **Use lowercase**: Types must be in lowercase
4. **No period**: Don't end the description with a period
5. **Use imperative mood**: Write as if giving a command (e.g., "add" not "added")
6. **Keep it short**: Aim for 50 characters or less in the description
7. **Be specific**: Clearly describe what changed

### Automated Validation

This project uses Husky hooks to automatically:

- **Pre-commit**: Run ESLint and Prettier on staged files
- **Commit-msg**: Validate commit message format using Commitlint

If your commit message doesn't follow the convention, the commit will be rejected with helpful error messages.

### Tips for Writing Good Commits

1. **Make atomic commits**: Each commit should represent a single logical change
2. **Write for your future self**: Someone should understand what changed without looking at the code
3. **Use the body for context**: If the change is complex, add a body explaining why
4. **Reference issues**: Include issue numbers when applicable (e.g., `fixes #123`)

### Breaking Changes

For breaking changes, add an exclamation mark after the type:

```bash
feat!: remove deprecated authentication method
```

Or include `BREAKING CHANGE:` in the footer:

```bash
feat: update user API response format

BREAKING CHANGE: User API now returns different field names
```

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
