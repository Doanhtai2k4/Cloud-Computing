# backend/Dockerfile (JS)
FROM node:20-alpine

# tạo user non-root (tốt cho security)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# copy package files first (for better caching)
COPY package*.json ./

# install dependencies
RUN npm ci --production

# copy source code
COPY . .

# expose port 
EXPOSE 4000

# switch to non-root user
USER appuser

# start app
CMD ["npm", "start"]
