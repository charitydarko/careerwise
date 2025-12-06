# Database Setup Guide

## Current Status

✅ **Completed:**
- Database schema designed (9 models)
- NextAuth dependencies installed
- Environment variables defined

⏸️ **Next Steps:**
- Set up database
- Run migrations
- Complete authentication system

## Database Options

### Option 1: Neon (Recommended - Serverless PostgreSQL)

**Why Neon?**
- Free tier: 0.5 GB storage, 100 hours compute/month
- Serverless (auto-scales, auto-sleeps)
- Built for Next.js/Vercel
- 1-minute setup

**Setup:**
1. Go to https://neon.tech/
2. Sign up (GitHub login works)
3. Create new project: "careerwise"
4. Copy connection string
5. Add to `.env`:
   ```env
   DATABASE_URL="postgresql://user:pass@HOST/neondb?sslmode=require"
   ```

### Option 2: Supabase (Alternative)

1. Go to https://supabase.com/
2. Create new project
3. Go to Settings → Database
4. Copy "Connection string" (Pooler mode)
5. Add to `.env`

### Option 3: Local PostgreSQL

**Mac (via Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
createdb careerwise
```

Then add to `.env`:
```env
DATABASE_URL="postgresql://localhost:5432/careerwise"
```

**Ubuntu/Debian:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb careerwise
```

## Environment Setup

1. **Copy example env file:**
   ```bash
   cp .env.example .env
   ```

2. **Add required values to `.env`:**
   ```env
   # Database (from Neon/Supabase/local)
   DATABASE_URL="postgresql://..."
   
   # Gemini AI (already have this)
   GEMINI_API_KEY="your_key"
   
   # NextAuth (generate new secret)
   NEXTAUTH_SECRET="88xDln/dcNU35L/uwk5B7pf211N86sjgzgkpXgc+E6M="
   NEXTAUTH_URL="http://localhost:3000"
   ```

## Run Migrations

Once database is configured:

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (creates tables)
npx prisma migrate dev --name init_auth_schema

# Verify tables created
npx prisma studio
```

This will create these tables:
- ✅ `users` - User accounts
- ✅ `career_profiles` - Career track selection
- ✅ `user_progress` - Learning progress tracking
- ✅ `tasks` - Curriculum tasks
- ✅ `task_progress` - User task completion
- ✅ `achievements` - Achievement definitions
- ✅ `user_achievements` - Unlocked achievements
- ✅ `conversations` - AI mentor chat history

## Seed Database (Coming Next)

After migrations, we'll create a seed script to populate:
- Starter tasks for each career track
- Achievement definitions
- Default learning paths

## Next Authentication Steps

Once database is ready, we'll build:
1. ✅ NextAuth configuration
2. ✅ Signup page & API
3. ✅ Login page & API
4. ✅ Route protection
5. ✅ User session management

## Database Schema Overview

```
User (authentication)
  ├─ CareerProfile (1:1)
  ├─ UserProgress (1:many - supports multiple sprint versions)
  ├─ TaskProgress (many:many with Tasks)
  ├─ UserAchievement (many:many with Achievements)
  └─ Conversation (1:many)

Task (curriculum content)
  └─ TaskProgress (tracks user completion)

Achievement (gamification)
  └─ UserAchievement (tracks user unlocks)
```

## Troubleshooting

### "Can't reach database server"
- Verify DATABASE_URL is correct
- Check database is running (local PostgreSQL)
- Check firewall/network (cloud databases)
- Try connection with: `npx prisma db pull`

### "SSL error"
- Add `?sslmode=require` to connection string
- Or try `?ssl=true` depending on provider

### "Password authentication failed"
- Double-check credentials in connection string
- URL-encode special characters in password

### "Database does not exist"
- Create database first: `createdb careerwise`
- Or create via cloud provider dashboard

## Quick Test

Test database connection:
```bash
npx prisma db pull
```

Should output: "Introspecting database..."

If successful, proceed with:
```bash
npx prisma migrate dev
```

---

**Ready?** Once your DATABASE_URL is configured, run:
```bash
npx prisma generate && npx prisma migrate dev
```

Then we'll continue with authentication implementation!
