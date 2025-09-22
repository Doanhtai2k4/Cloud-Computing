# backend/Dockerfile (JS)
FROM node:20-alpine

WORKDIR /app

# Copy package files explicitly
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci --production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of app directory
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port 
EXPOSE 4000

# Environment variables (can be overridden at runtime)
ENV PORT=4000
ENV NODE_ENV=production

# Start app
CMD ["npm", "start"]
