# CareerWise 🚀

An AI-powered career learning platform that provides personalized, interactive career education from aptitude assessment through job readiness.

## ✨ Features

- **🎯 Personalized Learning Paths** - Choose from Frontend, Data Science, or Cloud career tracks
- **📅 14-Day Sprint Plans** - Structured daily tasks tailored to your career goals
- **🤖 AI Mentor** - Powered by Google Gemini, available via voice or text chat
- **✅ Task Management** - Track your progress with interactive task completion
- **🏆 Achievements & Streaks** - Stay motivated with gamification
- **💾 Progress Persistence** - Your learning journey is saved and synced
- **🔐 Secure Authentication** - Personal accounts with protected data

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker Desktop
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd careerwise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file with:
   ```env
   DATABASE_URL="postgresql://careerwise:careerwise123@localhost:5432/careerwise"
   NEXTAUTH_SECRET="your-secret-here"  # Run: openssl rand -base64 32
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Start the database**
   ```bash
   docker compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run prisma:migrate
   ```

6. **Seed the database**
   ```bash
   npm run db:seed
   ```

7. **Start the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

1. **Sign Up** - Create an account with your email and password
2. **Onboarding** - Complete the 5-step wizard to set up your profile
3. **Dashboard** - View your personalized daily tasks
4. **Complete Tasks** - Mark tasks as complete to track progress
5. **AI Mentor** - Click the voice panel to chat or speak with your AI mentor
6. **Track Progress** - Watch your streak and achievements unlock

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, NextAuth v5
- **Database:** PostgreSQL, Prisma ORM
- **AI:** Google Gemini API
- **Voice:** Web Speech API

## 📊 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with tasks |

## 🗄️ Database Management

### View Database Tables
```bash
docker exec careerwise-db psql -U careerwise -d careerwise -c "\dt"
```

### Access Database Shell
```bash
docker exec -it careerwise-db psql -U careerwise -d careerwise
```

### Reset Database
```bash
docker compose down -v
docker compose up -d
npm run prisma:migrate
npm run db:seed
```

## 🎨 Current Content

- **3 Career Tracks:** Frontend Development, Data Science, Cloud & DevOps
- **30 Tasks:** 10 tasks per career track for Days 1-5
- **4 Achievements:** Auto-unlocking based on progress
- **AI Mentor:** Context-aware conversations with voice support

## 🔐 Security

- Passwords hashed with bcrypt
- JWT-based session management
- HTTP-only cookies
- Protected API routes
- Environment variable secrets

## 🚧 Development

### Adding New Tasks

Edit `prisma/seed.ts` and run:
```bash
npm run db:seed
```

### Database Schema Changes

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration_name`
3. Run `npm run prisma:generate`

## 📚 Documentation

- [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Detailed project status
- [WARP.md](./WARP.md) - Project overview and guidelines
- [Prisma Schema](./prisma/schema.prisma) - Database structure

---

**Status:** ✅ Production Ready  
**Version:** 1.0.0  

For detailed setup and troubleshooting, see [PROJECT_STATUS.md](./PROJECT_STATUS.md)
