# 🚀 Deploy Frontend to Vercel - Step by Step

**Time**: 20 minutes  
**Goal**: Get your dashboard live at a Vercel URL

---

## Step 1: Import Project (5 min)

1. **Go to**: https://vercel.com/dashboard
2. **Sign in** with GitHub (if not already)
3. **Click**: "Add New..." → "Project"
4. **Find**: `speakdirect` repository
5. **Click**: "Import"

---

## Step 2: Configure Build Settings (5 min)

### **Framework Preset**:
```
Next.js
```

### **Root Directory**:
```
apps/web
```

### **Build Command** (Click "Override"):
```
cd ../.. && pnpm install && pnpm --filter @omniagents/web build
```

### **Output Directory**:
```
.next
```

### **Install Command** (Click "Override"):
```
pnpm install
```

### **Node.js Version**:
```
20.x (should be default)
```

---

## Step 3: Add Environment Variables (10 min)

**Click "Environment Variables"** section and add these **one by one**:

### **Variable 1: API_BASE_URL**
```
KEY: API_BASE_URL
VALUE: https://speakdirect-api.onrender.com
```

### **Variable 2: API_ADMIN_TOKEN**
```
KEY: API_ADMIN_TOKEN
VALUE: a2286a1f05d9f33eb6fcd2288086ba1c5e7b4bc7efcdfbe92bee6ea584d62072
```

### **Variable 3: NEXT_PUBLIC_SITE_URL**
```
KEY: NEXT_PUBLIC_SITE_URL
VALUE: https://app.speakdirect.xyz
```
*Note: This will be your custom domain later, for now Vercel will give you a temporary URL*

### **Variable 4: NEXT_PUBLIC_DEFAULT_PLAN_ID**
```
KEY: NEXT_PUBLIC_DEFAULT_PLAN_ID
VALUE: starter
```

### **Variable 5: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**
```
KEY: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
VALUE: pk_test_cHJlc2VudC1lbGYtODEuY2xlcmsuYWNjb3VudHMuZGV2JA
```

### **Variable 6: CLERK_SECRET_KEY**
```
KEY: CLERK_SECRET_KEY
VALUE: sk_test_z6uLzXAWPBv82Ja1TIrrNaBMxgQmSLLKWnrbqwIlTi
```

---

## Step 4: Deploy! (3 min)

1. **Click**: "Deploy"
2. **Wait**: 2-3 minutes (watch the build logs)
3. **Success**: Should see "Congratulations!" page
4. **Copy**: The Vercel URL (something like `speakdirect-xxx.vercel.app`)

---

## Step 5: Update Clerk Domains (2 min)

Your Vercel URL needs to be added to Clerk:

1. **Go to**: https://dashboard.clerk.com
2. **Click**: Your application
3. **Go to**: "Domains" section
4. **Add domain**: Your Vercel URL (e.g., `speakdirect-xxx.vercel.app`)
5. **Click**: "Add domain"

---

## ✅ Test Your Dashboard

1. **Visit**: Your Vercel URL
2. **Click**: "Sign Up"
3. **Create account**: Use your email
4. **Verify email**: Check inbox
5. **Log in**: Should see dashboard!

---

## 🎯 What You Should See

After signing up and logging in:
- ✅ Dashboard with navigation
- ✅ "Agents" page
- ✅ "Calls" page
- ✅ "Technicians" page (this is where you'll make calls!)
- ✅ User profile button in header

---

## 🚨 Troubleshooting

### **Build fails**:
- Check all 6 environment variables are set
- Verify Clerk keys are correct
- Check build logs for specific error

### **Can't sign up**:
- Add Vercel URL to Clerk domains
- Check Clerk keys in Vercel
- Try incognito mode

### **Dashboard shows errors**:
- Verify API_BASE_URL is correct
- Check API is running at that URL
- Open browser console (F12) for errors

---

## 📋 Checklist

- [ ] Imported project to Vercel
- [ ] Set root directory to `apps/web`
- [ ] Added all 6 environment variables
- [ ] Build succeeded
- [ ] Got Vercel URL
- [ ] Added Vercel URL to Clerk domains
- [ ] Signed up successfully
- [ ] Can see dashboard

---

## 🎯 After This Works

Next steps:
1. Configure Twilio webhooks (10 min)
2. Make a test call to yourself! (5 min)
3. See the call transcript in dashboard! 🎉

---

**Start with Step 1: Go to https://vercel.com/dashboard now!** 🚀
