# File Processor Monorepo

This monorepo contains two main services:

- `web-app`: A Next.js 15 application for uploading and visualizing log file stats.
- `node-service`: A Node.js 20 service that asynchronously processes uploaded log files using BullMQ and stores extracted stats in Supabase.

---

## 🐳 Docker-based Setup (Recommended)

### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Clone the Repository

```bash
git clone https://github.com/shafeequeom/file-processor.git
cd file-processor
```

### 2. Setup Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Supabase
SUPABASE_URL=https://projectcode.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Queue
BULLMQ_QUEUE_NAME=log-processing-queue
BULLMQ_CONCURRENCY=4

# Log Parser
KEYWORDS=ERROR,FAIL,EXCEPTION

```

> You can also copy `.env.example` and modify it:

```bash
cp .env.example .env
```

### 3. Start Services

```bash
docker-compose up --build
```

This command will:

- Start the `node-service` worker and log processor.
- Start the `web-app` frontend on `http://localhost:3000`.
- Start Redis container for job queueing.

### 4. Open in Browser

Navigate to:

```
http://localhost:3000
```

Sign up/Login to navigate to dashboard
Upload `.log` files and view job queue stats and extracted metrics in real-time.

```
http://localhost:4000/status-check
```

## Above url can used to check node-service life.

## 📁 Folder Structure

```
file-processor/
├── node-service/   # BullMQ worker and parser logic
├── web-app/        # Next.js frontend + API routes
├── docker-compose.yml
└── README.md       # This file
```

---

## 🧪 Testing

Each service has its own test setup:

- `web-app`: Uses `Jest`, `node-mocks-http` for API integration tests
- `node-service`: Uses `Jest` with mocking for Redis, Supabase, etc.

Run tests from root:

```bash
# Web app
cd web-app && yarn test

# Node service
cd ../node-service && yarn test
```

---
