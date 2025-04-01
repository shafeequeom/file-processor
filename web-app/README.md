# 📦 Web App - Log Processor Frontend

This is the frontend application for the Log Processor platform, built with **Next.js 15.x**, **React 18.x**, and **Tailwind CSS**. It interfaces with the Supabase backend and the BullMQ-powered Node.js log processing service.

---

## 🚀 Features

- 📁 Upload `.log` files via drag-and-drop
- 📊 Real-time job status with WebSocket updates
- 🧾 Display parsed statistics: error levels, IPs, and more
- 🛡️ Supabase Auth (Email + GitHub OAuth)
- 🌐 API rate-limiting and secured routes
- ✨ Clean and responsive UI with Tailwind CSS

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/shafeequeom/file-processor.git
cd file-processor/web-app
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://projectcode.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

Refer to `.env.example` for all options.

---

## 🧪 Running in Development

```bash
yarn dev
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 📦 Production (with Docker)

In the root directory, run:

```bash
docker-compose up --build
```

This will bring up both `node-service` and `web-app`.

---

## 🧪 Testing

```bash
yarn test
```

Includes:

- ✅ Unit tests for critical components
- ✅ Integration test for file upload flow
- ✅ Mocked Supabase + BullMQ jobs

---

## 🧠 Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Auth**: Supabase Auth
- **Realtime**: WebSockets (custom API route)
- **Queue**: BullMQ
- **Rate Limiting**: Redis (rate-limiter-flexible)

---

## 📂 Directory Overview

```
src/
├── app/              # App Router structure (Next.js)
├── pages/api/        # API route for uploads
├── components/       # UI components
├── util/             # Supabase client, helpers
├── __tests__/        # Unit & integration tests
```

---

## 🧼 Linting & Formatting

```bash
yarn lint
yarn format
```

---

## 🧠 Notes

- File uploads are streamed and passed to the BullMQ job processor.
- Job status updates appear live using WebSocket messages.
- Rate limiting prevents excessive uploads from the same IP.

---

## 👤 Author

- Shafeeque OM
