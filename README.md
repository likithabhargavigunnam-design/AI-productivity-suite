# AI Productivity Suite

A full-stack Next.js application integrated with AI tools for notes, YouTube summarization, job searching, and resume building.

## Features
- **Notes Saver**: Full CRUD functionality with real-time sync.
- **AI YouTube Summariser**: Fetch transcripts and generate summaries via Gemini 2.0 Flash.
- **AI Job Search**: Crawl job listings using Firecrawl and summarize them with AI.
- **AI Resume Maker**: Generate professional resumes from user input.
- **Google Auth**: Secure authentication via Supabase Auth.

## Tech Stack
- **Next.js**: Framework
- **TailwindCSS**: Premium UI with Glassmorphism
- **Supabase**: Auth & PostgreSQL Database
- **OpenRouter (Gemini 2.0 Flash)**: AI Logic
- **Firecrawl**: Job Crawling

## Prerequisites
- Node.js installed on your machine.
- A Supabase account and project.
- An OpenRouter API key.
- A Firecrawl API key.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd app
   npm install
   ```

2. **Configure Environment Variables**
   Update the `app/.env.local` file with your actual API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   FIRECRAWL_API_KEY=your_firecrawl_api_key
   ```

3. **Database Setup**
   Go to your Supabase SQL Editor and run the contents of `supabase_schema.sql` found in the root directory.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure
- `src/app`: Page routes and API handlers.
- `src/components`: UI components (Sidebar, DashboardShell, etc.).
- `src/lib/supabase`: Supabase SSR client/server config.
- `src/middleware.ts`: Auth protection and redirects.
