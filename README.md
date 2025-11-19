# Housing Platform

> Complete real estate marketplace for buying, renting, and selling properties

[![CI](https://github.com/your-org/housing-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/housing-platform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Housing Platform is a comprehensive real estate marketplace that connects buyers, tenants, owners, brokers, and builders. The platform provides a seamless experience for property listing, search, lead management, and transactions.

**Current Status:** Phase 0 - Foundations Complete ✅

**Next Phase:** Phase 1 - Core Marketplace MVP

## ✨ Features

### Phase 0 - Foundations (✅ Complete)
- ✅ Monorepo structure with Turborepo
- ✅ Next.js 14+ web application (buyer/tenant facing)
- ✅ Next.js admin panel (internal operations)
- ✅ NestJS backend API
- ✅ PostgreSQL database with Prisma ORM
- ✅ Redis caching
- ✅ JWT authentication
- ✅ Docker Compose for local development
- ✅ CI/CD pipelines with GitHub Actions
- ✅ Code quality tools (ESLint, Prettier, Husky)

### Upcoming Phases
- 📅 Phase 1: Core marketplace with listings and search
- 📅 Phase 2: Lead and visit management
- 📅 Phase 3: Broker panel and CRM
- 📅 Phase 4: Builder projects
- 📅 Phase 5: Monetization and payments
- 📅 Phase 6: Advanced UX and SEO
- 📅 Phase 7: Internal tools
- 📅 Phase 8: Mobile apps

See [docs/05-Phased-Roadmap.md](docs/05-Phased-Roadmap.md) for detailed roadmap.

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14+ (React, TypeScript, App Router)
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **HTTP Client:** Fetch API / Axios

### Backend
- **Framework:** NestJS (Node.js, TypeScript)
- **API Documentation:** Swagger/OpenAPI
- **Authentication:** JWT (Passport.js)
- **Validation:** class-validator

### Database & Caching
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **Cache:** Redis 7

### DevOps & Tools
- **Monorepo:** Turborepo
- **Package Manager:** npm
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Code Quality:** ESLint, Prettier, Husky

### Future Integrations
- **Search:** Elasticsearch/OpenSearch (Phase 6)
- **Storage:** AWS S3 (Phase 1)
- **Payments:** Razorpay (Phase 5)
- **Email:** SendGrid/AWS SES (Phase 1)
- **SMS:** Twilio (Phase 2)

## 📁 Project Structure

```
housing-platform/
├── apps/
│   ├── web/                 # Next.js buyer/tenant app (port 3000)
│   ├── admin/               # Next.js admin panel (port 3002)
│   └── api/                 # NestJS backend API (port 3001)
├── packages/
│   ├── database/            # Prisma schema and migrations
│   ├── ui/                  # Shared React components (future)
│   ├── types/               # Shared TypeScript types (future)
│   └── utils/               # Shared utilities (future)
├── docs/                    # Documentation
├── .github/
│   └── workflows/           # GitHub Actions CI/CD
├── docker-compose.yml       # Local development services
├── Makefile                 # Common commands
├── turbo.json               # Turborepo configuration
└── package.json             # Root package.json
```

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js:** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm:** >= 9.0.0 (comes with Node.js)
- **Docker:** >= 24.0.0 ([Download](https://www.docker.com/))
- **Docker Compose:** >= 2.20.0 (comes with Docker Desktop)
- **Git:** >= 2.40.0

Verify installations:
```bash
node --version
npm --version
docker --version
docker-compose --version
```

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/housing-platform.git
cd housing-platform

# Run automated setup
make setup
```

This will:
1. Create `.env` from `.env.example`
2. Install all dependencies
3. Start Docker containers (PostgreSQL + Redis)
4. Run database migrations
5. Seed database with sample data

### Option 2: Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/housing-platform.git
cd housing-platform

# 2. Copy environment variables
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start Docker containers
docker-compose up -d

# 5. Generate Prisma Client
cd packages/database
npm run db:generate

# 6. Run database migrations
npm run db:migrate

# 7. Seed database (optional)
npm run db:seed

# 8. Return to root
cd ../..
```

## 💻 Development

### Start All Applications

```bash
# Start all apps in development mode
npm run dev

# Or use make command
make dev
```

This starts:
- 🌐 Web app: http://localhost:3000
- 🔧 Admin panel: http://localhost:3002
- 🚀 API: http://localhost:3001
- 📚 API docs: http://localhost:3001/api-docs
- 🗄️ Prisma Studio: `make db-studio` → http://localhost:5555
- 🔴 Redis Commander: http://localhost:8081

### Individual App Development

```bash
# Web app only
cd apps/web
npm run dev

# Admin panel only
cd apps/admin
npm run dev

# API only
cd apps/api
npm run dev
```

### Database Commands

```bash
# Open Prisma Studio (database GUI)
make db-studio

# Create a new migration
cd packages/database
npm run db:migrate

# Reset database
npm run db:push

# Seed database
make db-seed
```

### Docker Commands

```bash
# Start containers
make docker-up

# Stop containers
make docker-down

# View logs
make docker-logs

# Restart containers
docker-compose restart
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

## 🎨 Code Quality

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Type check
npm run type-check
```

## 🏗 Build

```bash
# Build all applications
npm run build

# Or use make
make build
```

Build outputs:
- `apps/web/.next` - Web app build
- `apps/admin/.next` - Admin panel build
- `apps/api/dist` - API build

## 🚢 Deployment

### Environment Variables

Ensure you have configured the following secrets in your deployment environment:

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `REDIS_HOST` / `REDIS_PORT` - Redis connection

**Optional (Phase 1+):**
- `AWS_*` - AWS S3 credentials for file uploads
- `SMTP_*` - Email service credentials
- `TWILIO_*` - SMS service credentials
- `RAZORPAY_*` - Payment gateway credentials

### Deployment Workflows

The project includes GitHub Actions workflows:

- **CI:** Runs on all PRs and pushes (lint, test, build)
- **Deploy Staging:** Auto-deploys `develop` branch to staging
- **Deploy Production:** Auto-deploys `main` branch to production

See `.github/workflows/` for configuration.

### Manual Deployment

```bash
# Build for production
NODE_ENV=production npm run build

# Run migrations in production
cd packages/database
npm run db:migrate:deploy

# Start applications
cd apps/api
npm run start:prod

cd apps/web
npm run start

cd apps/admin
npm run start
```

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

1. [Master Plan Index](docs/00-MASTER-PLAN-INDEX.md) - Overview and navigation
2. [Overview and Architecture](docs/01-Overview-and-Architecture.md) - System design
3. [User Journeys](docs/02-User-Journeys.md) - Detailed user flows
4. [Database Schema](docs/03-Database-Schema.md) - Complete schema (50+ tables)
5. [Non-Functional Requirements](docs/04-Non-Functional-Requirements.md) - Performance, security
6. [Phased Roadmap](docs/05-Phased-Roadmap.md) - 8-phase implementation plan
7. [V1 Scope and Workflow](docs/06-V1-Scope-and-Workflow.md) - Development workflow

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve login redirect issue
docs: update API documentation
style: format code with prettier
refactor: restructure user module
test: add unit tests for auth service
chore: update dependencies
```

### Code Review Process

All PRs require:
- ✅ Passing CI checks
- ✅ Code review approval
- ✅ Updated tests
- ✅ Documentation updates (if applicable)

## 🧹 Cleanup

```bash
# Clean all build artifacts and dependencies
make clean

# Remove Docker volumes (WARNING: deletes data)
docker-compose down -v
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs housing-postgres

# Restart database
docker-compose restart postgres
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
cd packages/database
npm run db:generate

# Reset database
npm run db:push
```

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/your-org/housing-platform/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-org/housing-platform/discussions)
- **Email:** support@housing-platform.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🎉 Next Steps

Phase 0 is complete! Ready to start building features?

1. **Review the roadmap:** [docs/05-Phased-Roadmap.md](docs/05-Phased-Roadmap.md)
2. **Start Phase 1:** Core marketplace MVP
3. **Create your first feature:** See [docs/06-V1-Scope-and-Workflow.md](docs/06-V1-Scope-and-Workflow.md)

**Let's build something amazing! 🚀**

---

Made with ❤️ by the Housing Platform Team
