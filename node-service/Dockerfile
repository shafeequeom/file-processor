# Use the official Node.js 20 image
FROM node:20

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and config
COPY . .

# Compile TypeScript
RUN npm run build

EXPOSE 4000

# Command to run the compiled worker
CMD ["node", "dist/index.js"]
