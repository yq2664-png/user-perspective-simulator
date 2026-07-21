import { openaiCreate, MODELS } from '../llm/openai.js';
import { buildProductUxReviewPrompt } from '../prompts/productUxReview.js';
import { extractJSON } from '../lib/json.js';

export default async function productUxReview(req, res) {
  const {
    productName,
    productStage,
    productType,
    coreFunctions,
    requirements,
    webLink,
    cards,
  } = req.body;

  const productDesc = requirements || coreFunctions || '';
  let perspectives = [];
  try {
    perspectives = cards ? JSON.parse(cards) : [];
  } catch {
    perspectives = [];
  }

  let webContent = '';
  if (productStage === 'web' && webLink) {
    try {
      const resp = await fetch(webLink, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(8000),
      });
      const html = await resp.text();
      webContent = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 6000);
    } catch {
      webContent = '';
    }
  }

  const content = [];
  const screenshots = req.files?.screenshots || [];
  for (const file of screenshots.slice(0, 3)) {
    if (file.mimetype.startsWith('image/')) {
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: file.mimetype, data: file.buffer.toString('base64') },
      });
    }
  }

  content.push({
    type: 'text',
    text: buildProductUxReviewPrompt({
      productName,
      productStage,
      productType,
      productDesc,
      webLink,
      webContent,
      perspectives,
    }),
  });

  try {
    const message = await openaiCreate(MODELS.prd, 5000, [{ role: 'user', content }]);
    const parsed = extractJSON(message.content[0].text);
    if (parsed) return res.json(parsed);
    return res.status(500).json({ error: 'Parse failed' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
