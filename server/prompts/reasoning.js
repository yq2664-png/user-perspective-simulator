function formatPerspectives(cards) {
  return cards.map(c => {
    const label = c.perspective || c.persona || 'User';
    return `[${label}]\nThought: "${c.thought}"${c.worry ? `\nWorry: ${c.worry}` : ''}`;
  }).join('\n\n');
}

function formatUxFindings(uxExpertReview) {
  if (!uxExpertReview?.findings?.length) return '';
  return `\n\nUX Expert Perspective findings:\n${JSON.stringify(uxExpertReview.findings, null, 2)}`;
}

export function buildReasoningPrompt(productName, insights, cards, uxExpertReview) {
  return `You are a senior UX researcher synthesizing how evidence connects for ${productName}.

Combine three sources in every thread when possible:
1. User Evidence (from perspectives)
2. Behavior Patterns (from insights)
3. UX Findings (from UX Expert Perspective)

Do not invent links without evidence.

User perspectives:
${formatPerspectives(cards)}

Behavioral insights:
${JSON.stringify(insights, null, 2)}${formatUxFindings(uxExpertReview)}

For each thread, trace:
User Evidence → Behavioral Insight → UX Finding → Design Implication

Rules:
- "userEvidence" must cite observable behavior or quotes from perspectives.
- "behavioralInsight" must reference or paraphrase a specific insight finding.
- "insightTitle" must name the exact insight title from the insights data.
- "uxFinding" must cite a title or finding from UX Expert Perspective when available; if none applies, write a short UX finding grounded in the same evidence.
- "pattern" is the design implication — what this means for product/design decisions, in one sentence.
- "perspective" must name the exact perspective label from user perspectives.
- confidence: integer 0–100
- Generate 3–5 threads, sorted by confidence descending.
- Prefer threads that connect user evidence + behavioral insights + UX findings.
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
      "uxFinding": "Onboarding Complexity — users struggle to know where to start",
      "pattern": "Design implication: reduce early complexity before asking for commitment",
      "confidence": 90
    }
  ]
}`;
}
