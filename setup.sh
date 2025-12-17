#!/bin/bash

# Express + TypeScript + Auth0 MVP Setup Script
# This script initializes the project structure and installs dependencies

echo "🚀 Setting up Express + TypeScript + Auth0 MVP..."

# Initialize npm project
echo "📦 Initializing npm project..."
npm init -y

# Install production dependencies
echo "📥 Installing production dependencies..."
npm install express auth0 dotenv cors helmet express-validator multer csv-parser winston express-jwt jwks-rsa morgan swagger-jsdoc swagger-ui-express

# Install TypeScript and development dependencies
echo "🔧 Installing development dependencies..."
npm install --save-dev typescript @types/node @types/express @types/cors @types/multer @types/csv-parser ts-node nodemon @types/express-jwt @types/morgan @types/swagger-jsdoc @types/swagger-ui-express eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier

# Create TypeScript configuration
echo "⚙️  Creating TypeScript configuration..."
cat > tsconfig.json << 'EOF'
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
EOF

# Create directory structure
echo "📁 Creating project structure..."
mkdir -p src/config
mkdir -p src/routes
mkdir -p src/controllers
mkdir -p src/services
mkdir -p src/middlewares
mkdir -p src/utils
mkdir -p src/types
mkdir -p uploads
mkdir -p logs

# Create .env.example file
echo "📝 Creating .env.example..."
cat > .env.example << 'EOF'
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
EOF

# Create .gitignore
echo "🚫 Creating .gitignore..."
cat > .gitignore << 'EOF'
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
EOF

# Create uploads .gitkeep
touch uploads/.gitkeep
touch logs/.gitkeep

# Create ESLint and Prettier configurations
echo "⚙️  Creating ESLint configuration..."
cat > .eslintrc.json << 'EOF'
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
  }
}
EOF

echo "⚙️  Creating Prettier configuration..."
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
EOF

# Update package.json scripts
echo "📜 Updating package.json scripts..."
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = {
  'dev': 'nodemon --exec ts-node src/server.ts',
  'build': 'tsc',
  'start': 'node dist/server.js',
  'type-check': 'tsc --noEmit',
  'lint': 'eslint . --ext .ts',
  'format': 'prettier --write \"src/**/*.ts\"'
};
pkg.name = 'express-auth0-mvp';
pkg.version = '1.0.0';
pkg.description = 'Express + TypeScript + Auth0 MVP for user registration and management';
pkg.main = 'dist/server.js';
pkg.author = '';
pkg.license = 'ISC';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env and fill in your Auth0 credentials"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Access Swagger documentation at http://localhost:3000/api-docs"
echo "4. Check the README.md for detailed setup and API documentation"
echo ""
echo "Available commands:"
echo "  npm run dev       - Start development server with hot reload"
echo "  npm run build     - Build for production"
echo "  npm start         - Start production server"
echo "  npm run lint      - Lint TypeScript files"
echo "  npm run format    - Format code with Prettier"
echo "  npm run type-check - Check types without emitting"
echo ""
