# 🔐 GitHub Secrets Setup Guide

## Overview

This guide will help you configure all necessary secrets for the CI/CD pipeline.

---

## 📝 Required Secrets

Go to: `Your Repository → Settings → Secrets and variables → Actions → New repository secret`

### 1. DOCKER_USERNAME

**Value:** Your Docker Hub username  
**Example:** `johndoe`  
**Get it:** https://hub.docker.com → Account Settings

```
Name: DOCKER_USERNAME
Value: your_dockerhub_username
```

---

### 2. DOCKER_PASSWORD

**Value:** Docker Hub Access Token (NOT your password!)  
**Get it:**

1. Go to https://hub.docker.com
2. Account Settings → Security → New Access Token
3. Name it "GitHub Actions CI/CD"
4. Copy the token (you won't see it again!)

```
Name: DOCKER_PASSWORD
Value: dckr_pat_xxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Important:** Use Access Token, not your Docker Hub password!

---

### 3. RENDER_API_KEY

**Value:** Your Render API Key  
**Get it:**

1. Go to https://dashboard.render.com
2. Account Settings → API Keys
3. Create API Key
4. Copy the key

```
Name: RENDER_API_KEY
Value: rnd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

### 4. RENDER_SERVICE_ID_BACKEND

**Value:** Backend Service ID from Render  
**Get it:**

1. Go to your Backend service on Render
2. Look at the URL: `https://dashboard.render.com/web/srv-XXXXX`
3. Copy `srv-XXXXX` part

```
Name: RENDER_SERVICE_ID_BACKEND
Value: srv-xxxxxxxxxxxxxxxxxxxxx
```

---

### 5. RENDER_SERVICE_ID_FRONTEND

**Value:** Frontend Service ID from Render  
**Get it:**

1. Go to your Frontend service on Render
2. Look at the URL: `https://dashboard.render.com/static/sts-XXXXX`
3. Copy `sts-XXXXX` part

```
Name: RENDER_SERVICE_ID_FRONTEND
Value: sts-xxxxxxxxxxxxxxxxxxxxx
```

---

### 6. BACKEND_URL

**Value:** Your deployed backend URL  
**Example:** `https://your-backend-name.onrender.com`  
**Get it:** From Render dashboard → Backend service → URL

```
Name: BACKEND_URL
Value: https://your-backend-name.onrender.com
```

⚠️ **Note:** No trailing slash!

---

### 7. FRONTEND_URL

**Value:** Your deployed frontend URL  
**Example:** `https://your-frontend-name.onrender.com`  
**Get it:** From Render dashboard → Frontend service → URL

```
Name: FRONTEND_URL
Value: https://your-frontend-name.onrender.com
```

⚠️ **Note:** No trailing slash!

---

## 🚀 Render Services Setup

### Before getting Service IDs, create services on Render:

### Backend Service Configuration

1. **Create Web Service**

   - Name: `mern-backend` (or your choice)
   - Region: Singapore (or closest)
   - Branch: `master`
   - Runtime: Docker
   - Dockerfile Path: `./server/Dockerfile`
   - Docker Context: `./server`

2. **Environment Variables** (in Render dashboard):

   ```
   NODE_ENV=production
   PORT=4000
   MONGO_URL=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   CHATBOT_API_KEY=your_chatbot_api_key
   ```

3. **Health Check Path:** `/api/health`

4. **Auto Deploy:** ✅ Enabled

---

### Frontend Service Configuration

1. **Create Static Site** (or Web Service)

   - Name: `mern-frontend` (or your choice)
   - Region: Singapore (or closest)
   - Branch: `master`
   - Runtime: Docker
   - Dockerfile Path: `./client/Dockerfile`
   - Docker Context: `./client`

2. **Environment Variables** (in Render dashboard):

   ```
   VITE_API=https://your-backend-name.onrender.com
   ```

   ⚠️ Use your actual backend URL from step above!

3. **Auto Deploy:** ✅ Enabled

---

## 🧪 Testing Secrets

After adding all secrets, test them:

### 1. Make a Small Change

```bash
echo "<!-- Test -->" >> client/index.html
```

### 2. Commit and Push

```bash
git add .
git commit -m "Test CI/CD pipeline"
git push origin master
```

### 3. Check GitHub Actions

1. Go to: `Your Repo → Actions`
2. Watch the workflow run
3. Check each job:
   - ✅ Quality Check
   - ✅ Build Images
   - ✅ Deploy
   - ✅ Verify

### 4. Verify Deployment

```bash
# Test backend health
curl https://your-backend.onrender.com/api/health

# Should return:
# {"status":"UP","timestamp":"...","uptime":123,...}
```

---

## 🔍 Troubleshooting

### Error: "Invalid Docker credentials"

- ✅ Check DOCKER_USERNAME is correct
- ✅ Use Access Token, not password
- ✅ Token has write permissions

### Error: "Render API authentication failed"

- ✅ Check RENDER_API_KEY is valid
- ✅ Key hasn't been revoked
- ✅ Copy entire key including `rnd_` prefix

### Error: "Service not found"

- ✅ Check RENDER_SERVICE_ID format (`srv-xxx` or `sts-xxx`)
- ✅ Service exists in Render dashboard
- ✅ Service is in the same Render account

### Error: "Health check failed"

- ✅ BACKEND_URL is correct
- ✅ Service is running on Render
- ✅ MongoDB Atlas is accessible
- ✅ Environment variables are set

---

## 📋 Secrets Checklist

Before running CI/CD, verify:

- [ ] ✅ DOCKER_USERNAME - Docker Hub username
- [ ] ✅ DOCKER_PASSWORD - Docker Hub access token
- [ ] ✅ RENDER*API_KEY - Render API key (starts with `rnd*`)
- [ ] ✅ RENDER_SERVICE_ID_BACKEND - Backend service ID (`srv-xxx`)
- [ ] ✅ RENDER_SERVICE_ID_FRONTEND - Frontend service ID (`sts-xxx`)
- [ ] ✅ BACKEND_URL - Full backend URL (no trailing slash)
- [ ] ✅ FRONTEND_URL - Full frontend URL (no trailing slash)

---

## 🔒 Security Best Practices

1. **Never commit secrets to git**

   ```bash
   # Always in .gitignore:
   .env
   .env.local
   .env.production
   ```

2. **Rotate secrets regularly**

   - Change every 90 days
   - After team member leaves
   - If compromised

3. **Use different secrets for environments**

   - Development secrets
   - Production secrets
   - Never mix them

4. **Limit access**
   - Only give secrets to those who need them
   - Use Render's team features
   - Review access regularly

---

## 📚 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Render API Keys](https://render.com/docs/api#authentication)
- [Docker Hub Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)

---

## ✅ Final Verification

Run this checklist before presentation:

```bash
# 1. Check GitHub Secrets
# Go to repo Settings → Secrets → verify all 7 secrets

# 2. Test Docker Hub login (locally)
echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin

# 3. Test Render services
curl https://your-backend.onrender.com/api/health
curl https://your-frontend.onrender.com

# 4. Trigger CI/CD
git commit --allow-empty -m "Test pipeline"
git push origin master

# 5. Watch GitHub Actions
# Should complete successfully within 5-10 minutes
```

---

**Setup complete!** 🎉

Your CI/CD pipeline is now ready for production deployments.
