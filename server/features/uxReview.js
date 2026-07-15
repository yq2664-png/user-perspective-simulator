import { openaiCreate, MODELS } from '../llm/openai.js';
import { buildUxReviewPrompt } from '../prompts/uxReview.js';
import { extractJSON } from '../lib/json.js';

export default async function uxReview(req, res) {
  const { productName, insights, cards } = req.body;
  if (!insights || !cards || cards.length === 0) {
    return res.status(400).json({ error: 'Insights and perspective cards are required' });
  }
  try {
    const message = await openaiCreate(MODELS.prd, 6000, [{
      role: 'user',
      content: buildUxReviewPrompt(productName, insights, cards),
    }]);
    const text = message.content[0].text;
    const parsed = extractJSON(text);
    if (parsed) res.json(parsed);
    else res.status(500).json({ error: 'Parse failed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
