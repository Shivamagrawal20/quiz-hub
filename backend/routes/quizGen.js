import express from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import adminAuth from '../middleware/adminAuth.js';
import admin from 'firebase-admin';

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

// Helper: Extract text from PDF using a simpler approach
function extractTextFromPDF(filePath) {
  return new Promise((resolve, reject) => {
    try {
      // For now, return a placeholder message since PDF2JSON is unreliable
      // In a production environment, you might want to use a different PDF parsing library
      const fileName = path.basename(filePath);
      resolve(`PDF file uploaded: ${fileName}. Please manually create questions based on the document content. The PDF parsing service is currently being improved.`);
    } catch (err) {
      reject(new Error('Error processing PDF: ' + err.message));
    }
  });
}

// Helper: Parse file to text
async function extractText(filePath, mimetype) {
  if (mimetype === 'application/pdf' || filePath.endsWith('.pdf')) {
    try {
      return await extractTextFromPDF(filePath);
    } catch (err) {
      console.error('PDF parsing failed with pdf2json, trying fallback:', err.message);
      // Fallback: return a simple message that the PDF was uploaded
      return `PDF file uploaded: ${path.basename(filePath)}. Please manually create questions based on the document content.`;
    }
  } else if (
    mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    filePath.endsWith('.docx')
  ) {
    try {
    const data = await mammoth.extractRawText({ path: filePath });
    return data.value;
    } catch (err) {
      console.error('DOCX parsing failed:', err.message);
      return `DOCX file uploaded: ${path.basename(filePath)}. Please manually create questions based on the document content.`;
    }
  } else if (mimetype === 'text/plain' || filePath.endsWith('.txt')) {
    try {
    return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.error('TXT parsing failed:', err.message);
      return `Text file uploaded: ${path.basename(filePath)}. Please manually create questions based on the document content.`;
    }
  } else {
    throw new Error('Unsupported file type');
  }
}

// Helper: Call Gemini API to generate quiz
async function generateQuizFromText(text, questionCount = 5) {
  try {
    // Check if we have a valid API key
  const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key found:', apiKey ? 'Yes' : 'No');
    if (!apiKey) {
      console.log('No Gemini API key found, generating basic questions');
      return generateBasicQuestions(text, questionCount);
    }

    const prompt = `Generate exactly ${questionCount} diverse and challenging multiple-choice questions from the following document text. Each question should:
    1. Test different aspects of the content (concepts, details, applications)
    2. Have 1 correct answer and 3 plausible but incorrect options
    3. Be specific to the content provided
    4. Avoid repetitive question patterns
    5. Use clear, concise language
    
    IMPORTANT: You MUST generate exactly ${questionCount} questions. If the content is limited, create additional questions by:
    - Asking about different interpretations of the same concepts
    - Creating application-based questions
    - Asking about related concepts or implications
    - Creating scenario-based questions
    
    Return ONLY valid JSON in this exact format:
    {
      "questions": [
        {
          "question": "Specific question about the content?",
          "options": ["Correct answer", "Plausible wrong answer", "Another wrong answer", "Third wrong answer"],
          "answer": "A"
        }
      ]
    }
    
    Document text: ${questionCount > 50 ? text.slice(0, 15000) : text.slice(0, 8000)}`;
    
    console.log('Making Gemini API call...');
    console.log('API Key (first 10 chars):', apiKey.substring(0, 10) + '...');
    console.log('Prompt length:', prompt.length);
    
  const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );
    
    console.log('Gemini API response received');
    console.log('Response status:', response.status);
    console.log('Response data keys:', Object.keys(response.data));
    
    // Parse Gemini response
  const quizText = response.data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini response:', quizText.substring(0, 200) + '...');

    // Clean the response - remove markdown code blocks if present
    let cleanText = quizText.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\n/, '').replace(/\n```$/, '');
    }
    
    console.log('Cleaned response:', cleanText.substring(0, 200) + '...');

    try {
      const parsed = JSON.parse(cleanText);
      console.log('Successfully parsed Gemini response');
      
      // Ensure we have the requested number of questions
      if (parsed.questions && parsed.questions.length < questionCount) {
        console.log(`AI generated ${parsed.questions.length} questions, but ${questionCount} were requested. Generating additional questions...`);
        
        // Generate additional questions using basic method
        const additionalQuestions = generateBasicQuestions(text, questionCount - parsed.questions.length);
        
        // Combine the questions
        parsed.questions = [...parsed.questions, ...additionalQuestions.questions];
        
        console.log(`Total questions after combination: ${parsed.questions.length}`);
      }
      
      // Final check - if we still don't have enough questions, create more basic ones
      if (!parsed.questions || parsed.questions.length < questionCount) {
        console.log(`Still need ${questionCount - (parsed.questions?.length || 0)} more questions. Creating basic questions...`);
        const remainingQuestions = generateBasicQuestions(text, questionCount - (parsed.questions?.length || 0));
        parsed.questions = [...(parsed.questions || []), ...remainingQuestions.questions];
        console.log(`Final question count: ${parsed.questions.length}`);
      }
      
      return parsed;
    } catch (parseErr) {
      console.error('Failed to parse Gemini response as JSON:', parseErr);
      console.error('Raw response was:', quizText);
      console.error('Cleaned response was:', cleanText);
      return generateBasicQuestions(text, questionCount);
    }
  } catch (err) {
    console.error('Gemini API call failed:', err.message);
    console.error('Full error:', err);
    return generateBasicQuestions(text, questionCount);
  }
}

// Fallback function to generate basic questions
function generateBasicQuestions(text, questionCount = 5) {
  const questions = [];
  
  // Clean and split text into meaningful chunks
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 15);
  
  // Extract key terms and concepts
  const words = cleanText.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq = {};
  words.forEach(word => {
    if (word.length > 3) { // Only consider words longer than 3 characters
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  // Get most common terms
  const commonTerms = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
  
  // Create questions based on content
  for (let i = 0; i < questionCount; i++) {
    let sentence = "";
    if (i < sentences.length) {
      sentence = sentences[i].trim();
      if (sentence.length < 10) {
        // If sentence is too short, create a general question
        sentence = cleanText.substring(0, 100);
      }
    } else {
      // If we run out of sentences, use the full text or create general questions
      sentence = cleanText.substring(0, 100);
    }
    
    // Extract key information from sentence
    const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    const keyTerms = commonTerms.filter(term => sentenceWords.includes(term));
    
    // Create question based on content
    let questionText = "";
    let correctAnswer = "";
    let options = [];
    
    if (keyTerms.length > 0) {
      // Question about key terms
      const mainTerm = keyTerms[0];
      questionText = `What is the main topic discussed in: "${sentence.substring(0, 100)}..."?`;
      correctAnswer = mainTerm.charAt(0).toUpperCase() + mainTerm.slice(1);
      options = [
        correctAnswer,
        `Alternative ${mainTerm}`,
        `Related to ${mainTerm}`,
        `Different from ${mainTerm}`
      ];
    } else {
      // Create more diverse questions when content is limited
      const questionTypes = [
        {
          text: `Based on the text: "${sentence.substring(0, 80)}...", what is being described?`,
          answer: "The main topic",
          options: ["The main topic", "A different subject", "An unrelated concept", "A secondary topic"]
        },
        {
          text: `What type of content is this: "${sentence.substring(0, 80)}..."?`,
          answer: "Educational material",
          options: ["Educational material", "Technical documentation", "General information", "Personal notes"]
        },
        {
          text: `What is the purpose of this text: "${sentence.substring(0, 80)}..."?`,
          answer: "To inform or educate",
          options: ["To inform or educate", "To entertain", "To persuade", "To confuse"]
        },
        {
          text: `What category does this content belong to: "${sentence.substring(0, 80)}..."?`,
          answer: "Information sharing",
          options: ["Information sharing", "Storytelling", "Advertising", "Technical writing"]
        }
      ];
      
      const questionType = questionTypes[i % questionTypes.length];
      questionText = questionType.text;
      correctAnswer = questionType.answer;
      options = questionType.options;
    }
    
    // Ensure options are unique
    options = [...new Set(options)];
    while (options.length < 4) {
      options.push(`Option ${options.length + 1}`);
    }
    
    questions.push({
      question: questionText,
      options: options.slice(0, 4),
      answer: "A" // Default to first option
    });
  }
  
  // If no meaningful questions created, create basic ones
  if (questions.length === 0) {
    const basicQuestions = [
      {
        question: "What is the main topic of this document?",
        options: ["The primary subject", "A secondary topic", "An unrelated concept", "A minor detail"],
        answer: "A"
      },
      {
        question: "What type of document is this?",
        options: ["Educational material", "Technical document", "General information", "Personal notes"],
        answer: "A"
      }
    ];
    return { questions: basicQuestions };
  }
  
  return { questions };
}

// POST /upload: Upload file, parse, generate quiz
router.post('/upload', adminAuth, upload.single('file'), async (req, res) => {
  console.log("Received /upload request");
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Get question count from request body or query params
    const questionCount = parseInt(req.body.questionCount || req.query.questionCount || 5);
    if (isNaN(questionCount) || questionCount < 1 || questionCount > 100) {
      return res.status(400).json({ error: 'Question count must be between 1 and 100' });
    }
    
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
      quiz = await generateQuizFromText(text, questionCount);
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

// GET /test-api-key: Test if the API key is loaded
router.get('/test-api-key', adminAuth, (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  res.json({ 
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none'
  });
});

// GET /test-gemini: Test Gemini API directly
router.get('/test-gemini', adminAuth, async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ error: 'No API key found' });
    }
    
    console.log('Testing Gemini API directly...');
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey,
      {
        contents: [{ parts: [{ text: "Say hello and respond with just the word TEST" }] }]
      }
    );
    
    const result = response.data.candidates[0].content.parts[0].text;
    res.json({ 
      success: true, 
      result: result,
      responseKeys: Object.keys(response.data)
    });
  } catch (err) {
    console.error('Gemini test failed:', err.message);
    res.json({ 
      error: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
  }
});

// GET /test-question-generation: Test question generation specifically
router.get('/test-question-generation', adminAuth, async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({ error: 'No API key found' });
    }
    
    const testText = "Linked lists are a fundamental data structure in computer science.";
    const prompt = `Generate 2 multiple-choice questions from this text: "${testText}"

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "What is the main topic?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "A"
    }
  ]
}`;
    
    console.log('Testing question generation...');
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + apiKey,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );
    
    const rawResponse = response.data.candidates[0].content.parts[0].text;
    console.log('Raw AI response:', rawResponse);
    
    try {
      const parsed = JSON.parse(rawResponse);
      res.json({ 
        success: true, 
        rawResponse: rawResponse,
        parsed: parsed,
        isValidJson: true
      });
    } catch (parseErr) {
      res.json({ 
        success: false, 
        rawResponse: rawResponse,
        parseError: parseErr.message,
        isValidJson: false
      });
    }
  } catch (err) {
    console.error('Question generation test failed:', err.message);
    res.json({ 
      error: err.message,
      status: err.response?.status,
      data: err.response?.data
    });
  }
});

// POST /generate-questions: Generate questions from text using AI
router.post('/generate-questions', adminAuth, async (req, res) => {
  try {
    const { text, questionCount = 5 } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required' });
    }
    
    // Validate question count
    const count = parseInt(questionCount);
    if (isNaN(count) || count < 1 || count > 100) {
      return res.status(400).json({ error: 'Question count must be between 1 and 100' });
    }
    
    console.log(`Generating ${count} AI questions from text...`);
    const quiz = await generateQuizFromText(text, count);
    
    return res.json({ 
      success: true, 
      questions: quiz.questions || [],
      message: `${count} questions generated successfully using AI`
    });
  } catch (err) {
    console.error('Error in /generate-questions:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate questions' });
  }
});

// POST /save: Save quiz to Firestore
router.post('/save', adminAuth, async (req, res) => {
  try {
    const { quiz, meta } = req.body; // meta: { title, createdBy, etc. }
    if (!quiz) return res.status(400).json({ error: 'No quiz data' });
    
    // Ensure questions array is properly structured
    const quizData = {
      ...meta,
      ...quiz,
      questions: Array.isArray(quiz.questions) ? quiz.questions : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Spread quiz fields into the document, so questions is an array
    const docRef = await firestore.collection('quizzes').add(quizData);
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