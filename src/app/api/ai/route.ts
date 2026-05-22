import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the Groq client.
// It automatically picks up the GROQ_API_KEY environment variable.
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, context } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { text: "[SYSTEM]: No GROQ_API_KEY found in .env.local. Add your key to enable the AI Auditor." },
        { status: 200 }
      );
    }

    const systemPrompt = `You are 'Apex Auditor', an elite AI performance engineer.
STRICT GUARDRAILS & FORMATTING:
1. You are NOT a general chatbot. Reject non-performance queries with exactly: "INVALID QUERY: Outside operational parameters."
2. DO NOT use markdown (no asterisks **, no hash symbols #).
3. Do not write massive paragraphs. Format your response structurally using plain text labels, for example:
STATUS: Suboptimal
ANALYSIS: Core Vitals indicate room for improvement...
ACTION: Enable CDN to reduce latency...
4. Use normal sentence casing for explanations, only use UPPERCASE for labels.

CURRENT SYSTEM STATE:
[SCORE: ${context?.perfScore ?? 100}/100]
[CDN: ${context?.cdnEnabled ? 'ONLINE' : 'OFFLINE'}]
[JS: ${context?.deferJs ? 'OPTIMIZED' : 'UNMINIFIED'}]
[WEIGHT: ${context?.pageWeight ?? '1.46 MB'}]
[LATENCY: ${context?.estimatedLatency ?? 38}ms]
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.1-8b-instant', // Upgraded to active model
      temperature: 0.3,
      max_tokens: 150,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "No diagnosis generated.";

    return NextResponse.json({ text: reply });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
  }
}
