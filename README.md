Smart Task Manager with Gemini AI

Task management app built with Next.js 15, TypeScript, and Google Gemini API.

Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Google Gemini API
- Vercel (Optional deployment)

Getting Started

Run on Local server:

Clone the repo:
```bash
https://github.com/mohammad-selim03/task-management-ai.git
```
Go to the project folder:
```
cd /task-management-ai
```

Open terminal and run

```
pnpm install
pnpm dev
```

Create .env.local:
GEMINI_API_KEY=your-key-here


Features
- Add / Edit / Delete tasks
- AI-based subtask suggestions
- Mobile-friendly responsive UI
- Form validation & error handling

Example Prompt
Task: Plan birthday
- Suggestions: Book venue, Send invites, etc.

Known Issues
-Gemini rate limit: Retry after some time
-No persistence (local state only)
