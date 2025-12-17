# Deployment Guide

This guide covers deploying your Express + Auth0 User Management API to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured for production
- [ ] Auth0 production tenant set up
- [ ] SSL/TLS certificates obtained
- [ ] Domain name configured
- [ ] Database backups configured (if applicable)
- [ ] Monitoring and logging set up
- [ ] Security audit completed

## Environment Variables for Production

Create a `.env.production` file with:

```env
NODE_ENV=production
PORT=3000

# Production Auth0 Configuration
AUTH0_DOMAIN=your-production-tenant.auth0.com
AUTH0_CLIENT_ID=production-client-id
AUTH0_CLIENT_SECRET=production-client-secret
AUTH0_AUDIENCE=https://your-production-api-identifier
AUTH0_ISSUER_BASE_URL=https://your-production-tenant.auth0.com

# Auth0 Management API
AUTH0_MANAGEMENT_API_CLIENT_ID=production-management-client-id
AUTH0_MANAGEMENT_API_CLIENT_SECRET=production-management-client-secret
AUTH0_MANAGEMENT_API_AUDIENCE=https://your-production-tenant.auth0.com/api/v2/

# Production Role IDs
ROLE_ID_STAFF=rol_production_staff_id
ROLE_ID_TEACHER=rol_production_teacher_id
ROLE_ID_STUDENT=rol_production_student_id

# Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=text/csv,application/vnd.ms-excel
```

## Deployment Options

### Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)

#### 1. Build the Application

```bash
npm run build
```

#### 2. Install PM2

```bash
npm install -g pm2
```

#### 3. Create PM2 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'auth0-user-api',
    script: './dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
```

#### 4. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 5. Configure Nginx as Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 6. Enable HTTPS with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Heroku

#### 1. Create Procfile

```
web: node dist/server.js
```

#### 2. Deploy

```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set AUTH0_DOMAIN=your-domain.auth0.com
# ... set all other environment variables
git push heroku main
```

### Option 3: AWS Elastic Beanstalk

#### 1. Install EB CLI

```bash
pip install awsebcli
```

#### 2. Initialize EB

```bash
eb init
```

#### 3. Create Environment

```bash
eb create production-env
```

#### 4. Set Environment Variables

```bash
eb setenv NODE_ENV=production AUTH0_DOMAIN=your-domain.auth0.com ...
```

#### 5. Deploy

```bash
eb deploy
```

### Option 4: Docker Container

#### 1. Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY .env.production .env

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

#### 2. Create .dockerignore

```
node_modules
npm-debug.log
.env
.env.local
dist
src
.git
.gitignore
README.md
```

#### 3. Build and Run

```bash
docker build -t auth0-user-api .
docker run -p 3000:3000 --env-file .env.production auth0-user-api
```

### Option 5: Kubernetes

#### 1. Create Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth0-user-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth0-user-api
  template:
    metadata:
      labels:
        app: auth0-user-api
    spec:
      containers:
      - name: auth0-user-api
        image: your-registry/auth0-user-api:latest
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: auth0-secrets
```

## Post-Deployment

### 1. Security Hardening

- Enable rate limiting
- Set up WAF (Web Application Firewall)
- Configure security headers
- Enable CORS only for trusted domains
- Regular security updates

### 2. Monitoring

Set up monitoring with:
- **Application Performance**: New Relic, DataDog, or AppDynamics
- **Uptime Monitoring**: Pingdom, UptimeRobot
- **Error Tracking**: Sentry, Rollbar
- **Log Aggregation**: Loggly, Papertrail, CloudWatch

### 3. Backups

- Regular Auth0 tenant backups
- Log backups
- Configuration backups

### 4. CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy
        run: |
          # Your deployment commands here
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancers
- Deploy multiple instances
- Session management (if needed)

### Vertical Scaling
- Increase server resources
- Optimize Node.js memory limits
- Use clustering

### Caching
- Implement Redis for caching
- Use CDN for static assets
- Cache Auth0 responses where appropriate

## Troubleshooting Production Issues

### Check Logs
```bash
pm2 logs
# or
tail -f logs/combined.log
```

### Monitor Resources
```bash
pm2 monit
```

### Restart Application
```bash
pm2 restart all
```

### Health Checks
Set up health check endpoints and monitoring.

## Support

For production support:
- Review application logs
- Check Auth0 status page
- Monitor error tracking service
- Review server metrics

---

**Remember**: Always test in a staging environment before deploying to production!
