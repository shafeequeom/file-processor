# Use Node.js 20 as base image
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build Next.js app
RUN npm run build:server
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

