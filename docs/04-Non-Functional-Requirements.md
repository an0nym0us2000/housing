# HOUSING PLATFORM - NON-FUNCTIONAL REQUIREMENTS

This document outlines performance, scalability, security, and operational requirements.

---

## 5.1 PERFORMANCE REQUIREMENTS

### Critical Performance Targets:

**1. Search Response Time:**
- Goal: < 300ms for 95th percentile search queries
- Strategy: Use Elasticsearch with proper indexing, caching popular queries in Redis

**2. Property Detail Page Load:**
- Goal: < 500ms server response time, < 2s full page load
- Strategy: SSR with Next.js, CDN for images, Redis cache for listing data

**3. API Response Times:**
- Goal: < 200ms for 95% of API calls
- Strategy: Database query optimization, connection pooling, caching, async processing for heavy operations

**4. Real-Time Messaging:**
- Goal: < 100ms latency for message delivery
- Strategy: WebSocket connections with Socket.io, Redis pub/sub for scaling across servers

**5. Listing Submission:**
- Goal: < 3 seconds for form submission and initial save
- Strategy: Offload image processing (resize, compress, upload to S3) to background jobs

---

## 5.2 SCALABILITY STRATEGY

### Horizontal Scaling:
- **Backend:** Deploy NestJS app on multiple instances behind a load balancer (AWS ALB/ELB, Nginx)
- **Database:** Use read replicas for PostgreSQL to distribute read load, primary for writes
- **Search:** Elasticsearch cluster with multiple nodes, shard data by city or property type
- **Cache:** Redis cluster (Redis Sentinel or Redis Cluster) for high availability
- **WebSocket:** Use Redis adapter for Socket.io to sync WebSocket connections across multiple backend instances

### Vertical Scaling (for initial phases):
- Upgrade database and cache instances as needed
- Optimize queries and add indexes before adding hardware

### Auto-Scaling:
- Configure auto-scaling groups for backend servers based on CPU/memory metrics
- Scale up during traffic spikes (weekends, marketing campaigns)

### Database Sharding (future consideration if massive scale):
- Shard listings table by city (each city in separate database)
- Not needed for MVP, consider when single database reaches limits

### CDN for Static Assets:
- Use CloudFront or similar CDN to serve images, videos, JS, CSS globally with low latency

---

## 5.3 SECURITY

### Authentication & Authorization:
- JWT tokens for stateless auth (access token short-lived: 15 mins, refresh token long-lived: 7 days)
- Secure token storage: HttpOnly cookies for web, secure storage for mobile
- Role-based access control (RBAC): Middleware checks user role and permissions before API access

### Data Protection:
- **Encryption at rest:** Database encryption, S3 bucket encryption
- **Encryption in transit:** HTTPS/TLS for all API communication
- **Password security:** bcrypt hashing with salt rounds >= 10
- **Sensitive data masking:** Mask phone numbers in listings until buyer reveals (lead captured first)

### Input Validation & Sanitization:
- Use class-validator in NestJS for all API inputs
- Sanitize user-generated content (descriptions, notes) to prevent XSS
- Parameterized queries (ORM handles this) to prevent SQL injection

### Rate Limiting:
- Implement rate limiting per IP and per user
  - Anonymous users: 100 requests per 15 mins
  - Authenticated users: 1000 requests per 15 mins
  - Use Redis to track request counts
- Stricter limits on sensitive endpoints (OTP sending, password reset)

### CSRF Protection:
- CSRF tokens for state-changing operations on web (built-in with modern frameworks)

### File Upload Security:
- Validate file types and sizes
- Scan uploaded files for malware (use ClamAV or cloud service like AWS S3 malware scanning)
- Generate unique filenames (UUID) to prevent overwriting

### DDoS Protection:
- Use cloud provider's DDoS protection (AWS Shield, Cloudflare)
- Rate limiting and IP blocking

### Session Management:
- Invalidate tokens on logout
- Track active sessions and allow user to revoke sessions
- Detect and alert on suspicious login patterns (login from new location/device)

---

## 5.4 DATA PRIVACY

### PII Protection:
- Do not expose full phone numbers publicly on listings
- Buyer must log in and contact to reveal phone number (creates lead event)
- Mask email addresses in public views

### GDPR/Data Protection Compliance (if applicable):
- Allow users to download their data (data export feature)
- Allow users to delete their account and all associated data (right to be forgotten)
- Clear privacy policy and terms of service
- Cookie consent banner for EU users

### Access Logs:
- Log all access to sensitive data (who viewed what user's contact info, when)
- Audit trail for admin actions (impersonation, editing user data)

---

## 5.5 AVAILABILITY & RELIABILITY

### Uptime Target:
- Goal: 99.9% uptime (approximately 8.76 hours downtime per year)
- Strategy: Multi-AZ deployment, load balancing, health checks, auto-recovery

### Fault Tolerance:
- Database backups: Daily automated backups with point-in-time recovery
- Multi-AZ deployment for database (primary + standby replica)
- Graceful degradation: If search service is down, fall back to basic DB query
- Circuit breaker pattern for external service calls (payment gateway, notification services)

### Health Checks:
- Implement `/health` endpoint on backend (checks database connection, Redis connection, etc.)
- Load balancer health checks to remove unhealthy instances from rotation

### Deployment Strategy:
- Blue-green deployment or rolling updates with zero downtime
- Canary deployments for risky changes (deploy to 5% of traffic first, monitor, then full rollout)

---

## 5.6 LOGGING, MONITORING & ALERTING

### Logging:
- **Structured logging:** JSON format logs with correlation IDs for request tracing
- **Centralized logging:** Use AWS CloudWatch, ELK Stack (Elasticsearch, Logstash, Kibana), or Datadog
- **Log levels:** DEBUG (dev only), INFO, WARN, ERROR
- **Log retention:** 30 days for general logs, 1 year for audit logs

### Application Monitoring:
- **APM tool:** Use New Relic, Datadog, or AWS X-Ray for application performance monitoring
- Track API response times, error rates, throughput
- Distributed tracing for multi-service calls

### Infrastructure Monitoring:
- Monitor CPU, memory, disk I/O, network for all servers
- Database performance metrics (slow queries, connection pool usage, replication lag)
- Redis memory usage and eviction rates

### Alerting:
- Alert on:
  - Error rate > 1% for 5 minutes
  - API response time p95 > 1 second
  - Database connection pool exhaustion
  - Disk space > 80%
  - Payment gateway failures
  - Critical background jobs failing
- Alert channels: PagerDuty, Slack, email, SMS for on-call engineers

### Business Metrics Dashboards:
- Real-time dashboards for:
  - Signups per hour
  - Active listings count
  - Leads generated per hour
  - Revenue per day
  - Search volume and top searches

---

## 5.7 BACKUP & DISASTER RECOVERY

### Database Backups:
- Automated daily full backups
- Point-in-time recovery (PITR) enabled (continuous backup of transaction logs)
- Store backups in separate region for geo-redundancy
- Regular backup restoration tests (monthly) to ensure backups are valid

### S3 Backups:
- Enable versioning on S3 buckets (media files, documents)
- Cross-region replication for critical files

### Disaster Recovery Plan:
- **RTO (Recovery Time Objective):** 4 hours - system should be restored within 4 hours of major failure
- **RPO (Recovery Point Objective):** 1 hour - acceptable data loss window is 1 hour
- Maintain infrastructure-as-code (Terraform/CloudFormation) to quickly recreate infrastructure
- Document runbooks for common disaster scenarios
- Quarterly DR drills

### Code & Configuration Backups:
- All code in Git (GitHub) with branch protection
- Environment variables and secrets in secure vault (AWS Secrets Manager, HashiCorp Vault)
- Regular backups of configuration databases

---

## 5.8 COMPLIANCE & LEGAL

### Data Residency:
- Store Indian users' data in Indian data centers (if required by law)
- Comply with local data protection laws

### Terms of Service & Privacy Policy:
- Clear ToS and Privacy Policy displayed and accepted during registration
- Cookie policy and consent management

### Content Moderation:
- Human moderation for user-generated content (listings, reviews)
- Compliance with local laws regarding property advertising

### Tax Compliance:
- GST invoicing for Indian market
- Proper tax collection and reporting

---

## 5.9 ACCESSIBILITY (A11y)

### WCAG 2.1 AA Compliance:
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader testing and fixes
- Alt text for all images
- Focus indicators for interactive elements

### Multi-language Support (Future):
- i18n framework setup for future localization
- Support for Hindi, regional languages (Phase 8+)

---

## 5.10 PERFORMANCE BUDGETS

### Page Load Budgets:
- Homepage: < 2s (First Contentful Paint), < 3s (Time to Interactive)
- Search Results: < 2.5s
- Listing Detail: < 2s
- Dashboard pages: < 3s

### Bundle Size Budgets:
- Initial JS bundle: < 200KB (gzipped)
- CSS bundle: < 50KB (gzipped)
- Images: Lazy loaded, WebP format preferred

### Lighthouse Scores (Targets):
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

---

## 5.11 TESTING REQUIREMENTS

### Unit Tests:
- Backend services: 80%+ code coverage
- Frontend components: 70%+ coverage for critical components

### Integration Tests:
- API endpoint tests (happy path and edge cases)
- Database integration tests

### End-to-End Tests:
- Critical user flows:
  - User registration and login
  - Property listing creation and moderation
  - Search and view listing
  - Contact owner and create lead
  - Payment and subscription

### Load Testing:
- Simulate 1000 concurrent users
- Identify bottlenecks before launch
- Test auto-scaling behavior

### Security Testing:
- OWASP Top 10 vulnerability scanning
- Penetration testing before production launch

---

## SUMMARY

These non-functional requirements ensure the housing platform is:
- **Fast:** Sub-second response times for critical operations
- **Scalable:** Handles growth from hundreds to millions of users
- **Secure:** Protects user data and prevents common vulnerabilities
- **Reliable:** 99.9% uptime with disaster recovery
- **Observable:** Comprehensive logging and monitoring
- **Compliant:** Meets legal and accessibility standards
