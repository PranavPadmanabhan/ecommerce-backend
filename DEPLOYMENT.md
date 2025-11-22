# Deployment Guide

This guide covers deploying the ecommerce backend to various platforms.

## Prerequisites

- Node.js 18.x
- MongoDB database (MongoDB Atlas, Railway, Render, etc.)
- Environment variables configured

## Required Environment Variables

Create a `.env` file or set these in your platform's environment variables:

```env
PORT=3000
NODE_ENV=production
MONGO_URI=mongodb://your-mongodb-connection-string
API_KEY=your_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Platform-Specific Deployment

### 1. Docker / Docker Compose

**Build and run:**
```bash
docker build -t ecommerce-backend .
docker run -p 3000:3000 --env-file .env ecommerce-backend
```

**Using Docker Compose:**
```bash
docker-compose up -d
```

### 2. Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set MONGO_URI=your_mongo_uri
   heroku config:set API_KEY=your_api_key
   # ... set all other variables
   ```
5. Deploy: `git push heroku main`

The `Procfile` will automatically be used.

### 3. Railway

1. Connect your GitHub repository to Railway
2. Railway will auto-detect the `railway.json` configuration
3. Set environment variables in Railway dashboard
4. Deploy automatically on push

### 4. Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Render will use `render.yaml` for configuration
4. Set environment variables in Render dashboard
5. Deploy

### 5. Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard
4. The `vercel.json` config will be used

### 6. AWS / Google Cloud / Azure

Use the provided `Dockerfile`:

```bash
# Build
docker build -t ecommerce-backend .

# Tag for your registry
docker tag ecommerce-backend your-registry/ecommerce-backend

# Push
docker push your-registry/ecommerce-backend

# Deploy using your platform's container service
```

### 7. DigitalOcean App Platform

1. Connect GitHub repository
2. Select "Docker" as build type
3. Set environment variables
4. Deploy

### 8. Fly.io

1. Install Fly CLI: `flyctl install`
2. Initialize: `flyctl launch`
3. Set secrets: `flyctl secrets set MONGO_URI=your_uri`
4. Deploy: `flyctl deploy`

### 9. Leapcell / Nixpacks

The `nixpacks.toml` file is already configured. Just:
1. Connect your repository
2. Set environment variables
3. Deploy

## Health Check

The application includes a health check endpoint at `/health` that returns:
- Status: "ok"
- Timestamp
- Uptime
- Database connection status

This is useful for load balancers and monitoring tools.

## Production Best Practices

1. **Always use environment variables** - Never commit secrets
2. **Use HTTPS** - Configure SSL/TLS certificates
3. **Set up monitoring** - Use services like Sentry, LogRocket, etc.
4. **Database connection** - Use connection pooling and proper error handling
5. **Logging** - Set up proper logging (Winston, Pino, etc.)
6. **Rate limiting** - Consider adding rate limiting middleware
7. **CORS** - Configure CORS properly for your frontend domain

## Troubleshooting

### Port Issues
- Most platforms set `PORT` automatically
- The app defaults to port 3000 if `PORT` is not set
- Check platform documentation for port configuration

### MongoDB Connection
- Ensure your MongoDB URI is correct
- Check if your IP is whitelisted (for MongoDB Atlas)
- Verify network connectivity from your platform

### Build Failures
- Check Node.js version (requires 18.x)
- Ensure `package-lock.json` is committed
- Review build logs for specific errors

## Local Development

```bash
# Install dependencies
npm install

# Run with nodemon (development)
npm run serve

# Run production build
npm start
```

## Docker Development

```bash
# Use docker-compose for development
docker-compose -f docker-compose.dev.yml up
```

