# 🚀 MERN Stack Cloud-Native Application

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue?logo=docker)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-black?logo=github)
![Deploy](https://img.shields.io/badge/Deploy-Render-purple)

**Production-Ready Full-Stack Application with Automated CI/CD**

[Live Demo](#) | [Documentation](./DEPLOYMENT_GUIDE.md) | [Presentation Guide](./PRESENTATION_GUIDE.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Monitoring](#-monitoring)
- [Security](#-security)
- [Contributing](#-contributing)

---

## 🎯 Overview

A modern, cloud-native MERN (MongoDB, Express, React, Node.js) stack application featuring:

- ✅ **Fully Automated CI/CD** - Push to deploy with GitHub Actions
- ✅ **Cloud-Native Architecture** - Containerized with Docker, deployed on Render
- ✅ **Managed Database** - MongoDB Atlas with auto-scaling
- ✅ **Production-Ready** - Health checks, logging, monitoring, rate limiting
- ✅ **Security First** - JWT auth, bcrypt, CORS, rate limiting, security headers
- ✅ **Developer Friendly** - Hot reload, easy setup, comprehensive docs

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  PRODUCTION ARCHITECTURE                 │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐    ┌──────────────┐   ┌────────────┐ │
│  │   Frontend   │───▶│   Backend    │──▶│  MongoDB   │ │
│  │              │    │              │   │   Atlas    │ │
│  │ React + Vite │    │ Node+Express │   │   Cloud    │ │
│  │    Nginx     │    │   REST API   │   │            │ │
│  │              │    │              │   │            │ │
│  │  Render.com  │    │  Render.com  │   │  Managed   │ │
│  └──────────────┘    └──────────────┘   └────────────┘ │
│         │                    │                           │
│         └────────────────────┼──────────────┐           │
│                              │               │           │
│                    ┌─────────▼────┐  ┌──────▼──────┐   │
│                    │ Health Checks│  │   Logging   │   │
│                    │  Monitoring  │  │  & Metrics  │   │
│                    └──────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Request** → Frontend (React SPA)
2. **API Call** → Backend (Express REST API)
3. **Authentication** → JWT Token Validation
4. **Rate Limiting** → DDoS Protection
5. **Business Logic** → Controllers & Models
6. **Database** → MongoDB Atlas
7. **Response** → JSON Data
8. **Logging** → Structured Logs

---

## ✨ Features

### Application Features

- 🔐 **User Authentication** - JWT-based auth with bcrypt password hashing
- 📚 **Language Library** - Manage programming languages, categories, blogs
- 👥 **User Management** - Admin dashboard for user control
- 📊 **Dashboard** - Analytics and metrics visualization
- 💬 **Chatbot Integration** - AI-powered assistance
- 🎨 **Modern UI** - Ant Design components with responsive layout

### Cloud & DevOps Features

- 🐳 **Docker Containerization** - Multi-stage builds for optimization
- 🔄 **CI/CD Pipeline** - Automated testing, building, and deployment
- 📊 **Health Monitoring** - Multiple health check endpoints
- 🚦 **Rate Limiting** - Protection against abuse
- 📝 **Structured Logging** - JSON logs ready for centralized logging
- 🔒 **Security Headers** - XSS, clickjacking protection
- ⚡ **Performance** - Optimized Docker images, resource limits
- 📈 **Scalability** - Auto-scaling ready architecture

---

## 🛠️ Tech Stack

### Frontend

| Technology   | Version | Purpose            |
| ------------ | ------- | ------------------ |
| React        | 19.1.0  | UI Framework       |
| Vite         | 6.3.5   | Build Tool         |
| React Router | 7.6.2   | Routing            |
| Ant Design   | 5.25.4  | UI Components      |
| Axios        | 1.9.0   | HTTP Client        |
| Chart.js     | 4.4.9   | Data Visualization |

### Backend

| Technology | Version | Purpose          |
| ---------- | ------- | ---------------- |
| Node.js    | 20      | Runtime          |
| Express    | 5.1.0   | Web Framework    |
| MongoDB    | 8.15.1  | Database         |
| Mongoose   | 8.15.1  | ODM              |
| JWT        | 9.0.2   | Authentication   |
| Bcrypt     | 6.0.0   | Password Hashing |

### DevOps & Infrastructure

| Technology     | Purpose            |
| -------------- | ------------------ |
| Docker         | Containerization   |
| GitHub Actions | CI/CD              |
| Render         | PaaS Hosting       |
| MongoDB Atlas  | DBaaS              |
| Docker Hub     | Container Registry |
| Nginx          | Web Server         |

---

## 🚀 Quick Start

### Prerequisites

```bash
- Node.js 20+
- Docker & Docker Compose
- Git
```

### Local Development

1. **Clone Repository**

```bash
git clone <your-repo-url>
cd cicd
```

2. **Setup Environment Variables**

```bash
# Backend
cp server/.env.example server/.env
# Edit server/.env with your MongoDB Atlas connection string

# Frontend
cp client/.env.example client/.env
# Edit client/.env with your backend URL
```

3. **Run with Docker Compose**

```bash
docker-compose -f docker-compose.dev.yml up
```

4. **Access Application**

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- API Health: http://localhost:4000/api/health

### Manual Setup (Without Docker)

**Backend:**

```bash
cd server
npm install
npm start
```

**Frontend:**

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Deployment

### Automated Deployment (Recommended)

1. **Fork/Clone Repository**
2. **Configure GitHub Secrets** (in repo Settings → Secrets)

   ```
   DOCKER_USERNAME
   DOCKER_PASSWORD
   RENDER_API_KEY
   RENDER_SERVICE_ID_BACKEND
   RENDER_SERVICE_ID_FRONTEND
   BACKEND_URL
   FRONTEND_URL
   ```

3. **Setup Render Services**

   - Import `render.yaml` or create manually
   - Configure environment variables
   - Enable auto-deploy

4. **Push to Master**

   ```bash
   git push origin master
   ```

   GitHub Actions will automatically:

   - Run quality checks
   - Build Docker images
   - Push to Docker Hub
   - Deploy to Render
   - Run health checks

### Manual Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:4000
Production: https://your-backend.onrender.com
```

### Health Endpoints

#### Basic Health Check

```bash
GET /api/health
```

Response:

```json
{
  "status": "UP",
  "timestamp": "2025-12-12T10:00:00.000Z",
  "uptime": 12345,
  "service": "MERN Backend API",
  "version": "1.0.0"
}
```

#### Readiness Probe

```bash
GET /api/health/ready
```

Checks database and memory status.

#### Liveness Probe

```bash
GET /api/health/live
```

Checks if service is responsive.

#### Metrics

```bash
GET /api/health/metrics
```

Returns detailed system metrics.

### Authentication Endpoints

#### Register User

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Protected Endpoints

All API requests to protected endpoints must include JWT token:

```bash
Authorization: Bearer <your-jwt-token>
```

---

## 📊 Monitoring

### Health Check Monitoring

```bash
# Check backend health
curl https://your-backend.onrender.com/api/health

# Check readiness (K8s compatible)
curl https://your-backend.onrender.com/api/health/ready

# Get detailed metrics
curl https://your-backend.onrender.com/api/health/metrics
```

### Logging

Structured JSON logs for production monitoring:

```json
{
  "timestamp": "2025-12-12T10:00:00Z",
  "level": "INFO",
  "message": "HTTP Request",
  "method": "GET",
  "path": "/api/users",
  "statusCode": 200,
  "duration": "45ms",
  "ip": "1.2.3.4",
  "service": "mern-backend"
}
```

### Metrics Available

- Request count & duration
- Memory usage
- CPU usage
- Database connection status
- Error rates
- Response times

---

## 🔒 Security

### Implemented Security Measures

1. **Authentication & Authorization**

   - JWT tokens with expiration
   - Bcrypt password hashing (10 rounds)
   - Protected routes middleware

2. **Rate Limiting**

   - General API: 100 requests/15 minutes per IP
   - Auth endpoints: 20 requests/15 minutes per IP
   - Customizable per endpoint

3. **CORS Protection**

   - Whitelist specific origins in production
   - Credentials support
   - Configurable options

4. **Security Headers**

   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection: 1; mode=block

5. **Container Security**

   - Non-root user in containers
   - Minimal base images (Alpine)
   - No secrets in images
   - Regular security updates

6. **Database Security**
   - MongoDB Atlas encryption at rest
   - TLS/SSL in transit
   - Network isolation
   - Environment variable secrets

### Security Best Practices

```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use strong JWT secrets
JWT_SECRET=$(openssl rand -base64 32)

# Rotate secrets regularly
# Use GitHub Secrets for CI/CD
# Enable 2FA on all accounts
```

---

## 🐳 Docker Configuration

### Multi-stage Build Strategy

**Frontend Dockerfile:**

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

**Benefits:**

- 90% smaller final image
- No dev dependencies in production
- Faster deployment
- Better security

### Resource Limits

```yaml
Backend:
  Memory: 512MB
  CPU: 1 core

Frontend:
  Memory: 256MB
  CPU: 0.5 core
```

---

## 📈 Performance

### Optimizations

- ✅ Docker layer caching
- ✅ Multi-stage builds
- ✅ Gzip compression (Nginx)
- ✅ Static asset caching
- ✅ Database connection pooling
- ✅ Efficient queries with indexes

### Performance Metrics

- **Frontend Load Time:** < 2s
- **API Response Time:** < 100ms (avg)
- **Docker Image Size:** ~50MB (frontend), ~100MB (backend)
- **Build Time:** ~2-3 minutes

---

## 🧪 Testing

### Run Tests

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# E2E tests (if available)
npm run test:e2e
```

### CI/CD Testing

Tests automatically run on every push:

- ESLint code quality checks
- Security vulnerability scanning
- Build validation
- Integration tests

---

## 🔧 Configuration

### Environment Variables

**Backend (.env):**

```env
PORT=4000
NODE_ENV=production
MONGO_URL=mongodb+srv://...
JWT_SECRET=your_secret_key
CHATBOT_API_KEY=your_api_key
```

**Frontend (.env):**

```env
VITE_API=https://your-backend.onrender.com
```

### Docker Compose

Three configurations available:

- `docker-compose.yml` - Basic setup
- `docker-compose.dev.yml` - Development with hot reload
- `docker-compose.prod.yml` - Production with health checks

---

## 📚 Documentation

- [📘 Deployment Guide](./DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [🎓 Presentation Guide](./PRESENTATION_GUIDE.md) - How to present this project
- [🔐 Security Guide](./DEPLOYMENT_GUIDE.md#security) - Security best practices
- [🐛 Troubleshooting](./DEPLOYMENT_GUIDE.md#troubleshooting) - Common issues

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is created for educational purposes as part of the Cloud Computing course.

---

## 👥 Team

- **Your Name** - Developer
- **Course:** Cloud Computing
- **Semester:** 1, 2025-2026
- **Institution:** [Your University]

---

## 🙏 Acknowledgments

- MongoDB Atlas for managed database service
- Render.com for cloud hosting
- GitHub for CI/CD platform
- Docker for containerization
- All open-source contributors

---

## 📞 Support

For questions or issues:

- 📧 Email: your.email@example.com
- 🐛 Issues: [GitHub Issues](your-repo/issues)
- 📖 Docs: [Documentation](./DEPLOYMENT_GUIDE.md)

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ for Cloud Computing Course

</div>
#   C I / C D   T e s t   -   1 2 / 1 3 / 2 0 2 5   0 1 : 1 2 : 1 4  
 