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

export function buildProductUxReviewPrompt({
  productName,
  productStage,
  productType,
  productDesc,
  webLink,
  webContent,
  perspectives,
}) {
  const heuristicList = NIELSEN_HEURISTICS.map(h => `${h.number}. ${h.name}`).join('\n');

  const perspectiveBlock = perspectives?.length
    ? `\nUser perspectives (cross-check only — focus on the product interface):\n${perspectives
        .map((c, i) => `${i + 1}. [${c.perspective || c.persona || 'User'}] "${c.thought}"`)
        .join('\n')}`
    : '';

  const contextBlock = [
    productStage ? `Stage: ${productStage}` : '',
    productType ? `Type: ${productType}` : '',
    webLink ? `URL: ${webLink}` : '',
    productDesc ? `Description:\n${productDesc}` : '',
    webContent ? `Live page text (truncated):\n${webContent}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `You are a senior UX expert writing UX Expert Perspective findings for ${productName || 'this product'}.

Use Nielsen's 10 Usability Heuristics as the analytical basis (do NOT mention Nielsen numbers in titles or finding text):
${heuristicList}

Inspect the product itself — screens, flows, and interface areas — and produce key findings that later Insights, Reasoning, and Decisions stages can cite.

Product context:
${contextBlock || '(Limited context — infer typical screens from product name and type.)'}${perspectiveBlock}

Rules:
- Do NOT write an overall product conclusion or review essay.
- Do NOT use phrases like "Overall, the product presents..." or score the product holistically.
- Each finding is one UX issue that can be referenced downstream.
- "title": short finding name (3–5 words), e.g. "Onboarding Complexity".
- "finding": plain-language UX finding — what users cannot easily do or understand. No heuristic numbers.
- "why": one sentence explaining the cause in usability terms (e.g. relies on memory rather than recognition).
- "principle": exact heuristic name from the list above (no number, no "Nielsen" prefix).
- "recommendation": concrete, actionable fix.
- "impact": "Low" | "Medium" | "High".
- Generate 4–6 findings. Sort by impact (High first).

Return ONLY valid JSON:
{
  "title": "${productName || 'Product'} — UX Expert Perspective",
  "findings": [
    {
      "id": 1,
      "title": "Onboarding Complexity",
      "finding": "New users may struggle to understand where to start due to the complexity of available features.",
      "why": "The interface presents too many options at once and relies on prior product knowledge.",
      "principle": "Recognition Rather Than Recall",
      "recommendation": "Provide clearer onboarding guidance and progressive disclosure.",
      "impact": "High"
    }
  ]
}`;
}
