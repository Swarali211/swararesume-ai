# Resume Genius

Build a React web app called "ResumeIQ" — an AI-powered resume analyzer.

DESIGN STYLE:

Clean, modern SaaS aesthetic. Use TailwindCSS. Soft gradient background 

(indigo to purple, subtle), white cards with rounded corners (rounded-2xl) 

and soft shadows. Generous whitespace. Use a modern sans-serif font. 

Add smooth fade-in and slide-up animations when content loads.

SCREENS / FLOW:

1. LANDING/INPUT SCREEN

- Centered hero: title "ResumeIQ" with a short tagline like 

  "Get instant AI feedback on your resume"

- A large textarea for pasting resume text (placeholder: "Paste your 

  resume text here...")

- A dropdown to select target role (options: Frontend Developer, 

  Backend Developer, Data Analyst, Product Manager, General)

- A prominent gradient "Analyze My Resume" button with a hover scale 

  animation

2. LOADING STATE

- Replace the button/form area with a centered animated loading spinner 

  and rotating text messages like "Reading your resume...", 

  "Checking formatting...", "Scoring keyword match..." (cycle every 

  1.5 seconds)

3. RESULTS SCREEN

- Large animated circular score gauge at top showing overall score 

  out of 100 (animate the number counting up from 0)

- Below it, 4 category cards in a grid, each with an icon, category 

  name (Clarity, Impact, Keywords, Formatting), a horizontal progress 

  bar, and a score out of 25

- A "Detailed Suggestions" section below with expandable/collapsible 

  cards, each showing one specific piece of feedback with a small 

  icon (warning/tip/good)

- A "Try Another Resume" button at the bottom to reset back to input 

  screen

FUNCTIONALITY:

- On "Analyze My Resume" click, send the resume text and selected 

  role to the Gemini API (I will provide the API key via environment 

  variable GEMINI_API_KEY)

- The prompt sent to Gemini should ask it to return ONLY valid JSON 

  in this exact structure, nothing else:

  {

    "overallScore": number (0-100),

    "categories": [

      {"name": "Clarity", "score": number (0-25), "feedback": "string"},

      {"name": "Impact", "score": number (0-25), "feedback": "string"},

      {"name": "Keywords", "score": number (0-25), "feedback": "string"},

      {"name": "Formatting", "score": number (0-25), "feedback": "string"}

    ],

    "suggestions": [

      {"type": "warning" | "tip" | "good", "text": "string"}

    ]

  }

- Parse this JSON response and render it into the results screen 

  components described above

- Handle loading and error states gracefully (show a friendly error 

  message with a retry button if the API call fails)

- Make the whole layout fully responsive for mobile

Use React state (useState) to manage the three screens (input → 

loading → results). Keep all components in clean, separate files.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://swararesume-ai.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f9b61716-441b-4f3d-8552-ee51cb2d7d45).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
