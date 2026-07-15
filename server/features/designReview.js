import { openaiCreate, MODELS } from '../llm/openai.js';
import { buildDesignReviewPrompt } from '../prompts/designReview.js';
import { extractJSON } from '../lib/json.js';

export default async function designReview(req, res) {
  const { productName, insights, cards, opportunities } = req.body;
  if (!insights || !cards?.length) {
    return res.status(400).json({ error: 'Insights and perspective cards are required' });
  }
  try {
    const message = await openaiCreate(MODELS.prd, 8000, [{
      role: 'user',
      content: buildDesignReviewPrompt(productName, insights, cards, opportunities),
    }]);
    const parsed = extractJSON(message.content[0].text);
    if (parsed) res.json(parsed);
    else res.status(500).json({ error: 'Parse failed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
