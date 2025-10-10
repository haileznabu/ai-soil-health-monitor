# Deployment Guide - AI Soil Health Monitor

### Step 1: Push to GitHub


\`\`\`bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - AI Soil Health Monitor"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/ai-soil-health-monitor.git
git branch -M main
git push -u origin main
\`\`\`

### Step 2: Deploy to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your `ai-soil-health-monitor` repository
5. Click **"Import"**

### Step 3: Configure Environment Variables

In the Vercel deployment configuration:

1. Expand **"Environment Variables"**
2. Add each variable:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL = your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_production_service_role_key
\`\`\`

**Important:** Do NOT add `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` in production

3. Click **"Deploy"**

### Step 4: Configure Supabase for Production

1. Go to your Supabase Dashboard
2. Click **Authentication → URL Configuration**
3. Add your Vercel domain to **Site URL**:
   \`\`\`
   https://your-app-name.vercel.app
   \`\`\`
4. Add to **Redirect URLs**:
   \`\`\`
   https://your-app-name.vercel.app/**
   \`\`\`

### Step 5: Test Your Deployment

1. Wait for deployment to complete (2-3 minutes)
2. Click **"Visit"** to open your live site
3. Test signup and login functionality
4. Verify all features work correctly

## 🔄 Continuous Deployment

Once set up, Vercel automatically deploys when you push to GitHub:

\`\`\`bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push

# Vercel automatically deploys the changes
\`\`\`

## 🌍 Custom Domain (Optional)

### Add Your Own Domain

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Click **"Add"**
4. Enter your domain name
5. Follow the DNS configuration instructions
6. Update Supabase URL Configuration with your custom domain

## 📊 Production Checklist

Before going live, ensure:

- [ ] All environment variables are set in Vercel
- [ ] Supabase URL configuration includes production domain
- [ ] Database tables are created in production Supabase project
- [ ] Row Level Security (RLS) policies are enabled
- [ ] Email templates are configured in Supabase
- [ ] Test user signup and login flow
- [ ] Test all major features (land areas, soil analysis, alerts)
- [ ] Check mobile responsiveness
- [ ] Review error handling and logging

## 🔒 Security Best Practices

### Environment Variables

- Never commit `.env.local` to version control
- Use different Supabase projects for development and production
- Rotate service role keys periodically

### Database Security

- Keep Row Level Security (RLS) enabled on all tables
- Regularly review RLS policies
- Monitor database access logs in Supabase

### Authentication

- Enable email verification (default in Supabase)
- Consider adding 2FA for admin users
- Set up password strength requirements

## 📈 Monitoring & Analytics

### Vercel Analytics

1. In Vercel Dashboard, go to your project
2. Click **"Analytics"** tab
3. Enable Web Analytics (free tier available)

### Supabase Monitoring

1. In Supabase Dashboard, click **"Reports"**
2. Monitor:
   - Database performance
   - API usage
   - Authentication events

## 🐛 Debugging Production Issues

### View Logs

**Vercel Logs:**
1. Go to your project in Vercel Dashboard
2. Click **"Deployments"**
3. Click on a deployment
4. Click **"Functions"** tab to see logs

**Supabase Logs:**
1. Go to Supabase Dashboard
2. Click **"Logs"** → **"API"** or **"Database"**

### Common Production Issues

**Issue: Authentication redirects to localhost**
- Solution: Remove `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` from Vercel environment variables

**Issue: Database connection errors**
- Solution: Verify Supabase environment variables are correct in Vercel

**Issue: 404 errors on refresh**
- Solution: This shouldn't happen with Next.js on Vercel, but check your `next.config.mjs`

## 🔄 Rollback Deployment

If something goes wrong:

1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"**
3. Find the last working deployment
4. Click **"⋮"** → **"Promote to Production"**

## 📱 Progressive Web App (PWA) - Optional

To make your app installable on mobile:

1. Add a `manifest.json` file
2. Configure service workers
3. Add PWA meta tags
4. Test with Lighthouse in Chrome DevTools

## 🌐 Alternative Deployment Options

### Deploy to Netlify

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect GitHub and select repository
5. Add environment variables
6. Deploy

### Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select repository
4. Add environment variables
5. Deploy

### Self-Hosting with Docker

\`\`\`dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

Build and run:
\`\`\`bash
docker build -t ai-soil-health-monitor .
docker run -p 3000:3000 --env-file .env.local ai-soil-health-monitor
\`\`\`

## 📞 Support

For deployment issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Check [Supabase Documentation](https://supabase.com/docs)
- Review error logs in both platforms

---

**Your app is now live and ready to help monitor land degradation! 🌱**
