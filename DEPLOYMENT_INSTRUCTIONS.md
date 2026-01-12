# 🚀 Chat Spark Deployment Guide

Your chat app has **TWO parts** that need to be deployed separately:

## 📦 Part 1: Frontend (Already Done ✅)
**Deployed to:** Netlify
**URL:** https://exquisite-kheer-6b0e55.netlify.app/
**Status:** ✅ Deployed (but won't work until backend is deployed)

---

## 🔧 Part 2: Backend (NEEDS DEPLOYMENT)

Your backend server (in `server/` folder) needs to be deployed to a Node.js hosting service.

### **Option A: Deploy to Render.com (RECOMMENDED - FREE)**

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. **Click:** "New +" → "Web Service"
4. **Connect** your GitHub repository
5. **Configure:**
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node
   - **Instance Type:** Free

6. **Add Environment Variables** (in Render dashboard):
   ```
   MONGODB_URI=mongodb+srv://siddiq_5_1_0:siddiq123@cluster0.wdomjbv.mongodb.net/chat-spark?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=chat-spark-super-secret-key-2026-change-in-production
   JWT_EXPIRE=7d
   CLIENT_URL=https://exquisite-kheer-6b0e55.netlify.app
   PORT=5000
   NODE_ENV=production
   ```

7. **Click:** "Create Web Service"
8. **Wait** for deployment (3-5 minutes)
9. **Copy** your backend URL (e.g., `https://chat-spark.onrender.com`)

---

### **Option B: Deploy to Railway.app (FREE)**

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **Click:** "New Project" → "Deploy from GitHub repo"
4. **Select:** Your repository
5. **Configure:**
   - **Root Directory:** `server`
   - **Start Command:** `node server.js`

6. **Add Environment Variables** (same as above)
7. **Copy** your backend URL

---

## 🔗 Step 4: Connect Frontend to Backend

Once your backend is deployed and you have the URL (e.g., `https://chat-spark.onrender.com`):

1. **Update** `.env.production` file:
   ```env
   VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com/api
   VITE_SOCKET_URL=https://YOUR-BACKEND-URL.onrender.com
   ```

2. **Commit and push** to trigger Netlify rebuild:
   ```bash
   git add .
   git commit -m "Update production API URLs"
   git push
   ```

3. **Netlify will auto-deploy** the updated frontend

---

## 🔐 Step 5: Update Backend CORS

After deploying backend, make sure your backend allows Netlify URL.

Your backend already has this in `server/server.js`:
```javascript
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
```

The `CLIENT_URL` environment variable (set to your Netlify URL) will handle this! ✅

---

## ✅ Final Checklist

- [ ] Backend deployed to Render/Railway
- [ ] Backend environment variables configured
- [ ] Backend URL copied
- [ ] `.env.production` updated with backend URL
- [ ] Changes committed and pushed to GitHub
- [ ] Netlify auto-deployed the update
- [ ] Test the live app!

---

## 🧪 Testing Your Live App

1. Visit: https://exquisite-kheer-6b0e55.netlify.app/login
2. Register a new account (or use test account if you created sample users in production DB)
3. Try sending messages
4. Open in two different browsers to test real-time chat

---

## 🐛 Troubleshooting

**Problem:** Frontend shows connection errors
- ✅ **Solution:** Check if backend URL is correct in `.env.production`
- ✅ **Solution:** Check Netlify build logs for environment variable issues

**Problem:** CORS errors in browser console
- ✅ **Solution:** Verify `CLIENT_URL` environment variable in backend matches your Netlify URL

**Problem:** Backend won't start on Render
- ✅ **Solution:** Check Render logs, ensure all environment variables are set
- ✅ **Solution:** Verify MongoDB connection string is correct

---

## 📞 Need Help?

Check the logs:
- **Netlify:** Dashboard → Site → Deploys → View logs
- **Render:** Dashboard → Service → Logs
- **Browser:** F12 → Console tab
