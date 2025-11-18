import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';
import { openai } from '@/lib/openai';
export const maxDuration = 60; // important for Vercel
export const dynamic = 'force-dynamic';

const USE_CLAUDE = process.env.USE_CLAUDE === 'true';

const SYSTEM_PROMPT = `You are an expert software architect and diagram specialist.
Convert the user's natural language description into Mermaid flowchart syntax (graph TD direction).

Rules:
- Use meaningful node IDs (e.g., FE, BE, DB, Cache, Auth, CDN)
- Group related components with subgraphs when logical (e.g., subgraph Frontend, subgraph Backend, subgraph Cloud)
- Use FontAwesome-like icons if possible: -->|HTTPS| or custom classDef with :::icon
- Prefer horizontal layout (graph LR) for most architectures
- Add third-party services in dashed boxes when appropriate
- Detect deployment targets (AWS, Azure, Vercel, etc.) and show as a cloud container
- Always return ONLY valid Mermaid code inside \`\`\`mermaid ... \`\`\` block
- After the diagram, optionally add a short JSON with suggestions in this exact format:

{
  "suggestions": [
    "You didn't mention authentication — consider adding Auth0 or Firebase Auth",
    "No CI/CD pipeline mentioned"
  ]
}

Example input: "React frontend, FastAPI backend, PostgreSQL database, Redis cache, deployed on AWS"
Example output:
\`\`\`mermaid
graph LR
    subgraph Frontend [Frontend]
        FE[React App]
    end
    subgraph Backend [Backend]
        BE[FastAPI]
        Cache[Redis]
    end
    subgraph Database [Database]
        DB[(PostgreSQL)]
    end
    subgraph Cloud [AWS Cloud]
        direction TB
        Frontend --> Backend
        Backend --> Cache
        Backend --> DB
    end
    classDef frontend fill:#1e40af,stroke:#fff,color:#fff
    classDef backend fill:#166534,stroke:#fff,color:#fff
    classDef db fill:#9f1239,stroke:#fff,color:#fff
    class FE frontend
    class BE,Cache backend
    class DB db
\`\`\`

{
  "suggestions": []
}`;

export async function POST(req: NextRequest) {
  try {
    const { description, previousMermaid } = await req.json();

    if (!description?.trim()) {
      return NextResponse.json({ error: 'Description required' }, { status: 400 });
    }

    const userMessage = previousMermaid
      ? `Here is the previous diagram. Refine it based on this new description:\n\nPrevious Mermaid:\n${previousMermaid}\n\nNew description: ${description}`
      : description;

    let mermaidCode: string;
    let suggestions: string[] = [];

    if (USE_CLAUDE) {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 4096,
        temperature: 0.3,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      mermaidCode = extractMermaid(text);
      suggestions = extractSuggestions(text);
    } else {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0.3,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
      });
      const text = response.choices[0].message.content || '';
      mermaidCode = extractMermaid(text);
      suggestions = extractSuggestions(text);
    }

    return NextResponse.json({ mermaid: mermaidCode, suggestions });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate diagram' },
      { status: 500 }
    );
  }
}

function extractMermaid(text: string): string {
  const match = text.match(/```mermaid\s*([\s\S]*?)\s*```/);
  return match ? match[1].trim() : text.trim();
}

function extractSuggestions(text: string): string[] {
  try {
    const jsonMatch = text.match(/\{[\s\S]*"suggestions"[\s\S]*\}/);
    if (jsonMatch) {
      const obj = JSON.parse(jsonMatch[0]);
      return obj.suggestions || [];
    }
  } catch {}
  return [];
}