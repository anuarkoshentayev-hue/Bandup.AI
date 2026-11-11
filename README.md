# BandUp AI — IELTS preparation MVP

A responsive IELTS learning dashboard with AI-assisted Speaking and Writing feedback.

## Features
- Dashboard with a Band 7.0 goal
- AI Speaking text practice (Part 1 sample questions)
- AI Writing feedback for Task 2
- Reading, Listening and Vocabulary sample practice
- Responsive dark navy / blue interface
- API key stays on the server; it is never placed in frontend code

## Run locally
1. Install Node.js 18 or newer.
2. Download/clone this repository.
3. In the project folder run:
   ```bash
   npm install
   ```
4. Copy `.env.example` to `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_key_here
   OPENAI_MODEL=gpt-4o-mini
   PORT=3001
   ```
5. Start the app:
   ```bash
   npm run dev
   ```
6. Open the local address printed by Vite (usually http://localhost:5173).

## Publish to GitHub
1. Create a new empty repository on GitHub named `bandup-ai`.
2. In this folder run:
   ```bash
   git init
   git add .
   git commit -m "Create BandUp AI IELTS platform"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/bandup-ai.git
   git push -u origin main
   ```
3. Never upload `.env` or expose your API key. `.gitignore` excludes `.env`.

## Deployment
This project uses a Node/Express API, so it needs a host that can run a Node server (for example Render or Railway). Add `OPENAI_API_KEY` and `OPENAI_MODEL` as environment variables in the hosting dashboard. Set the build command to `npm install && npm run build` and the start command to `npm start`. Configure the host to serve the Vite `dist` folder if you deploy frontend and backend together; for a production deployment, add static-file serving in `server/index.js` or deploy the frontend and API separately.

## Important
- AI-generated band estimates are practice guidance, not official IELTS scores.
- Speaking is text-only in this MVP, so pronunciation is not assessed.
- Reading and Listening currently contain sample exercises, not a complete official-style test bank.
- API usage may incur charges. Keep the API key private and set usage limits with your provider.
