# HOUSING PLATFORM - PHASED ROADMAP

This document breaks down the entire platform into 8 manageable phases with clear deliverables and acceptance criteria.

---

## PHASE 0: FOUNDATIONS & PROJECT SETUP

**Objective:** Set up the development environment, project structure, CI/CD pipelines, and foundational architecture.

**Duration Estimate:** 1-2 weeks

### Deliverables:

1. **Repository Structure Decision**
   - **Decision:** Monorepo (recommended)
   - **Tool:** Turborepo or Nx
   - **Structure:**
     ```
     /housing-platform
       /apps
         /web               (Next.js buyer/tenant facing app)
         /admin             (Next.js admin/ops panel)
         /api               (NestJS backend)
       /packages
         /ui                (Shared React components)
         /types             (Shared TypeScript types)
         /utils             (Shared utilities)
         /database          (Database schemas, migrations)
       /docs
       /.github/workflows
       package.json
       turbo.json
     ```

2. **Next.js Web Application Shell**
   - Initialize Next.js 14+ with App Router
   - Configure TypeScript strict mode
   - Set up Tailwind CSS
   - Create basic layout structure
   - Set up routing structure
   - Configure environment variables

3. **Next.js Admin Application Shell**
   - Separate Next.js app for admin panel
   - Different layout and navigation

4. **NestJS Backend Service Skeleton**
   - Initialize NestJS application
   - Set up modular structure with empty modules
   - Configure TypeScript strict mode
   - Set up config module
   - Add health check endpoint
   - API documentation setup (Swagger)

5. **Database Setup**
   - Provision PostgreSQL database
   - Choose ORM: **Prisma**
   - Initialize Prisma schema
   - Set up migration workflow
   - Create initial schema (users table)

6. **Redis Setup**
   - Provision Redis instance
   - Configure connection in NestJS

7. **Authentication Foundation**
   - JWT-based authentication
   - Registration/login endpoints
   - Password hashing with bcrypt
   - Role-based guard decorators

8. **CI/CD Pipeline**
   - GitHub Actions workflows
   - Environment setup: dev, staging, production
   - Secrets management

9. **Development Tooling**
   - ESLint and Prettier
   - Husky pre-commit hooks
   - VSCode workspace settings
   - Docker Compose for local dev

10. **Documentation**
    - README with setup instructions
    - Architecture decision records
    - API documentation framework
    - Contributing guidelines

### Acceptance Criteria:

- [ ] Monorepo structure is set up
- [ ] Next.js apps run locally
- [ ] NestJS backend runs and `/health` returns 200
- [ ] PostgreSQL and Prisma connected
- [ ] Redis connected
- [ ] User registration API works
- [ ] User login API works and returns JWT
- [ ] Protected endpoint works with JWT
- [ ] CI/CD pipeline runs on PRs
- [ ] All code passes lint and type-check

---

## PHASE 1: CORE MARKETPLACE MVP

**Objective:** Build the minimum viable marketplace.

**Duration Estimate:** 4-6 weeks

### Deliverables:

1. **Public Homepage**
2. **Search Functionality (Basic)**
3. **Property Listing Detail Page**
4. **Owner Onboarding & Profile**
5. **Add Property Wizard**
6. **Listing Management (Owner)**
7. **Admin Moderation Panel**
8. **Buyer Login & Basic Actions**
9. **Backend Services:** User, Listing, Search (basic), Lead, Media
10. **Database Schema:** Core tables
11. **Email Notifications (Basic)**

### Acceptance Criteria:

- [ ] Anonymous user can visit homepage
- [ ] User can search properties with basic filters
- [ ] User can view listing detail page
- [ ] Owner can register and create listing
- [ ] Owner can upload photos (3-20)
- [ ] Listing submitted goes to "Under Review"
- [ ] Admin can login and access moderation queue
- [ ] Admin can approve/reject listings
- [ ] Approved listings appear in search
- [ ] Buyer can save listings
- [ ] Buyer can contact owner (phone reveal, lead created)
- [ ] Owner can see leads
- [ ] Email notifications sent for key events

**User Roles:** Anonymous, Buyer, Owner, Admin

**Services:** AuthModule, UserModule, ListingModule, SearchModule (basic), LeadModule, NotificationModule (email), AdminModule

---

## PHASE 2: LEAD & VISIT MANAGEMENT

**Objective:** Enable lead and visit management for buyers and owners.

**Duration Estimate:** 3-4 weeks

### Deliverables:

1. **Buyer Dashboard Enhancements**
   - Enquiries tab
   - Scheduled visits tab
   - Chats tab
2. **Owner Lead Management Panel**
3. **Visit Scheduling Flow**
4. **Visit Reminders**
5. **SMS Notification Integration**
6. **In-App Chat System (Basic)**
7. **Notification Center (In-App)**
8. **Backend:** Lead Service enhanced, Visit Service, Messaging Service
9. **Database:** visits, conversations, messages, lead_notes, notifications

### Acceptance Criteria:

- [ ] Buyer can view all enquiries
- [ ] Buyer can schedule visit
- [ ] Owner receives notification when visit scheduled
- [ ] Owner can confirm/reschedule visit
- [ ] Reminders sent 24h and 1h before visit
- [ ] Buyer can initiate chat with owner
- [ ] Real-time messages delivered
- [ ] Message history preserved
- [ ] Owner can add notes to leads
- [ ] Lead activity timeline shows all interactions
- [ ] In-app notifications work

**User Roles:** Buyer, Owner

**Services:** LeadModule, VisitModule, MessagingModule, NotificationModule (SMS + in-app)

---

## PHASE 3: BROKER & TEAM PANEL

**Objective:** Enable brokers to manage properties, leads, and teams.

**Duration Estimate:** 4-5 weeks

### Deliverables:

1. **Broker Registration & Onboarding**
2. **Broker Profile Management**
3. **Multi-Property Management**
4. **Team Management**
5. **Lead Assignment & Distribution**
6. **CRM Pipeline (Kanban Board)**
7. **Lead Detail & Activity Management**
8. **Tasks & Reminders**
9. **Broker Analytics Dashboard**
10. **Agent Mobile-Friendly View**
11. **Backend:** User Service enhanced, Listing Service, Lead Service (CRM)
12. **Database:** Team relationships, tasks

### Acceptance Criteria:

- [ ] Broker can register with company details
- [ ] Broker can complete KYC
- [ ] Broker can add properties individually and bulk upload
- [ ] Broker can add agents to team
- [ ] Broker can assign leads manually
- [ ] Auto-assignment distributes leads evenly
- [ ] Kanban board works with drag-and-drop
- [ ] Agent can view assigned leads
- [ ] Agent can add activities and notes
- [ ] Agent can schedule tasks
- [ ] Reminders sent for tasks
- [ ] Broker dashboard shows team performance
- [ ] Mobile view works for agents

**User Roles:** Broker, Agent

**Services:** UserModule, ListingModule, LeadModule (CRM), AnalyticsModule

---

## PHASE 4: BUILDER PROJECTS & INVENTORY MANAGEMENT

**Objective:** Enable builders to create projects and manage unit inventory.

**Duration Estimate:** 5-6 weeks

### Deliverables:

1. **Builder Registration & Onboarding**
2. **Create Project**
3. **Project Detail Page (Public)**
4. **Tower & Unit Management**
5. **Inventory Summary & Reports**
6. **Campaign Management**
7. **Project Lead Management**
8. **Channel Partner Management**
9. **Builder Analytics**
10. **Backend:** Project Service, Campaign Service, Lead Service (projects)
11. **Database:** projects, towers, units, campaigns, channel_partners

### Acceptance Criteria:

- [ ] Builder can register and verify
- [ ] Builder can create project
- [ ] Admin can approve project
- [ ] Project appears on public page
- [ ] Builder can add towers and units
- [ ] Bulk unit upload works
- [ ] Inventory grid displays with status colors
- [ ] Builder can update unit status
- [ ] Inventory summary accurate
- [ ] Builder can create campaign
- [ ] Campaign landing page generated
- [ ] Buyer can enquire from project page
- [ ] Builder can view project leads
- [ ] Builder can assign leads
- [ ] Builder can add channel partners
- [ ] Commission calculated on unit sold
- [ ] Builder analytics show project performance

**User Roles:** Builder, Channel Partner, Buyer, Admin

**Services:** ProjectModule, LeadModule, AnalyticsModule, PaymentModule

---

## PHASE 5: MONETIZATION & PAID PLANS

**Objective:** Implement subscription plans and payment gateway.

**Duration Estimate:** 4-5 weeks

### Deliverables:

1. **Define Subscription Plans**
2. **Subscription Management (User Side)**
3. **One-Time Promotions**
4. **Payment Gateway Integration (Razorpay)**
5. **Invoice Generation**
6. **Payment History & Receipts**
7. **Admin - Plan Management**
8. **Admin - Transaction Management**
9. **Refund Processing**
10. **Listing Ranking Logic Based on Promotion**
11. **Subscription Lifecycle Management**
12. **Backend:** Payment Service, Subscription Service
13. **Database:** plans, subscriptions, promotions, transactions, invoices

### Acceptance Criteria:

- [ ] Admin can create subscription plans
- [ ] Plans displayed on pricing page
- [ ] Owner can select plan and pay
- [ ] Razorpay checkout works
- [ ] Payment success activates subscription
- [ ] User's plan updated
- [ ] Invoice generated and emailed
- [ ] Owner can purchase listing boost
- [ ] Boosted listings show badge
- [ ] Boosted listings ranked higher
- [ ] Payment history shows transactions
- [ ] User can download invoices
- [ ] Admin can view all transactions
- [ ] Admin can process refunds
- [ ] Renewal reminders sent
- [ ] Auto-renewal works
- [ ] Expired subscriptions downgrade

**User Roles:** Owner, Broker, Builder, Admin, Finance

**Services:** PaymentModule, SubscriptionModule, NotificationModule, ListingModule

---

## PHASE 6: ADVANCED UX & SEO OPTIMIZATION

**Objective:** Implement Elasticsearch, price trends, locality pages, and SEO.

**Duration Estimate:** 4-5 weeks

### Deliverables:

1. **Elasticsearch Integration**
2. **Advanced Search Features**
3. **Price Trends & Analytics (Locality Level)**
4. **Locality Research Pages (SEO)**
5. **City Landing Pages**
6. **Recommendation Engine (Basic)**
7. **SEO Enhancements Across Site**
8. **Performance Optimizations**
9. **Accessibility Improvements**
10. **Backend:** Search Service (Elasticsearch), Analytics Service (price trends), Content Service
11. **Infrastructure:** Elasticsearch cluster

### Acceptance Criteria:

- [ ] Elasticsearch cluster running
- [ ] All published listings indexed
- [ ] Search uses Elasticsearch
- [ ] Full-text search works
- [ ] Autocomplete works
- [ ] Map view shows markers
- [ ] User can draw polygon search
- [ ] Price trends chart on listing page
- [ ] Locality pages exist with trends
- [ ] City landing pages exist
- [ ] Similar properties show recommendations
- [ ] Meta tags optimized
- [ ] Sitemap generated at /sitemap.xml
- [ ] Lighthouse scores 90+ for Performance and SEO
- [ ] Site passes WCAG checks

**User Roles:** All users

**Services:** SearchModule (Elasticsearch), AnalyticsModule, ContentModule

---

## PHASE 7: INTERNAL TOOLS MATURITY & ADVANCED ADMIN

**Objective:** Build comprehensive admin tools.

**Duration Estimate:** 5-6 weeks

### Deliverables:

1. **Role & Permission Management (RBAC)**
2. **Advanced User Management**
3. **Support Ticket System**
4. **User Impersonation (for Support)**
5. **Finance & Billing Panel Enhancements**
6. **Marketing Campaign Manager**
7. **Banner & Promotion Management**
8. **Content Management System (CMS)**
9. **Analytics Dashboards (Internal)**
10. **A/B Experiment Management**
11. **Fraud Detection & Monitoring**
12. **Audit Logs Viewer**
13. **Backend:** Admin Service enhanced, Support Service, Finance Service, Marketing Service
14. **Database:** support_tickets, banners, email_campaigns, fraud_flags

### Acceptance Criteria:

- [ ] Admin can create custom roles
- [ ] Permissions enforced
- [ ] Admin can search/filter users
- [ ] Admin can suspend/ban/impersonate
- [ ] Impersonation logs all actions
- [ ] User can submit support ticket
- [ ] Support agent can respond
- [ ] Support dashboard shows metrics
- [ ] Finance dashboard shows MRR and churn
- [ ] Admin can process refunds
- [ ] Marketing can create email campaigns
- [ ] A/B test for emails works
- [ ] Campaign analytics track opens/clicks
- [ ] Admin can create banners
- [ ] Banner analytics show CTR
- [ ] CMS allows blog creation
- [ ] Analytics dashboard shows platform health
- [ ] Fraud detection flags suspicious patterns
- [ ] Audit logs searchable

**User Roles:** Admin, Moderator, Support, Finance, Marketing, Analytics

**Services:** AdminModule, SupportModule, FinanceModule, MarketingModule, AnalyticsModule

---

## PHASE 8: MOBILE APP & FUTURE ENHANCEMENTS

**Objective:** Launch mobile apps and advanced features.

**Duration Estimate:** 8-10 weeks (Future)

### Deliverables (High-Level):

1. **React Native Mobile Apps**
2. **AI-Powered Chatbot**
3. **Advanced Recommendations**
4. **Video Tours & 360° Views**
5. **Voice Search**
6. **Saved Search Alerts (Enhanced)**
7. **Offers & Negotiation Module**
8. **Transaction Management**

This phase is conceptual for now, detailed planning later.

---

## ROADMAP SUMMARY

| Phase | Duration | Key Features | User Roles |
|-------|----------|--------------|------------|
| 0 | 1-2 weeks | Foundations, CI/CD, Auth | Dev team |
| 1 | 4-6 weeks | Core marketplace, listings, search, moderation | Buyer, Owner, Admin |
| 2 | 3-4 weeks | Leads, visits, chat | Buyer, Owner |
| 3 | 4-5 weeks | Broker panel, CRM, team management | Broker, Agent |
| 4 | 5-6 weeks | Builder projects, inventory, campaigns | Builder |
| 5 | 4-5 weeks | Monetization, payments, subscriptions | All paid users |
| 6 | 4-5 weeks | Elasticsearch, SEO, price trends | All users |
| 7 | 5-6 weeks | Admin tools, support, analytics | Internal teams |
| 8 | 8-10 weeks | Mobile, AI, advanced features | All users |

**Total Timeline:** 6-9 months for Phases 0-7 (full web platform)
