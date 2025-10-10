# AI Soil Health Monitor 🌱

A comprehensive AI-powered platform for monitoring land degradation, analyzing soil health, and providing actionable insights for sustainable land management. Built for the Land ReGen Hackathon 2025.

## 🎯 Project Overview

The AI Soil Health Monitor addresses critical challenges in land degradation by providing:

- **Real-time Land Monitoring**: Track multiple land areas with geospatial data
- **AI-Powered Analysis**: Claude AI analyzes satellite imagery to detect soil erosion, vegetation loss, and degradation patterns
- **Automated Alerts**: Receive notifications when critical degradation is detected
- **Data-Driven Recommendations**: Get actionable insights for land restoration
- **Stakeholder Engagement**: Accessible interface for farmers, policymakers, and NGOs

## ✨ Key Features

### 1. Dashboard
- Overview of all monitored land areas
- Real-time statistics (total areas, alerts, health score)
- Interactive map visualization
- Recent analysis timeline

### 2. Land Area Management
- Add and track multiple land parcels
- Store location coordinates and area size
- Monitor land type and current status
- View historical data for each area

### 3. Soil Health Analysis
- Upload satellite imagery for analysis
- AI-powered detection of:
  - Soil erosion levels
  - Vegetation health (NDVI)
  - Soil moisture content
  - pH levels and organic matter
- Detailed analysis summaries with recommendations

### 4. Alert System
- Automatic alert generation for critical issues
- Priority levels (Critical, High, Medium, Low)
- Alert status tracking (Active, Acknowledged, Resolved)
- Filterable alert dashboard

### 5. Authentication
- Secure user registration and login
- Email verification
- Protected routes with middleware
- User profile management

### 6. Mobile Responsive
- Fully responsive design for all devices
- Mobile-optimized navigation
- Touch-friendly interfaces

## 🛠️ Technologies Used

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Claude AI (Anthropic) via Vercel AI SDK
- **Maps**: Leaflet (ready for integration)
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** or **pnpm**
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (recommended) - [Download](https://code.visualstudio.com/)
- **Supabase Account** - [Sign up](https://supabase.com/)

## 🚀 Installation & Setup

#### Step 1: Clone from GitHub
\`\`\`bash
git clone https://github.com/haileznabu/ai-soil-health-monitor.git
cd ai-soil-health-monitor
\`\`\`

### Step 2: Open in VS Code

1. Open VS Code
2. Click **File → Open Folder**
3. Navigate to the `ai-soil-health-monitor` folder and select it
4. Click **Select Folder**

### Step 3: Install Dependencies

Open the integrated terminal in VS Code (**Terminal → New Terminal** or `` Ctrl+` ``) and run:

\`\`\`bash
npm install
\`\`\`

Or if you prefer yarn:
\`\`\`bash
yarn install
\`\`\`

Or pnpm:
\`\`\`bash
pnpm install
\`\`\`

### Step 4: Set Up Environment Variables

1. Create a `.env.local` file in the root directory:

\`\`\`bash
# In VS Code terminal
touch .env.local
\`\`\`

2. Open `.env.local` and add your environment variables:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Development Redirect URL (for email verification)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# AI Configuration (Optional - for Claude AI)
# If you want to use a different AI provider, add your API key here
# ANTHROPIC_API_KEY=your_anthropic_api_key
\`\`\`

### Step 5: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to **Settings → API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`
5. Paste them into your `.env.local` file

### Step 6: Set Up Database

#### Option A: Using Supabase SQL Editor

1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `scripts/001_create_tables.sql` from the project
5. Paste into the SQL editor and click **Run**
6. Repeat for `scripts/002_create_profile_trigger.sql`

### Step 7: Verify Database Setup

1. In Supabase Dashboard, go to **Table Editor**
2. You should see these tables:
   - `profiles`
   - `land_areas`
   - `soil_health_data`
   - `alerts`
   - `recommendations`

### Step 8: Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Or with yarn:
\`\`\`bash
yarn dev
\`\`\`

Or with pnpm:
\`\`\`bash
pnpm dev
\`\`\`

The application will start at **http://localhost:3000**

### Step 9: Create Your First Account

1. Open http://localhost:3000 in your browser
2. Click **"Get Started"** or **"Sign Up"**
3. Enter your email and password
4. Check your email for verification link
5. Click the verification link
6. You'll be redirected to the dashboard

## 📁 Project Structure

\`\`\`
ai-soil-health-monitor/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── analyze-soil/         # AI analysis endpoint
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── sign-up/
│   │   └── sign-up-success/
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── alerts/               # Alerts management
│   │   ├── land-areas/           # Land area management
│   │   ├── settings/             # User settings
│   │   ├── soil-health/          # Soil health monitoring
│   │   ├── layout.tsx            # Dashboard layout
│   │   └── page.tsx              # Dashboard home
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── alerts/                   # Alert components
│   ├── dashboard/                # Dashboard components
│   ├── land-areas/               # Land area components
│   ├── soil-health/              # Soil health components
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utility libraries
│   ├── ai/                       # AI analysis functions
│   ├── supabase/                 # Supabase clients
│   ├── types/                    # TypeScript types
│   └── utils.ts                  # Utility functions
├── scripts/                      # Database scripts
│   ├── 001_create_tables.sql
│   └── 002_create_profile_trigger.sql
├── middleware.ts                 # Auth middleware
├── .env.local                    # Environment variables (create this)
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
\`\`\`

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Yes |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Redirect URL for development (http://localhost:3000) | Yes |
| `ANTHROPIC_API_KEY` | Claude AI API key (optional if using Vercel AI Gateway) | No |

## 🗄️ Database Schema

### Tables

#### `profiles`
- User profile information
- Automatically created on signup
- Links to auth.users

#### `land_areas`
- Land parcels being monitored
- Stores location, size, type, status
- Belongs to a user

#### `soil_health_data`
- Soil health measurements
- NDVI, moisture, pH, organic matter
- Links to land areas
- Stores AI analysis results

#### `alerts`
- Automated alerts for degradation
- Priority levels and status tracking
- Links to land areas

#### `recommendations`
- AI-generated recommendations
- Action items for land restoration
- Links to soil health data

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:
- Users can only access their own data
- Authenticated users can create records
- Users can update/delete their own records

## 🔌 API Endpoints

### POST `/api/analyze-soil`

Analyzes satellite imagery using Claude AI.

**Request Body:**
\`\`\`json
{
  "imageUrl": "string",
  "landAreaId": "string",
  "coordinates": {
    "latitude": number,
    "longitude": number
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "ndvi": number,
    "soilMoisture": number,
    "erosionLevel": "low" | "moderate" | "high" | "severe",
    "vegetationHealth": "excellent" | "good" | "fair" | "poor",
    "phLevel": number,
    "organicMatter": number,
    "degradationRisk": "low" | "moderate" | "high" | "critical",
    "analysis": "string",
    "recommendations": ["string"]
  }
}
\`\`\`

## 🎨 Customization

### Changing Colors

Edit `app/globals.css` to customize the color scheme:

\`\`\`css
@theme inline {
  --color-primary: #2d5016;      /* Dark green */
  --color-secondary: #8b4513;    /* Earth brown */
  --color-accent: #d4a574;       /* Sand */
  /* ... more colors */
}
\`\`\`

### Adding New Features

1. Create components in `components/` directory
2. Add pages in `app/` directory
3. Update database schema in `scripts/` if needed
4. Add types in `lib/types/database.ts`

## 🐛 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
\`\`\`bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
\`\`\`

### Issue: Database connection errors

**Solution:**
1. Verify `.env.local` has correct Supabase credentials
2. Check Supabase project is active
3. Ensure database tables are created

### Issue: Authentication not working

**Solution:**
1. Check email verification settings in Supabase Dashboard → Authentication → Email Templates
2. Verify `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set correctly
3. Check Supabase Auth logs for errors

### Issue: AI analysis not working

**Solution:**
1. Ensure you have Claude AI access (or configure alternative AI provider)
2. Check API key is set correctly
3. Verify image URLs are accessible

### Issue: Port 3000 already in use

**Solution:**
\`\`\`bash
# Use a different port
npm run dev -- -p 3001
\`\`\`

## 📱 Mobile Testing

To test on mobile devices:

1. Find your local IP address:
   \`\`\`bash
   # On Mac/Linux
   ifconfig | grep "inet "
   
   # On Windows
   ipconfig
   \`\`\`

2. Update `.env.local`:
   \`\`\`env
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://YOUR_IP:3000
   \`\`\`

3. Access from mobile: `http://YOUR_IP:3000`

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **"New Project"**
4. Import your GitHub repository
5. Add environment variables (same as `.env.local`)
6. Click **"Deploy"**

### Environment Variables for Production

Update these for production:
- Remove `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
- Ensure Supabase URL and keys are from production project
- Add production domain to Supabase Auth settings

## 📊 Usage Guide

### Adding a Land Area

1. Go to **Dashboard → Land Areas**
2. Click **"Add Land Area"**
3. Fill in details (name, location, size, type)
4. Click **"Add Land Area"**

### Analyzing Soil Health

1. Go to **Dashboard → Soil Health**
2. Select a land area
3. Click **"Analyze Image"**
4. Upload satellite imagery or enter image URL
5. Wait for AI analysis
6. View results and recommendations

### Managing Alerts

1. Go to **Dashboard → Alerts**
2. View active alerts
3. Click on an alert to see details
4. Mark as acknowledged or resolved

## 🤝 Contributing

This project was built for the Land ReGen Hackathon 2025. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🙏 Acknowledgments

- Built for the **Land ReGen Hackathon 2025**
- Powered by **Supabase**, **Claude AI**, and **Next.js**
- UI components from **shadcn/ui**

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact the development team
- Check the troubleshooting section above

---

**Built with 🌱 for a greener planet**
