# 🚂 Railway Deployment - CORS Fix Checklist

## 🔧 Step-by-Step Fix Instructions

### 1. **Update Backend Code** ✅
You've already done this! The updated `main.py` now has:
- Enhanced CORS configuration with `allow_methods=["*"]`
- Explicit OPTIONS handler for preflight requests
- Request logging middleware
- Better error handling

### 2. **Verify Railway Environment Variables** ⚠️

Go to your Railway backend service and check these variables:

```bash
ALLOWED_ORIGINS=https://www.tailoredhireresume.com,https://tailoredhireresume.com
```

**Important Notes:**
- NO spaces after commas
- NO trailing slashes (❌ `https://example.com/`)
- Must match EXACTLY what frontend sends

### 3. **Deploy the Updated Code**

```bash
# Commit your changes
git add backend/main.py
git commit -m "fix: Enhanced CORS configuration for production"
git push origin main
```

Railway will automatically redeploy.

### 4. **Check Deployment Logs** 🔍

After deployment, look for these log messages:

```
✅ Should see:
🌐 CORS Origins configured: ['https://www.tailoredhireresume.com', 'https://tailoredhireresume.com']
🔵 OPTIONS /api/upload - Origin: https://www.tailoredhireresume.com
🟢 Response: 200
🔵 POST /api/upload - Origin: https://www.tailoredhireresume.com
🟢 Response: 200

❌ Should NOT see:
404 (Not Found)
CORS policy error
```

### 5. **Test from Frontend**

After deployment, test uploading a resume from your frontend:
- Open browser DevTools (F12)
- Go to Network tab
- Try uploading a file
- Check the request headers and response

### 6. **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| Still getting 404 | Check that Railway is using the correct start command: `uvicorn main:app --host 0.0.0.0 --port 8000` |
| CORS still blocked | Verify `ALLOWED_ORIGINS` in Railway dashboard has NO spaces |
| Preflight fails | Check OPTIONS request returns 200, not 404 |

### 7. **Verification Steps**

After deployment, run these checks:

**Test 1: Health Check**
```bash
curl https://tailorhire-ai-production.up.railway.app/health
```
Expected: `{"status":"healthy",...}`

**Test 2: OPTIONS Request**
```bash
curl -X OPTIONS \
  -H "Origin: https://www.tailoredhireresume.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  https://tailorhire-ai-production.up.railway.app/api/upload -v
```
Expected: Response with CORS headers

**Test 3: Actual Upload (from browser console)**
```javascript
const formData = new FormData();
formData.append('file', yourFileHere);

fetch('https://tailorhire-ai-production.up.railway.app/api/upload', {
  method: 'POST',
  body: formData,
  credentials: 'include'
}).then(r => r.json()).then(console.log);
```

## 🎯 Expected Results

After these fixes, you should see:

1. ✅ OPTIONS preflight request returns 200 OK
2. ✅ POST request to `/api/upload` works
3. ✅ CORS headers present in response
4. ✅ Text extraction succeeds
5. ✅ No 404 errors in console

## 🆘 If Still Not Working

If you still see errors after deploying:

1. **Check Railway logs** for the CORS configuration message
2. **Verify environment variables** in Railway dashboard
3. **Test with curl** to isolate frontend vs backend issues
4. **Check Railway's public URL** matches what frontend is calling
5. **Ensure Railway is using port 8000** (should auto-detect from Dockerfile)

## 📝 What Changed?

### Before:
```python
allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
```

### After:
```python
allow_methods=["*"]  # Allows ALL methods including OPTIONS
expose_headers=["*"]
max_age=3600
```

Plus explicit OPTIONS handler and request logging!
