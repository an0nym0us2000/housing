.PHONY: help setup dev down clean install build

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Initial project setup (install deps, start docker, run migrations)
	@echo "🚀 Setting up Housing Platform..."
	cp .env.example .env
	@echo "✅ Environment file created"
	npm install
	@echo "✅ Dependencies installed"
	docker-compose up -d
	@echo "✅ Docker containers started"
	@echo "⏳ Waiting for database to be ready..."
	sleep 5
	cd packages/database && npm run db:generate && npm run db:migrate && npm run db:seed
	@echo "✅ Database setup complete"
	@echo ""
	@echo "🎉 Setup complete! Run 'make dev' to start development servers"

install: ## Install dependencies
	npm install

dev: ## Start all development servers
	npm run dev

build: ## Build all applications
	npm run build

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## Show Docker container logs
	docker-compose logs -f

db-migrate: ## Run database migrations
	cd packages/database && npm run db:migrate

db-seed: ## Seed database with sample data
	cd packages/database && npm run db:seed

db-studio: ## Open Prisma Studio (database GUI)
	cd packages/database && npm run db:studio

clean: ## Clean all generated files and dependencies
	@echo "🧹 Cleaning project..."
	rm -rf node_modules
	rm -rf apps/*/node_modules
	rm -rf packages/*/node_modules
	rm -rf apps/*/.next
	rm -rf apps/*/dist
	rm -rf packages/*/dist
	docker-compose down -v
	@echo "✅ Clean complete"

format: ## Format code with Prettier
	npm run format

lint: ## Lint code
	npm run lint

test: ## Run tests
	npm run test
