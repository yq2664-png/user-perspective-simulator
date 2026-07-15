function formatPerspectives(cards) {
  return cards.map(c => {
    const label = c.perspective || c.persona || 'User';
    return `[${label}]\nThought: "${c.thought}"${c.worry ? `\nWorry: ${c.worry}` : ''}`;
  }).join('\n\n');
}

export function buildReasoningPrompt(productName, insights, cards) {
  return `You are a senior UX researcher synthesizing how user perspectives connect to behavioral insights for ${productName}.

This is the reasoning bridge between raw user reactions and design action. Trace explicit connections — do not invent links without evidence.

User perspectives:
${formatPerspectives(cards)}

Behavioral insights:
${JSON.stringify(insights, null, 2)}

For each thread, trace:
User Perspective → Observable Evidence → Behavioral Insight → Underlying Pattern

Rules:
- "userEvidence" must cite observable behavior or quotes from perspectives.
- "behavioralInsight" must reference or paraphrase a specific insight finding.
- "insightTitle" must name the exact insight title from the insights data.
- "pattern" describes the underlying behavioral pattern in one sentence.
- "perspective" must name the exact perspective label from user perspectives.
- confidence: integer 0–100
- Generate 3–5 threads, sorted by confidence descending.
- synthesis: 1–2 short sentences, max 35 words total. One clear behavioral takeaway — no lists, no repetition of thread details.

Return ONLY valid JSON:
{
  "title": "${productName} — Reasoning Synthesis",
  "synthesis": "One concise sentence on what the evidence reveals.",
  "threads": [
    {
      "id": 1,
      "perspective": "Looking for Simplicity",
      "userEvidence": "Observable quote or behavior",
      "behavioralInsight": "The supporting insight finding",
      "insightTitle": "Exact insight title",
      "pattern": "Underlying behavioral pattern",
      "confidence": 90
    }
  ]
}`;
}
