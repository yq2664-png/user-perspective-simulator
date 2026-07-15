const NIELSEN_HEURISTICS = [
  { number: 1, name: 'Visibility of System Status' },
  { number: 2, name: 'Match Between System and the Real World' },
  { number: 3, name: 'User Control and Freedom' },
  { number: 4, name: 'Consistency and Standards' },
  { number: 5, name: 'Error Prevention' },
  { number: 6, name: 'Recognition Rather Than Recall' },
  { number: 7, name: 'Flexibility and Efficiency of Use' },
  { number: 8, name: 'Aesthetic and Minimalist Design' },
  { number: 9, name: 'Help Users Recognize, Diagnose, and Recover from Errors' },
  { number: 10, name: 'Help and Documentation' },
];

function formatPerspectives(cards) {
  return cards.map(c => {
    const label = c.perspective || c.persona || 'User';
    const driver = c.driver || c.emotion || '';
    return `[${label}${driver ? ` — ${driver}` : ''}]\nThought: "${c.thought}"${c.worry ? `\nWorry: ${c.worry}` : ''}${c.assumption ? `\nAssumption: ${c.assumption}` : ''}`;
  }).join('\n\n');
}

export function buildUxReviewPrompt(productName, insights, cards) {
  const heuristicList = NIELSEN_HEURISTICS
    .map(h => `${h.number}. ${h.name}`)
    .join('\n');

  return `You are a senior UX researcher performing an evidence-based heuristic evaluation for ${productName}.

This is NOT a generic checklist exercise. Infer which Nielsen heuristics are actually violated or at risk based on the user perspectives and behavioral insights below. Only flag issues that are directly supported by the evidence.

Nielsen's 10 Usability Heuristics:
${heuristicList}

User perspectives:
${formatPerspectives(cards)}

Behavioral insights:
${JSON.stringify(insights, null, 2)}

For each issue, you MUST trace this chain:
User Perspective → Behavioral Insight → Nielsen Heuristic → Design Recommendation

Rules:
- Do NOT generate issues without supporting evidence from the perspectives and insights above.
- "evidence" must cite observable user behavior or quotes derived from the perspectives (not invented).
- "behavioralInsight" must reference or paraphrase a specific insight title or finding from the insights data.
- "sourcePerspective" must name the exact perspective label from the user perspectives (e.g. "Looking for Simplicity").
- "sourceInsightTitle" must name the exact insight title from the behavioral insights.
- "heuristic" must be one of the 10 Nielsen heuristic names listed above (use the exact name).
- "heuristicNumber" must be the matching number (1–10).
- "heuristicRelevance" must explain WHY this heuristic applies to this specific issue.
- "recommendation" must be a concrete, actionable design improvement — not vague advice.
- "severity": "Low" | "Medium" | "High" — based on user impact and frequency implied by the evidence.
- "confidence": integer 0–100 — how strongly the evidence supports this heuristic violation.
- Generate 4–8 issues. Prioritize the most evidence-backed findings.
- Sort by severity (High first), then confidence descending.
- If evidence is thin for a potential issue, omit it rather than speculate.

Also compute a summary:
- "overallScore": integer 0–100 — holistic UX quality score based on severity and count of issues (100 = excellent, lower = more risk).
- "topUsabilityRisks": array of exactly 3 short risk statements derived from the highest-severity issues.
- "criticalIssueCount": count of issues with severity "High".

Return ONLY valid JSON:
{
  "title": "${productName} — UX Design Review",
  "framework": "Nielsen's 10 Usability Heuristics",
  "summary": {
    "overallScore": 62,
    "topUsabilityRisks": [
      "Users cannot recover previous selections without re-entering data",
      "Inconsistent labeling causes confusion across workflows",
      "No visible feedback during long-running operations"
    ],
    "criticalIssueCount": 2
  },
  "issues": [
    {
      "id": 1,
      "heuristic": "Recognition Rather Than Recall",
      "heuristicNumber": 6,
      "heuristicRelevance": "Why this heuristic is violated or at risk for this product",
      "evidence": "Observable user behavior or quote from perspectives",
      "behavioralInsight": "The supporting behavioral insight from the research",
      "recommendation": "Specific design improvement",
      "severity": "High",
      "confidence": 92,
      "sourcePerspective": "Looking for Simplicity",
      "sourceInsightTitle": "Exact insight title from the insights data"
    }
  ]
}`;
}
