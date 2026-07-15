import { openaiCreate, MODELS } from '../llm/openai.js';
import { buildOpportunitiesPrompt } from '../prompts/opportunities.js';
import { extractJSON } from '../lib/json.js';

export default async function opportunities(req, res) {
  const { productName, insights, cards } = req.body;
  if (!insights || !cards?.length) {
    return res.status(400).json({ error: 'Insights and perspective cards are required' });
  }
  try {
    const message = await openaiCreate(MODELS.fast, 4000, [{
      role: 'user',
      content: buildOpportunitiesPrompt(productName, insights, cards),
    }]);
    const parsed = extractJSON(message.content[0].text);
    if (parsed) res.json(parsed);
    else res.status(500).json({ error: 'Parse failed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
