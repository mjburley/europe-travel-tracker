# Europe Travel Tracker - Deployment Guide

## Quick Start (Local Development)

```bash
npm install
npm run dev
```

Visit http://localhost:5173

---

## Option A: Deploy to Hostinger (Static Build)

This is the simplest option - no backend required. Uses localStorage for persistence.

### 1. Build the project

```bash
npm run build
```

This creates a `dist/` folder with static files.

### 2. Upload to Hostinger

1. Log into Hostinger → File Manager
2. Navigate to `public_html` (or your domain folder)
3. Upload all contents of the `dist/` folder
4. Done! Your app is live.

### 3. Configure for SPA routing (optional)

Create a `.htaccess` file in `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Option B: Deploy with Supabase Backend

For cloud persistence and image storage.

### 1. Create Supabase Project

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Note your `Project URL` and `anon/public` API key

### 2. Create Database Table

In Supabase SQL Editor, run:

```sql
-- Create visited_places table
CREATE TABLE visited_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT NOT NULL,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  lat FLOAT8 NOT NULL,
  lon FLOAT8 NOT NULL,
  country TEXT,
  wiki_summary TEXT,
  wiki_url TEXT,
  auto_image_url TEXT,
  user_image_url TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE visited_places ENABLE ROW LEVEL SECURITY;

-- Allow public read/write (for demo - add auth for production)
CREATE POLICY "Allow all operations" ON visited_places
  FOR ALL USING (true) WITH CHECK (true);
```

### 3. Create Storage Bucket (for user photos)

1. Go to Storage in Supabase dashboard
2. Create a new bucket called `travel-photos`
3. Set it to Public
4. Add policy to allow uploads

### 4. Configure Environment Variables

Create `.env.local` in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 6. Build and Deploy

```bash
npm run build
```

Then upload `dist/` to Hostinger as described above.

---

## Option C: Git Deployment (Hostinger)

If you have Hostinger's Git deployment feature:

### 1. Initialize Git

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Connect to Hostinger

1. Go to Hostinger → Websites → Manage → Git
2. Create a new repository or connect existing
3. Push your code:

```bash
git remote add hostinger <your-hostinger-git-url>
git push hostinger main
```

### 3. Configure Build

In Hostinger's Git settings, set:
- Build command: `npm install && npm run build`
- Publish directory: `dist`

---

## API Keys Required

### Unsplash (Optional - for better images)

1. Go to https://unsplash.com/developers
2. Create a new application
3. Get your Access Key
4. Update `src/services/unsplash.js` with your key

The app works without this - it uses Unsplash Source which doesn't require a key.

---

## Project Structure

```
europe-travel-tracker/
├── src/
│   ├── components/
│   │   ├── EuropeMap.jsx      # Main map with markers
│   │   ├── SearchBar.jsx      # City search
│   │   ├── PlaceModal.jsx     # Place details popup
│   │   └── VisitedPlacesList.jsx  # Sidebar with saved places
│   ├── services/
│   │   ├── nominatim.js       # OpenStreetMap search
│   │   ├── wikipedia.js       # Wikipedia summaries
│   │   ├── unsplash.js        # Place photos
│   │   └── supabase.js        # Cloud storage (optional)
│   ├── hooks/
│   │   └── usePlaceData.js    # Data fetching hook
│   ├── App.jsx                # Main app component
│   └── index.css              # Tailwind styles
├── index.html
├── vite.config.js
└── package.json
```

---

## Troubleshooting

### Map not showing
- Check if Leaflet CSS is loading
- Ensure container has explicit height

### Search not working
- Nominatim has rate limits (1 request/second)
- Check browser console for errors

### Images not loading
- Unsplash Source can be slow/inconsistent
- Consider using your own Unsplash API key

### Styles broken after build
- Make sure Tailwind is configured in vite.config.js
- Check that @import "tailwindcss" is in index.css
