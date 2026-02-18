# Vercel setup – fix “no database” / sign up or login not working

See [README.md](./README.md) for project overview, tech stack, and local setup.

## What’s going wrong

On Vercel you only deploy the **frontend** (Vite) and the **auth API routes** in `/api`. Those API routes need your **PostgreSQL connection string** in an environment variable. If they don’t get it, they return **503** and the app shows “Database not configured” or “Sign-up / Sign-in is temporarily unavailable” and sign up / login effectively “don’t work” (or feel like a crash).

So the fix is: **make sure Vercel has `DATABASE_URL` set and that the deployment that’s running actually uses it.**

---

## What you need to do on Vercel (exact steps)

### 1. Open Environment Variables

1. Go to [vercel.com](https://vercel.com) and open your **project** (MovieFlix).
2. Click **Settings** in the top nav.
3. In the left sidebar, click **Environment Variables**.

### 2. Add `DATABASE_URL`

1. Click **Add New** (or **Add**).
2. **Name (key):** type exactly  
   `DATABASE_URL`  
   (no space, no typo; case-sensitive.)
3. **Value:** paste your **full Aiven PostgreSQL URL**, e.g.  
   `postgres://avnadmin:YOUR_PASSWORD@pg-xxxx.aivencloud.com:11092/defaultdb?sslmode=require`  
   - Do **not** wrap the value in quotes in the Vercel UI.  
   - If the password has special characters (`#`, `?`, `@`, etc.), you may need to **URL-encode** them (e.g. `@` → `%40`, `#` → `%23`) only in the password part.
4. **Environment:**  
   - Check **Production**.  
   - If you use preview URLs, also check **Preview** (and **Development** if you use that).  
   Otherwise at least **Production** must be checked.
5. Click **Save**.

### 3. Redeploy so the new env is used

Environment variables are applied at **deploy** time. So after adding or changing `DATABASE_URL` you must redeploy:

**Option A – Redeploy from dashboard**

1. Go to the **Deployments** tab.
2. Find the **latest deployment**.
3. Open the **⋮** (three dots) menu on that deployment.
4. Click **Redeploy**.
5. Leave “Use existing Build Cache” **unchecked** (so the new env is picked up).
6. Confirm **Redeploy**.

**Option B – Push a new commit**

- Commit and push any change to your repo; Vercel will create a new deployment that includes the updated `DATABASE_URL`.

### 4. Check that it’s working

1. Open your **live site** (Production URL).
2. Try **Sign up** with a new user (or **Sign in** if you already have one).
3. If it works, you’re done. If you still get “temporarily unavailable” or “Database not configured”, go to **Verify and troubleshoot** below.

---

## Verify and troubleshoot

### Confirm the variable is set

1. **Settings → Environment Variables.**  
   You should see `DATABASE_URL` with a value (masked).  
   Make sure it’s enabled for **Production** (and **Preview** if you use it).

### Confirm the deployment used it

1. **Deployments** → open the **latest** deployment (the one you’re testing).
2. Check that it was built **after** you added/changed `DATABASE_URL` and clicked Save.
3. If the deployment is old, do a **Redeploy** (step 3 above).

### Check function logs

1. **Deployments** → open the latest deployment.
2. Go to the **Functions** tab (or **Logs**).
3. Trigger **Sign up** or **Sign in** on the live site, then look at logs for `api/auth/register` or `api/auth/login`.
4. Look for:
   - `[db.js] DATABASE_URL present: true` → env is reaching the function.
   - `[db.js] DATABASE_URL present: false` or “DATABASE_URL is not set” → the function still doesn’t see the variable (wrong env scope or need to redeploy).
   - `Pool created successfully` → DB connection is being created.

### Common mistakes

| Mistake | Fix |
|--------|-----|
| Variable name typo | Must be exactly `DATABASE_URL`. |
| Only “Development” checked | Enable **Production** (and **Preview** if you use it). |
| Forgot to redeploy | Redeploy after saving the variable. |
| Quotes in value | In Vercel’s value field, paste the URL **without** surrounding quotes. |
| Special characters in password | URL-encode only the password part (e.g. `@` → `%40`). |

---

## Summary

- **Issue:** Auth API routes on Vercel don’t see `DATABASE_URL`, so they return 503 and sign up / login don’t work.
- **Fix:** In Vercel → **Settings → Environment Variables**, add `DATABASE_URL` with your Aiven URL, enable it for **Production** (and Preview if needed), **Save**, then **Redeploy** and test again.
