# HOUSING PLATFORM - OVERVIEW & ARCHITECTURE

## EXECUTIVE SUMMARY

We're building a comprehensive real estate marketplace platform similar to Housing.com, serving multiple user personas: buyers/tenants, property owners, brokers, builders, and internal operational teams. The platform will enable property search, listing management, lead handling, project management, and monetization through paid plans.

**Timeline Structure:** 8 phases, from foundations to full-featured platform
**Development Approach:** Incremental, testable, AI-assistant-friendly
**Current Status:** Planning phase (Phase 0 not started)

---

## SECTION 1: HIGH-LEVEL PRODUCT OVERVIEW

### 1.1 Platform Vision

A multi-sided marketplace connecting property seekers with property providers (owners, brokers, builders), featuring advanced search, lead management, CRM capabilities, project inventory systems, and monetization through subscriptions and promotions.

### 1.2 User Actors & Core Jobs to Be Done

#### **Actor 1: Anonymous/Guest User**

1. Search properties across buy/rent/PG/commercial categories
2. Apply filters (city, locality, BHK, budget, amenities)
3. View property listings and details
4. Browse locality information and price trends
5. Register/login to save properties or contact owners

#### **Actor 2: Registered Buyer/Tenant**

1. Save properties and create shortlists
2. Set up search alerts for matching properties
3. Contact owners/brokers (call, chat, WhatsApp)
4. Schedule property visits
5. Track all enquiries and visit history
6. View conversation history with sellers
7. Compare properties side-by-side
8. Share properties with family/friends
9. Manage profile and preferences
10. Track offers and negotiations

#### **Actor 3: Owner/Landlord**

1. Create and verify account with KYC
2. List properties with photos, videos, documents
3. Manage multiple listings (edit, pause, republish)
4. Receive and manage leads
5. Communicate with potential buyers/tenants
6. Schedule and track property visits
7. View listing performance analytics (views, leads, conversions)
8. Subscribe to paid plans for better visibility
9. Promote specific listings
10. Track payment history and invoices

#### **Actor 4: Broker/Agent**

1. Register as broker with company profile
2. Manage inventory of multiple properties
3. Bulk upload and manage listings
4. Handle leads through CRM pipeline stages
5. Assign leads to team members
6. Schedule and track visits
7. Set tasks and reminders for follow-ups
8. View performance metrics (conversion rates, response times)
9. Manage team of sub-agents
10. Track commissions and earnings

#### **Actor 5: Builder/Developer**

1. Create project profiles with RERA details
2. Define towers, wings, and unit inventory
3. Manage unit-level status (available, blocked, booked, sold)
4. Create and track marketing campaigns
5. Receive and manage leads per project/campaign
6. View project-level analytics
7. Manage channel partners and broker relationships
8. Track commission structures
9. Upload project documentation and approvals
10. Subscribe to premium plans for project promotion

#### **Actor 6: Internal Admin**

1. Manage user roles and permissions
2. Configure platform settings (cities, localities, property types)
3. Moderate and approve/reject listings
4. Manage KYC verification workflows
5. Handle user reports and disputes
6. Block fraudulent users or listings
7. Monitor platform health and metrics
8. Configure business rules and pricing
9. Manage promotion campaigns
10. Access audit logs and system reports

#### **Actor 7: Operations/Verification Team**

1. Review listing submissions in moderation queue
2. Verify documents and KYC submissions
3. Conduct quality checks on photos and descriptions
4. Flag suspicious listings for review
5. Process verification requests
6. Handle listing edit requests
7. Coordinate with users for missing information
8. Maintain data quality standards
9. Update locality and area taxonomies
10. Process bulk listing imports

#### **Actor 8: Support Team**

1. View and manage support tickets
2. Access user accounts for troubleshooting (with logging)
3. Handle complaints and disputes
4. Impersonate users for debugging (audited)
5. Escalate fraud cases to admin
6. Update ticket status and communicate with users
7. Access knowledge base and help articles
8. Track SLA and response times
9. Handle refund requests
10. Coordinate with other teams

#### **Actor 9: Finance Team**

1. Manage subscription plans and pricing
2. Track payments and revenue
3. Process refunds and adjustments
4. Generate invoices
5. Manage payout schedules for partners
6. Track commission calculations
7. Reconcile payment gateway transactions
8. Generate financial reports
9. Handle billing disputes
10. Manage tax documentation

#### **Actor 10: Marketing/Content Team**

1. Create and publish blog content
2. Manage locality and city pages for SEO
3. Design and schedule banner campaigns
4. Manage promotional slots on key pages
5. Create email campaign templates
6. Schedule push notifications
7. Update help center and FAQs
8. Manage SEO metadata for pages
9. A/B test marketing content
10. Track campaign performance

#### **Actor 11: Analytics/Data Team**

1. Define and track key metrics
2. Build funnel reports (search → lead → conversion)
3. Create cohort analysis reports
4. Set up A/B experiments
5. Monitor event tracking implementation
6. Build dashboards for business stakeholders
7. Analyze user behavior patterns
8. Generate insights for product improvements
9. Track feature adoption rates
10. Monitor platform health metrics

---

## SECTION 3: SYSTEM ARCHITECTURE & BACKEND SERVICES

### 3.1 Overall Architecture Philosophy

**Modular Monolith with Service-Oriented Design**

We'll start with a **modular monolith** backend (single deployable application with clear module boundaries) for speed of development, then evolve toward microservices for specific high-scale or high-complexity modules if needed.

**Why Modular Monolith First:**

- Faster initial development (shared code, single deployment)
- Easier debugging and testing in early stages
- Lower infrastructure complexity initially
- Can extract microservices later when scale or team structure demands it

**Technology Choice: NestJS (Node.js + TypeScript)**

**Justification:**

- Built-in modular architecture (modules, services, controllers)
- Strong TypeScript support (type safety across large codebase)
- Excellent ecosystem (ORMs like TypeORM/Prisma, validation with class-validator, auth with Passport)
- Scalable and production-ready (used by large enterprises)
- Dependency injection makes testing easier
- GraphQL support if needed later

---

### 3.2 Service/Module Breakdown

Each module is a logical separation within the NestJS monolith. Modules can communicate via direct imports initially, and we can add message queues for async operations.

#### **3.2.1 Auth & User Service**

**Responsibility:**

- User registration and login (email, phone with OTP)
- JWT token generation and validation
- Role-based access control (RBAC)
- Password management (hash, reset, change)
- Session management
- Refresh token handling

**Core APIs:**

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login with email/phone and password
- `POST /auth/send-otp` - Send OTP for phone verification
- `POST /auth/verify-otp` - Verify OTP and issue token
- `POST /auth/refresh-token` - Refresh access token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/logout` - Invalidate token (optional, mostly client-side)
- `GET /auth/me` - Get current user info

**Dependencies:**

- User Profile Service (for user data)
- Notification Service (to send OTP and password reset emails/SMS)

**Database Tables:**

- `users` (id, email, phone, password_hash, role, status, created_at, updated_at)
- `refresh_tokens` (id, user_id, token, expires_at)
- `otps` (id, user_id, otp, type, expires_at, verified)

---

#### **3.2.2 User Profile Service**

**Responsibility:**

- Manage user profile data for all user types
- KYC document upload and tracking
- User preferences and settings
- Profile photos
- Address and contact details

**Core APIs:**

- `GET /users/:id` - Get user profile (with access control)
- `PATCH /users/:id` - Update user profile
- `POST /users/:id/kyc` - Upload KYC documents
- `GET /users/:id/kyc` - Get KYC verification status
- `POST /users/:id/avatar` - Upload profile picture
- `GET /users/:id/preferences` - Get user preferences
- `PATCH /users/:id/preferences` - Update preferences
- `DELETE /users/:id` - Delete account (soft delete)

**Dependencies:**

- Auth Service (for user identity)
- Media Service (for photo uploads)
- Notification Service (KYC status updates)

**Database Tables:**

- `user_profiles` (id, user_id, full_name, bio, city, state, address, alternate_phone, created_at, updated_at)
- `kyc_documents` (id, user_id, document_type, file_url, status, verified_by, verified_at, rejection_reason)
- `user_preferences` (id, user_id, email_notifications, sms_notifications, push_notifications, search_preferences_json)

---

#### **3.2.3 Listing Service**

**Responsibility:**

- Create, read, update, delete property listings
- Listing status management (draft, under review, published, paused, expired, rejected)
- Listing expiry and renewal
- Listing moderation workflow
- Duplicate detection
- Listing search (basic, delegates to Search Service for advanced)

**Core APIs:**

- `POST /listings` - Create new listing
- `GET /listings/:id` - Get listing detail (public or owner view based on auth)
- `PATCH /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing (soft delete)
- `POST /listings/:id/publish` - Publish listing (owner action)
- `POST /listings/:id/pause` - Pause listing
- `POST /listings/:id/resume` - Resume paused listing
- `POST /listings/:id/moderate` - Moderate listing (admin action: approve, reject, send back)
- `GET /listings` - List listings with filters (for admin or owner's own listings)
- `GET /listings/pending-moderation` - Get moderation queue (admin only)
- `POST /listings/:id/duplicate-check` - Check for potential duplicates

**Dependencies:**

- User Profile Service (to link owner)
- Media Service (for photos, videos, documents)
- Search Service (to index listing after publish)
- Notification Service (notify owner of moderation status)
- Analytics Service (log listing events)

**Database Tables:**

- `listings` (id, user_id, title, description, property_type, transaction_type, city, locality, address, latitude, longitude, bhk, bathrooms, balconies, furnishing, carpet_area, built_up_area, floor_number, total_floors, facing, age_of_property, possession_status, price, price_unit, is_negotiable, maintenance_charges, security_deposit, status, published_at, expires_at, views_count, leads_count, is_featured, featured_until, created_at, updated_at, deleted_at)
- `listing_amenities` (listing_id, amenity_id) - many-to-many
- `listing_media` (id, listing_id, media_id, media_type, is_cover, order)
- `listing_moderation_log` (id, listing_id, moderator_id, action, notes, timestamp)

---

#### **3.2.4 Search Service**

**Responsibility:**

- Index listings in Elasticsearch/OpenSearch
- Provide fast, filtered, faceted search
- Geospatial search (radius, polygon)
- Sort by relevance, price, date
- Autocomplete for localities and projects
- Search suggestions

**Core APIs:**

- `POST /search` - Search listings with filters (body: query, filters, sort, pagination)
- `GET /search/suggestions` - Autocomplete suggestions for search box
- `POST /search/index-listing` - Index or re-index a listing (internal API, called by Listing Service)
- `DELETE /search/index-listing/:id` - Remove listing from index (internal)

**Dependencies:**

- Listing Service (source of data to index)
- Elasticsearch/OpenSearch cluster

**Indexing Strategy:**

- Write path: Listing Service publishes event → Search Service listens and indexes
- Or: Listing Service calls Search Service API directly after publish/update
- Bulk re-indexing script for initial setup or after schema changes

**Caching:**

- Cache popular search queries in Redis with TTL (e.g., 5 minutes)
- Cache filter facets and counts

---

#### **3.2.5 Lead Service**

**Responsibility:**

- Capture leads (contact actions: call, chat, visit request)
- Lead tracking and status management
- Lead assignment (for brokers and builders)
- Lead enrichment (source, campaign tracking)
- CRM pipeline stages
- Lead analytics

**Core APIs:**

- `POST /leads` - Create lead (triggered when buyer contacts owner)
- `GET /leads/:id` - Get lead detail
- `PATCH /leads/:id` - Update lead (status, notes)
- `GET /leads` - List leads (with filters: status, listing, user, date range)
- `POST /leads/:id/assign` - Assign lead to agent/team member
- `POST /leads/:id/notes` - Add note to lead
- `GET /leads/:id/activity` - Get activity timeline for lead

**Dependencies:**

- User Profile Service (buyer and owner info)
- Listing Service (property info)
- Messaging Service (if lead includes chat)
- Visit Scheduling Service (if lead includes visit request)
- Notification Service (notify owner of new lead)
- Analytics Service (log lead events)

**Database Tables:**

- `leads` (id, listing_id, buyer_id, owner_id, source, campaign_id, contact_method, status, assigned_to, priority, created_at, updated_at)
- `lead_notes` (id, lead_id, user_id, note, timestamp)
- `lead_activity_log` (id, lead_id, activity_type, details, timestamp)

---

#### **3.2.6 Messaging/Chat Service**

**Responsibility:**

- In-app real-time chat between buyers and owners/brokers
- Conversation threads linked to listings
- Message history
- Unread count tracking
- Real-time delivery (WebSocket or polling)

**Core APIs:**

- `POST /conversations` - Start a conversation (between buyer and listing owner)
- `GET /conversations/:id` - Get conversation detail with messages
- `POST /conversations/:id/messages` - Send a message
- `GET /conversations` - List all conversations for a user
- `PATCH /conversations/:id/read` - Mark conversation as read
- `GET /conversations/:id/unread-count` - Get unread message count

**Real-Time Architecture:**

- Use WebSockets (Socket.io) for real-time messaging
- Fallback to HTTP polling if WebSocket not available
- Store messages in database for history
- Use Redis pub/sub for multi-server WebSocket broadcasting if needed

**Dependencies:**

- User Profile Service (participants)
- Listing Service (context of conversation)
- Notification Service (push notification for new messages if user offline)

**Database Tables:**

- `conversations` (id, listing_id, buyer_id, owner_id, last_message_at, unread_count_buyer, unread_count_owner)
- `messages` (id, conversation_id, sender_id, message_text, sent_at, read_at)

---

#### **3.2.7 Visit Scheduling Service**

**Responsibility:**

- Schedule property visits
- Manage visit slots (if owner defines available slots)
- Reminders for upcoming visits
- Visit status tracking (pending, confirmed, completed, cancelled)
- Calendar integration (optional)

**Core APIs:**

- `POST /visits` - Schedule a visit
- `GET /visits/:id` - Get visit detail
- `PATCH /visits/:id` - Update visit (confirm, reschedule, cancel)
- `GET /visits` - List visits (for buyer or owner, with filters)
- `GET /visits/slots` - Get available time slots for a listing (if owner defined slots)

**Dependencies:**

- Listing Service (property info)
- User Profile Service (buyer and owner details)
- Lead Service (link visit to lead)
- Notification Service (send reminders)

**Database Tables:**

- `visits` (id, listing_id, buyer_id, owner_id, lead_id, scheduled_date, scheduled_time, status, created_at, updated_at)
- `visit_slots` (id, listing_id, day_of_week, start_time, end_time, is_available) - optional

---

#### **3.2.8 Project & Builder Service**

**Responsibility:**

- Manage builder projects, towers, units
- Project detail pages data
- Inventory grid status management
- Campaign management for projects
- Channel partner and commission tracking

**Core APIs:**

- `POST /projects` - Create project
- `GET /projects/:id` - Get project detail
- `PATCH /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project (soft delete)
- `POST /projects/:id/towers` - Add tower to project
- `GET /projects/:id/towers` - Get all towers in project
- `POST /projects/:id/units` - Add units (can be bulk)
- `GET /projects/:id/units` - Get unit inventory grid
- `PATCH /units/:id` - Update unit status
- `GET /projects/:id/inventory-summary` - Get summary (available, sold, blocked by BHK)
- `POST /projects/:id/campaigns` - Create campaign for project
- `GET /campaigns/:id` - Get campaign detail
- `GET /projects/:id/leads` - Get leads for project
- `POST /projects/:id/channel-partners` - Add channel partner
- `GET /projects/:id/channel-partners` - List partners with commission data

**Dependencies:**

- User Profile Service (builder info)
- Media Service (project images, brochures)
- Lead Service (project leads)
- Notification Service (campaign notifications)

**Database Tables:**

- `projects`, `project_amenities`, `project_media`, `towers`, `units`, `campaigns`, `channel_partners`, `partner_commissions`

---

#### **3.2.9 Payment & Billing Service**

**Responsibility:**

- Manage subscription plans and promotions
- Payment gateway integration (Stripe, Razorpay, PayPal, etc.)
- Transaction recording
- Invoice generation
- Refund processing
- Subscription lifecycle (activate, renew, expire, cancel)

**Core APIs:**

- `GET /plans` - Get all available plans (public)
- `POST /subscriptions` - Subscribe to a plan (initiates payment)
- `GET /subscriptions/:id` - Get subscription detail
- `PATCH /subscriptions/:id` - Upgrade/downgrade plan
- `POST /subscriptions/:id/cancel` - Cancel subscription
- `POST /promotions/purchase` - Purchase one-time promotion (e.g., listing boost)
- `POST /payments/webhook` - Payment gateway webhook (to confirm payment)
- `GET /invoices` - List invoices for user
- `GET /invoices/:id` - Get invoice PDF
- `POST /refunds` - Initiate refund (admin action)

**Dependencies:**

- User Profile Service (billing details)
- Notification Service (payment confirmation emails)
- Listing Service (apply promotion boost to listing ranking)

**Database Tables:**

- `plans`, `subscriptions`, `promotions`, `transactions`, `invoices`

---

#### **3.2.10 Notification Service**

**Responsibility:**

- Send emails (transactional and promotional)
- Send SMS (OTP, alerts)
- Send push notifications (mobile and web)
- Send WhatsApp messages (via WhatsApp Business API)
- Manage notification templates
- Track notification delivery status

**Core APIs:**

- `POST /notifications/email` - Send email (internal API)
- `POST /notifications/sms` - Send SMS (internal API)
- `POST /notifications/push` - Send push notification (internal API)
- `POST /notifications/whatsapp` - Send WhatsApp message (internal API)
- `GET /notifications` - Get notification history for user
- `PATCH /notifications/:id/read` - Mark notification as read

**Dependencies:**

- User Profile Service (user contact info and preferences)

**Database Tables:**

- `notification_templates`, `notifications`

---

#### **3.2.11 Admin & Moderation Service**

**Responsibility:**

- Admin user management
- Role and permission management
- Listing moderation workflows
- KYC verification workflows
- Fraud and abuse management
- Platform configuration (cities, localities, property types, amenities)
- Audit logs

**Core APIs:**

- `GET /admin/users` - List all users with filters (admin only)
- `PATCH /admin/users/:id` - Update user (suspend, ban, edit)
- `POST /admin/users/:id/impersonate` - Impersonate user (with logging)
- `GET /admin/roles` - Get all roles
- `POST /admin/roles` - Create role
- `PATCH /admin/roles/:id` - Update role permissions
- `GET /admin/moderation-queue` - Get listings pending moderation
- `POST /admin/moderate-listing/:id` - Approve/reject/flag listing
- `GET /admin/kyc-queue` - Get KYC submissions pending review
- `POST /admin/verify-kyc/:id` - Approve/reject KYC
- `GET /admin/reports` - Get user reports and flags
- `POST /admin/resolve-report/:id` - Resolve report
- `GET /admin/config/cities` - Get city configuration
- `POST /admin/config/cities` - Add city
- `GET /admin/audit-logs` - View audit logs

**Dependencies:**

- All other services (admin has access to everything with proper auth)

**Database Tables:**

- `roles`, `user_roles`, `cities`, `localities`, `amenities`, `property_types`, `reports`, `audit_logs`

---

#### **3.2.12 Analytics & Events Service**

**Responsibility:**

- Track all user events and actions
- Store events for analysis
- Provide analytics APIs for dashboards
- Funnel and cohort calculations
- A/B experiment tracking

**Core APIs:**

- `POST /events` - Log an event (called by frontend and other backend services)
- `GET /analytics/metrics` - Get key metrics (with date range and filters)
- `GET /analytics/funnels` - Get funnel data
- `GET /analytics/cohorts` - Get cohort analysis
- `GET /analytics/experiments` - Get experiment results
- `POST /analytics/custom-query` - Run custom analytics query (admin only)

**Dependencies:**

- All services (send events to this service)

**Database Tables:**

- `events`, `experiments`, `experiment_assignments`

---

### 3.3 Overall Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                             │
│              (Rate limiting, Auth, Routing)                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
  ┌──────────┐          ┌──────────────┐         ┌──────────────┐
  │  Next.js │          │  Mobile App  │         │  Admin Panel │
  │  (Web)   │          │ (React Native)│        │   (Next.js)  │
  └──────────┘          └──────────────┘         └──────────────┘
                                 │
                                 │
        ┌────────────────────────┴────────────────────────┐
        │                                                  │
        ▼                                                  ▼
┌────────────────────────────────────────────────────────────────┐
│              NESTJS BACKEND (Modular Monolith)                 │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Auth   │  │  User    │  │ Listing  │  │  Search  │      │
│  │ Service  │  │ Profile  │  │ Service  │  │ Service  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Lead   │  │ Messaging│  │  Visit   │  │ Project  │      │
│  │ Service  │  │ Service  │  │Scheduling│  │ Service  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Payment  │  │Notification│ │  Admin   │  │ Analytics│      │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
                    │              │              │
        ────────────┼──────────────┼──────────────┼────────
                    │              │              │
                    ▼              ▼              ▼
        ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
        │  PostgreSQL  │  │Elasticsearch/│  │    Redis     │
        │   (Primary   │  │  OpenSearch  │  │  (Cache +    │
        │   Database)  │  │   (Search)   │  │   Queue)     │
        └──────────────┘  └──────────────┘  └──────────────┘
                    │
                    ▼
        ┌──────────────────────────────────────┐
        │   S3 / Cloud Storage (Media Files)   │
        └──────────────────────────────────────┘
```

**Communication:**

- **Client → Backend:** REST APIs over HTTPS, JWT in Authorization header
- **Backend Services → Backend Services:** Direct function calls within monolith
- **Async Communication:** Message queue (BullMQ + Redis) for jobs like sending emails, indexing search
- **Real-time Communication:** WebSocket (Socket.io) for chat

---

### 3.4 Database Indexing & Optimization Strategy

**High-Traffic Queries (need indexes):**

**Listings Table:**

- Index on: `city`, `locality`, `property_type`, `transaction_type`, `bhk`, `price`, `status`, `published_at`
- Composite index: `(city, locality, transaction_type, status, published_at)`
- Index on: `user_id`
- Index on: `expires_at`

**Leads Table:**

- Index on: `listing_id`, `buyer_id`, `owner_id`, `status`, `created_at`
- Composite index: `(owner_id, status, created_at)`

**Users Table:**

- Unique index on: `email`, `phone`
- Index on: `role`, `status`

**Caching Strategy:**

**Redis Caching:**

- Cache popular search queries: Key pattern `search:<hash>`, TTL 5-10 mins
- Cache listing detail pages: Key `listing:<id>`, TTL 10 mins
- Cache config data: Cities, localities, amenities, TTL 1 hour
- Cache aggregated analytics: Daily metrics, TTL 1 hour

**CDN Caching:**

- Static assets (JS, CSS, images) via CDN
- Media files (property photos) from S3 + CloudFront
- Public pages cached at CDN with short TTL
