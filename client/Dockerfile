# client/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files explicitly
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Copy environment file
COPY .env.production ./.env.production

# Copy source code
COPY . .

# Build the application with production env
RUN npm run build

# Production stage
FROM nginx:stable-alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
