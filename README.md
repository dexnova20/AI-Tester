# Explain Like I'm Dumb

A lightweight full-stack web app that explains anything in a way that actually makes sense.

## Folder Structure

```
ARE U DUMB TOO/
├── client/
│   └── index.html       # React frontend (CDN-based, no build step)
├── server/
│   ├── index.js         # Express backend with /explain endpoint
│   └── package.json     # Server dependencies
└── README.md
```

## How to Run Locally

### 1. Start the backend

```bash
cd server
npm install
npm start
```

Server runs at: http://localhost:3001

### 2. Open the frontend

Just open `client/index.html` directly in your browser — no server needed for the frontend.

> Double-click the file, or drag it into Chrome/Firefox/Edge.

---

## Using a Real AI API (Optional)

Open `server/index.js` and find the `getExplanation` function.  
Uncomment the OpenAI block, install the package, and add your key:

```bash
cd server
npm install openai
```

Then set your key as an environment variable before starting:

```bash
# Windows CMD
set OPENAI_API_KEY=your-key-here
npm start

# Windows PowerShell
$env:OPENAI_API_KEY="your-key-here"
npm start
```

---

## Example API Request & Response

**POST** `http://localhost:3001/explain`

Request body:
```json
{
  "topic": "How does the internet work?",
  "mode": "eli5"
}
```

Response:
```json
{
  "explanation": "Okay so imagine 'How does the internet work?' is like a giant cookie jar. You want a cookie (the answer), but the jar is on a high shelf (the hard stuff). Someone tall (a smart person) gets it for you and breaks it into tiny pieces so you don't choke. That's basically it!"
}
```

## Available Modes

| Mode      | Value     | Description                        |
|-----------|-----------|------------------------------------|
| ELI5      | `eli5`    | Explain like I'm 5 years old       |
| Meme      | `meme`    | Internet meme humor style          |
| Analogy   | `analogy` | Real-life comparison               |
| Exam-ready| `exam`    | Structured, bullet-point format    |
