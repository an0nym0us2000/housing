# @housing/database

Shared database package with Prisma ORM for the Housing Platform.

## Setup

1. Copy `.env.example` to `.env` and configure your DATABASE_URL
2. Run migrations: `npm run db:migrate`
3. Generate Prisma Client: `npm run db:generate`
4. (Optional) Seed database: `npm run db:seed`

## Scripts

- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema changes to database (dev)
- `npm run db:migrate` - Create and run migrations
- `npm run db:migrate:deploy` - Run migrations in production
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data

## Usage

```typescript
import { prisma } from '@housing/database';

// Create user
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    password: 'hashed_password',
  },
});

// Find user
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
});
```

## Schema Updates

When you update the schema:

1. Run `npm run db:migrate` to create a migration
2. Run `npm run db:generate` to update the Prisma Client
3. Rebuild dependent packages
