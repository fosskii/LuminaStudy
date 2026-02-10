
# LuminaStudy AI 🎓

An intelligent study planner that uses Google Gemini AI to generate personalized schedules, track deadlines, and optimize student productivity.

## 🚀 Deployment on Vercel

1. **Push to GitHub**: Push this code to a GitHub repository.
2. **Import to Vercel**: Go to [vercel.com](https://vercel.com) and import your repository.
3. **Configure Environment Variables**:
   - In the Vercel project settings, go to **Environment Variables**.
   - Add a new variable named `API_KEY`.
   - Paste your Google Gemini API key as the value.
4. **Deploy**: Vercel will automatically detect the static setup and deploy your site.

## 🔑 Environment Variables

The app requires the following environment variable to function:

- `API_KEY`: Your Google Generative AI API Key.

## 🛠 Features

- **AI Assistant**: Generates balanced 7-day study plans.
- **Planner**: Manage tasks, subjects, and deadlines.
- **Role-Based Access**: Specialized views for Admin and Moderator roles.
- **Persistence**: All data is saved locally for seamless usage.
