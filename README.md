# ArchSketch ✨  
**Turn natural language into beautiful software architecture diagrams — instantly.**


### Live Example
Just type:

```
React frontend with Next.js and Tailwind, FastAPI backend, PostgreSQL database, Redis cache, authentication via Firebase Auth, deployed on AWS ECS with Terraform
```

→ Get a clean, professional Mermaid diagram in <2 seconds.

## Features

- ✍️ Natural language input (no syntax required)
- 🤖 Powered by Claude 3.5 Sonnet (or GPT-4o)
- 📊 Renders with Mermaid.js – beautiful, customizable diagrams
- 🔄 “Refine Diagram” – edit your description and improve iteratively
- 💾 Export as PNG or SVG
- 🔗 Share via link (diagram encoded in URL)
- 💡 Smart suggestions (e.g., “You didn’t mention auth – want Firebase?”)
- 🚀 Fully responsive, minimal, modern UI (Next.js 14 + Tailwind + shadcn/ui)
- ⚡ Zero-config deploy on Vercel

## Tech Stack

| Layer            | Technology                                      |
|------------------|-------------------------------------------------|
| Framework        | Next.js 14 (App Router) + TypeScript            |
| Styling          | Tailwind CSS + shadcn/ui                        |
| Diagrams         | Mermaid.js                                      |
| AI               | Anthropic Claude 3.5 Sonnet (default) or OpenAI GPT-4o |
| Exports          | html-to-image                                   |
| Icons            | lucide-react                                    |

## Quick Start (Local)

```bash
# 1. Clone & enter
git clone https://github.com/yourusername/archsketch.git
cd archsketch

# 2. Install
npm install

# 3. Add your API key
cp .env.local.example .env.local
# Then paste your Anthropic key:
# ANTHROPIC_API_KEY=sk-ant-...

# (Optional: use OpenAI instead)
# OPENAI_API_KEY=sk-...
# USE_CLAUDE=false

# 4. Run
npm run dev
```

Open http://localhost:3000 and start sketching!

## Deploy Your Own (1-click)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Farchsketch)

Just add your `ANTHROPIC_API_KEY` (or OpenAI key) in Vercel project settings → done!

## Environment Variables

| Variable           | Description                            | Required |
|--------------------|----------------------------------------|----------|
| `ANTHROPIC_API_KEY`| Claude API key                         | Yes (if USE_CLAUDE=true) |
| `OPENAI_API_KEY`   | GPT-4o key (fallback/alternative)      | Yes (if USE_CLAUDE=false) |
| `USE_CLAUDE`       | Set to `false` to use OpenAI instead   | Optional (default: true) |

## Contributing

Feel free to open issues or PRs!  
Ideas on the roadmap:
- Save diagrams to accounts
- Diagram templates / presets
- Export to Draw.io, Excalidraw, PlantUML
- AI-powered best practice recommendations
- Multi-page architecture support

## License

MIT © 2025 – Feel free to use, modify, and ship!

---

Made with ❤️ by developers, for developers.  
Stop drawing boxes in PowerPoint — start sketching architectures in English.  

**ArchSketch – Because diagrams should be as easy as describing them.**