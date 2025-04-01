# Node Service - Log Processor

This is the backend processing service for the File Processor project. It is responsible for:
- Receiving and processing log files via BullMQ.
- Streaming file content from Supabase Storage.
- Parsing logs and extracting structured data.
- Inserting summarized data into Supabase database.

---

## 📁 Directory Structure

```
node-service/
├── __tests__/              # Unit and integration tests
├── dist/                   # Compiled output (ignored)
├── src/                    # Main source code
│   ├── Common/Config/      # Config values like keywords
│   ├── Jobs/               # BullMQ job handlers
│   ├── Queue/              # BullMQ setup and queue creation
│   ├── Service/            # Supabase service for upload/download
│   ├── Utils/              # Utility functions (parsers, Redis)
│   └── Worker/             # Worker entry for job processing
├── Dockerfile              # Docker build instructions
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

---

## 🚀 Running Locally

Clone the Repository

```bash
git clone https://github.com/shafeequeom/file-processor.git
cd file-processor/web-app
```

Make sure Redis and Supabase credentials are configured.

```bash
cd node-service
cp .env.example .env
yarn install
yarn build
yarn start
```

To run in dev mode:

```bash
yarn dev
```

---

## 🧪 Testing

```bash
yarn test
```

---

## 🐳 Running with Docker

```bash
docker build -t node-service .
docker run --env-file .env node-service
```

Or via docker-compose from the root project.

---

## ⚙️ Environment Variables

Set these in `.env`:

```env
NODE_ENV=development
PORT=4000

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Supabase
SUPABASE_URL=https://projectcode.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY

# Queue
BULLMQ_QUEUE_NAME=log-processing-queue
BULLMQ_CONCURRENCY=4

# Log Parser
KEYWORDS=ERROR,FAIL,EXCEPTION

```

---

## 📌 Notes

- Uses BullMQ for robust job queuing and retry mechanisms.
- Designed to efficiently stream and process large log files (1GB+).
- Fully typed with TypeScript.

---

## 📫 Maintainer

Shafeeque OM