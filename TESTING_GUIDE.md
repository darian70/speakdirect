# SpeakDirect Testing Guide

This guide provides step-by-step instructions for testing all features of the SpeakDirect platform.

## Prerequisites

- Platform running locally or deployed to staging
- Test Twilio account with a phone number
- Test Stripe account (use test mode)
- Your personal phone number for testing calls
- Test email account

## Testing Checklist

### 1. Authentication & User Management

#### Sign Up Flow

1. Go to the web app URL (e.g., `http://localhost:2001` or `https://app.speakdirect.xyz`)
2. Click "Sign Up"
3. Enter test credentials:
   - Email: `test@example.com`
   - Password: Strong password
4. Verify email confirmation (check email)
5. Complete onboarding if prompted
6. **Expected**: User is logged in and sees dashboard

#### Sign In Flow

1. Log out of the application
2. Go to sign in page
3. Enter credentials
4. **Expected**: Successfully logs in and redirects to dashboard

#### Password Reset

1. Click "Forgot Password?"
2. Enter email address
3. Check email for reset link
4. Click link and set new password
5. **Expected**: Can log in with new password

### 2. Dashboard & Navigation

#### Dashboard Overview

1. Navigate to Dashboard
2. Verify displays:
   - Active agents count
   - Messages/minutes this month
   - Current plan information
   - Quick action buttons
3. **Expected**: All stats load correctly

#### Navigation

1. Test navigation between pages:
   - Dashboard
   - Calls
   - Agents
   - Technicians (if on Growth+ plan)
   - Analytics
   - Settings
   - Billing
2. **Expected**: All pages load without errors

### 3. Agent Management

#### Create Agent

1. Navigate to Agents page
2. Click "Create Agent"
3. Fill in form:
   - Name: "Test Support Agent"
   - Channel: Chat (or Voice if on Growth+)
   - Initial prompt: "You are a helpful assistant"
4. Click "Create"
5. **Expected**: Agent appears in agents list

#### Configure Agent

1. Click on newly created agent
2. Go to Configure
3. Update settings:
   - System Prompt: Add detailed instructions
   - Voice Settings: Choose voice provider and ID
   - Temperature: Adjust slider
   - Max Tokens: Set limit
4. Click "Save Changes"
5. **Expected**: Settings saved successfully

#### Delete Agent

1. Go to agent configuration
2. Click "Delete Agent"
3. Confirm deletion
4. **Expected**: Agent removed from list

### 4. Technician Work Order Flow (Growth+ Plan)

#### Submit Work Order

1. Navigate to Technicians page
2. Fill out work order form:
   - Customer Name: "John Smith"
   - Customer Phone: YOUR_TEST_PHONE_NUMBER
   - Vehicle: "2020 Honda Accord"
   - Service Performed: "Oil change, tire rotation"
   - Total Cost: "$85.00"
   - Notes: "Customer requested synthetic oil"
   - Requires Approval: Check if needed
3. Click "Call Customer Now"
4. **Expected**: 
   - Success message appears
   - Call SID displayed
   - Call appears in history

#### Receive Call

1. Wait for your phone to ring (should be within 30 seconds)
2. Answer the call
3. **Expected**:
   - Call is from your Twilio number
   - AI agent speaks with work order details
   - Can have natural conversation
   - Agent provides all relevant information

### 5. Call Management

#### View Calls List

1. Navigate to Calls page
2. **Expected**:
   - Recent calls displayed
   - Shows time, direction, from/to, status, duration
   - Calls are sorted by most recent

#### View Call Details

1. Click on a call from the list
2. **Expected**:
   - Full call overview displayed
   - Work order details shown (if applicable)
   - Call events timeline visible
   - Transcript displayed (if available)
   - Recording link works (if recording enabled)

#### Test Call Transcript

1. Find a completed call with transcript
2. Verify transcript shows:
   - Speaker identification (AI Agent vs Customer)
   - Timestamps
   - Full conversation text
3. **Expected**: Transcript is accurate and readable

### 6. Phone Number Management

#### Add Phone Number

1. Go to Settings → Phone Numbers (or dedicated page)
2. Click "Add Number"
3. Enter Twilio number in E.164 format: `+15551234567`
4. Add label: "Main Support Line"
5. Click "Add Number"
6. **Expected**: Number appears in list

#### Configure Twilio Webhook

1. Go to Twilio Console
2. Find your phone number
3. Under Voice Configuration:
   - Set webhook URL: `https://your-api-url/twilio/voice/inbound`
   - Method: POST
4. Save
5. **Expected**: Webhook saves successfully

#### Test Inbound Call

1. Call your Twilio number from any phone
2. **Expected**:
   - Call is answered by AI agent
   - Agent speaks greeting
   - Can have conversation
   - Call logs in dashboard

### 7. Billing & Subscriptions

#### View Current Plan

1. Navigate to Billing page
2. **Expected**:
   - Current plan displayed
   - Features list shown
   - Usage stats visible
   - "Manage Subscription" button works

#### Upgrade Plan (Test Mode)

1. Click "Upgrade Plan" or similar
2. Select higher tier (Growth or Pro)
3. Enter test card: `4242 4242 4242 4242`
4. Complete checkout
5. **Expected**:
   - Subscription created
   - Plan updates in dashboard
   - Features unlock automatically

#### Access Billing Portal

1. Click "Manage Subscription" button
2. **Expected**:
   - Redirects to Stripe Customer Portal
   - Can view invoices
   - Can update payment method
   - Can cancel subscription

### 8. Admin Panel

#### Access Admin Dashboard

1. Go to admin panel URL (e.g., `http://localhost:2100`)
2. Sign in with admin credentials
3. **Expected**: Admin dashboard loads

#### Manage Tenants

1. Navigate to Tenants page
2. View list of all organizations
3. Click on a tenant
4. **Expected**:
   - Tenant details displayed
   - Can view agents
   - Can view usage
   - Can modify settings

#### Monitor Usage

1. Navigate to Usage page
2. **Expected**:
   - Usage events listed
   - Can filter by tenant
   - Shows messages, minutes, calls

### 9. Error Handling

#### Test Invalid Phone Number

1. Go to Technicians page
2. Enter invalid phone: "123"
3. Try to initiate call
4. **Expected**: Clear error message displayed

#### Test Network Error

1. Disconnect from internet
2. Try to load dashboard
3. **Expected**: User-friendly error message

#### Test Unauthorized Access

1. Log out
2. Try to access `/agents` directly
3. **Expected**: Redirects to sign-in page

### 10. Performance Testing

#### Page Load Times

1. Use browser DevTools Network tab
2. Measure page load times:
   - Dashboard: Should load in < 2 seconds
   - Calls list: Should load in < 2 seconds
   - Call details: Should load in < 3 seconds
3. **Expected**: Pages load quickly

#### API Response Times

1. Open browser DevTools Network tab
2. Monitor API calls
3. **Expected**:
   - Most API calls < 200ms
   - Database queries < 100ms
   - No failed requests

### 11. Mobile Responsiveness

#### Test on Mobile Device

1. Open app on mobile browser (or use DevTools device emulation)
2. Test all pages:
   - Dashboard
   - Agents
   - Calls
   - Forms
3. **Expected**:
   - All pages responsive
   - Forms are usable
   - Navigation works
   - Touch targets are appropriately sized

### 12. Cross-Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

For each browser:
1. Sign in
2. Navigate through app
3. Create agent
4. View calls
5. **Expected**: Works consistently across all browsers

## Regression Testing

Before each release, run through:

1. **Critical Path**: Sign up → Create agent → Make call → View call details
2. **Billing Path**: Sign up → View plan → Upgrade → Downgrade
3. **Admin Path**: Admin login → View tenants → Monitor usage

## Load Testing

### Simulate Multiple Users

Use tools like Apache Bench or Artillery:

```bash
# Test API health endpoint
ab -n 1000 -c 10 https://api.speakdirect.xyz/health

# Test dashboard loading
ab -n 100 -c 5 https://app.speakdirect.xyz/dashboard
```

**Expected**:
- API can handle 100+ requests/minute
- No 5xx errors
- Response times remain consistent

## Security Testing

### Authentication

- [ ] Can't access protected routes without login
- [ ] Can't access other tenants' data
- [ ] Session expires after logout
- [ ] Password reset tokens expire

### API Security

- [ ] API requires valid authentication
- [ ] Admin endpoints require admin token
- [ ] Rate limiting works on sensitive endpoints
- [ ] CORS is configured correctly

### Input Validation

- [ ] SQL injection attempts are blocked
- [ ] XSS attempts are sanitized
- [ ] File uploads are validated (if applicable)
- [ ] Phone number format is validated

## Automated Testing (Future)

### Unit Tests

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage
```

### E2E Tests

```bash
# Run E2E tests
pnpm test:e2e

# Run in headless mode
pnpm test:e2e:headless
```

## Reporting Issues

When you find a bug:

1. **Document**:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots/videos
   - Browser/device info
   - Error messages from console

2. **Severity**:
   - Critical: Blocks core functionality
   - High: Major feature doesn't work
   - Medium: Minor feature issue
   - Low: Cosmetic issue

3. **Report**:
   - Create GitHub issue
   - Tag with appropriate labels
   - Assign to relevant team member

## Test Data Cleanup

After testing:

1. Delete test agents
2. Remove test phone numbers
3. Cancel test subscriptions
4. Clear test data from database (if staging)

## Staging vs Production

### Staging Environment
- Use for all testing before production
- Use test API keys (Stripe, Twilio test mode)
- Can break things without consequences
- Reset data as needed

### Production Environment
- Only test critical, non-destructive flows
- Use real API keys
- Monitor carefully
- Have rollback plan ready

---

**Last Updated**: 2025-09-30
**Version**: 1.0.0
