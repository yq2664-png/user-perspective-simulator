import { openaiCreate, MODELS } from '../llm/openai.js';
import { buildPRDPrompt } from '../prompts/prd.js';
import { extractJSON } from '../lib/json.js';

export default async function prd(req, res) {
  const { productName, insights, designReview, opportunities, uxReview } = req.body;
  const review = designReview || uxReview;
  try {
    const message = await openaiCreate(MODELS.prd, 5000, [{
      role: 'user',
      content: buildPRDPrompt(productName, insights, review, opportunities),
    }]);
    const parsed = extractJSON(message.content[0].text);
    if (parsed) res.json(parsed);
    else res.status(500).json({ error: 'Parse failed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
