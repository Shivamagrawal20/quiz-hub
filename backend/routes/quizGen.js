import express from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import adminAuth from '../middleware/adminAuth.js';
import admin from 'firebase-admin';
import PDFParser from 'pdf2json';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL('../serviceAccountKey.json', import.meta.url))
);
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const firestore = admin.firestore();

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Helper: Extract text from PDF using pdf2json
function extractTextFromPDF(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataError', errData => reject(new Error(errData.parserError)));
    pdfParser.on('pdfParser_dataReady', pdfData => {
      const text = pdfData.formImage.Pages.map(page =>
        page.Texts.map(textObj => decodeURIComponent(textObj.R.map(r => r.T).join(''))).join(' ')
      ).join('\n');
      resolve(text);
    });
    pdfParser.loadPDF(filePath);
  });
}

// Helper: Parse file to text
async function extractText(filePath, mimetype) {
  if (mimetype === 'application/pdf' || filePath.endsWith('.pdf')) {
    try {
      return await extractTextFromPDF(filePath);
    } catch (err) {
      throw new Error('Failed to parse PDF: ' + (err.message || err));
    }
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    filePath.endsWith('.docx')
  ) {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
  } else if (mimetype === 'text/plain' || filePath.endsWith('.txt')) {
    return fs.readFileSync(filePath, 'utf8');
  } else {
    throw new Error('Unsupported file type');
  }
}

// Helper: Call Gemini API to generate quiz
async function generateQuizFromText(text) {
  // Replace with your Gemini API call
  const apiKey = process.env.GEMINI_API_KEY;
  const prompt = `Generate 5 multiple-choice questions from the following document text. Each question should have 1 correct answer and 3 incorrect options. Return the output in JSON format.\n\nText: ${text.slice(0, 4000)}`;
  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );
  // Parse Gemini response (adjust as needed)
  const quizText = response.data.candidates[0].content.parts[0].text;
  return JSON.parse(quizText);
}

// POST /upload: Upload file, parse, generate quiz
router.post('/upload', adminAuth, upload.single('file'), async (req, res) => {
  console.log("Received /upload request");
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    let text;
    try {
      text = await extractText(file.path, file.mimetype);
      console.log("Text extraction complete");
    } catch (parseErr) {
      console.error('PDF/Text extraction error:', parseErr);
      return res.status(500).json({ error: 'Failed to extract text from file: ' + (parseErr.message || parseErr) });
    }
    // Clean up file
    fs.unlinkSync(file.path);
    // Call Gemini API
    let quiz;
    try {
      quiz = await generateQuizFromText(text);
    } catch (aiErr) {
      console.error('AI quiz generation error:', aiErr);
      return res.status(500).json({ error: 'Failed to generate quiz: ' + (aiErr.message || aiErr) });
    }
    return res.json({ quiz });
  } catch (err) {
    console.error('Error in /upload:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// POST /save: Save quiz to Firestore
router.post('/save', adminAuth, async (req, res) => {
  try {
    const { quiz, meta } = req.body; // meta: { title, createdBy, etc. }
    if (!quiz) return res.status(400).json({ error: 'No quiz data' });
    // Spread quiz fields into the document, so questions is an array
    const docRef = await firestore.collection('quizzes').add({ ...meta, ...quiz });
    return res.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error('Error in /save:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Top-level error handler for this router (fallback)
router.use((err, req, res, next) => {
  console.error('Unhandled error in quizGen router:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default router; 