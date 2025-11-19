# HOUSING PLATFORM - USER JOURNEYS & PANELS

This document details the screen-by-screen flows for each user panel in the platform.

---

## 2.1 BUYER/TENANT WEB APPLICATION

### 2.1.1 Onboarding & City Selection
- **Entry Point:** User lands on homepage
- **Flow:**
  1. Clean hero section with search box prominently displayed
  2. City auto-detection based on IP/browser location
  3. City selector dropdown with major cities
  4. "Detect my location" option with geolocation API
  5. Quick category tabs: Buy | Rent | PG | Commercial
  6. Option to browse without selecting city (shows popular cities grid)
- **No account required** at this stage

### 2.1.2 Homepage Design
- **Hero Section:**
  - Large search bar with placeholder: "Search by locality, landmark, project"
  - Property type selector (Buy/Rent/PG/Commercial)
  - City selector
  - Search button
- **Quick Filters Bar:**
  - BHK chips (1 BHK, 2 BHK, 3 BHK, 4+ BHK)
  - Budget range slider preview
- **Featured Sections:**
  - Popular localities grid with property count
  - Featured projects carousel
  - Recently added properties grid
  - Trending searches
  - Promotional banners (if admin configured)
- **Footer:**
  - Links to locality pages for SEO
  - Help center, about, contact
  - Trust indicators (verified listings count, etc.)

### 2.1.3 Search & Filters System
- **Search Input:**
  - Autocomplete with suggestions (localities, landmarks, projects, builders)
  - Recent searches history (for logged-in users)
  - Category context (searching within Buy/Rent/PG/Commercial)
- **Filter Panel (Left Sidebar):**
  - **Property Type:** Apartment, Villa, Plot, House, Builder Floor
  - **BHK:** 1, 2, 3, 4, 4+
  - **Budget Range:** Min-Max slider with popular ranges as quick chips
  - **Property Status:** Ready to Move, Under Construction
  - **Furnishing:** Furnished, Semi-Furnished, Unfurnished
  - **Posted By:** Owner, Broker, Builder
  - **Amenities:** Multi-select checkboxes (Parking, Gym, Swimming Pool, Power Backup, Lift, Security, etc.)
  - **Age of Property:** Less than 1 year, 1-5 years, 5-10 years, 10+ years
  - **Carpet Area:** Range input
  - **Facing:** North, South, East, West, North-East, etc.
  - **Floor:** Ground, 1-5, 6-10, 10+
  - **Bathroom Count:** 1, 2, 3, 3+
  - **Availability:** Immediate, Within 15 days, Within 30 days, After 30 days
- **Active Filters Display:** Chips showing selected filters with X to remove
- **Clear All Filters** button

### 2.1.4 Search Results Page
- **View Toggle:** List view | Map view | Gallery view
- **Sort Options:** Relevance, Price (Low to High), Price (High to Low), Newest First, Popular
- **Results Count:** "Showing 248 properties in Indiranagar, Bangalore"
- **Listing Card (List View):**
  - Property image carousel (3-5 photos)
  - Property title (e.g., "3 BHK Apartment in Indiranagar")
  - Key specs: BHK, area, furnishing status
  - Price prominently displayed
  - Price per sq.ft (for buy)
  - Locality name with distance from landmark
  - Posted by badge (Owner/Broker/Builder)
  - Quick actions: Save icon, Share icon
  - CTA: "Contact Owner" button
  - Tags: Verified, New, Price Reduced (if applicable)
- **Map View:**
  - Full-width map with clustered markers
  - Click marker to show listing preview card
  - Synchronized: moving map updates list sidebar
- **Pagination:** Infinite scroll or Load More button
- **No Results State:** Suggestions to broaden search, remove filters, or get alerts

### 2.1.5 Property Detail Page (PDP)
- **URL Structure:** `/property/[property-id]/[seo-friendly-title]`
- **Hero Gallery:**
  - Large image viewer with thumbnail strip
  - Fullscreen mode
  - Image count badge
  - Video button if video available
  - Virtual tour link if available
- **Key Information Panel (Sticky on Scroll):**
  - Price (with price history graph if available)
  - Property type, BHK, area, furnishing
  - "Contact Owner" CTA (opens modal with call/chat/WhatsApp options)
  - "Schedule Visit" button
  - Save and Share buttons
- **Property Details Section:**
  - Overview: Description text
  - Property Features: Table format (Carpet Area, Built-up Area, Floor, Facing, Bathrooms, Balconies, Parking, Age, Possession Status)
  - Amenities: Icon grid with all amenities
  - Address & Locality: Map embed with exact location (or approximate for privacy)
- **Price Trends (If Available):**
  - Graph showing price trends in the locality
  - Average price per sq.ft comparison
- **Locality Information:**
  - Nearby landmarks and distances
  - Transport connectivity (metro, bus)
  - Schools, hospitals, shopping malls nearby
  - Locality rating and reviews
  - Link to full locality page
- **Similar Properties Section:**
  - Carousel of 6-10 similar listings
- **Contact Seller Section:**
  - Posted by: Name/Company, broker badge if applicable
  - Response rate and time (if available)
  - Contact form with options: Call | Chat | WhatsApp | Schedule Visit
  - **For Non-Logged-In Users:** Show login/signup modal before revealing contact
- **Report Listing Button:** For flagging fraud or incorrect info

### 2.1.6 Contact & Lead Actions
- **Call Action:**
  - For non-logged-in: prompt login
  - For logged-in: reveal phone number (masked if privacy enabled)
  - Log lead event in backend
  - Show "Number revealed" confirmation
- **Chat Action:**
  - Open in-app chat interface (or redirect to chat panel)
  - Pre-fill with property context
  - Real-time messaging with owner/broker
- **WhatsApp Action:**
  - Generate WhatsApp deep link with pre-filled message
  - Message template: "Hi, I'm interested in your property [link]"
  - Log event
- **Schedule Visit:**
  - Modal with calendar picker
  - Time slot selector (owner-defined slots or free-form)
  - Optional note field
  - Confirmation and notification to owner
  - Add to user's visit schedule

### 2.1.7 Buyer Dashboard
- **Navigation Tabs:**
  - **Saved Properties:** Grid of all saved listings with remove option
  - **Saved Searches:** List of saved filter combinations with alert toggle
  - **My Searches:** Recent search history with quick re-run
  - **Property Alerts:** Manage email/push alerts for saved searches
  - **Enquiries:** List of all properties user contacted
    - Property card, contact method, date, status
    - Conversation preview and link to chat
  - **Scheduled Visits:** Upcoming and past visits
    - Property details, date/time, owner contact, status (pending, confirmed, completed, cancelled)
    - Reschedule or cancel options
  - **Chats:** All active conversations with owners/brokers
    - Conversation list with unread count
    - Last message preview
  - **Offers & Negotiations:** (Future phase) Track all offers made
  - **Profile Settings:**
    - Personal information
    - Contact preferences
    - Notification settings
    - Change password
    - Delete account

---

## 2.2 OWNER/LANDLORD PANEL

### 2.2.1 Owner Onboarding Flow
- **Step 1: Registration**
  - Email/phone signup
  - OTP verification
  - Create password
- **Step 2: Profile Setup**
  - Full name
  - Contact details (phone, email, alternate phone)
  - Select role: Individual Owner | Multiple Properties Owner
- **Step 3: KYC Verification (Optional initially, required for paid plans)**
  - Upload ID proof (Aadhaar, PAN, Passport, Driving License)
  - Upload address proof
  - Document verification status: Pending | Under Review | Verified | Rejected
  - Verified badge on listings after approval

### 2.2.2 Add Property Wizard (Multi-Step Form)
- **Step 1: Property Type**
  - Category: Residential | Commercial
  - Type: Apartment | Villa | Plot | House | Builder Floor | Office | Shop | Warehouse | Industrial
  - Transaction Type: Sell | Rent | Lease
- **Step 2: Location**
  - City selector
  - Locality autocomplete (integrated with master locality list)
  - Society/Project name (optional)
  - Exact address (private, not shown publicly)
  - Map pin for approximate location (draggable)
- **Step 3: Property Details**
  - BHK (for residential)
  - Number of bathrooms
  - Number of balconies
  - Furnishing status
  - Carpet area, built-up area, super built-up area (with unit selector: sq.ft | sq.m)
  - Floor number and total floors
  - Facing direction
  - Age of property
  - Possession status: Ready to Move | Under Construction (with expected date)
- **Step 4: Amenities & Features**
  - Multi-select checklist of all amenities
  - Parking: None | Open | Covered (count)
  - Power backup: Full | Partial | None
  - Water supply: Municipal | Borewell | Both
- **Step 5: Pricing**
  - Expected price (with unit: Lakh, Crore for sale; per month for rent)
  - Price negotiable checkbox
  - Maintenance charges (for rent)
  - Security deposit (for rent, auto-suggest 2-3 months rent)
  - Booking amount (if applicable)
- **Step 6: Photos & Media**
  - Upload photos (min 3, max 20)
  - Drag-and-drop reordering
  - Set cover photo
  - Upload video link (YouTube, Vimeo) or file
  - Upload floor plan image
  - Upload documents (title deed, RERA certificate, etc.) - private, for verification
- **Step 7: Additional Information**
  - Property description (rich text editor, max 2000 chars)
  - Highlights/USPs (bullet points)
  - Nearby landmarks
  - Preferred tenant type (Family, Bachelor, Company, Any) - for rent
  - Pet-friendly checkbox - for rent
  - Available from date
- **Step 8: Review & Publish**
  - Preview of listing as it will appear
  - Terms and conditions checkbox
  - Submit for review (if moderation enabled) or Publish immediately
  - Success message with next steps

### 2.2.3 Listing Management Dashboard
- **Overview Cards:**
  - Total active listings
  - Total leads received (this month)
  - Total views (this month)
  - Visit requests pending
- **My Listings Table/Grid:**
  - Columns: Property Image | Title | Location | Price | Status | Views | Leads | Actions
  - Status badges: Published | Under Review | Rejected | Paused | Expired
  - Actions dropdown: Edit | Pause | Republish | Duplicate | Promote | Delete | View Analytics
  - Filters: Status, Property Type, City
  - Search by title or location
- **Bulk Actions:** Select multiple listings to pause/activate

### 2.2.4 Lead Management Panel
- **Leads List View:**
  - Columns: Buyer Name | Property | Contact Method | Date | Status | Actions
  - Status: New | Contacted | Visit Scheduled | Interested | Not Interested | Closed
  - Filter by status, property, date range
  - Search by buyer name or phone
- **Lead Detail View (Modal or Side Panel):**
  - Buyer information: Name, phone, email (if shared)
  - Property they enquired about (with link)
  - Enquiry source: Call | Chat | WhatsApp | Visit Request
  - Timestamp and history of all interactions
  - Conversation thread (if chat-based)
  - Visit schedule details (if visit requested)
  - Notes field for owner to add private notes
  - Status change dropdown
  - Quick actions: Call | Message | Schedule Visit | Mark as Closed
- **Visit Scheduling:**
  - Calendar view of all scheduled visits
  - Confirm/reschedule/cancel visit
  - Automatic reminders sent to buyer and owner

### 2.2.5 Analytics & Performance Dashboard
- **Time Range Selector:** Last 7 days | Last 30 days | Custom range
- **Key Metrics Cards:**
  - Total impressions (listing views)
  - Unique visitors
  - Contact actions (calls + chats + WhatsApp)
  - Visit requests
  - Conversion rate (contacts/views %)
- **Funnel Visualization:**
  - Views → Contacts → Visits → Offers (if tracked)
- **Per-Listing Performance Table:**
  - Listing title, views, contacts, visits, conversion rate
  - Identify top and underperforming listings
- **Traffic Sources:** Organic search, direct, referral (if trackable)
- **Suggestions:** "Boost your listing visibility with a paid plan" CTA

### 2.2.6 Paid Plans & Promotions
- **Available Plans Display:**
  - Free plan features
  - Premium plan tiers (e.g., Silver, Gold, Platinum)
  - Features comparison table: listing limit, photo limit, priority placement, featured badge, etc.
  - Pricing per month/quarter/year with discount highlights
- **Active Subscription Section:**
  - Current plan name and validity
  - Listings used / limit
  - Features unlocked
  - Renewal date
  - Upgrade/downgrade options
- **One-Time Promotions:**
  - Boost individual listing for X days
  - Featured listing on homepage
  - Pricing and duration selector
  - Payment and confirmation
- **Payment History:**
  - Table of all transactions with invoice download links

---

## 2.3 BROKER/AGENT PANEL

### 2.3.1 Broker Onboarding
- **Registration:**
  - Company name and RERA registration number
  - Company address and phone
  - Broker's personal information
  - ID and business proof upload for verification
  - Select number of agents in team (for plan selection)
- **Profile Setup:**
  - Company logo upload
  - Operating cities/localities
  - Specialization (Residential sale, Residential rent, Commercial, etc.)
  - Years in business
  - Description and USPs
- **Verification:** KYC and RERA verification by ops team

### 2.3.2 Property Inventory Management
- **Add Property:**
  - Same wizard as owner, with additional field: "Property belongs to" (owner's name/contact for broker's internal reference)
  - Bulk upload option: CSV/Excel template download and upload with field mapping
- **Inventory Grid/Table:**
  - All properties managed by broker and their team
  - Columns: Property | Owner | Assigned Agent | Status | Leads | Last Activity | Actions
  - Filter by assigned agent, property type, status, city
  - Search across all fields
- **Assign Property to Agent:** Dropdown to assign leads/property to specific team member

### 2.3.3 Team Management
- **Agents List:**
  - Table: Agent Name | Email | Phone | Role | Active Listings | Active Leads | Performance Score | Status | Actions
  - Add new agent button
- **Add Agent Form:**
  - Name, email, phone
  - Role: Agent | Senior Agent | Team Lead
  - Access permissions (can manage all team listings or only assigned)
  - Send invite link
- **Performance Metrics per Agent:**
  - Total leads handled
  - Conversion rate
  - Average response time
  - Total closings
  - Leaderboard view

### 2.3.4 CRM Pipeline for Leads
- **Kanban Board View:**
  - Columns: **New** | **Contacted** | **Visit Scheduled** | **Negotiation** | **Closed Won** | **Closed Lost**
  - Lead cards draggable between columns
  - Each card shows: Buyer name, property, assigned agent, last activity timestamp, priority flag
- **Lead Card Detail (Modal):**
  - Buyer information
  - Property details
  - Assigned agent
  - Lead source
  - Activity timeline (calls, messages, visits, notes)
  - Add note/activity button
  - Schedule follow-up task
  - Change stage button
  - Set priority (High, Medium, Low)
  - Tags for categorization
- **List View (Alternative):**
  - Tabular view with all leads
  - Sortable and filterable by stage, agent, property, date, priority
- **Filters:**
  - My leads | Team leads | All leads
  - Stage
  - Property
  - Date range
  - Agent assigned

### 2.3.5 Tasks & Reminders
- **Task List:**
  - All pending tasks and follow-ups
  - Linked to specific lead
  - Due date and priority
  - Mark as complete checkbox
- **Add Task:**
  - Task description
  - Link to lead/property
  - Due date and time
  - Assign to self or team member
  - Reminder before X hours
- **Calendar View:**
  - All tasks and visits on calendar
  - Click date to add task or view scheduled items

### 2.3.6 Broker Analytics Dashboard
- **Overview Metrics:**
  - Total active listings
  - Total leads (this month)
  - Leads by stage breakdown
  - Conversion rate
  - Average lead response time
  - Team performance summary
- **Performance by Agent:**
  - Table with per-agent metrics
- **Performance by Listing:**
  - Top-performing properties
  - Listings needing attention (low engagement)
- **Lead Source Analysis:** Organic, paid, referral, walk-in
- **Revenue Tracking (Optional for future):** Commissions earned, pending, paid

---

## 2.4 BUILDER/DEVELOPER PANEL

### 2.4.1 Builder Onboarding
- **Registration:**
  - Company name
  - RERA registration number (mandatory)
  - Company address, phone, email
  - Website
  - Builder's personal info for account admin
  - ID and business registration documents
- **Verification:** Ops team verifies RERA and business documents
- **Company Profile:**
  - Logo and banner images
  - About the builder (description)
  - Operating cities
  - List of past projects (for credibility)
  - Awards and recognitions

### 2.4.2 Create Project
- **Step 1: Project Basics**
  - Project name
  - RERA project registration number
  - Project type: Residential | Commercial | Mixed-use
  - City and exact location (map pin)
  - Locality
  - Total land area
  - Launch date and expected completion date
  - Possession status: Under Construction | Ready to Move | Pre-launch
- **Step 2: Project Description**
  - Rich text description
  - Highlights and USPs (bullet points)
  - Architecture and design overview
  - Approvals and certifications
- **Step 3: Amenities & Features**
  - Multi-select list of project-level amenities (clubhouse, swimming pool, gym, sports facilities, landscaping, security, etc.)
- **Step 4: Media & Documentation**
  - Upload project images (renders, construction photos, completed photos)
  - Upload project video/walkthrough
  - Upload brochure PDF
  - Upload master plan image
  - Upload floor plans for different unit types
  - Upload RERA certificate and approvals
- **Step 5: Pricing & Payment Plans**
  - Price range (min-max) for the project
  - Payment plan options description (e.g., 20-80, 40-60, etc.)
  - Bank loan partners (if applicable)
- **Step 6: Review & Publish**
  - Preview and submit for admin review
  - Once approved, project goes live with public project detail page

### 2.4.3 Tower/Wing & Unit Inventory Management
- **Project Dashboard:**
  - Overview: Total units, available, blocked, booked, sold
  - Project-level analytics: views, leads, visits
  - Quick access to add towers/units
- **Add Tower/Wing:**
  - Tower name/number (e.g., Tower A, Wing B)
  - Total floors
  - Floors per tower
  - Unit configurations available in this tower (e.g., 2 BHK, 3 BHK)
- **Unit Grid/Matrix:**
  - Rows: Floors (Ground, 1, 2, 3, ..., Penthouse)
  - Columns: Unit numbers per floor (101, 102, 103, ...)
  - Cell color-coded by status:
    - Available (green)
    - Blocked (yellow) - temporarily on hold
    - Booked (orange) - customer committed, payment pending
    - Sold (red) - fully sold
  - Click cell to open unit detail modal
- **Unit Detail Modal:**
  - Unit number and tower
  - Floor and facing
  - Configuration (2 BHK, 3 BHK, etc.)
  - Carpet area, built-up area, super built-up area
  - Price and price per sq.ft
  - Status dropdown (Available | Blocked | Booked | Sold)
  - Assign to customer (link to lead if booked/sold)
  - Floor plan image specific to this unit type
  - Save changes
- **Bulk Upload Units:**
  - CSV/Excel template download
  - Upload file with all units (tower, floor, unit number, BHK, area, price, status)
  - Import and review before saving
- **Inventory Summary Reports:**
  - Units available by configuration (2 BHK: 45 available, 3 BHK: 23 available, etc.)
  - Units by status
  - Export to Excel

### 2.4.4 Campaign Management
- **Create Campaign:**
  - Campaign name (internal reference)
  - Campaign type: Launch Offer | Festive Discount | Early Bird | Referral
  - Project selection (link campaign to one or more projects)
  - Offer details: discount percentage, flat discount, free amenities, etc.
  - Validity: start date and end date
  - Campaign landing page URL (custom or auto-generated)
  - Tracking UTM parameters for external marketing
- **Active Campaigns List:**
  - Table: Campaign Name | Project | Offer | Validity | Leads Generated | Conversions | Actions
  - Actions: Edit | Pause | Extend | View Analytics | Duplicate | Delete
- **Campaign-Specific Landing Page:**
  - Auto-generated page with campaign offer highlights
  - Lead capture form integrated
  - Shareable link for digital marketing

### 2.4.5 Lead Management for Projects
- **Project Leads Dashboard:**
  - Filter leads by project, campaign, date range, status
  - Columns: Lead Name | Contact | Project/Unit Interest | Source | Campaign | Date | Status | Assigned To | Actions
- **Lead Detail:**
  - Similar to broker lead detail with project context
  - Unit preferences (BHK, budget, floor preference, facing)
  - Lead source: Website | Campaign | Walk-in | Referral | Channel Partner
  - Assigned sales manager
  - Activity log and notes
  - Schedule site visit
  - Send brochure/floor plans via email
  - Move through sales pipeline stages
- **Lead Assignment:**
  - Assign to internal sales team or channel partner
  - Auto-assignment rules (round-robin, by locality, by load balancing)

### 2.4.6 Builder Analytics
- **Project-Level Analytics:**
  - Views on project page
  - Leads generated (total and by campaign)
  - Site visits scheduled and completed
  - Units sold (by configuration, by tower, by month)
  - Inventory turnover rate
- **Campaign Performance:**
  - Campaign-wise leads and conversions
  - ROI on paid campaigns (if ad spend tracked)
  - Best-performing channels
- **Sales Funnel:**
  - Leads → Interested → Site Visit → Booking → Sold
  - Drop-off rates at each stage
- **Channel Partner Performance:**
  - Leads sent by each partner
  - Conversion rate by partner
  - Commission payable

### 2.4.7 Channel Partner Management
- **Partner List:**
  - Table: Partner Name | Type (Broker/Agent/Agency) | Contact | Active | Leads Sent | Conversions | Commission Due | Actions
- **Add Channel Partner:**
  - Name and company
  - Contact details
  - Commission structure: flat fee per lead, percentage of sale, tiered
  - Agreement upload
  - Status: Active | Inactive
- **Commission Tracking:**
  - Automatic calculation based on conversions
  - Payout schedule and status: Pending | Processed | Paid
  - Generate commission reports and invoices

---

## 2.5 INTERNAL ADMIN & OPERATIONS PANEL

### 2.5.1 Admin Dashboard Home
- **Overview Metrics:**
  - Total users (by role)
  - Total listings (active, pending approval, flagged)
  - Total leads generated today/this week/this month
  - Pending moderation queue count
  - Pending KYC verifications
  - Open support tickets
- **Quick Actions:**
  - Go to moderation queue
  - Manage users
  - Configure platform settings
  - View system health

### 2.5.2 Role & Permissions Management
- **Roles List:**
  - Pre-defined roles: Admin, Moderator, Verifier, Support, Finance, Marketing, Analytics
  - Custom roles creation option
- **Edit Role:**
  - Role name
  - Permissions checklist (grouped by module):
    - Users: View | Create | Edit | Delete | Impersonate
    - Listings: View | Edit | Approve | Reject | Delete
    - Projects: View | Edit | Delete
    - Leads: View | Edit | Delete
    - Payments: View | Process Refunds | Manage Plans
    - Content: View | Edit | Publish
    - Reports: View All Data | Export Data
    - Settings: View | Edit
- **Assign Roles to Internal Users:**
  - User list with role assignment dropdown
  - Audit log of role changes

### 2.5.3 Listing Moderation Queue
- **Queue List:**
  - Pending Approval tab | Flagged/Reported tab | Recently Rejected tab
  - Columns: Listing Image | Title | Owner | Property Type | Submitted Date | Priority | Actions
  - Priority flag: High (if pro user), Normal
- **Moderation Detail View:**
  - Full listing preview as it will appear publicly
  - All listing data (text, images, documents uploaded by owner)
  - Owner information and history (past listings, any flags)
  - Verification status of owner
  - Checklist for moderator:
    - Photos are clear and relevant
    - Description is appropriate (no spam/fraud)
    - Pricing seems reasonable
    - Location is accurate
    - No duplicate listing
    - No prohibited content
  - Actions:
    - **Approve** → Listing goes live
    - **Approve with edits** → Moderator makes minor corrections and approves
    - **Send back for corrections** → Add note on what needs fixing, owner gets notification
    - **Reject** → Provide reason, listing won't be published
    - **Flag for senior review** → Escalate to admin
- **Bulk Moderation:**
  - Select multiple listings
  - Approve or reject in bulk (with confirmation)

### 2.5.4 User Management
- **User Search & List:**
  - Search by name, email, phone, user ID
  - Filter by role, status (Active, Suspended, Banned), KYC status, city
  - Columns: User Name | Role | Email | Phone | Joined Date | Status | KYC Status | Actions
- **User Detail View:**
  - Personal information
  - Listings count and links
  - Leads count
  - Payment history
  - Activity log (logins, key actions)
  - Flags or reports against this user
  - Actions:
    - Edit user info
    - Reset password
    - Suspend account (temporary, with reason and duration)
    - Ban account (permanent, with reason)
    - Unban/Unsuspend
    - Impersonate user (with audit log entry and time limit)

### 2.5.5 KYC Verification Workflow
- **Pending KYC Queue:**
  - List of users who submitted KYC documents
  - Columns: User Name | Role | Document Type | Submitted Date | Actions
- **KYC Detail View:**
  - View uploaded documents (ID proof, address proof, business registration for brokers/builders)
  - Verify details match user profile
  - Check document validity
  - Actions:
    - **Approve** → User gets verified badge
    - **Reject** → Provide reason, user can resubmit
    - **Request re-upload** → If document unclear
- **KYC Status in User Profile:** Verified badge displayed on listings and profile

### 2.5.6 Complaints, Disputes & Fraud Management
- **Reports/Flags List:**
  - User-reported listings or profiles
  - Columns: Reported Item | Reporter | Reason | Date | Status | Assigned To | Actions
  - Filter by type (Spam, Fraud, Incorrect Info, Duplicate, Offensive Content), status (New, In Progress, Resolved, Closed)
- **Report Detail:**
  - Reporter information
  - Reported listing/user detail
  - Reason and description
  - Evidence (screenshots, links)
  - Investigation notes (internal)
  - Actions:
    - Contact reporter for more info
    - Contact reported user for clarification
    - Take action on listing (remove, edit, flag)
    - Take action on user (warn, suspend, ban)
    - Mark as resolved or false report
- **Fraud Pattern Detection (Simple Rules):**
  - Same phone number used across multiple accounts
  - Same property listed multiple times by different users
  - Extremely low pricing compared to locality average (potential fraud)
  - High report frequency for a user
  - Admin dashboard alerts for these patterns

### 2.5.7 Platform Configuration Management
- **Cities & Localities:**
  - Master list of cities with enable/disable toggle
  - Add new city form
  - Locality taxonomy per city (hierarchical: City > Zone > Locality)
  - Add/edit localities with lat/long and polygon boundaries (for map search)
  - Merge duplicate localities
- **Property Types & Features:**
  - Manage list of property types (Apartment, Villa, etc.)
  - Manage list of amenities with icons
  - Add/remove/edit options
- **Dropdown Options:**
  - Configure all dropdown values used across platform (furnishing types, facing options, property age ranges, etc.)
- **Business Rules:**
  - Minimum and maximum price ranges per city
  - Photo upload limits by plan
  - Listing expiry duration (e.g., 90 days)
  - Auto-renewal settings
- **Content Moderation Rules:**
  - Prohibited keywords list (auto-flag listings with these words)
  - Minimum description length
  - Minimum photo count for approval

---

## 2.6 FINANCE & BILLING PANEL

(See detailed flows in main plan - includes subscription management, payments, invoices, refunds, and revenue reporting)

---

## 2.7 MARKETING & CONTENT PANEL

(See detailed flows in main plan - includes CMS, banner management, email campaigns, and SEO content)

---

## 2.8 ANALYTICS & EXPERIMENTATION

(See detailed flows in main plan - includes metrics dashboards, funnel analysis, cohort analysis, and A/B testing)
