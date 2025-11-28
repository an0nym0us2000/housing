# HOUSING PLATFORM - V1 SCOPE & DEVELOPMENT WORKFLOW

This document defines what should be in the first public launch (V1) and how to work with AI coding assistants.

---

## SECTION 7: V1 SCOPE vs. LATER PHASES

### Must-Have for V1 (Minimum Public Launch):

**Included Phases:** Phase 0, Phase 1, Phase 2

**Features:**

- ✅ User registration and authentication (buyers and owners)
- ✅ Owner can list properties (with moderation)
- ✅ Buyers can search and view property listings
- ✅ Buyers can contact owners (phone reveal, lead tracking)
- ✅ Buyers can save listings
- ✅ Buyers can schedule visits
- ✅ Owners can manage listings and view leads
- ✅ Basic email and SMS notifications
- ✅ In-app chat between buyers and owners
- ✅ Admin panel for moderation and user management

**Why this is the MVP:**

- Provides core marketplace value: buyers find properties, owners get leads
- Establishes trust with moderation
- Enables basic lead management for owners
- Foundation for all future features

**Timeline for V1:** 8-12 weeks

---

### V2 and Beyond (Post-Launch Iterations):

**Phase 3 (Broker Panel):** Launch 2-4 weeks after V1

- Targets broker segment (expands supply)

**Phase 4 (Builder Projects):** Launch 4-6 weeks after V1

- Targets new construction segment

**Phase 5 (Monetization):** Launch 6-8 weeks after V1

- Once user base is established and value is proven

**Phase 6 (SEO & Advanced UX):** Ongoing optimization

- Some features (Elasticsearch) can go live earlier if search performance is an issue

**Phase 7 (Internal Tools):** Gradual rollout

- Some features (support system) might be needed earlier

**Phase 8 (Mobile & AI):** 6-12 months post-V1 launch

---

### Key Dependencies:

- **Cannot launch broker panel (Phase 3)** until stable listing and lead flow exists (Phase 1, 2)
- **Cannot launch monetization (Phase 5)** until there is proven value and user engagement
- **SEO (Phase 6)** is important for organic growth, some aspects (SSR, meta tags) should be in V1
- **Internal tools (Phase 7)** grow with platform complexity; start with basics in V1, mature over time

---

## SECTION 8: DEVELOPMENT WORKFLOW WITH AI CODING ASSISTANT

### 8.1 General Workflow

**Step 1: Select a Phase**

- Start with Phase 0, then move sequentially through phases
- Don't skip phases (they build on each other)

**Step 2: Break Phase into Sub-Tasks**

- Each phase has 10-15 deliverables
- Break deliverables into smaller coding tasks

**Step 3: Prompt AI Assistant with Context**

- Provide context from this roadmap
- Specify exactly what to build
- Reference the architecture, database schema, and service boundaries

**Example prompt:**

```
I'm working on Phase 1 of the housing platform (as per the roadmap).

Task: Implement the user registration API endpoint in NestJS.

Requirements:
- POST /auth/register
- Accept: email, password, role (buyer or owner)
- Validate input using class-validator
- Hash password with bcrypt
- Save user to PostgreSQL using Prisma
- Return success message (do not auto-login)

Tech stack: NestJS, Prisma, PostgreSQL
Database schema: users table as defined in Section 4.1

Please generate the code for:
1. DTO (Data Transfer Object) for registration
2. Auth service method for registration
3. Auth controller endpoint
4. Prisma schema update if needed
```

**Step 4: Review and Test Generated Code**

- AI generates code
- Review for correctness, security, and consistency
- Test locally (unit tests, manual testing)

**Step 5: Iterate and Refine**

- If issues found, provide feedback to AI
- If requirements change, update AI with new context

**Step 6: Commit and Move to Next Task**

- Commit code to Git with clear commit message
- Move to next deliverable

**Step 7: Complete Phase and Deploy**

- Once all deliverables complete, run integration tests
- Deploy to staging
- User acceptance testing (UAT)
- Deploy to production
- Move to next phase

---

### 8.2 Maintaining Consistency Across Prompts

**Create a Context File:**

- Save this roadmap document
- Create `ARCHITECTURE.md` with key decisions
- Create `DATABASE_SCHEMA.md` with table definitions
- Reference these files in prompts

**Naming Conventions:**

- Stick to conventions (snake_case for DB, camelCase for code)
- Reuse terminology consistently

**Code Style:**

- Define linting and formatting rules early (Phase 0)
- Ask AI to follow those rules
- Use Prettier and ESLint to enforce

**Module Boundaries:**

- Each service/module is independent
- Clearly specify which service AI is working on
- Avoid mixing concerns

---

### 8.3 Best Practices for AI-Assisted Development

1. **One Feature at a Time:**
   - Don't ask AI to build entire phase at once
   - Break into small, testable increments

2. **Provide Examples:**
   - If you've built similar feature, show AI the code and ask to follow pattern

3. **Security First:**
   - Always remind AI to validate inputs, sanitize outputs
   - Review authentication and authorization logic carefully

4. **Test as You Go:**
   - Write unit tests for backend services
   - Write integration tests for critical flows
   - Manual testing for UI/UX

5. **Document Decisions:**
   - When AI suggests architectural decision, document it (ADRs)
   - Keep README updated

6. **Refactor Regularly:**
   - As codebase grows, refactor for maintainability
   - Ask AI to help with refactoring

7. **Version Control:**
   - Commit frequently with meaningful messages
   - Use feature branches
   - PR reviews (even self-reviewing)

8. **Iterate on UI/UX:**
   - AI can generate UI code, but design is subjective
   - Iterate based on user feedback
   - Use design tools (Figma) to plan UI before coding

---

### 8.4 Example Workflow for Phase 1

**Week 1:**

- Task 1: Set up database schema for users, listings, cities, localities (Prisma migrations)
- Task 2: Implement auth endpoints (register, login, JWT generation)
- Task 3: Create homepage Next.js page with basic layout
- Task 4: Implement city selector component with autocomplete

**Week 2:**

- Task 5: Create "Add Listing" wizard UI (all 7 steps)
- Task 6: Implement backend API to save listing (POST /listings)
- Task 7: Image upload to S3 integration
- Task 8: Implement listing status management (draft, under review)

**Week 3:**

- Task 9: Build search page UI with filters
- Task 10: Implement backend search API (basic SQL query with filters)
- Task 11: Build listing detail page UI
- Task 12: Implement GET /listings/:id API

**Week 4:**

- Task 13: Build admin moderation panel UI
- Task 14: Implement moderation APIs (approve, reject listing)
- Task 15: Build owner dashboard (my listings)
- Task 16: Implement lead creation when buyer contacts owner
- Task 17: Email notification integration (SendGrid)

**Week 5:**

- Task 18: Testing and bug fixes
- Task 19: Deploy to staging
- Task 20: UAT and feedback
- Task 21: Deploy to production (Phase 1 complete)

---

### 8.5 Handling Blockers

- **AI doesn't understand context:** Provide more specific details, paste relevant code, reference roadmap sections
- **Generated code has bugs:** Provide error message and stack trace to AI, ask for fix
- **Uncertain about architecture decision:** Refer back to roadmap, research best practices, then update roadmap
- **Third-party integration issues:** Check official docs, provide docs to AI
- **Performance issues:** Profile the app, identify bottleneck, ask AI for optimization suggestions

---

### 8.6 Sample Prompts for Common Tasks

#### Backend API Endpoint

```
Create a NestJS endpoint for [purpose].

Path: [HTTP method] [path]
Input: [describe request body/params]
Validation: [rules]
Business logic: [describe]
Output: [describe response]

Use Prisma for database access.
Follow the existing pattern in [reference file].
Include error handling and proper HTTP status codes.
```

#### Frontend Component

```
Create a React component for [purpose].

Requirements:
- [List UI requirements]
- Use Tailwind CSS for styling
- Make it responsive
- Handle loading and error states
- Use TypeScript with proper types

API integration: [if applicable]
Follow the pattern in [reference component].
```

#### Database Migration

```
Create a Prisma migration for [purpose].

Tables to modify: [list]
Changes: [describe schema changes]
Indexes: [specify]

Ensure backwards compatibility with existing data.
Include seed data if needed.
```

---

### 8.7 Testing Strategy with AI

**Unit Tests:**

```
Write unit tests for [service/function].

Test cases:
1. Happy path: [describe]
2. Edge case: [describe]
3. Error case: [describe]

Use Jest and follow existing test patterns.
Mock external dependencies.
Aim for 80%+ coverage.
```

**Integration Tests:**

```
Write integration test for [API endpoint].

Test flow:
1. [Setup]
2. [Action]
3. [Assertion]

Use supertest for API testing.
Use test database.
Clean up after tests.
```

---

### 8.8 Code Review Checklist

When reviewing AI-generated code, check:

- [ ] Code follows project conventions and style guide
- [ ] No security vulnerabilities (SQL injection, XSS, etc.)
- [ ] Proper error handling
- [ ] Input validation
- [ ] Logging for important operations
- [ ] No hardcoded secrets
- [ ] TypeScript types are correct
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Edge cases handled
- [ ] Tests included (if applicable)
- [ ] Documentation updated (if public API)

---

## CONCLUSION

This roadmap provides a comprehensive blueprint for building your housing platform:

✅ **Clear Phases:** 8 phases from foundations to full platform
✅ **Detailed Requirements:** User journeys, database schema, architecture
✅ **V1 Definition:** Phases 0-2 for initial launch (8-12 weeks)
✅ **AI Workflow:** Step-by-step guide to working with AI coding assistants
✅ **Best Practices:** Testing, security, performance, scalability

### Next Steps:

1. **Review and Approve:** Share with stakeholders, gather feedback
2. **Set Up Phase 0:** Initialize repository, set up dev environment
3. **Begin Phase 1:** Start building core marketplace MVP
4. **Iterate and Learn:** Gather user feedback after V1, adjust roadmap
5. **Scale and Optimize:** Continue through phases

This roadmap is a **living document**. Update it as you build and discover new insights.

**Good luck building your housing platform! 🏠🚀**
