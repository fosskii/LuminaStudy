
# LuminaStudy AI 🎓

An intelligent study planner that uses Google Gemini AI to generate personalized schedules, track deadlines, and optimize student productivity.

## 🚀 Production Deployment (Vercel)

This application is configured for secure deployment using Vercel Serverless Functions to hide API secrets.

### Step 1: Push to Git
Push this codebase to your GitHub, GitLab, or Bitbucket repository.

### Step 2: Import to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your repository.

### Step 3: Configure Environment Variables
In the Vercel Dashboard, go to **Project Settings** > **Environment Variables** and add:
- `API_KEY`: Your Google Gemini API Key. (Get it at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### Step 4: Deploy
Click **Deploy**. Vercel will build the frontend and the `/api` routes automatically.

## 🔒 Security Features
- **Serverless API Proxy**: The `API_KEY` is only available to the `/api/generate-plan` route and is never exposed to the client browser.
- **Edge Runtime**: API routes use the Vercel Edge Runtime for lower latency and better global performance.

## 🛠 Features
- **AI Assistant**: Generates balanced 7-day study plans via secure backend.
- **Planner**: Manage tasks, subjects, and deadlines with local persistence.
- **Role-Based Access**: Specialized views for Admin and Moderator roles.
