You are an expert PRODUCT ARCHITECT + FULL STACK ARCHITECT + TECH LEAD.

You are helping me design a complete blueprint for building a real estate platform LIKE Housing.com, covering:

Buyers

Tenants

PG / co-living users

Sellers / Owners / Landlords

Brokers / Channel partners

Builders / Developers

Internal teams (admin, ops, support, finance, marketing, analytics)

Important:

In this step, DO NOT write any production code.

Only create a complete, detailed ROADMAP and SYSTEM DESIGN.

Go into tiny details so a dev team or AI coding assistant can implement it phase by phase.

I want you to think and answer like a very experienced architect who is planning a serious long term product.

A. CONTEXT ABOUT THE PLATFORM

We are building a Housing.com style platform where:

Public users can:

Search properties for buy, rent, PG, and commercial use

Filter, compare, and view property details

Book visits, contact owners, brokers or builders

Save properties, manage shortlists, track enquiries

Owners / Landlords can:

List properties for sale or rent

Upload photos, videos, documents

Get leads, manage conversations and visits

See performance analytics and optionally pay for promotion plans

Brokers / Agents can:

Manage multiple properties and inventory

Handle leads with a mini-CRM (pipeline stages)

Manage a small team and assign leads

Track performance, calls, visits, closings

Builders / Developers can:

Create full “Projects” with multiple towers/units

Manage inventory grids (BHK, floor, facing, status)

Run campaigns, track leads, and see campaign analytics

Manage channel partners and commissions

Internal teams (platform side) can:

Moderate listings and content

Verify documents and run KYC workflows

Handle complaints, disputes, and fraud

Manage subscription plans, invoices, payouts

Run marketing campaigns, promo banners, and content pages

See analytics, funnels, cohorts, and experiment results

The platform will later have:

AI based chat assistant for buyers

Price trends and locality research tools

Recommendations and ranking engine

Mobile apps

For now, your job is to design the ENTIRE blueprint in detail.

B. TECH STACK ASSUMPTIONS

Assume the following default stack (you can refine it and justify choices):

Frontend (Web)

Next.js (React + TypeScript)

Tailwind CSS or similar utility styling

Component library / design system (you can suggest structure)

SSR for SEO critical pages like home, locality, projects, listings

Mobile (later phases)

React Native (you can just plan, not implement yet)

Backend

Node.js with NestJS or Express (pick one and justify)

REST APIs (with potential GraphQL gateway later, if needed)

Authentication and Authorization service (JWT + role based access control)

Database and Storage

PostgreSQL or MySQL for relational data

Elasticsearch / OpenSearch for search

Redis for caching and rate limiting

Object storage (like S3) for images, videos, PDFs

Infra / DevOps

Any major cloud (AWS / GCP) – choose one in the plan and work with it consistently

API gateway, load balancer, autoscaling, CDN

CI/CD pipelines (GitHub Actions)

Observability (logs, metrics, alerts)

AI and Data (high level in roadmap only)

Recommendation logic for similar listings

Price trend and locality insights based on stored data

Simple lead scoring and quality classification later

You must include these technologies in the roadmap sections where relevant, not as a generic list only.

C. HOW I WANT THE OUTPUT STRUCTURED

Structure your answer in clear sections.

Section 1: High level product overview

Describe the overall platform in 1–2 paragraphs.

Summarize all actors:

Anonymous user

Registered buyer / tenant

Owner / landlord

Broker / agent

Builder / developer

Internal admin

Operations / verification team

Support team

Finance team

Marketing / content team

Analytics / data team

For each actor, list their top 5–10 core jobs to be done on the platform.

Section 2: User journeys and panels
Describe in detail, screen by screen and flow by flow, for each panel:

2.1 Buyer / Tenant web app

Onboarding and city selection

Home page and search box design

Filters (buy / rent / PG / commercial, BHK, budget, furnishing, locality, amenities, etc)

Search results list and map view

Property detail page (photos, floor plans, locality info, price trends, actions)

Actions: call, chat, WhatsApp, schedule visit, save, share

Buyer dashboard: saved searches, alerts, saved listings, visits, chats, offers

2.2 Owner / Landlord panel

Onboarding, owner verification, KYC flow

Add property wizard: property type, location, BHK, area, pricing, photos, documents

Listing management: publish, pause, duplicate, edit

Lead management: list, detail view, conversation history, visit scheduling

Simple funnel and analytics: views, leads, calls, visits, conversions

Paid promotion / plan management

2.3 Broker / Agent panel

Broker onboarding and company profile

Multi listing management and bulk upload

Team management (agents under broker)

CRM pipeline view: New, Contacted, Visit Scheduled, Negotiation, Closed, Lost

Task and reminder management

Performance analytics by agent, by listing, by source

2.4 Builder / Developer panel

Add projects: project details, RERA info, location, amenities, launch status

Tower/wing/unit management with grid for all units

Status tracking per unit: available, blocked, booked, sold

Campaign management: define offers and marketing campaigns

Lead analytics per project and per campaign

Channel partner management and commissions overview

2.5 Internal admin & ops panel

Role and permissions management

Listing moderation queue (approve / reject / flag / send back)

User management and KYC verification

Complaint and dispute handling tools

Fraud detection and blocking patterns (simple rules at first)

Config management (cities, locality taxonomy, property types, features)

2.6 Finance / billing panel

Manage owner/builder subscription plans and one-time promotions

Track payments, refunds, adjustments

Manage payouts to partners (if needed)

Basic reporting for finance team

2.7 Marketing & content panel

CMS for blogs, locality pages, help center

Banner and promotion slot management on key pages

Email / push campaign definitions (high level)

2.8 Analytics & experimentation (high level)

Funnels for search → detail → lead → visit → booking (conceptual)

A/B testing hooks and event tracking points

Section 3: System architecture and services
Design a modular backend architecture.

3.1 List all main services (microservices or modules), for example:

Auth service

User profile service

Listing service

Search service

Lead service

Messaging / chat service

Visit scheduling service

Project / builder service

Payment and billing service

Notification service (email, SMS, push, WhatsApp)

Admin and moderation service

Analytics / events collection service

3.2 For each service:

Describe responsibility

Describe the core APIs (names and what they do, no code yet)

Mention which other services it depends on

3.3 Describe the overall architecture:

How client apps talk to APIs (API gateway, auth)

How services talk to each other (REST, message queue, etc)

How search indexing works (write path from DB → search index)

How caching layers are used (Redis for specific hot paths)

Section 4: Database schema design (high level)
Define the main tables and relationships for:

Users

Roles and permissions

Properties (generic)

Residential vs commercial properties

Project / Tower / Unit entities for builders

Localities, cities, areas

Media assets (images, videos, documents)

Leads and enquiries

Visits and visit slots

Conversations / messages

Plans, subscriptions, promotions

Payments and invoices

Events / logs (minimal)

Support tickets, complaints, flags

For each key table:

Describe purpose

List key fields and important relations

Mention indexing strategy for scale (e.g. on city, locality, budget range)

Section 5: Non-functional requirements
Describe in detail:

Performance requirements (what needs to be fast and why)

Scalability strategy (horizontal scaling, caching, search)

Security basics (auth, rate limits, access control between roles)

Data privacy concerns (masking phone numbers, etc)

Availability targets

Logging, monitoring, and alerting plan

Backup and disaster recovery approach

Section 6: Roadmap and phases
I want a realistic, PHASED roadmap, where each phase is small enough to be built by an AI coding assistant and a small dev team.

Do it like this:

Phase 0: Foundations

Repo structure and monorepo vs polyrepo decision

Basic Next.js app shell

Backend service skeleton with health checks

Auth foundation (email/phone login, roles design)

CI/CD and environments (dev, staging, prod)

Phase 1: Core marketplace MVP

Public search and listing pages (Buy / Rent basic)

Owner onboarding and property listing

Admin listing moderation

Buyer login, saved listing, and basic contact action

Data models: users, properties, cities, localities, media, leads

Basic search (DB based or simple search engine integration)

Phase 2: Lead and visit management

Buyer dashboard with saved listings and lead history

Owner lead management

Visit scheduling flow and reminders

Notifications (email and basic SMS)

Phase 3: Broker and team panel

Broker roles and setup

Multi property management & simple CRM pipeline

Team agents under broker

Broker performance metrics

Phase 4: Builder projects and projects UI

Project / tower / unit models and UI

Project detail pages on frontend

Builder dashboard with inventory grid and campaign analytics

Phase 5: Monetization and plans

Owner and builder paid plans

Promotion logic (boost in listing sort order)

Payment integration and invoice logic

Phase 6: Advanced UX and optimization

Price trends and locality research pages

Basic recommendations (similar properties)

SEO optimizations and city/locality landing page strategy

Phase 7: Internal tools maturity

Full admin console

Support tools with impersonation (with logging)

Finance and billing panel

Analytics dashboards and experimentation hooks

For each phase:

List clear deliverables

List user roles impacted

List required backend services and frontend areas touched

Define acceptance criteria (what “done” means functionally)

Keep things granular enough so we can later convert each item into a coding task prompt.

Section 7: Prioritised V1 scope vs later
Clearly mark:

What MUST be in the very first public MVP (V1)

What can be safely postponed to V2+ without breaking core marketplace value

Any strong dependencies (for example, you cannot launch broker panel before you have stable listing + lead flow)

Section 8: Suggested development workflow with AI coding assistant
Explain how we should:

Use this roadmap to ask you (Claude Code) for code in small slices

Keep each coding prompt focused on one module at a time

Maintain consistent architecture and naming across prompts

Gradually build, test, and refactor the system

VERY IMPORTANT STYLE REQUIREMENTS

Use clear headings and subheadings.

Write in simple, direct language so that a human dev or AI assistant can follow step by step.

Avoid generic fluff. I want concrete, implementation oriented details.

Do NOT write code at all in this answer. Only design, tables, flows, and roadmap.

Now, generate the complete roadmap and system design as requested.
