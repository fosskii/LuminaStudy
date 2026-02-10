
# LuminaStudy AI 🎓

An intelligent study planner that uses Google Gemini AI to generate personalized schedules.

## 🚀 Production Deployment (Vercel)

### Step 1: Push to Git
Push this codebase to your GitHub, GitLab, or Bitbucket repository.

### Step 2: Import to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** > **Project**.
3. Import your repository.

### Step 3: Deployment Settings (Crucial)
Vercel should auto-detect settings, but verify:
- **Framework Preset**: Other (or Vite)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Environment Variables
Add:
- `API_KEY`: Your Google Gemini API Key.

### Step 5: Deploy
Click **Deploy**.

## 🛠 Features
- **AI Assistant**: Generates balanced 7-day study plans via secure backend.
- **Planner**: Manage tasks, subjects, and deadlines.
- **Role-Based Access**: Specialized views for Admin and Moderator roles.
