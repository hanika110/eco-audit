# EcoAudit 🌿
### Where Waste Meets Accountability

EcoAudit is a community-driven waste tracking platform built to make environmental accountability transparent and actionable. Users log real waste entries with verified geolocation, categorized across 10+ waste types including E-waste, Plastic, Organic, and Hazardous materials.

## Live Demo
https://eco-audit-orcin.vercel.app

## Features
- Community waste logging with verified geolocation
- 10+ waste categories (E-waste, Plastic, Organic, Hazardous and more)
- Real-time dashboard with live metrics
- Analytics page with trend visualization
- Secure authentication with Supabase Auth
- Row-Level Security — users only write their own data

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Supabase (PostgreSQL + Auth + Row-Level Security)
- Deployment: Vercel
- UI Components: shadcn/ui, Radix UI, Recharts

## Running Locally

1. Clone the repository
git clone https://github.com/hanika110/eco-audit.git
cd eco-audit

2. Install dependencies
npm install

3. Create a .env file
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

4. Start the dev server
npm run dev

Open http://localhost:5173 in your browser
