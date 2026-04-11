require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer'); // Handles file uploads
const pdf = require('pdf-parse'); // Reads PDF text
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

// 2. Setup File Upload (Ram storage is fine for now)
const upload = multer({ storage: multer.memoryStorage() });

// 3. The "Analyze" Route
app.post('/analyze', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        console.log("File received:", req.file.originalname);

        // A. Extract Text from PDF
        const pdfData = await pdf(req.file.buffer);
        const extractedText = (pdfData.text || '').substring(0, 30000); // Limit text to avoid errors

        // B. Send to Gemini
        const prompt = `
            Analyze this exam paper text. Identify weak areas and predict high-weightage topics for the next exam.
            Return ONLY raw JSON. format:
            {
                "weak_topics": ["topic1", "topic2"],
                "predicted_questions": ["question1", "question2"],
                "study_plan": "Short strategy here"
            }
            
            Exam Text: ${extractedText}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text;
        try {
            // response.text may be a function or string depending on client
            text = typeof response.text === 'function' ? await response.text() : String(response);
        } catch (e) {
            console.warn('Could not read response.text(), using raw result:', e.message || e);
            text = JSON.stringify(response);
        }

        console.log('LLM raw output (first 1000 chars):', text.slice(0, 1000));

        // C. Clean up the JSON (Gemini sometimes adds ```json markers)
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const parsed = JSON.parse(text);
            return res.json(parsed);
        } catch (parseErr) {
            console.warn('Failed to parse LLM JSON output, returning raw text');
            return res.json({ raw: text });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Analysis failed" });
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
