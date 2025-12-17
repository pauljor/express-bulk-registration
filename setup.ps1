# Express + TypeScript + Auth0 MVP Setup Script (PowerShell)
# This script initializes the project structure and installs dependencies

Write-Host "🚀 Setting up Express + TypeScript + Auth0 MVP..." -ForegroundColor Green

# Initialize npm project
Write-Host "📦 Initializing npm project..." -ForegroundColor Cyan
npm init -y

# Install production dependencies
Write-Host "📥 Installing production dependencies..." -ForegroundColor Cyan
npm install express auth0 dotenv cors helmet express-validator multer csv-parser winston express-jwt jwks-rsa

# Install TypeScript and development dependencies
Write-Host "🔧 Installing development dependencies..." -ForegroundColor Cyan
npm install --save-dev typescript @types/node @types/express @types/cors @types/multer @types/csv-parser ts-node ts-node-dev @types/express-jwt @types/jwks-rsa

# Create TypeScript configuration
Write-Host "⚙️  Creating TypeScript configuration..." -ForegroundColor Cyan
@"
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
"@ | Out-File -FilePath "tsconfig.json" -Encoding UTF8

# Create directory structure
Write-Host "📁 Creating project structure..." -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path "src/config"
New-Item -ItemType Directory -Force -Path "src/routes"
New-Item -ItemType Directory -Force -Path "src/controllers"
New-Item -ItemType Directory -Force -Path "src/services"
New-Item -ItemType Directory -Force -Path "src/middlewares"
New-Item -ItemType Directory -Force -Path "src/utils"
New-Item -ItemType Directory -Force -Path "src/types"
New-Item -ItemType Directory -Force -Path "uploads"
New-Item -ItemType Directory -Force -Path "logs"

# Create .env.example file
Write-Host "📝 Creating .env.example..." -ForegroundColor Cyan
@"
# Server Configuration
NODE_ENV=development
PORT=3000

# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://your-tenant.auth0.com/api/v2/
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com

# Auth0 Management API
AUTH0_MANAGEMENT_API_CLIENT_ID=your-management-api-client-id
AUTH0_MANAGEMENT_API_CLIENT_SECRET=your-management-api-client-secret
AUTH0_MANAGEMENT_API_AUDIENCE=https://your-tenant.auth0.com/api/v2/

# Role IDs (get these from Auth0 Dashboard)
ROLE_ID_STAFF=rol_xxxxxxxxxxxxx
ROLE_ID_TEACHER=rol_xxxxxxxxxxxxx
ROLE_ID_STUDENT=rol_xxxxxxxxxxxxx

# Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=text/csv,application/vnd.ms-excel
"@ | Out-File -FilePath ".env.example" -Encoding UTF8

# Create .gitignore
Write-Host "🚫 Creating .gitignore..." -ForegroundColor Cyan
@"
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build output
dist/
build/

# Environment variables
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# Uploads
uploads/*
!uploads/.gitkeep

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8

# Create .gitkeep files
New-Item -ItemType File -Force -Path "uploads/.gitkeep"
New-Item -ItemType File -Force -Path "logs/.gitkeep"

# Update package.json scripts
Write-Host "📜 Updating package.json scripts..." -ForegroundColor Cyan
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$packageJson.scripts = @{
    dev = "ts-node-dev --respawn --transpile-only src/server.ts"
    build = "tsc"
    start = "node dist/server.js"
    "type-check" = "tsc --noEmit"
}
$packageJson.name = "express-auth0-mvp"
$packageJson.version = "1.0.0"
$packageJson.description = "Express + TypeScript + Auth0 MVP for user registration and management"
$packageJson.main = "dist/server.js"
$packageJson | ConvertTo-Json -Depth 10 | Out-File -FilePath "package.json" -Encoding UTF8

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy .env.example to .env and fill in your Auth0 credentials"
Write-Host "2. Run 'npm run dev' to start the development server"
Write-Host "3. Check the README.md for API documentation"
Write-Host ""
