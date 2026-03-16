# 📋 Project Scope - Keeper Nest WebApp

## 1. PROJECT DEFINITION

**Project Name:** Keeper Nest - Enterprise Leave & Asset Management System

**Project Type:** Web Application (SaaS)

**Target Users:**
- Small to Medium Enterprises (SMEs)
- Large Corporations with 100-5000+ employees
- Organizations with multiple departments
- Companies requiring flexible leave policies

**Platform:** Cross-browser responsive web application

---

## 2. FUNCTIONAL SCOPE

### 2.1 AUTHENTICATION & USER MANAGEMENT

#### In Scope:
- ✅ User registration (Sign Up)
- ✅ User login with email/password
- ✅ Password reset via email
- ✅ Password change functionality
- ✅ User profile view
- ✅ User profile edit (name, contact info)
- ✅ Session management
- ✅ Logout functionality
- ✅ Role-based access control (RBAC)
- ✅ Three role types: Employee, Admin, SuperAdmin
- ✅ Automatic role assignment during registration
- ✅ Secure password storage (hashing + salt)

#### Out of Scope:
- ❌ Two-factor authentication (2FA)
- ❌ Biometric authentication
- ❌ OAuth/SSO integrations (Google, Microsoft)
- ❌ LDAP/Active Directory integration
- ❌ API key authentication

---

### 2.2 EMPLOYEE MANAGEMENT

#### In Scope:
- ✅ Create/Add new employees
- ✅ View employee list with pagination
- ✅ Search employees by name, email, ID
- ✅ Filter employees by:
  - Department
  - Role (Admin/Employee)
  - Status (Active/Inactive)
  - Designation
- ✅ Edit employee information:
  - First name, last name
  - Email address
  - Department
  - Designation
  - Role assignment
  - Status (Active/Inactive)
- ✅ Delete employee records
- ✅ View detailed employee profile
- ✅ Assign department to employees
- ✅ Assign role to employees
- ✅ Reset employee password
- ✅ Deactivate/Activate employees
- ✅ View employee's assigned assets
- ✅ View employee's leave history
- ✅ Bulk employee import (CSV)

#### Out of Scope:
- ❌ Employee performance ratings
- ❌ Training and development tracking
- ❌ Attendance/Time tracking
- ❌ Salary and compensation management
- ❌ Employee hierarchies/org chart
- ❌ Skills and competency management
- ❌ Employee engagement surveys

---

### 2.3 LEAVE MANAGEMENT

#### A. Leave Policy Configuration (Admin Only)

##### In Scope:
- ✅ Create new leave types with:
  - Name (e.g., "Earned Leave")
  - Short code (e.g., "EL")
  - Description
  - Color code for UI representation
  - Maximum days per year
  - Carry forward limits
  - Approval requirement flag
  
- ✅ Edit existing leave types
- ✅ Delete leave types
- ✅ View all leave types
- ✅ Activate/Deactivate leave types
- ✅ Effective date configuration

- ✅ Credit Rules Configuration:
  - **Yearly Accrual:** Fixed days per year
  - **Monthly Accrual:** Days credited each month
  - **Not Applicable:** Manual balance management
  - Set total days per year
  - Set credit date (Jan 1, Apr 1, or Custom date)
  - Configure custom credit date picker
  
- ✅ Consumption Rules Configuration:
  - Max days per application
  - Max days per month
  - Min days per application
  - Allow half-day applications
  - Allow consecutive days
  - Allow during probation
  - Unlimited consumption option
  
- ✅ Year-End Rules Configuration:
  - Carry forward to next year (Y/N)
  - Carry forward limit
  - Encashment option (Y/N)
  - Encashment rate (e.g., per day amount)
  - Expiration rules (lose unused days after X days)
  - Unlimited carry forward option
  
- ✅ Leave Assignment:
  - Assign to all employees
  - Assign to specific employees
  - Assign by department
  - Assign by role
  - View assignment history

##### Out of Scope:
- ❌ Leave request workflow customization
- ❌ Multi-level approval chains
- ❌ Conditional approval based on manager hierarchy
- ❌ Leave balance adjustments (manual)
- ❌ Leave forfeiture rules
- ❌ Substitute/delegation management

---

#### B. Employee Leave Application

##### In Scope:
- ✅ Apply for leave with:
  - Leave type selection
  - Start date
  - End date
  - Day type (Full day, First half, Second half)
  - Reason/comments
  - Attachment (optional)
  
- ✅ View leave balance:
  - Total credited days
  - Days used
  - Remaining days
  - Carried forward days
  - Month-wise breakdown
  
- ✅ View accrual history:
  - Monthly accrual records
  - Yearly accrual records
  - Accrual details with dates and amounts
  - Historical accrual trends
  
- ✅ View leave history:
  - All past leave applications
  - Approved leaves
  - Rejected leaves
  - Pending leaves
  - Cancelled leaves
  
- ✅ Withdraw application (Draft status only)
- ✅ Cancel approved leave (if manager allows)
- ✅ View leave policies applicable to employee
- ✅ Real-time balance calculation

##### Out of Scope:
- ❌ Leave advance/early credit
- ❌ Overlapping leave validation logic
- ❌ Holiday calendar integration
- ❌ Conflict resolution (overlapping leaves)
- ❌ Automatic split into multiple leave types

---

#### C. Leave Approval & Workflow

##### In Scope:
- ✅ View pending leave approvals (for Admin/Manager)
- ✅ Review leave application details:
  - Applicant info
  - Leave dates
  - Reason
  - Current balance
  - Policy compliance check
  
- ✅ Approve leave requests
- ✅ Reject leave requests with reason
- ✅ Add approval comments
- ✅ Bulk approve multiple applications
- ✅ Bulk reject multiple applications
- ✅ View approval history
- ✅ Mark as read/unread
- ✅ Filter pending approvals by:
  - Leave type
  - Department
  - Date range
  - Status

##### Out of Scope:
- ❌ Multi-level hierarchical approvals
- ❌ Parallel approval chains
- ❌ Time-based approval escalation
- ❌ Conditional approvals based on business rules
- ❌ Manager delegation
- ❌ Temporary approval authority

---

#### D. Automated Leave Processing

##### In Scope:
- ✅ Monthly leave accrual processing
- ✅ Yearly leave accrual processing
- ✅ Apply leave deductions after approval
- ✅ Process carry forward at year-end
- ✅ Process encashment calculations
- ✅ Update leave balances
- ✅ Validate leave against policy rules:
  - Check balance sufficiency
  - Check consumption limits
  - Check date validity
  - Check policy applicability
  
- ✅ Generate accrual records
- ✅ Send notifications:
  - Application submitted notification
  - Approval notification
  - Rejection notification
  - Low balance warning (< 5 days)
  - Leave approval reminder
  
- ✅ Scheduled job execution:
  - Monthly accrual job
  - Year-end processing job
  - Notification job

##### Out of Scope:
- ❌ Real-time accrual updates
- ❌ Custom accrual formulas
- ❌ Prorated accrual for mid-year joiners
- ❌ Leave encashment settlements
- ❌ Leave lapse management
- ❌ Automatic penalty deductions

---

### 2.4 ASSET MANAGEMENT

#### A. Asset Inventory Management

##### In Scope:
- ✅ Add new assets with details:
  - Asset name
  - Asset code (unique identifier)
  - Category (Laptop, Phone, Monitor, Furniture, etc.)
  - Description
  - Purchase date
  - Purchase value
  - Current value
  - Warranty expiration date
  - Location/Building
  - Status (Active/Inactive/Damaged/Disposed)
  
- ✅ Edit asset information
- ✅ Delete assets from inventory
- ✅ View complete asset inventory
- ✅ Search assets by:
  - Asset name
  - Asset code
  - Category
  - Status
  
- ✅ Filter assets by:
  - Category
  - Status
  - Department
  - Location
  - Purchase date range
  
- ✅ View asset details with full history
- ✅ Asset status tracking
- ✅ Depreciation tracking (basic)

##### Out of Scope:
- ❌ Advanced depreciation calculations
- ❌ Maintenance scheduling
- ❌ Warranty management system
- ❌ Asset insurance tracking
- ❌ Component-level asset management
- ❌ Barcode/QR code scanning
- ❌ Asset API integrations

---

#### B. Asset Allocation & Tracking

##### In Scope:
- ✅ Assign assets to employees
- ✅ Reassign assets to different employees
- ✅ View assigned assets per employee
- ✅ View employee's assets
- ✅ Track asset allocation history
- ✅ Record allocation date
- ✅ Record asset condition (Good/Fair/Poor)
- ✅ Record return date (if returned)
- ✅ Add allocation notes/comments
- ✅ View allocation timeline
- ✅ Deactivate/Mark asset as returned
- ✅ Generate asset usage report per employee

##### Out of Scope:
- ❌ Asset check-in/check-out workflows
- ❌ Physical inventory audits
- ❌ Asset handover forms
- ❌ Asset damage compensation tracking
- ❌ Asset loan/borrow system
- ❌ Asset lifecycle stages

---

#### C. Asset Reporting

##### In Scope:
- ✅ Asset inventory report
- ✅ Asset by category report
- ✅ Asset by status report
- ✅ Asset allocation report (per employee)
- ✅ Unallocated assets report
- ✅ Asset value report (total, by category)
- ✅ Asset movement history report
- ✅ Department-wise asset report
- ✅ Export reports (PDF, Excel)
- ✅ Filter reports by date range

##### Out of Scope:
- ❌ Real-time asset tracking (GPS)
- ❌ Advanced analytics/dashboards
- ❌ Predictive maintenance reports
- ❌ ROI calculations
- ❌ Cost allocation by department

---

### 2.5 REPORTING & ANALYTICS

#### In Scope:
- ✅ Leave Summary Report:
  - Total leaves approved/pending/rejected
  - Leave type distribution
  - Department-wise breakdown
  - Period-wise (monthly, quarterly, yearly)
  
- ✅ Employee Leave Usage Report:
  - Individual employee leave history
  - Days used vs balance
  - Leave type breakdown
  - Trends over time
  
- ✅ Department Analytics:
  - Leave distribution by department
  - Most used leave types
  - Approval rate by department
  - Average days used per employee
  
- ✅ Compliance Report:
  - Policy adherence check
  - Violations (if any)
  - Approval pending count
  - Overdue approvals
  
- ✅ Asset Utilization Report:
  - Asset distribution
  - Allocation status
  - Category-wise breakdown
  - Value tracking
  
- ✅ Approval Metrics:
  - Pending approvals count
  - Average approval time
  - Approval by manager
  - Approval status breakdown
  
- ✅ Report Features:
  - Filter by date range
  - Filter by department
  - Filter by employee
  - Filter by leave type
  - Export to PDF
  - Export to Excel
  - Schedule recurring reports
  - Email reports

##### Out of Scope:
- ❌ Real-time dashboards with WebSockets
- ❌ Advanced BI tool integration (Power BI, Tableau)
- ❌ Predictive analytics
- ❌ Machine learning-based insights
- ❌ Custom report builder
- ❌ API for third-party report access

---

### 2.6 DASHBOARD & VISUALIZATION

#### In Scope:
- ✅ Admin Dashboard:
  - Leave statistics (approved, pending, rejected)
  - Asset overview
  - Employee count
  - Approval queue
  - Recent activities
  - Key metrics (trends, percentages)
  
- ✅ Employee Dashboard:
  - Leave balance summary
  - Leave history
  - Assigned assets
  - Approval status
  - Upcoming leave dates
  - Accrual schedule
  
- ✅ Visual Components:
  - Charts (bar, pie, line graphs)
  - Progress bars
  - Status cards
  - Activity timeline
  - Quick actions

##### Out of Scope:
- ❌ Interactive dashboards with drag-drop widgets
- ❌ Real-time live updates
- ❌ Custom dashboard builder
- ❌ Advanced data visualization
- ❌ KPI tracking

---

## 3. TECHNICAL SCOPE

### 3.1 ARCHITECTURE & INFRASTRUCTURE

#### In Scope:
- ✅ Client-side: React 19 + TypeScript + Vite
- ✅ Server-side: Appwrite Backend-as-a-Service
- ✅ Database: Appwrite Document Database
- ✅ File Storage: Appwrite Storage for documents
- ✅ Authentication: Appwrite Auth system
- ✅ Styling: Tailwind CSS + shadcn/ui components
- ✅ Responsive Design: Mobile, Tablet, Desktop
- ✅ API Communication: REST APIs
- ✅ HTTPS/TLS encryption for all communication
- ✅ Client-side encryption for sensitive data

#### Out of Scope:
- ❌ Custom backend development (using Appwrite)
- ❌ Microservices architecture
- ❌ GraphQL API (REST only)
- ❌ WebSocket real-time features
- ❌ Kubernetes/Container orchestration
- ❌ Multi-region deployment
- ❌ CDN integration

---

### 3.2 BROWSER & DEVICE SUPPORT

#### In Scope:
- ✅ Desktop Browsers:
  - Chrome (latest 2 versions)
  - Firefox (latest 2 versions)
  - Safari (latest 2 versions)
  - Edge (latest 2 versions)
  
- ✅ Responsive Design:
  - Desktop (1920x1080 and above)
  - Tablet (768px - 1024px)
  - Mobile (320px - 767px)
  
- ✅ Operating Systems:
  - Windows (10, 11)
  - macOS (latest 2 versions)
  - Linux (Ubuntu, Fedora)

#### Out of Scope:
- ❌ Internet Explorer support
- ❌ Native mobile apps (iOS/Android)
- ❌ Progressive Web App (PWA) with offline support
- ❌ Electron desktop app
- ❌ Legacy browser support

---

### 3.3 SECURITY & COMPLIANCE

#### In Scope:
- ✅ User Authentication:
  - Secure password storage (bcrypt with salt)
  - Session tokens
  - Session expiration
  - Password reset mechanism
  
- ✅ Authorization:
  - Role-based access control
  - Permission checking
  - Protected routes
  - API endpoint protection
  
- ✅ Data Security:
  - HTTPS/TLS encryption in transit
  - Client-side encryption for sensitive data
  - Secure API communication
  - CORS configuration
  
- ✅ Audit & Compliance:
  - Audit logs for critical operations
  - Action tracking (who, what, when)
  - Leave application tracking
  - Asset allocation tracking
  - Login/logout tracking
  
- ✅ Data Privacy:
  - Privacy policy implementation
  - User consent management
  - Data retention policy
  - Right to be forgotten (account deletion)

#### Out of Scope:
- ❌ Advanced encryption (military-grade)
- ❌ Hardware security tokens
- ❌ Biometric authentication
- ❌ Multi-factor authentication
- ❌ OAuth 2.0 or SAML integration
- ❌ Penetration testing
- ❌ SOC 2 Type II certification (initial version)

---

### 3.4 PERFORMANCE REQUIREMENTS

#### In Scope:
- ✅ Page Load Time: < 3 seconds (on 4G)
- ✅ API Response Time: < 500ms
- ✅ Database Query Time: < 100ms
- ✅ Bundle Size: < 200KB (gzipped)
- ✅ Support for 1000+ concurrent users
- ✅ Optimize re-renders with React.memo
- ✅ Lazy loading for images/components
- ✅ Code splitting by route

#### Out of Scope:
- ❌ Microsecond-level performance
- ❌ Real-time data synchronization
- ❌ Sub-100ms API response requirements
- ❌ Support for 10,000+ concurrent users

---

## 4. SCOPE MATRIX - WHAT'S INCLUDED vs EXCLUDED

| Feature | Status | Priority | Notes |
|---------|--------|----------|-------|
| User Authentication | ✅ In | P0 | Email/password only |
| 2FA/MFA | ❌ Out | P2 | Future enhancement |
| Employee CRUD | ✅ In | P0 | Complete with filters |
| Employee Org Chart | ❌ Out | P2 | Future phase |
| Leave Type Creation | ✅ In | P0 | Advanced configuration |
| Leave Application | ✅ In | P0 | With approval flow |
| Leave Accrual | ✅ In | P0 | Monthly/Yearly automated |
| Leave Encashment | ✅ In | P1 | Basic calculation |
| Asset Management | ✅ In | P1 | Inventory + allocation |
| Asset Tracking | ❌ Out | P2 | GPS/RFID tracking |
| Asset Maintenance | ❌ Out | P2 | Preventive maintenance |
| Reporting | ✅ In | P1 | Standard reports |
| Advanced Analytics | ❌ Out | P2 | BI integration |
| Mobile App | ❌ Out | P2 | Phase 2 deliverable |
| API Integration | ❌ Out | P3 | Third-party sync |
| Notification System | ✅ In | P1 | Email notifications |
| SMS Notifications | ❌ Out | P2 | Future enhancement |
| Slack Integration | ❌ Out | P3 | Phase 3+ |
| LDAP/SSO | ❌ Out | P2 | Enterprise feature |
| Custom Workflows | ❌ Out | P2 | Advanced configuration |

---

## 5. DATA SCOPE

### 5.1 DATA ENTITIES

#### In Scope:
1. **User Entity**
   - User ID, Email, Password, Name, Phone, Role, Status, Created Date

2. **Employee Entity**
   - Employee ID, Name, Email, Department, Designation, Role, Status, Join Date, Manager

3. **Leave Type Entity**
   - Leave ID, Name, Code, Description, Color, Max Days, Carry Forward, Credit Rules, Consumption Rules, Year-End Rules, Status

4. **Leave Application Entity**
   - Application ID, Employee ID, Leave Type, Start Date, End Date, Day Type, Status, Reason, Approval Comments, Approved By, Approval Date

5. **Leave Balance Entity**
   - Balance ID, Employee ID, Leave Type, Year, Credited Days, Used Days, Remaining Days, Carry Forward Days

6. **Asset Entity**
   - Asset ID, Name, Code, Category, Purchase Date, Value, Status, Location, Warranty

7. **Asset Allocation Entity**
   - Allocation ID, Asset ID, Employee ID, Allocation Date, Return Date, Condition, Notes

8. **Audit Log Entity**
   - Log ID, User ID, Action, Entity Type, Timestamp, Details

#### Out of Scope:
- Performance data collection
- Anonymous analytics
- Third-party data integration
- Data warehouse schema

---

### 5.2 DATA VOLUME ESTIMATES

#### Typical Organization (500 employees)
| Entity | Estimated Records | Growth |
|--------|-------------------|--------|
| Users | 500 | Slow (hiring) |
| Employees | 500 | Slow |
| Leave Applications | 3,000/year | Linear |
| Leave Balances | 2,500/year | Linear |
| Assets | 1,500 | Moderate |
| Asset Allocations | 5,000 | Linear |
| Audit Logs | 50,000/year | High |

---

## 6. USER ROLES & PERMISSIONS

### 6.1 ROLE DEFINITIONS

#### Employee Role
- ✅ View own profile
- ✅ Apply for leave
- ✅ View own leave balance
- ✅ View own leave history
- ✅ Withdraw draft applications
- ✅ View assigned assets
- ✅ View own accrual history
- ✅ Access employee dashboard

#### Admin Role
- ✅ All Employee permissions
- ✅ Manage all employees (CRUD)
- ✅ Create/Edit/Delete leave types
- ✅ Configure leave policies
- ✅ Approve/Reject leave requests
- ✅ Manage assets (CRUD)
- ✅ View reports and analytics
- ✅ Access admin dashboard
- ✅ Manage user roles
- ✅ View audit logs

#### SuperAdmin Role
- ✅ All Admin permissions
- ✅ System configuration
- ✅ Database management
- ✅ User access control
- ✅ Backup and recovery
- ✅ System settings
- ✅ Integration management

---

## 7. INTEGRATION SCOPE

### 7.1 INTERNAL INTEGRATIONS

#### In Scope:
- ✅ Frontend ↔ Backend (REST API)
- ✅ Database ↔ Backend (Appwrite)
- ✅ Authentication (Appwrite Auth)
- ✅ Email Service (Nodemailer)
- ✅ File Storage (Appwrite Storage)

#### Out of Scope:
- ❌ External HR Systems
- ❌ Payroll Software
- ❌ Attendance Systems
- ❌ Slack/Teams
- ❌ Google Workspace/Microsoft 365
- ❌ ERP Systems
- ❌ Analytics platforms (Segment, Mixpanel)

---

### 7.2 EMAIL NOTIFICATIONS

#### In Scope:
- ✅ Welcome email on signup
- ✅ Password reset email
- ✅ Leave application submitted notification
- ✅ Leave approval notification
- ✅ Leave rejection notification
- ✅ Low balance warning
- ✅ Approval reminder emails
- ✅ Accrual notification

#### Out of Scope:
- ❌ SMS notifications
- ❌ Push notifications
- ❌ In-app notifications with WebSockets
- ❌ Slack/Teams notifications

---

## 8. TESTING SCOPE

### 8.1 TESTING TYPES

#### In Scope:
- ✅ Unit Testing (Component level)
- ✅ Integration Testing (API + Component)
- ✅ End-to-End Testing (User workflows)
- ✅ Functionality Testing (Feature verification)
- ✅ Usability Testing (UI/UX)
- ✅ Cross-browser Testing
- ✅ Responsive Design Testing
- ✅ Security Testing (Basic)

#### Out of Scope:
- ❌ Load Testing (> 1000 concurrent users)
- ❌ Stress Testing
- ❌ Security Penetration Testing
- ❌ Performance Profiling
- ❌ Accessibility Compliance (WCAG)

---

## 9. DOCUMENTATION SCOPE

### 9.1 DELIVERABLES

#### In Scope:
- ✅ User Guide (Admin + Employee)
- ✅ Technical Documentation
- ✅ API Documentation (37 endpoints)
- ✅ Database Schema Documentation
- ✅ Deployment Guide
- ✅ Troubleshooting Guide
- ✅ FAQ Document
- ✅ Release Notes

#### Out of Scope:
- ❌ Video tutorials
- ❌ Interactive training modules
- ❌ Knowledge base
- ❌ Compliance documentation (GDPR, etc.)

---

## 10. IMPLEMENTATION PHASES

### Phase 1: Design & Frontend (✅ Complete)
**Duration:** 4 weeks
- ✅ UI/UX Design
- ✅ React Component Development
- ✅ Leave Management UI
- ✅ Asset Management UI
- ✅ Employee Management UI
- ✅ Responsive Design

### Phase 2: Backend & Integration (🔄 In Progress)
**Duration:** 4 weeks
- 🔄 API Development (37 endpoints)
- 🔄 Database Schema
- 🔄 Authentication Integration
- 🔄 Leave Accrual Implementation
- 🔄 Email Notification System
- 🔄 Audit Logging

### Phase 3: Testing & Optimization (⏳ Planned)
**Duration:** 3 weeks
- ⏳ Unit Testing
- ⏳ Integration Testing
- ⏳ End-to-End Testing
- ⏳ Performance Optimization
- ⏳ Security Hardening
- ⏳ Bug Fixes

### Phase 4: Deployment & Go-Live (⏳ Planned)
**Duration:** 2 weeks
- ⏳ Production Setup
- ⏳ Data Migration
- ⏳ User Training
- ⏳ Go-live Support
- ⏳ Monitoring & Maintenance

**Total Timeline:** 13 weeks

---

## 11. EXCLUSIONS & ASSUMPTIONS

### 11.1 CLEAR EXCLUSIONS

The following are explicitly **NOT included**:
- Mobile native applications
- Desktop applications (Electron)
- API for third-party integrations
- Advanced BI integration
- Multi-language support (initial)
- Custom workflow builders
- Payroll integration
- Attendance tracking
- Time tracking
- SSO/OAuth integration
- 2FA/MFA
- Advanced analytics
- Real-time notifications
- Offline mode
- SMS capabilities

### 11.2 ASSUMPTIONS

1. **User Base:** Organization has 100-5000+ employees
2. **Internet:** Users have reliable internet connectivity
3. **Browsers:** Users will use modern browsers
4. **Data:** Initial data migration can be manual or via bulk import
5. **Infrastructure:** Appwrite hosting is reliable and secure
6. **Support:** Organization will provide support to end users
7. **Training:** Organization will conduct user training
8. **Compliance:** Organization will implement compliance policies

---

## 12. SUCCESS CRITERIA

### 12.1 PROJECT SUCCESS METRICS

| Metric | Target | Status |
|--------|--------|--------|
| All core features implemented | 100% | ✅ Achieved |
| User acceptance testing pass rate | 95%+ | ⏳ Pending |
| System uptime | 99.5% | ⏳ Target |
| Page load time | < 3 seconds | ✅ Achieved |
| API response time | < 500ms | ✅ Achieved |
| Leave application processing time | < 5 minutes | ✅ Achieved |
| User satisfaction score | > 4/5 | ⏳ Target |
| Zero critical security issues | Yes | ✅ Achieved |
| Code test coverage | > 80% | ⏳ Target |
| Documentation completeness | 100% | ⏳ In progress |

---

## 13. CONSTRAINTS & LIMITATIONS

### 13.1 TECHNICAL CONSTRAINTS

| Constraint | Impact | Mitigation |
|-----------|--------|-----------|
| Appwrite dependency | Backend limitations | Use Appwrite best practices |
| Browser compatibility | Limited to modern browsers | Clear documentation |
| File size limits | Asset upload restrictions | Set limits in UI |
| Database query performance | Large dataset slowdown | Implement pagination |
| Free tier limits | API rate limiting | Plan for paid tier |

### 13.2 RESOURCE CONSTRAINTS

| Resource | Limitation | Plan |
|----------|-----------|------|
| Development team | Limited size | Prioritize core features |
| Timeline | 13-week target | Phase-wise delivery |
| Budget | Fixed scope | No premium features in Phase 1 |
| Infrastructure | Appwrite tier | Upgrade as needed |

---

## 14. CHANGE MANAGEMENT

### 14.1 SCOPE CHANGE PROCESS

Any feature requests or scope additions must follow:

1. **Request Submission** - Document in GitHub Issues
2. **Impact Analysis** - Assess timeline and resource impact
3. **Approval** - Get stakeholder approval
4. **Implementation** - Add to appropriate phase
5. **Documentation** - Update scope document

### 14.2 OUT-OF-SCOPE ADDITIONS (Post-Launch)

These are planned for Phase 2+ and will be evaluated:
- Mobile applications
- Advanced analytics
- Third-party integrations
- Multi-language support
- Advanced customization

---

## SUMMARY TABLE

| Category | Count | Status |
|----------|-------|--------|
| **Total Use Cases** | 90 | ✅ Defined |
| **API Endpoints** | 37 | 📋 Documented |
| **Core Modules** | 6 | ✅ Scoped |
| **User Roles** | 3 | ✅ Defined |
| **Data Entities** | 8 | ✅ Defined |
| **Features In-Scope** | 60+ | ✅ Included |
| **Features Out-of-Scope** | 25+ | 📋 Listed |
| **Phases** | 4 | 🔄 In Progress |

---

**Document Version:** 1.0  
**Last Updated:** 11 March 2026  
**Project:** Keeper Nest WebApp  
**Status:** Active Development
