# 🚀 Vercel Configuration - CORRECT Setup for Monorepo

**Problem**: TypeScript not found during build  
**Cause**: Building from `apps/web` subdirectory doesn't install root devDependencies  
**Solution**: Build from root using Turbo

---

## ✅ CORRECT Vercel Settings

### **Framework Preset**:
```
Next.js
```

### **Root Directory**:
```
LEAVE EMPTY (or just put: .)
```
**Important**: Build from the root of the monorepo!

### **Build Command**:
```
NODE_ENV=development pnpm install --frozen-lockfile=false && pnpm turbo run build --filter=@omniagents/web
```

**Important**: `NODE_ENV=development` forces pnpm to install devDependencies (TypeScript, etc.)

This will:
1. Install all workspace dependencies INCLUDING devDependencies (TypeScript in root)
2. Use Turbo to build only the web app
3. Respect workspace dependencies

### **Output Directory**:
```
apps/web/.next
```
**Important**: Output is in `apps/web/.next`, not just `.next`

### **Install Command**:
```
pnpm install
```

### **Node Version** (Optional but recommended):
```
20.x
```

---

## 🔑 Environment Variables (6 total)

Add these in Vercel → Environment Variables:

```bash
API_BASE_URL=https://speakdirect-api.onrender.com
API_ADMIN_TOKEN=a2286a1f05d9f33eb6fcd2288086ba1c5e7b4bc7efcdfbe92bee6ea584d62072
NEXT_PUBLIC_SITE_URL=https://app.speakdirect.xyz
NEXT_PUBLIC_DEFAULT_PLAN_ID=starter
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_cHJlc2VudC1lbGYtODEuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_z6uLzXAWPBv82Ja1TIrrNaBMxgQmSLLKWnrbqwIlTi
```

---

## 📋 Step-by-Step Fix

### **In Vercel Dashboard:**

1. **Go to Settings** → Build & Development Settings

2. **Root Directory**: 
   - Delete `apps/web`
   - Leave empty OR type `.`

3. **Build Command**:
   ```
   pnpm install --frozen-lockfile=false && pnpm turbo run build --filter=@omniagents/web
   ```

4. **Output Directory**:
   ```
   apps/web/.next
   ```

5. **Install Command**:
   ```
   pnpm install
   ```

6. **Click "Save"**

7. **Click "Deployments"** tab

8. **Click "Redeploy"** on latest deployment

---

## 🎯 Why This Works

**Old way** (failed):
- Root Directory: `apps/web`
- Installs only `apps/web` dependencies
- Missing TypeScript from root `devDependencies`

**New way** (works):
- Root Directory: ` ` (empty, build from root)
- Installs ALL workspace dependencies
- TypeScript available from root
- Turbo handles the monorepo build correctly

---

## ✅ Expected Success

After redeploying, you should see:

```
✓ Installing dependencies
✓ Building @omniagents/web
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (29/29)
✓ Build completed successfully
```

---

## 🆘 If Still Fails

**Check these:**

1. **Root Directory is empty** - not `apps/web`
2. **Build Command** has `--filter=@omniagents/web`
3. **Output Directory** is `apps/web/.next` (not `.next`)
4. **All 6 environment variables** are set
5. **Latest code** is deployed (commit 2f9d910 or later)

---

## 🎯 Quick Summary

**Change these 3 settings in Vercel:**

1. Root Directory: ` ` (empty)
2. Build Command: `pnpm install --frozen-lockfile=false && pnpm turbo run build --filter=@omniagents/web`
3. Output Directory: `apps/web/.next`

Then redeploy!

---

**Make these changes now and redeploy - it will work!** 🚀
