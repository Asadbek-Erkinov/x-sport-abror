# AI Sport X — public deployment

## Local
1. `npm install`
2. Put your Groq key in `.env`:
   `GROQ_API_KEY=...`
3. `npm start`
4. Open `http://localhost:3000`

## Vercel
Upload this folder/repository to Vercel.
In Vercel Project Settings → Environment Variables add:
`GROQ_API_KEY` = your Groq API key.

Redeploy after adding the variable.

The `/api/chat` serverless function keeps the Groq key on the server.
Do not put the key in `script.js` or any HTML file.
