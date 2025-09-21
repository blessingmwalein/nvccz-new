# Payroll Module - Complete End-to-End Test Plan

## Overview
This document outlines the comprehensive test plan for the payroll module implementation, covering all APIs, UI components, and workflows.

## Test Environment Setup
- **Base URL**: `https://nvccz-pi.vercel.app/api`
- **Frontend**: `http://localhost:3000/payroll`
- **Authentication**: Bearer token required for all API calls

## 1. Setup Phase Testing

### 1.1 Tax Rules Management
**API Endpoints:**
- `GET /api/payroll/tax-rules` - List all tax rules
- `POST /api/payroll/tax-rules` - Create new tax rule
- `PUT /api/payroll/tax-rules/{id}` - Update tax rule
- `DELETE /api/payroll/tax-rules/{id}` - Delete tax rule

**Test Cases:**

#### Test Case 1.1.1: Create PAYE Tax Rule
1. Navigate to Payroll Dashboard
2. Click "Create" button in Tax Rules section
3. Fill form:
   - Name: "PAYE Tax - USD"
   - Type: "PAYE"
   - Rate: 20.0
   - Threshold: 500.0
   - Effective Date: 2024-01-01
   - Currency: USD
4. Submit form
5. **Expected**: Tax rule created successfully, appears in table

#### Test Case 1.1.2: Create NSSA Contribution
1. Click "Create" button in Tax Rules section
2. Fill form:
   - Name: "NSSA Contribution - USD"
   - Type: "NSSA"
   - Rate: 4.5
   - Ceiling: 1000.0
   - Effective Date: 2024-01-01
   - Currency: USD
3. Submit form
4. **Expected**: NSSA rule created successfully

#### Test Case 1.1.3: Create AIDS Levy
1. Click "Create" button in Tax Rules section
2. Fill form:
   - Name: "AIDS Levy - USD"
   - Type: "AIDS_LEVY"
   - Rate: 3.0
   - Effective Date: 2024-01-01
   - Currency: USD
3. Submit form
4. **Expected**: AIDS Levy rule created successfully

#### Test Case 1.1.4: Edit Tax Rule
1. Click "Edit" button on any tax rule
2. Modify rate from 20.0 to 25.0
3. Submit form
4. **Expected**: Tax rule updated successfully

#### Test Case 1.1.5: Delete Tax Rule
1. Click "Delete" button on any tax rule
2. Confirm deletion
3. **Expected**: Tax rule removed from table

### 1.2 Allowance Types Management
**API Endpoints:**
- `GET /api/payroll/allowance-types` - List all allowance types
- `POST /api/payroll/allowance-types` - Create new allowance type
- `PUT /api/payroll/allowance-types/{id}` - Update allowance type
- `DELETE /api/payroll/allowance-types/{id}` - Delete allowance type

**Test Cases:**

#### Test Case 1.2.1: Create Housing Allowance
1. Navigate to Allowance Types section
2. Click "Create" button
3. Fill form:
   - Name: "Housing Allowance"
   - Code: "HOUSING"
   - Description: "Monthly housing allowance"
   - Taxable: Yes
4. Submit form
5. **Expected**: Allowance type created successfully

#### Test Case 1.2.2: Create Transport Allowance
1. Click "Create" button
2. Fill form:
   - Name: "Transport Allowance"
   - Code: "TRANSPORT"
   - Description: "Monthly transport allowance"
   - Taxable: No
3. Submit form
4. **Expected**: Non-taxable allowance created

#### Test Case 1.2.3: Create Medical Allowance
1. Click "Create" button
2. Fill form:
   - Name: "Medical Allowance"
   - Code: "MEDICAL"
   - Description: "Monthly medical allowance"
   - Taxable: Yes
3. Submit form
4. **Expected**: Medical allowance created

### 1.3 Deduction Types Management
**API Endpoints:**
- `GET /api/payroll/deduction-types` - List all deduction types
- `POST /api/payroll/deduction-types` - Create new deduction type
- `PUT /api/payroll/deduction-types/{id}` - Update deduction type
- `DELETE /api/payroll/deduction-types/{id}` - Delete deduction type

**Test Cases:**

#### Test Case 1.3.1: Create Staff Loan Deduction
1. Navigate to Deduction Types section
2. Click "Create" button
3. Fill form:
   - Name: "Staff Loan"
   - Code: "LOAN"
   - Description: "Monthly loan repayment"
   - Statutory: No
4. Submit form
5. **Expected**: Voluntary deduction created

#### Test Case 1.3.2: Create Pension Contribution
1. Click "Create" button
2. Fill form:
   - Name: "Pension Contribution"
   - Code: "PENSION"
   - Description: "Monthly pension contribution"
   - Statutory: Yes
3. Submit form
4. **Expected**: Statutory deduction created

### 1.4 Bank File Templates Management
**API Endpoints:**
- `GET /api/payroll/bank-templates` - List all bank templates
- `POST /api/payroll/bank-templates` - Create new bank template
- `PUT /api/payroll/bank-templates/{id}` - Update bank template
- `DELETE /api/payroll/bank-templates/{id}` - Delete bank template

**Test Cases:**

#### Test Case 1.4.1: Create Standard Bank Template
1. Navigate to Bank Templates section
2. Click "Create" button
3. Fill form:
   - Name: "Standard Bank Template"
   - Bank Name: "Standard Bank"
   - Delimiter: ","
   - Has Header: Yes
   - Column Order: Employee Name, Bank Name, Branch Code, Account Number, Payment Amount, Payment Reference
4. Submit form
5. **Expected**: Bank template created with preview

## 2. Employee Setup Testing

### 2.1 Employee Management
**API Endpoints:**
- `GET /api/payroll/employees` - List all employees
- `POST /api/payroll/employees` - Create new employee
- `PUT /api/payroll/employees/{id}` - Update employee
- `DELETE /api/payroll/employees/{id}` - Delete employee

**Test Cases:**

#### Test Case 2.1.1: Create Employee
1. Navigate to Employees section
2. Click "Create" button
3. Fill form:
   - User: Select from dropdown
   - Bank Name: "Standard Bank"
   - Branch Code: "001"
   - Account Number: "1234567890"
   - Basic Salary: 2500.00
   - Currency: USD
4. Submit form
5. **Expected**: Employee created with auto-generated employee number

#### Test Case 2.1.2: Edit Employee
1. Click "Edit" button on any employee
2. Update basic salary to 3000.00
3. Submit form
4. **Expected**: Employee updated successfully

#### Test Case 2.1.3: View Employee Details
1. Click "View" button on any employee
2. **Expected**: Half-side drawer opens with employee details in tabs

## 3. Payroll Processing Testing

### 3.1 Payroll Runs Management
**API Endpoints:**
- `GET /api/payroll/payroll-runs` - List all payroll runs
- `POST /api/payroll/payroll-runs` - Create new payroll run
- `PUT /api/payroll/payroll-runs/{id}` - Update payroll run
- `DELETE /api/payroll/payroll-runs/{id}` - Delete payroll run

**Test Cases:**

#### Test Case 3.1.1: Create Payroll Run
1. Navigate to Payroll Runs section
2. Click "Create" button
3. Fill form:
   - Name: "August 2024 Payroll"
   - Pay Group: Select from dropdown
   - Period Start: 2024-08-01
   - Period End: 2024-08-31
   - Payout Date: 2024-08-28
4. Submit form
5. **Expected**: Payroll run created in DRAFT status

#### Test Case 3.1.2: Process Payroll Run
1. Click "Process" button on draft payroll run
2. **Expected**: Payroll calculations performed, payslips generated

#### Test Case 3.1.3: Generate Bank File
1. Click "Generate Bank File" button
2. Select bank template
3. **Expected**: Bank file generated and downloaded

### 3.2 Payslips Management
**API Endpoints:**
- `GET /api/payroll/payslips` - List all payslips
- `GET /api/payroll/payslips?payRunId={id}` - Get payslips by pay run
- `GET /api/payroll/payslips?employeeId={id}` - Get payslips by employee

**Test Cases:**

#### Test Case 3.2.1: View Payslips
1. Navigate to Payslips section
2. **Expected**: All payslips displayed in table with sorting/filtering

#### Test Case 3.2.2: View Payslip Details
1. Click "View" button on any payslip
2. **Expected**: Half-side drawer opens with payslip details

## 4. Employee Portal Testing

### 4.1 Employee Self-Service
**Test Cases:**

#### Test Case 4.1.1: Employee Login
1. Navigate to employee portal
2. Login with employee credentials
3. **Expected**: Employee dashboard loads

#### Test Case 4.1.2: View Payslips
1. Click "My Payslips" in employee portal
2. **Expected**: Employee's payslips displayed

#### Test Case 4.1.3: Download Payslip
1. Click "Download" on any payslip
2. **Expected**: PDF payslip downloaded

## 5. UI/UX Testing

### 5.1 Data Tables Testing
**Test Cases:**

#### Test Case 5.1.1: Sorting
1. Click on any column header
2. **Expected**: Data sorted by that column

#### Test Case 5.1.2: Filtering
1. Use search box to filter data
2. Use filter dropdowns
3. **Expected**: Data filtered correctly

#### Test Case 5.1.3: Pagination
1. Navigate through pages
2. **Expected**: Data loads correctly on each page

#### Test Case 5.1.4: Bulk Actions
1. Select multiple rows using checkboxes
2. Select bulk action from dropdown
3. **Expected**: Action applied to selected rows

#### Test Case 5.1.5: Export
1. Click "Export" button
2. **Expected**: CSV file downloaded with current filtered data

### 5.2 Forms Testing
**Test Cases:**

#### Test Case 5.2.1: Form Validation
1. Submit form with empty required fields
2. **Expected**: Validation errors displayed

#### Test Case 5.2.2: Dynamic Form Fields
1. Change tax type in tax rule form
2. **Expected**: Form fields update based on selection

#### Test Case 5.2.3: Form Reset
1. Fill form partially
2. Click "Cancel"
3. Reopen form
4. **Expected**: Form is empty/reset

### 5.3 Drawers Testing
**Test Cases:**

#### Test Case 5.3.1: Half-Side Drawer
1. Click "View" on any record
2. **Expected**: Half-side drawer opens with details

#### Test Case 5.3.2: Tabbed Content
1. Navigate between tabs in drawer
2. **Expected**: Content loads correctly in each tab

#### Test Case 5.3.3: Drawer Close
1. Click outside drawer or close button
2. **Expected**: Drawer closes

## 6. Performance Testing

### 6.1 Loading States
**Test Cases:**

#### Test Case 6.1.1: Skeleton Loaders
1. Navigate to payroll page
2. **Expected**: Skeleton loaders shown while data loads

#### Test Case 6.1.2: API Loading States
1. Perform any API operation
2. **Expected**: Loading indicators shown during API calls

### 6.2 Error Handling
**Test Cases:**

#### Test Case 6.1.1: API Errors
1. Disconnect network
2. Perform API operation
3. **Expected**: Error message displayed

#### Test Case 6.1.2: Form Errors
1. Submit invalid form data
2. **Expected**: Validation errors displayed

## 7. Integration Testing

### 7.1 Complete Workflow
**Test Case 7.1.1: End-to-End Payroll Process**
1. Create tax rules (PAYE, NSSA, AIDS Levy)
2. Create allowance types (Housing, Transport, Medical)
3. Create deduction types (Loan, Pension)
4. Create bank template
5. Create employees
6. Create payroll run
7. Process payroll run
8. Generate bank file
9. View payslips
10. **Expected**: Complete workflow functions correctly

## 8. Security Testing

### 8.1 Authentication
**Test Cases:**

#### Test Case 8.1.1: Unauthorized Access
1. Access payroll without authentication
2. **Expected**: Redirected to login

#### Test Case 8.1.2: Token Expiry
1. Use expired token
2. **Expected**: Redirected to login

## 9. Browser Compatibility Testing

### 9.1 Supported Browsers
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 10. Mobile Responsiveness Testing

### 10.1 Mobile Devices
- iPhone (various sizes)
- Android (various sizes)
- Tablet (iPad, Android tablets)

## Test Data Requirements

### Sample Tax Rules
- PAYE Tax - USD (20%, threshold: $500)
- NSSA Contribution - USD (4.5%, ceiling: $1000)
- AIDS Levy - USD (3%)

### Sample Allowance Types
- Housing Allowance (HOUSING, taxable)
- Transport Allowance (TRANSPORT, non-taxable)
- Medical Allowance (MEDICAL, taxable)

### Sample Deduction Types
- Staff Loan (LOAN, voluntary)
- Pension Contribution (PENSION, statutory)

### Sample Bank Templates
- Standard Bank Template (comma-delimited, with header)
- CBZ Template (semicolon-delimited, no header)

### Sample Employees
- John Doe (EMP001, $2500 basic salary)
- Jane Smith (EMP002, $3000 basic salary)
- Bob Johnson (EMP003, $2000 basic salary)

## Success Criteria

1. All API endpoints respond correctly
2. All forms validate input properly
3. All data tables sort, filter, and paginate correctly
4. All drawers open and display data correctly
5. All bulk actions work as expected
6. All export functions work correctly
7. Complete payroll workflow functions end-to-end
8. UI is responsive across all devices
9. Loading states and error handling work properly
10. Authentication and security work correctly

## Test Execution

1. **Setup Phase**: Execute test cases 1.1-1.4
2. **Employee Setup**: Execute test cases 2.1
3. **Payroll Processing**: Execute test cases 3.1-3.2
4. **Employee Portal**: Execute test cases 4.1
5. **UI/UX Testing**: Execute test cases 5.1-5.3
6. **Performance Testing**: Execute test cases 6.1-6.2
7. **Integration Testing**: Execute test case 7.1
8. **Security Testing**: Execute test cases 8.1
9. **Browser Compatibility**: Execute test cases 9.1
10. **Mobile Responsiveness**: Execute test cases 10.1

## Bug Reporting

When reporting bugs, include:
1. Test case number
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots/videos
6. Browser/device information
7. Console errors (if any)

## Test Completion Criteria

The payroll module is considered complete when:
1. All test cases pass
2. No critical bugs remain
3. Performance meets requirements
4. UI/UX is polished and responsive
5. Complete end-to-end workflow functions correctly
