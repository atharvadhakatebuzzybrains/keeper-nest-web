# 📊 Keeper Nest Webapp - Use Case Diagram

## Project Overview
**Keeper Nest** is an Enterprise Asset & Leave Management System with Role-based Access Control (Admin & Employee).

---

## 🎯 System Actors

### 1. **User** (Base Actor)
- Person interacting with the system

### 2. **Admin** (Specializes User)
- Super Admin with full system access
- Can manage employees, assets, and leave policies
- Can view all reports and analytics

### 3. **Employee** (Specializes User)
- Regular employee with restricted access
- Can view and manage own assets and leaves
- Cannot access admin functions

### 4. **System** (Internal)
- Automated processes (accrual, notifications)
- Scheduled jobs (year-end processing)

---

## 📋 Use Case Diagram (ASCII Representation)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    KEEPER NEST SYSTEM                                       │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                              │
│  ┌──────────────┐              ┌────────────────────────────────────────────┐              │
│  │   Employee   │              │        AUTHENTICATION & PROFILE             │              │
│  └──────┬───────┘              ├────────────────────────────────────────────┤              │
│         │                       │  • Login / Sign Up                         │              │
│         │                       │  • View / Edit Profile                     │              │
│         │                       │  • Change Password                         │              │
│         │                       │  • Forgot Password                         │              │
│         │                       └────────────────────────────────────────────┘              │
│         │                                        ▲                                          │
│         │                                        │                                          │
│         └────────────────────────────────────────┤                                          │
│                                                  │                                          │
│  ┌──────────────┐                               │                                          │
│  │    Admin     │───────────────────────────────┤                                          │
│  └──────┬───────┘                               │                                          │
│         │                                        │                                          │
│         │          ┌──────────────────────────────────────────────────────┐               │
│         │          │      EMPLOYEE MANAGEMENT (Admin Only)                │               │
│         │          ├──────────────────────────────────────────────────────┤               │
│         │          │  • Add / Edit / Delete Employees                    │               │
│         │          │  • View Employee List with Filters                  │               │
│         │          │  • Assign Roles (Admin/Employee)                    │               │
│         │          │  • Manage Department Assignments                    │               │
│         │          │  • Reset Employee Password                          │               │
│         │          └──────────────────────────────────────────────────────┘               │
│         │                                                                                   │
│         │          ┌──────────────────────────────────────────────────────┐               │
│         │          │      ASSET MANAGEMENT (Admin & Employee)             │               │
│         │          ├──────────────────────────────────────────────────────┤               │
│         │          │  ┌─ ADMIN FUNCTIONS (Asset Inventory)              │               │
│         │          │  │  • Add New Assets                                │               │
│         │          │  │  • Edit Asset Details                            │               │
│         │          │  │  • Delete Assets                                 │               │
│         │          │  │  • View All Assets                               │               │
│         │          │  │  • Assign Assets to Employees                    │               │
│         │          │  │  • Track Asset Status                            │               │
│         │          │  └                                                   │               │
│         │          │  ┌─ EMPLOYEE FUNCTIONS (Asset Management)          │               │
│         │          │  │  • View Assigned Assets                          │               │
│         │          │  │  • View Asset Details                            │               │
│         │          │  │  • Generate Asset Reports                        │               │
│         │          │  └                                                   │               │
│         │          └──────────────────────────────────────────────────────┘               │
│         │                                                                                   │
│         │          ┌──────────────────────────────────────────────────────┐               │
│         │          │   LEAVE MANAGEMENT (Admin & Employee)                │               │
│         │          ├──────────────────────────────────────────────────────┤               │
│         │          │  ┌─ LEAVE POLICY (Admin Only)                       │               │
│         │          │  │  • Create Leave Types                             │               │
│         │          │  │  • Edit Leave Types                               │               │
│         │          │  │  • Delete Leave Types                             │               │
│         │          │  │  • Configure Credit Rules (Yearly/Monthly)        │               │
│         │          │  │  • Configure Consumption Rules                    │               │
│         │          │  │  • Configure Year-End Rules                       │               │
│         │          │  │  • Set Carry Forward Limits                       │               │
│         │          │  │  • Enable/Disable Leave Types                     │               │
│         │          │  │  • Assign to Employees/Departments/Roles          │               │
│         │          │  └                                                   │               │
│         │          │  ┌─ EMPLOYEE LEAVE MANAGEMENT                      │               │
│         │          │  │  • Apply for Leave                                │               │
│         │          │  │  • View Leave Balance                             │               │
│         │          │  │  • View Leave History                             │               │
│         │          │  │  • View Accrual History                           │               │
│         │          │  │  • Withdraw Application                           │               │
│         │          │  └                                                   │               │
│         │          │  ┌─ LEAVE APPROVAL (Admin/Manager)                 │               │
│         │          │  │  • View Pending Approvals                         │               │
│         │          │  │  • Approve Leave Requests                         │               │
│         │          │  │  • Reject Leave Requests                          │               │
│         │          │  │  • Add Approval Comments                          │               │
│         │          │  │  • Bulk Approval Actions                          │               │
│         │          │  └                                                   │               │
│         │          └──────────────────────────────────────────────────────┘               │
│         │                                                                                   │
│         │          ┌──────────────────────────────────────────────────────┐               │
│         │          │   REPORTING & ANALYTICS (Admin Only)                 │               │
│         │          ├──────────────────────────────────────────────────────┤               │
│         │          │  • Leave Summary Report                              │               │
│         │          │  • Employee Leave Usage Report                       │               │
│         │          │  • Department Analytics                              │               │
│         │          │  • Compliance Report                                 │               │
│         │          │  • Asset Utilization Report                          │               │
│         │          │  • Department-wise Leave Statistics                  │               │
│         │          └──────────────────────────────────────────────────────┘               │
│         │                                                                                   │
│         │          ┌──────────────────────────────────────────────────────┐               │
│         │          │   SYSTEM OPERATIONS (Automated)                      │               │
│         │          ├──────────────────────────────────────────────────────┤               │
│         │          │  • Monthly Leave Accrual Processing                  │               │
│         │          │  • Yearly Leave Accrual Processing                   │               │
│         │          │  • Carry Forward Processing                          │               │
│         │          │  • Encashment Processing                             │               │
│         │          │  • Send Approval Reminders                           │               │
│         │          │  • Leave Expiration Notifications                    │               │
│         │          └──────────────────────────────────────────────────────┘               │
│         │                                                                                   │
│         └────────────────────────────────────────────────────────────────────────────────┘
│                                                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📑 Detailed Use Cases by Module

### **1. AUTHENTICATION & PROFILE MANAGEMENT**

| Use Case | Actor | Description |
|----------|-------|-------------|
| UC-1 | User | Login to system with email/password |
| UC-2 | User | Sign up new account |
| UC-3 | User | View own profile details |
| UC-4 | User | Edit profile information |
| UC-5 | User | Change password |
| UC-6 | User | Reset forgotten password via email |
| UC-7 | User | Logout from system |

**Pre-conditions:**
- System is accessible
- Valid credentials required for login

**Post-conditions:**
- User authenticated and session created
- User can access role-based features

---

### **2. EMPLOYEE MANAGEMENT (Admin Only)**

| Use Case | Actor | Description |
|----------|-------|-------------|
| UC-8 | Admin | Add new employee with details |
| UC-9 | Admin | Edit employee information |
| UC-10 | Admin | Delete employee from system |
| UC-11 | Admin | View list of all employees |
| UC-12 | Admin | Search/filter employees (by name, dept, role) |
| UC-13 | Admin | Assign role (Admin/Employee) |
| UC-14 | Admin | Assign department |
| UC-15 | Admin | Reset employee password |
| UC-16 | Admin | Deactivate/Activate employee |
| UC-17 | Admin | View employee details |

**Pre-conditions:**
- User must be Admin
- Employee data must be valid

**Post-conditions:**
- Employee record created/updated/deleted
- Audit log updated

---

### **3. ASSET MANAGEMENT**

#### **Admin Functions**
| Use Case | Actor | Description |
|----------|-------|-------------|
| UC-18 | Admin | Add new asset to inventory |
| UC-19 | Admin | Edit asset details |
| UC-20 | Admin | Delete asset from system |
| UC-21 | Admin | View complete asset inventory |
| UC-22 | Admin | Assign asset to employee |
| UC-23 | Admin | Reassign asset to different employee |
| UC-24 | Admin | Update asset status (Active/Inactive/Damaged) |
| UC-25 | Admin | Track asset allocation history |
| UC-26 | Admin | Generate asset list report |
| UC-27 | Admin | Search assets by name/category/status |

#### **Employee Functions**
| Use Case | Actor | Description |
|----------|-------|-------------|
| UC-28 | Employee | View assigned assets |
| UC-29 | Employee | View asset details |
| UC-30 | Employee | View asset assignment history |
| UC-31 | Employee | Generate personal asset report |

**Pre-conditions:**
- Asset information must be complete
- Employee must exist for assignment
- Asset must be available for assignment

**Post-conditions:**
- Asset record created/updated/deleted
- Asset allocation tracked

---

### **4. LEAVE MANAGEMENT**

#### **A. Leave Policy Configuration (Admin Only)**

| Use Case | Actor | Description |
|----------|-------|-------------|
| UC-32 | Admin | Create new leave type |
| UC-33 | Admin | Edit leave type configuration |
| UC-34 | Admin | Delete leave type |
| UC-35 | Admin | View all leave types |
| UC-36 | Admin | Configure credit rules (Yearly/Monthly Accrual/Not Applicable) |
| UC-37 | Admin | Set total days per year |
| UC-38 | Admin | Set credit date (Jan 1st/Apr 1st/Custom) |
| UC-39 | Admin | Configure consumption rules (Max days per application, etc.) |
| UC-40 | Admin | Set unlimited option for rules |
| UC-41 | Admin | Configure year-end rules (Carry Forward/Encashment) |
| UC-42 | Admin | Set carry forward limits |
| UC-43 | Admin | Configure special rules (Half day allowed, count weekends, etc.) |
| UC-44 | Admin | Activate/Deactivate leave type |
| UC-45 | Admin | Assign leave type to all/selected employees |
| UC-46 | Admin | Assign leave type by department |
| UC-47 | Admin | Assign leave type by role |

**Pre-conditions:**
- Leave type name and code must be unique
- Configuration must follow business rules

**Post-conditions:**
- Leave policy created/updated
- Changes effective from specified date

---

#### **B. Employee Leave Management**

| Use Case | Actor | Description |
|----------|-------|-------------|
| UC-48 | Employee | Apply for leave |
| UC-49 | Employee | Specify leave type |
| UC-50 | Employee | Select start and end date |
| UC-51 | Employee | Choose day type (Full/Half day) |
| UC-52 | Employee | Add leave reason/comments |
| UC-53 | Employee | View leave balance summary |
| UC-54 | Employee | View detailed accrual history |
| UC-55 | Employee | View monthly accrual details |
| UC-56 | Employee | View leave application history |
| UC-57 | Employee | View approved leaves |
| UC-58 | Employee | View rejected leaves |
| UC-59 | Employee | View pending leaves |
| UC-60 | Employee | Withdraw leave application (Draft status) |
| UC-61 | Employee | View leave policy details |

**Pre-conditions:**
- Employee must have eligible leave balance
- Leave type must be applicable to employee
- Dates must follow consumption rules
- Manager approval required if configured

**Post-conditions:**
- Leave application created in "Pending" status
- Notification sent to manager
- Leave balance updated after approval

---

#### **C. Leave Approval Workflow**

| Use Case | Actor | Description |
|----------|-------|-------------|
| UC-62 | Admin/Manager | View pending leave approvals |
| UC-63 | Admin/Manager | Review leave application details |
| UC-64 | Admin/Manager | Approve leave request |
| UC-65 | Admin/Manager | Reject leave request with reason |
| UC-66 | Admin/Manager | Add approval comments |
| UC-67 | Admin/Manager | Perform bulk approvals |
| UC-68 | Admin/Manager | Perform bulk rejections |
| UC-69 | Admin/Manager | View approval history |

**Pre-conditions:**
- Leave application must be in "Pending" status
- Approver must have sufficient authority
- Leave must not violate policy rules

**Post-conditions:**
- Leave status updated (Approved/Rejected)
- Employee notified of decision
- Leave balance updated accordingly

---

#### **D. Automated Leave Processing**

| Use Case | Actor | Description |
|----------|-------|-------------|
| UC-70 | System | Process monthly leave accrual |
| UC-71 | System | Process yearly leave accrual |
| UC-72 | System | Apply leave deductions for approved leaves |
| UC-73 | System | Process carry forward at year-end |
| UC-74 | System | Process encashment calculations |
| UC-75 | System | Update leave balance after approval |
| UC-76 | System | Send leave balance notifications |
| UC-77 | System | Send approval reminder notifications |
| UC-78 | System | Validate leave against policy rules |
| UC-79 | System | Calculate leave days (excluding weekends/holidays) |

**Pre-conditions:**
- Scheduled job triggered at configured time
- Employee eligibility determined

**Post-conditions:**
- Leave balance updated
- Notifications sent to relevant users

---

### **5. REPORTING & ANALYTICS (Admin Only)**

| Use Case | Actor | Description |
|----------|-------|-------------|
| UC-80 | Admin | View leave summary report |
| UC-81 | Admin | View employee leave usage report |
| UC-82 | Admin | View department-wise analytics |
| UC-83 | Admin | View compliance report |
| UC-84 | Admin | View asset utilization report |
| UC-85 | Admin | Filter reports by date range |
| UC-86 | Admin | Filter reports by department |
| UC-87 | Admin | Filter reports by employee |
| UC-88 | Admin | Export reports (PDF/Excel) |
| UC-89 | Admin | View leave policy effectiveness |
| UC-90 | Admin | View approval pending count |

**Pre-conditions:**
- User must be Admin
- Sufficient data must exist

**Post-conditions:**
- Report generated and displayed
- Data can be exported

---

## 🔄 System Workflows

### **Leave Application Flow**
```
Employee Applies
    ↓
System Validates Rules
    ├─ Check: Is leave type applicable?
    ├─ Check: Is employee eligible?
    ├─ Check: Does employee have balance?
    ├─ Check: Are dates valid?
    └─ Check: Do dates violate consumption rules?
    ↓
Create Application (Pending)
    ↓
Notify Manager for Approval
    ↓
Manager Reviews
    ├─ Approve → Update balance, Notify Employee
    └─ Reject → Revert status, Notify Employee
    ↓
Application Closed
```

### **Leave Accrual Flow**
```
Scheduled Job Trigger (Monthly/Yearly)
    ↓
Fetch All Employees
    ↓
For Each Employee:
    ├─ Check: Is employee eligible?
    ├─ Check: Is employee on probation?
    ├─ Calculate: Accrual amount
    └─ Update: Leave balance
    ↓
Process Year-End (If Yearly):
    ├─ Process Carry Forward
    ├─ Process Encashment
    └─ Generate Reports
    ↓
Notification Sent
```

---

## 👥 Actor Relationships

```
┌─────────────────┐
│      User       │  (Base Actor)
└────────┬────────┘
         │
         ├──────────────┬──────────────┐
         │              │              │
         ▼              ▼              ▼
    ┌────────┐    ┌─────────┐    ┌────────┐
    │ Admin  │    │Employee │    │ System │
    └────────┘    └─────────┘    └────────┘
```

---

## 🎯 Use Case Statistics

| Category | Count |
|----------|-------|
| Authentication & Profile | 7 |
| Employee Management | 10 |
| Asset Management | 14 |
| Leave Policy | 16 |
| Employee Leave Apps | 14 |
| Leave Approval | 8 |
| Leave Processing | 10 |
| Reporting & Analytics | 11 |
| **Total Use Cases** | **90** |

---

## 📊 Module Interaction Matrix

```
┌──────────────┬────────────────────────────────────────────────┐
│   Module     │         Interacts With                         │
├──────────────┼────────────────────────────────────────────────┤
│ Auth         │ Profile, Employee Mgmt, All Modules            │
│ Employee     │ Auth, Asset, Leave, Reporting                  │
│ Asset        │ Employee, Admin Dashboard                      │
│ Leave        │ Employee, Admin, System (accrual), Reporting   │
│ Reporting    │ All Modules (read-only)                        │
│ System Jobs  │ Leave Management (accrual/notifications)       │
└──────────────┴────────────────────────────────────────────────┘
```

---

## 🔐 Access Control Matrix

| Function | Employee | Admin | Super Admin |
|----------|----------|-------|------------|
| View Own Profile | ✅ | ✅ | ✅ |
| View All Employees | ❌ | ✅ | ✅ |
| Manage Employees | ❌ | ✅ | ✅ |
| View Own Assets | ✅ | ✅ | ✅ |
| Manage Assets | ❌ | ✅ | ✅ |
| Apply for Leave | ✅ | ✅ | ✅ |
| Create Leave Type | ❌ | ✅ | ✅ |
| Approve Leaves | ❌ | ✅ | ✅ |
| View Reports | ❌ | ✅ | ✅ |
| Manage System Settings | ❌ | ❌ | ✅ |

---

## 📝 Notes

- **Color Legend:** 
  - 🔵 Core Functionality
  - 🟢 Employee Features
  - 🔴 Admin Features
  - 🟡 Automated/System Features

- **Key Features:**
  - Role-based access control (RBAC)
  - Policy-driven leave management
  - Automated accrual and processing
  - Comprehensive reporting
  - Asset allocation tracking

---

**Created:** 11 March 2026  
**Version:** 1.0  
**Project:** Keeper Nest - Enterprise Asset & Leave Management
