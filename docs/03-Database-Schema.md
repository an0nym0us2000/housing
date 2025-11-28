# HOUSING PLATFORM - DATABASE SCHEMA

This document defines all database tables, relationships, and indexing strategies.

**Database:** PostgreSQL
**ORM:** Prisma (recommended)
**Conventions:**

- UUID for primary keys
- snake_case for table and column names
- All tables have `created_at` and `updated_at` timestamps
- Soft deletes with `deleted_at` where applicable
- JSONB columns for flexible/optional data

---

## 4.1 USERS & AUTH

### Table: users

| Column         | Type         | Constraints              | Description                                                                       |
| -------------- | ------------ | ------------------------ | --------------------------------------------------------------------------------- |
| id             | UUID         | PRIMARY KEY              |                                                                                   |
| email          | VARCHAR(255) | UNIQUE, NOT NULL         |                                                                                   |
| phone          | VARCHAR(20)  | UNIQUE                   | Can be null if registered via email only                                          |
| password_hash  | TEXT         | NOT NULL                 |                                                                                   |
| role           | ENUM         | NOT NULL                 | buyer, owner, broker, builder, admin, ops, support, finance, marketing, analytics |
| status         | ENUM         | NOT NULL, DEFAULT active | active, suspended, banned                                                         |
| email_verified | BOOLEAN      | DEFAULT false            |                                                                                   |
| phone_verified | BOOLEAN      | DEFAULT false            |                                                                                   |
| last_login_at  | TIMESTAMP    |                          |                                                                                   |
| created_at     | TIMESTAMP    | NOT NULL                 |                                                                                   |
| updated_at     | TIMESTAMP    | NOT NULL                 |                                                                                   |
| deleted_at     | TIMESTAMP    |                          | For soft delete                                                                   |

**Indexes:**

- Unique on `email`, `phone`
- Index on `role`, `status`

---

### Table: refresh_tokens

| Column     | Type      | Constraints            | Description          |
| ---------- | --------- | ---------------------- | -------------------- |
| id         | UUID      | PRIMARY KEY            |                      |
| user_id    | UUID      | FOREIGN KEY (users.id) |                      |
| token      | TEXT      | NOT NULL               | Hashed refresh token |
| expires_at | TIMESTAMP | NOT NULL               |                      |
| created_at | TIMESTAMP | NOT NULL               |                      |

**Indexes:**

- Index on `user_id`, `expires_at`

---

### Table: otps

| Column     | Type         | Constraints            | Description                                            |
| ---------- | ------------ | ---------------------- | ------------------------------------------------------ |
| id         | UUID         | PRIMARY KEY            |                                                        |
| user_id    | UUID         | FOREIGN KEY (users.id) | Nullable for pre-registration OTP                      |
| phone      | VARCHAR(20)  |                        | If user not registered yet                             |
| email      | VARCHAR(255) |                        | Or email for OTP                                       |
| otp        | VARCHAR(10)  | NOT NULL               | 6-digit code                                           |
| type       | ENUM         | NOT NULL               | phone_verification, email_verification, password_reset |
| verified   | BOOLEAN      | DEFAULT false          |                                                        |
| expires_at | TIMESTAMP    | NOT NULL               |                                                        |
| created_at | TIMESTAMP    | NOT NULL               |                                                        |

---

## 4.2 USER PROFILES

### Table: user_profiles

| Column            | Type         | Constraints                    | Description          |
| ----------------- | ------------ | ------------------------------ | -------------------- |
| id                | UUID         | PRIMARY KEY                    |                      |
| user_id           | UUID         | FOREIGN KEY (users.id), UNIQUE | One profile per user |
| full_name         | VARCHAR(255) | NOT NULL                       |                      |
| avatar_url        | TEXT         |                                | Profile picture URL  |
| bio               | TEXT         |                                |                      |
| city              | VARCHAR(100) |                                | User's city          |
| state             | VARCHAR(100) |                                |                      |
| address           | TEXT         |                                |                      |
| alternate_phone   | VARCHAR(20)  |                                |                      |
| company_name      | VARCHAR(255) |                                | For broker/builder   |
| rera_number       | VARCHAR(100) |                                | For broker/builder   |
| years_in_business | INT          |                                | For broker/builder   |
| specialization    | TEXT         |                                | For broker           |
| created_at        | TIMESTAMP    | NOT NULL                       |                      |
| updated_at        | TIMESTAMP    | NOT NULL                       |                      |

---

### Table: kyc_documents

| Column           | Type      | Constraints               | Description                                                                      |
| ---------------- | --------- | ------------------------- | -------------------------------------------------------------------------------- |
| id               | UUID      | PRIMARY KEY               |                                                                                  |
| user_id          | UUID      | FOREIGN KEY (users.id)    |                                                                                  |
| document_type    | ENUM      | NOT NULL                  | aadhaar, pan, passport, driving_license, business_registration, rera_certificate |
| file_url         | TEXT      | NOT NULL                  | S3 URL                                                                           |
| status           | ENUM      | NOT NULL, DEFAULT pending | pending, under_review, verified, rejected                                        |
| verified_by      | UUID      | FOREIGN KEY (users.id)    | Admin/ops user who verified                                                      |
| verified_at      | TIMESTAMP |                           |                                                                                  |
| rejection_reason | TEXT      |                           |                                                                                  |
| created_at       | TIMESTAMP | NOT NULL                  |                                                                                  |
| updated_at       | TIMESTAMP | NOT NULL                  |                                                                                  |

---

### Table: user_preferences

| Column                  | Type      | Constraints                    | Description                 |
| ----------------------- | --------- | ------------------------------ | --------------------------- |
| id                      | UUID      | PRIMARY KEY                    |                             |
| user_id                 | UUID      | FOREIGN KEY (users.id), UNIQUE |                             |
| email_notifications     | BOOLEAN   | DEFAULT true                   |                             |
| sms_notifications       | BOOLEAN   | DEFAULT true                   |                             |
| push_notifications      | BOOLEAN   | DEFAULT true                   |                             |
| whatsapp_notifications  | BOOLEAN   | DEFAULT false                  |                             |
| search_preferences_json | JSONB     |                                | Default city, filters, etc. |
| created_at              | TIMESTAMP | NOT NULL                       |                             |
| updated_at              | TIMESTAMP | NOT NULL                       |                             |

---

## 4.3 LISTINGS

### Table: listings

| Column              | Type          | Constraints             | Description                                                                       |
| ------------------- | ------------- | ----------------------- | --------------------------------------------------------------------------------- |
| id                  | UUID          | PRIMARY KEY             |                                                                                   |
| user_id             | UUID          | FOREIGN KEY (users.id)  | Owner of listing                                                                  |
| title               | VARCHAR(500)  | NOT NULL                |                                                                                   |
| description         | TEXT          |                         |                                                                                   |
| property_type       | ENUM          | NOT NULL                | apartment, villa, plot, house, builder_floor, office, shop, warehouse, industrial |
| transaction_type    | ENUM          | NOT NULL                | sell, rent, lease                                                                 |
| city                | VARCHAR(100)  | NOT NULL                |                                                                                   |
| locality            | VARCHAR(255)  | NOT NULL                |                                                                                   |
| address             | TEXT          |                         | Full address (private)                                                            |
| latitude            | DECIMAL(10,8) |                         |                                                                                   |
| longitude           | DECIMAL(11,8) |                         |                                                                                   |
| bhk                 | INT           |                         | For residential                                                                   |
| bathrooms           | INT           |                         |                                                                                   |
| balconies           | INT           |                         |                                                                                   |
| furnishing          | ENUM          |                         | furnished, semi_furnished, unfurnished                                            |
| carpet_area         | DECIMAL(10,2) |                         | In sq.ft                                                                          |
| built_up_area       | DECIMAL(10,2) |                         |                                                                                   |
| super_built_up_area | DECIMAL(10,2) |                         |                                                                                   |
| floor_number        | INT           |                         |                                                                                   |
| total_floors        | INT           |                         |                                                                                   |
| facing              | ENUM          |                         | north, south, east, west, north_east, north_west, south_east, south_west          |
| age_of_property     | INT           |                         | In years                                                                          |
| possession_status   | ENUM          | NOT NULL                | ready_to_move, under_construction                                                 |
| possession_date     | DATE          |                         | If under construction                                                             |
| price               | DECIMAL(15,2) | NOT NULL                |                                                                                   |
| price_unit          | ENUM          | NOT NULL                | total (for sale), per_month (for rent)                                            |
| is_negotiable       | BOOLEAN       | DEFAULT false           |                                                                                   |
| maintenance_charges | DECIMAL(10,2) |                         | For rent                                                                          |
| security_deposit    | DECIMAL(10,2) |                         | For rent                                                                          |
| parking_type        | ENUM          |                         | none, open, covered                                                               |
| parking_count       | INT           | DEFAULT 0               |                                                                                   |
| status              | ENUM          | NOT NULL, DEFAULT draft | draft, under_review, published, paused, rejected, expired                         |
| published_at        | TIMESTAMP     |                         |                                                                                   |
| expires_at          | TIMESTAMP     |                         | Auto-calculated (published_at + 90 days)                                          |
| views_count         | INT           | DEFAULT 0               |                                                                                   |
| leads_count         | INT           | DEFAULT 0               |                                                                                   |
| is_featured         | BOOLEAN       | DEFAULT false           | Paid promotion                                                                    |
| featured_until      | TIMESTAMP     |                         |                                                                                   |
| is_verified         | BOOLEAN       | DEFAULT false           | If verified by admin                                                              |
| rejection_reason    | TEXT          |                         | If rejected                                                                       |
| moderation_notes    | TEXT          |                         | Internal notes from moderator                                                     |
| extra_fields_json   | JSONB         |                         | For flexible fields                                                               |
| created_at          | TIMESTAMP     | NOT NULL                |                                                                                   |
| updated_at          | TIMESTAMP     | NOT NULL                |                                                                                   |
| deleted_at          | TIMESTAMP     |                         |                                                                                   |

**Indexes:**

- Index on: `user_id`, `status`, `city`, `locality`, `property_type`, `transaction_type`, `bhk`, `price`, `published_at`, `expires_at`
- Composite index: `(city, locality, transaction_type, status, published_at)`
- Geospatial index on: `(latitude, longitude)` using PostGIS

---

### Table: amenities (Master table)

| Column     | Type         | Constraints | Description               |
| ---------- | ------------ | ----------- | ------------------------- |
| id         | UUID         | PRIMARY KEY |                           |
| name       | VARCHAR(100) | NOT NULL    | e.g., Swimming Pool       |
| icon       | VARCHAR(100) |             | Icon name or URL          |
| category   | ENUM         |             | building, society, nearby |
| created_at | TIMESTAMP    | NOT NULL    |                           |
| updated_at | TIMESTAMP    | NOT NULL    |                           |

---

### Table: listing_amenities (Many-to-Many)

| Column      | Type                     | Constraints                |
| ----------- | ------------------------ | -------------------------- |
| listing_id  | UUID                     | FOREIGN KEY (listings.id)  |
| amenity_id  | UUID                     | FOREIGN KEY (amenities.id) |
| PRIMARY KEY | (listing_id, amenity_id) |                            |

---

### Table: media (Central media storage)

| Column      | Type         | Constraints            | Description            |
| ----------- | ------------ | ---------------------- | ---------------------- |
| id          | UUID         | PRIMARY KEY            |                        |
| file_url    | TEXT         | NOT NULL               | S3 URL                 |
| file_type   | ENUM         | NOT NULL               | image, video, document |
| file_size   | BIGINT       |                        | In bytes               |
| mime_type   | VARCHAR(100) |                        |                        |
| uploaded_by | UUID         | FOREIGN KEY (users.id) |                        |
| created_at  | TIMESTAMP    | NOT NULL               |                        |

---

### Table: listing_media (Link media to listings)

| Column     | Type    | Constraints               | Description                        |
| ---------- | ------- | ------------------------- | ---------------------------------- |
| id         | UUID    | PRIMARY KEY               |                                    |
| listing_id | UUID    | FOREIGN KEY (listings.id) |                                    |
| media_id   | UUID    | FOREIGN KEY (media.id)    |                                    |
| media_type | ENUM    | NOT NULL                  | photo, video, floor_plan, document |
| is_cover   | BOOLEAN | DEFAULT false             | Cover photo flag                   |
| order      | INT     | DEFAULT 0                 | Display order                      |

**Indexes:**

- Index on `listing_id`, `order`

---

### Table: listing_moderation_log

| Column       | Type      | Constraints               | Description                            |
| ------------ | --------- | ------------------------- | -------------------------------------- |
| id           | UUID      | PRIMARY KEY               |                                        |
| listing_id   | UUID      | FOREIGN KEY (listings.id) |                                        |
| moderator_id | UUID      | FOREIGN KEY (users.id)    | Admin/ops user                         |
| action       | ENUM      | NOT NULL                  | approved, rejected, sent_back, flagged |
| notes        | TEXT      |                           |                                        |
| timestamp    | TIMESTAMP | NOT NULL                  |                                        |

---

## 4.4 PROJECTS (BUILDERS)

### Table: projects

| Column            | Type          | Constraints             | Description                                   |
| ----------------- | ------------- | ----------------------- | --------------------------------------------- |
| id                | UUID          | PRIMARY KEY             |                                               |
| builder_id        | UUID          | FOREIGN KEY (users.id)  |                                               |
| name              | VARCHAR(255)  | NOT NULL                |                                               |
| rera_number       | VARCHAR(100)  |                         |                                               |
| description       | TEXT          |                         |                                               |
| city              | VARCHAR(100)  | NOT NULL                |                                               |
| locality          | VARCHAR(255)  | NOT NULL                |                                               |
| latitude          | DECIMAL(10,8) |                         |                                               |
| longitude         | DECIMAL(11,8) |                         |                                               |
| total_land_area   | DECIMAL(10,2) |                         | In acres or sq.ft                             |
| launch_date       | DATE          |                         |                                               |
| completion_date   | DATE          |                         |                                               |
| possession_status | ENUM          | NOT NULL                | pre_launch, under_construction, ready_to_move |
| status            | ENUM          | NOT NULL, DEFAULT draft | draft, published, paused                      |
| views_count       | INT           | DEFAULT 0               |                                               |
| leads_count       | INT           | DEFAULT 0               |                                               |
| extra_fields_json | JSONB         |                         | Awards, certifications, etc.                  |
| created_at        | TIMESTAMP     | NOT NULL                |                                               |
| updated_at        | TIMESTAMP     | NOT NULL                |                                               |
| deleted_at        | TIMESTAMP     |                         |                                               |

---

### Table: project_amenities (Many-to-Many)

| Column      | Type                     | Constraints                |
| ----------- | ------------------------ | -------------------------- |
| project_id  | UUID                     | FOREIGN KEY (projects.id)  |
| amenity_id  | UUID                     | FOREIGN KEY (amenities.id) |
| PRIMARY KEY | (project_id, amenity_id) |                            |

---

### Table: project_media

| Column     | Type | Constraints               | Description                                                       |
| ---------- | ---- | ------------------------- | ----------------------------------------------------------------- |
| id         | UUID | PRIMARY KEY               |                                                                   |
| project_id | UUID | FOREIGN KEY (projects.id) |                                                                   |
| media_id   | UUID | FOREIGN KEY (media.id)    |                                                                   |
| media_type | ENUM | NOT NULL                  | photo, video, brochure, master_plan, floor_plan, rera_certificate |
| order      | INT  | DEFAULT 0                 |                                                                   |

---

### Table: towers

| Column              | Type         | Constraints               | Description                  |
| ------------------- | ------------ | ------------------------- | ---------------------------- |
| id                  | UUID         | PRIMARY KEY               |                              |
| project_id          | UUID         | FOREIGN KEY (projects.id) |                              |
| tower_name          | VARCHAR(100) | NOT NULL                  | e.g., Tower A, Wing B        |
| total_floors        | INT          | NOT NULL                  |                              |
| configurations_json | JSONB        |                           | Available BHKs in this tower |
| created_at          | TIMESTAMP    | NOT NULL                  |                              |
| updated_at          | TIMESTAMP    | NOT NULL                  |                              |

---

### Table: units

| Column              | Type          | Constraints                 | Description                      |
| ------------------- | ------------- | --------------------------- | -------------------------------- |
| id                  | UUID          | PRIMARY KEY                 |                                  |
| tower_id            | UUID          | FOREIGN KEY (towers.id)     |                                  |
| unit_number         | VARCHAR(50)   | NOT NULL                    | e.g., 101, 102, A-501            |
| floor_number        | INT           | NOT NULL                    |                                  |
| configuration       | VARCHAR(50)   | NOT NULL                    | e.g., 2 BHK, 3 BHK               |
| carpet_area         | DECIMAL(10,2) |                             |                                  |
| built_up_area       | DECIMAL(10,2) |                             |                                  |
| super_built_up_area | DECIMAL(10,2) |                             |                                  |
| price               | DECIMAL(15,2) |                             |                                  |
| status              | ENUM          | NOT NULL, DEFAULT available | available, blocked, booked, sold |
| facing              | ENUM          |                             | north, south, east, west, etc.   |
| customer_id         | UUID          | FOREIGN KEY (users.id)      | Buyer, if booked/sold            |
| blocked_until       | TIMESTAMP     |                             | If status is blocked             |
| booked_at           | TIMESTAMP     |                             |                                  |
| sold_at             | TIMESTAMP     |                             |                                  |
| created_at          | TIMESTAMP     | NOT NULL                    |                                  |
| updated_at          | TIMESTAMP     | NOT NULL                    |                                  |

**Indexes:**

- Index on `tower_id`, `status`, `configuration`

---

### Table: campaigns

| Column            | Type         | Constraints               | Description                                 |
| ----------------- | ------------ | ------------------------- | ------------------------------------------- |
| id                | UUID         | PRIMARY KEY               |                                             |
| project_id        | UUID         | FOREIGN KEY (projects.id) |                                             |
| name              | VARCHAR(255) | NOT NULL                  |                                             |
| campaign_type     | ENUM         | NOT NULL                  | launch_offer, festive, early_bird, referral |
| offer_details     | TEXT         |                           |                                             |
| start_date        | DATE         | NOT NULL                  |                                             |
| end_date          | DATE         | NOT NULL                  |                                             |
| landing_page_url  | TEXT         |                           | Auto-generated or custom                    |
| utm_params        | JSONB        |                           | For tracking                                |
| status            | ENUM         | NOT NULL, DEFAULT active  | active, paused, ended                       |
| leads_count       | INT          | DEFAULT 0                 |                                             |
| conversions_count | INT          | DEFAULT 0                 |                                             |
| created_at        | TIMESTAMP    | NOT NULL                  |                                             |
| updated_at        | TIMESTAMP    | NOT NULL                  |                                             |

---

### Table: channel_partners

| Column                    | Type         | Constraints              | Description              |
| ------------------------- | ------------ | ------------------------ | ------------------------ |
| id                        | UUID         | PRIMARY KEY              |                          |
| builder_id                | UUID         | FOREIGN KEY (users.id)   |                          |
| partner_name              | VARCHAR(255) | NOT NULL                 |                          |
| contact_email             | VARCHAR(255) |                          |                          |
| contact_phone             | VARCHAR(20)  |                          |                          |
| commission_structure_json | JSONB        | NOT NULL                 | Flat, percentage, tiered |
| status                    | ENUM         | NOT NULL, DEFAULT active | active, inactive         |
| created_at                | TIMESTAMP    | NOT NULL                 |                          |
| updated_at                | TIMESTAMP    | NOT NULL                 |                          |

---

### Table: partner_commissions

| Column            | Type          | Constraints                       | Description              |
| ----------------- | ------------- | --------------------------------- | ------------------------ |
| id                | UUID          | PRIMARY KEY                       |                          |
| partner_id        | UUID          | FOREIGN KEY (channel_partners.id) |                          |
| lead_id           | UUID          | FOREIGN KEY (leads.id)            |                          |
| unit_id           | UUID          | FOREIGN KEY (units.id)            | If sale completed        |
| commission_amount | DECIMAL(15,2) | NOT NULL                          |                          |
| status            | ENUM          | NOT NULL, DEFAULT pending         | pending, processed, paid |
| paid_at           | TIMESTAMP     |                                   |                          |
| created_at        | TIMESTAMP     | NOT NULL                          |                          |
| updated_at        | TIMESTAMP     | NOT NULL                          |                          |

---

## 4.5 LEADS

### Table: leads

| Column          | Type      | Constraints                | Description                                                           |
| --------------- | --------- | -------------------------- | --------------------------------------------------------------------- |
| id              | UUID      | PRIMARY KEY                |                                                                       |
| listing_id      | UUID      | FOREIGN KEY (listings.id)  | Nullable if lead is for project                                       |
| project_id      | UUID      | FOREIGN KEY (projects.id)  | Nullable if lead is for listing                                       |
| buyer_id        | UUID      | FOREIGN KEY (users.id)     | User who initiated contact                                            |
| owner_id        | UUID      | FOREIGN KEY (users.id)     | Listing owner or builder                                              |
| source          | ENUM      | NOT NULL                   | organic, paid_ad, referral, walk_in, campaign                         |
| campaign_id     | UUID      | FOREIGN KEY (campaigns.id) | If from a campaign                                                    |
| contact_method  | ENUM      | NOT NULL                   | call, chat, whatsapp, visit_request                                   |
| status          | ENUM      | NOT NULL, DEFAULT new      | new, contacted, visit_scheduled, negotiation, closed_won, closed_lost |
| assigned_to     | UUID      | FOREIGN KEY (users.id)     | Agent or team member assigned to lead                                 |
| priority        | ENUM      | DEFAULT normal             | low, normal, high                                                     |
| lead_score      | INT       | DEFAULT 0                  | AI-generated lead score (future)                                      |
| extra_data_json | JSONB     |                            | Unit preferences, budget, notes                                       |
| created_at      | TIMESTAMP | NOT NULL                   |                                                                       |
| updated_at      | TIMESTAMP | NOT NULL                   |                                                                       |

**Indexes:**

- Index on: `listing_id`, `project_id`, `buyer_id`, `owner_id`, `status`, `assigned_to`, `created_at`
- Composite index: `(owner_id, status, created_at)`

---

### Table: lead_notes

| Column    | Type      | Constraints            | Description             |
| --------- | --------- | ---------------------- | ----------------------- |
| id        | UUID      | PRIMARY KEY            |                         |
| lead_id   | UUID      | FOREIGN KEY (leads.id) |                         |
| user_id   | UUID      | FOREIGN KEY (users.id) | User who added the note |
| note      | TEXT      | NOT NULL               |                         |
| timestamp | TIMESTAMP | NOT NULL               |                         |

---

### Table: lead_activity_log

| Column        | Type      | Constraints            | Description                                                                    |
| ------------- | --------- | ---------------------- | ------------------------------------------------------------------------------ |
| id            | UUID      | PRIMARY KEY            |                                                                                |
| lead_id       | UUID      | FOREIGN KEY (leads.id) |                                                                                |
| activity_type | ENUM      | NOT NULL               | status_changed, note_added, call_made, message_sent, visit_scheduled, assigned |
| details       | JSONB     |                        | Old/new values, etc.                                                           |
| performed_by  | UUID      | FOREIGN KEY (users.id) |                                                                                |
| timestamp     | TIMESTAMP | NOT NULL               |                                                                                |

---

## 4.6 MESSAGING

### Table: conversations

| Column             | Type      | Constraints               | Description             |
| ------------------ | --------- | ------------------------- | ----------------------- |
| id                 | UUID      | PRIMARY KEY               |                         |
| listing_id         | UUID      | FOREIGN KEY (listings.id) | Context of conversation |
| buyer_id           | UUID      | FOREIGN KEY (users.id)    |                         |
| owner_id           | UUID      | FOREIGN KEY (users.id)    |                         |
| last_message_at    | TIMESTAMP |                           |                         |
| unread_count_buyer | INT       | DEFAULT 0                 |                         |
| unread_count_owner | INT       | DEFAULT 0                 |                         |
| created_at         | TIMESTAMP | NOT NULL                  |                         |
| updated_at         | TIMESTAMP | NOT NULL                  |                         |

**Indexes:**

- Index on `buyer_id`, `owner_id`, `listing_id`, `last_message_at`

---

### Table: messages

| Column          | Type      | Constraints                    | Description |
| --------------- | --------- | ------------------------------ | ----------- |
| id              | UUID      | PRIMARY KEY                    |             |
| conversation_id | UUID      | FOREIGN KEY (conversations.id) |             |
| sender_id       | UUID      | FOREIGN KEY (users.id)         |             |
| message_text    | TEXT      | NOT NULL                       |             |
| sent_at         | TIMESTAMP | NOT NULL                       |             |
| read_at         | TIMESTAMP |                                |             |

**Indexes:**

- Index on `conversation_id`, `sent_at`

---

## 4.7 VISITS

### Table: visits

| Column         | Type      | Constraints               | Description                                           |
| -------------- | --------- | ------------------------- | ----------------------------------------------------- |
| id             | UUID      | PRIMARY KEY               |                                                       |
| listing_id     | UUID      | FOREIGN KEY (listings.id) |                                                       |
| buyer_id       | UUID      | FOREIGN KEY (users.id)    |                                                       |
| owner_id       | UUID      | FOREIGN KEY (users.id)    |                                                       |
| lead_id        | UUID      | FOREIGN KEY (leads.id)    | Link to lead if exists                                |
| scheduled_date | DATE      | NOT NULL                  |                                                       |
| scheduled_time | TIME      | NOT NULL                  |                                                       |
| status         | ENUM      | NOT NULL, DEFAULT pending | pending, confirmed, completed, cancelled, rescheduled |
| notes          | TEXT      |                           | Buyer's note                                          |
| created_at     | TIMESTAMP | NOT NULL                  |                                                       |
| updated_at     | TIMESTAMP | NOT NULL                  |                                                       |

**Indexes:**

- Index on `buyer_id`, `owner_id`, `scheduled_date`, `status`

---

## 4.8 PAYMENTS & BILLING

(Tables: plans, subscriptions, promotions, transactions, invoices - see main plan for complete details)

---

## 4.9 NOTIFICATIONS

(Tables: notification_templates, notifications - see main plan for complete details)

---

## 4.10 ADMIN CONFIGURATION

(Tables: roles, user_roles, cities, localities, amenities, property_types, reports, audit_logs - see main plan for complete details)

---

## 4.11 ANALYTICS & EVENTS

(Tables: events, experiments, experiment_assignments - see main plan for complete details)

---

## COMPLETE TABLE COUNT: 50+ tables

For full detailed schema with all remaining tables, refer to the main implementation plan Section 4.
