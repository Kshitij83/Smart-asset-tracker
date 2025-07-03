# AssetTrackr Environment Setup Guide

## 🚀 Quick Start

1. **Copy environment files:**
   \`\`\`bash
   cp .env.local.example .env.local
   cp backend/.env.example backend/.env
   \`\`\`

2. **Set required variables:**
   - `NEXT_PUBLIC_API_URL`
   - `DB_USERNAME`, `DB_PASSWORD`
   - `JWT_SECRET`

3. **Start development:**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📋 Environment Files Overview

| File | Purpose | Required |
|------|---------|----------|
| `.env.local` | Frontend development | ✅ Yes |
| `backend/.env` | Backend development | ✅ Yes |
| `.env.production` | Production deployment | 🔄 When deploying |
| `docker/.env` | Docker compose | 🔄 When using Docker |

## 🔑 API Keys Priority Guide

### **Immediate Setup (Free)**
1. **Alpha Vantage** - Best free tier for stocks
2. **Finnhub** - Good real-time data
3. **News API** - For market news

### **Enhanced Features (Free)**
4. **CoinGecko** - Crypto data (no key needed)
5. **FRED** - Economic data
6. **IEX Cloud** - Large free tier

### **Professional Features (Paid)**
7. **Polygon.io** - Professional market data
8. **OpenAI** - AI-powered analysis
9. **SendGrid** - Email notifications

## 🛠️ Step-by-Step Setup

### 1. Database Setup
\`\`\`bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Create database
createdb assettrackr
\`\`\`

### 2. JWT Secret Generation
\`\`\`bash
# Generate secure JWT secret
openssl rand -base64 32
\`\`\`

### 3. API Key Collection
Visit each service and follow the registration process:

#### Alpha Vantage (Recommended First)
- URL: https://www.alphavantage.co/support/#api-key
- Process: Email → Instant key
- Limit: 500 calls/day

#### Finnhub (Real-time data)
- URL: https://finnhub.io/register
- Process: Email → Verify → Dashboard
- Limit: 60 calls/minute

#### News API (Market news)
- URL: https://newsapi.org/register
- Process: Email → Verify → Dashboard
- Limit: 1,000 calls/day

### 4. Production Deployment

#### Vercel (Frontend)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
\`\`\`

#### Heroku (Backend)
\`\`\`bash
# Install Heroku CLI
# Create app
heroku create assettrackr-backend

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set DATABASE_URL=your-db-url
\`\`\`

## 🔒 Security Best Practices

1. **Never commit `.env` files**
2. **Use different secrets for production**
3. **Rotate API keys regularly**
4. **Use managed databases in production**
5. **Enable CORS restrictions**

## 🐛 Troubleshooting

### Common Issues

1. **API Key not working**
   - Check if key is active
   - Verify rate limits
   - Check CORS settings

2. **Database connection failed**
   - Verify PostgreSQL is running
   - Check credentials
   - Ensure database exists

3. **CORS errors**
   - Add frontend URL to CORS_ALLOWED_ORIGINS
   - Check protocol (http vs https)

### Debug Commands
\`\`\`bash
# Check environment variables
printenv | grep NEXT_PUBLIC

# Test database connection
psql -h localhost -U assettrackr -d assettrackr

# Test API endpoints
curl http://localhost:8080/api/health
\`\`\`

## 📞 Support

If you need help with environment setup:
1. Check this guide first
2. Review error logs
3. Test with minimal configuration
4. Gradually add API keys

Remember: The app works with just the basic configuration!
