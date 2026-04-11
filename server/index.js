const express = require('express');
const multer = require('multer');
const fs = require('fs/promises');
const pdf = require('pdf-parse');
const axios = require('axios');

const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const port = process.env.PORT || 5174;

app.post('/api/weightage', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const buffer = req.file.buffer;
    let text = '';

    if (req.file.mimetype === 'application/pdf' || req.file.originalname.endsWith('.pdf')) {
      const data = await pdf(buffer);
      text = data.text || '';
    } else {
      text = buffer.toString('utf8');
    }

    if (!text || text.trim().length < 20) {
      return res.status(400).json({ error: 'Uploaded file contains too little text to analyze.' });
    }

    // Build a clear instruction for the LLM to return strict JSON
    const instruction = `Extract the top exam topics and estimated weightage percentages from the following exam text. Return ONLY a JSON object with the structure:
{
  "summary": "short summary",
  "topics": [ { "name": "TopicName", "weight": 0, "examples": 0 } ],
  "suggestions": ["string"]
}

Respond with valid JSON only (no surrounding commentary).

Exam text:
${text.slice(0, 20000)}
`;

    const llmResponse = await callLLM(instruction);

    // Try to parse JSON from LLM response
    let parsed = null;
    if (typeof llmResponse === 'object') parsed = llmResponse;
    else {
      try {
        parsed = JSON.parse(llmResponse);
      } catch (e) {
        // try to extract JSON-like substring
        const m = llmResponse.match(/\{[\s\S]*\}/);
        if (m) {
          try { parsed = JSON.parse(m[0]); } catch (e2) { parsed = { raw: llmResponse }; }
        } else parsed = { raw: llmResponse };
      }
    }

    return res.json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
});

async function callLLM(prompt) {
  // Priority: GEMINI (if configured) -> OPENAI (if configured)
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_MODEL) {
    try {
      const endpoint = process.env.GEMINI_ENDPOINT || 'https://generativelanguage.googleapis.com';
      const url = `${endpoint}/v1beta2/models/${process.env.GEMINI_MODEL}:generateText?key=${process.env.GEMINI_API_KEY}`;
      const body = { prompt: { text: prompt }, temperature: 0.2 };
      const r = await axios.post(url, body, { timeout: 60000 });
      // Try common shapes
      if (r.data && r.data.candidates && r.data.candidates[0]) return r.data.candidates[0].output || r.data.candidates[0].content || JSON.stringify(r.data);
      if (r.data && r.data.answer) return r.data.answer;
      return JSON.stringify(r.data);
    } catch (e) {
      console.warn('Gemini call failed, falling back:', e.message || e);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const r = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant that outputs JSON only.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
          max_tokens: 1200,
        },
        { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, timeout: 60000 }
      );
      const text = r.data.choices && r.data.choices[0] && (r.data.choices[0].message?.content || r.data.choices[0].text);
      return text;
    } catch (e) {
      console.warn('OpenAI call failed:', e.message || e);
    }
  }

  // Last resort: simple heuristic fallback
  return fallbackHeuristics(prompt);
}

function fallbackHeuristics(text) {
  // Very naive: count occurrences of words that look like topics and assign weights
  const sample = text.slice(0, 8000).toLowerCase();
  const words = sample.match(/[a-zA-Z]+/g) || [];
  const freq = {};
  words.forEach((w) => { if (w.length > 4) freq[w] = (freq[w] || 0) + 1; });
  const entries = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,6);
  const topics = entries.map(([k,v],i) => ({ name: k.charAt(0).toUpperCase()+k.slice(1), weight: Math.max(5, Math.round((v/words.length)*100*3)), examples: Math.max(1, Math.round(v/10)) }));
  return { summary: 'Heuristic analysis (no LLM configured).', topics, suggestions: ['Configure GEMINI_API_KEY or OPENAI_API_KEY for accurate results.'] };
}

app.listen(port, () => console.log(`API server listening on http://localhost:${port}`));
