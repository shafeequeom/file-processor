# Use Node.js 20 as base image
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .

# Build Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npx", "ts-node", "src/server.ts"]

