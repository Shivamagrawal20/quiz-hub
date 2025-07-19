import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
// @ts-ignore
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// Fallback: use a local worker file in public/
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Function to generate questions using AI
async function generateAIQuestions(text: string, questionCount: number = 5) {
  try {
    // Use Gemini API directly
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.warn('Gemini API key not found, using fallback generation');
      return generateBasicQuestions(text, questionCount);
    }

    console.log('Generating AI questions using Gemini API...');
    
    // Prepare the prompt for Gemini
    const prompt = `Generate ${questionCount} diverse and challenging multiple-choice questions from the following document text. Each question should:
    1. Test different aspects of the content (concepts, details, applications)
    2. Have 1 correct answer and 3 plausible but incorrect options
    3. Be specific to the content provided
    4. Avoid repetitive question patterns
    5. Use clear, concise language
    
    Return the output in JSON format with this exact structure:
    {
      "questions": [
        {
          "question": "Specific question about the content?",
          "options": ["Correct answer", "Plausible wrong answer", "Another wrong answer", "Third wrong answer"],
          "answer": "A"
        }
      ]
    }
    
    Document text: ${text.slice(0, 8000)}`; // Limit text length to avoid token limits

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const rawResponse = data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini response:', rawResponse);

    // Clean the response to extract JSON
    let cleanedResponse = rawResponse;
    if (rawResponse.includes('```json')) {
      cleanedResponse = rawResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    console.log('Cleaned response:', cleanedResponse);

    // Parse the JSON response
    const parsedResponse = JSON.parse(cleanedResponse);
    
    if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
      throw new Error('Invalid question format from Gemini API');
    }

    console.log('Successfully parsed Gemini response');
    return parsedResponse.questions.slice(0, questionCount);

  } catch (error) {
    console.error('AI question generation failed:', error);
    console.log('Falling back to basic question generation...');
    // Fallback to basic questions
    return generateBasicQuestions(text, questionCount);
  }
}

// Enhanced fallback function to generate basic questions
function generateBasicQuestions(text: string, questionCount: number = 5) {
  const questions = [];
  
  // Clean and split text into meaningful chunks
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Extract key terms and concepts
  const words = cleanText.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFreq = {};
  words.forEach(word => {
    if (word.length > 3 && !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'about', 'many', 'then', 'them', 'these', 'some', 'what', 'when', 'where', 'your', 'very', 'just', 'into', 'than', 'more', 'only', 'over', 'such', 'most', 'make', 'like', 'through', 'back', 'after', 'work', 'first', 'well', 'should', 'because', 'think', 'look', 'before', 'great', 'where', 'help', 'through', 'much', 'before', 'line', 'right', 'too', 'mean', 'old', 'any', 'same', 'tell', 'boy', 'follow', 'came', 'want', 'show', 'also', 'around', 'form', 'three', 'small', 'set', 'put', 'end', 'does', 'another', 'well', 'large', 'must', 'big', 'even', 'such', 'because', 'turn', 'here', 'why', 'ask', 'went', 'men', 'read', 'need', 'land', 'different', 'home', 'us', 'move', 'try', 'kind', 'hand', 'picture', 'again', 'change', 'off', 'play', 'spell', 'air', 'away', 'animal', 'house', 'point', 'page', 'letter', 'mother', 'answer', 'found', 'study', 'still', 'learn', 'should', 'America', 'world', 'high', 'every', 'near', 'add', 'food', 'between', 'own', 'below', 'country', 'plant', 'last', 'school', 'father', 'keep', 'tree', 'never', 'start', 'city', 'earth', 'eye', 'light', 'thought', 'head', 'under', 'story', 'saw', 'left', 'don\'t', 'few', 'while', 'along', 'might', 'close', 'something', 'seem', 'next', 'hard', 'open', 'example', 'begin', 'life', 'always', 'those', 'both', 'paper', 'together', 'got', 'group', 'often', 'run', 'important', 'until', 'children', 'side', 'feet', 'car', 'mile', 'night', 'walk', 'white', 'sea', 'began', 'grow', 'took', 'river', 'four', 'carry', 'state', 'once', 'book', 'hear', 'stop', 'without', 'second', 'late', 'miss', 'idea', 'enough', 'eat', 'face', 'watch', 'far', 'Indian', 'real', 'almost', 'let', 'above', 'girl', 'sometimes', 'mountain', 'cut', 'young', 'talk', 'soon', 'list', 'song', 'being', 'leave', 'family', 'it\'s'].includes(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  // Get most common terms
  const commonTerms = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word);
  
  // Create questions based on content
  const maxQuestions = Math.min(questionCount, sentences.length, commonTerms.length);
  for (let i = 0; i < maxQuestions; i++) {
    const sentence = sentences[i]?.trim();
    if (!sentence || sentence.length < 15) continue;
    
    // Extract key information from sentence
    const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    const keyTerms = commonTerms.filter(term => sentenceWords.includes(term));
    
    // Create question based on content
    let questionText = "";
    let options = [];
    
    if (keyTerms.length > 0) {
      // Question about key terms
      const mainTerm = keyTerms[0];
      const capitalizedTerm = mainTerm.charAt(0).toUpperCase() + mainTerm.slice(1);
      
      questionText = `What is the main concept discussed in this text: "${sentence.substring(0, 120)}..."?`;
      options = [
        capitalizedTerm,
        `Related to ${capitalizedTerm}`,
        `Different from ${capitalizedTerm}`,
        `Opposite of ${capitalizedTerm}`
      ];
    } else {
      // General comprehension question
      questionText = `Based on the following text: "${sentence.substring(0, 100)}...", what is the primary topic?`;
      options = [
        "The main subject discussed",
        "A secondary topic mentioned",
        "An unrelated concept",
        "A minor detail"
      ];
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
        options: ["The primary subject discussed", "A secondary topic", "An unrelated concept", "A minor detail"],
        answer: "A"
      },
      {
        question: "What type of content is this?",
        options: ["Educational material", "Technical documentation", "General information", "Personal notes"],
        answer: "A"
      },
      {
        question: "What is the purpose of this text?",
        options: ["To inform or educate", "To entertain", "To persuade", "To confuse"],
        answer: "A"
      }
    ];
    return basicQuestions.slice(0, questionCount);
  }
  
  return questions.slice(0, questionCount);
}

export default function AdminAIGeneratedQuiz() {
  const { role, profile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only allow admin/administrator
  if (role !== "admin" && role !== "administrator") {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar showInDashboard />
        <div className="flex-1 flex items-center justify-center text-lg text-destructive font-bold">
          Forbidden: Admins only.
        </div>
        <Footer />
      </div>
    );
  }

  const resetForm = () => {
    setQuiz(null);
    setFile(null);
    setExtractedText("");
    setError("");
    setSuccess("");
    setLoading(false);
    setSaving(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuiz(null);
    setSuccess("");
    setError("");
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!file) return;
    setLoading(true);
    setQuiz(null);
    setError("");
    setSuccess("");
    try {
      // Upload file to Supabase Storage
      const uniqueName = `uploads/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('pdfs')
        .upload(uniqueName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        setError(error.message || "Upload failed");
        setLoading(false);
        return;
      }
      
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('pdfs')
        .getPublicUrl(data.path);
      const url = publicUrlData?.publicUrl;
      
      // Extract text from file in browser
      let text = "";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          console.log(`PDF has ${pdf.numPages} pages`);
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items
              .map(item => ('str' in item ? item.str : ''))
              .join(" ")
              .replace(/\s+/g, ' ')
              .trim();
            
            if (pageText.length > 0) {
              text += pageText + "\n";
            }
          }
          
          // Clean up the extracted text
          text = text.replace(/\s+/g, ' ').trim();
          
          if (text.length < 50) {
            text = `PDF file uploaded: ${file.name}. The document appears to contain minimal text or may be image-based. Please manually create questions based on the document content.`;
          }
        } catch (pdfErr) {
          console.error('PDF parsing error:', pdfErr);
          text = `PDF file uploaded: ${file.name}. Error parsing PDF content. Please manually create questions based on the document content.`;
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
        setError("DOCX parsing in browser is not supported yet. Please use PDF or TXT.");
        setLoading(false);
        return;
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        text = await file.text();
        text = text.replace(/\s+/g, ' ').trim();
      } else {
        setError("Unsupported file type");
        setLoading(false);
        return;
      }
      
      setExtractedText(text);
      
      // Generate quiz using AI
      const questions = await generateAIQuestions(text, questionCount);
      
      const quiz = { title: file.name, pdfUrl: url, questions };
      setQuiz(quiz);
      setSuccess(`Quiz generated successfully with ${questions.length} questions using AI!`);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSaveQuiz = async () => {
    if (!quiz) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Save to Firebase using v9+ syntax
      const quizzesRef = collection(db, "quizzes");
      const newQuizRef = doc(quizzesRef);
      const quizData = {
        id: newQuizRef.id,
        title: quiz.title || file?.name || "AI Generated Quiz",
        questions: quiz.questions,
        pdfUrl: quiz.pdfUrl,
        createdBy: profile?.name || "admin",
        createdAt: new Date().toISOString(),
        meta: {
          title: quiz.title || file?.name || "AI Generated Quiz",
          createdBy: profile?.name || "admin",
          createdAt: new Date().toISOString(),
        },
      };
      
      console.log("Saving quiz to Firebase:", { quizId: newQuizRef.id, quizData });
      await setDoc(newQuizRef, quizData);
      console.log("Quiz saved successfully to Firebase");
      
      // Show success dialog
      setShowSuccessDialog(true);
      
      // Reset form
      resetForm();
    } catch (err: any) {
      console.error("Error saving quiz:", err);
      setError(err.message || "Failed to save quiz");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard />
      <div className="flex-1 flex flex-col items-center py-8 px-2 bg-gradient-to-br from-white to-blue-50 pt-20">
        <Card className="w-full max-w-xl p-8 shadow-xl relative z-10">
          <h1 className="text-2xl font-bold mb-4 text-primary">AI Made Quiz Generator</h1>
          <p className="mb-6 text-muted-foreground">Upload a PDF, DOCX, or TXT file, or manually enter text. The AI will generate a quiz based on the content. You can preview and confirm before saving.</p>
          
          {/* Info Alert */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">AI-Powered Question Generation</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Now using Google Gemini AI for intelligent question generation! Features include:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Advanced AI-powered question creation</li>
                    <li>Context-aware multiple choice options</li>
                    <li>Automatic fallback to enhanced text analysis</li>
                    <li>Support for 5-100 questions per quiz</li>
                  </ul>
                  <p className="mt-2 text-xs">
                    <strong>Note:</strong> Add your Gemini API key to <code className="bg-green-100 px-1 rounded">VITE_GEMINI_API_KEY</code> in your environment variables for full AI functionality.
                  </p>
                </div>
              </div>
            </div>
          </div>
        <div className="mb-4">
          <label className="font-semibold mb-2 block">Option 1: Upload File</label>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="mb-4 w-full"
          />
        </div>
        
        <div className="mb-4">
          <label className="font-semibold mb-2 block">Number of Questions</label>
          <select
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full border rounded p-2 text-sm"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
            <option value={20}>20 Questions</option>
            <option value={25}>25 Questions</option>
            <option value={30}>30 Questions</option>
            <option value={40}>40 Questions</option>
            <option value={50}>50 Questions</option>
            <option value={100}>Whole PDF (100 Questions)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select how many questions you want to generate. "Whole PDF" will generate comprehensive questions from the entire document.
          </p>
        </div>
        
        <div className="mb-4">
          <label className="font-semibold mb-2 block">Option 2: Manual Text Input</label>
          <textarea
            placeholder="Enter or paste your text content here..."
            rows={6}
            className="w-full border rounded p-2 text-sm"
            onChange={async (e) => {
              if (e.target.value.trim()) {
                setExtractedText(e.target.value);
                const questions = await generateAIQuestions(e.target.value, questionCount);
                setQuiz({ 
                  title: "Manual Text Quiz", 
                  pdfUrl: "", 
                  questions 
                });
              }
            }}
          />
        </div>
        
        <Button onClick={handleGenerateQuiz} disabled={(!file && !extractedText) || loading} className="mb-4 w-full">
          {loading ? "Generating with AI..." : "Generate Quiz with AI"}
        </Button>
        {extractedText && (
          <div className="mb-4">
            <label className="font-semibold mb-1 block">Extracted Text (editable):</label>
            <textarea
              value={extractedText}
              onChange={e => setExtractedText(e.target.value)}
              rows={8}
              className="w-full border rounded p-2 text-sm"
              readOnly={loading}
              placeholder="Edit the extracted text to improve question generation..."
            />
            <div className="mt-2 flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={async () => {
                  const questions = await generateAIQuestions(extractedText, questionCount);
                  setQuiz({ title: file?.name || "Quiz", pdfUrl: quiz?.pdfUrl, questions });
                }}
                disabled={loading || !extractedText}
              >
                Regenerate Questions with AI
              </Button>
              <span className="text-xs text-gray-500 self-center">
                {extractedText.length} characters extracted
              </span>
            </div>
          </div>
        )}
        {error && <div className="text-destructive font-semibold mb-2">{error}</div>}
        {quiz && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4 relative z-20">
            <h2 className="font-bold text-lg mb-2 text-primary">Quiz Preview</h2>
            
            {/* Human-readable preview */}
            <div className="mb-4 max-h-96 overflow-y-auto bg-white p-4 rounded border border-blue-100 relative z-30">
              <h3 className="font-semibold text-lg mb-3">{quiz.title}</h3>
              {quiz.questions.map((q: any, index: number) => (
                <div key={index} className="mb-4 p-3 border border-gray-200 rounded">
                  <p className="font-medium mb-2">
                    <span className="text-blue-600">Q{index + 1}:</span> {q.question}
                  </p>
                  <div className="ml-4 space-y-1">
                    {q.options.map((option: string, optIndex: number) => (
                      <div key={optIndex} className="flex items-center">
                        <span className={`w-4 h-4 rounded-full border mr-2 flex items-center justify-center text-xs ${
                          q.answer === String.fromCharCode(65 + optIndex) 
                            ? 'bg-green-500 text-white border-green-500' 
                            : 'border-gray-300'
                        }`}>
                          {q.answer === String.fromCharCode(65 + optIndex) ? '✓' : ''}
                        </span>
                        <span className={`text-sm ${
                          q.answer === String.fromCharCode(65 + optIndex) ? 'font-semibold text-green-700' : ''
                        }`}>
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Raw JSON for debugging */}
            <details className="mb-4">
              <summary className="cursor-pointer text-sm text-gray-600 font-medium">Show Raw JSON</summary>
              <pre className="text-xs whitespace-pre-wrap break-words max-h-48 overflow-y-auto bg-gray-100 p-2 rounded border mt-2">
                {JSON.stringify(quiz, null, 2)}
              </pre>
            </details>
            
            <Button onClick={handleSaveQuiz} disabled={saving} className="w-full">
              {saving ? "Saving..." : "Confirm & Save"}
            </Button>
          </div>
        )}
        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
        </Card>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Quiz Saved Successfully!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 mb-4">
              Your quiz has been successfully saved to the database. You can now find it in the quizzes section.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  setShowSuccessDialog(false);
                  // Reset form to start fresh
                  resetForm();
                }}
                className="flex-1"
              >
                Generate Another Quiz
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowSuccessDialog(false);
                  // Navigate to quizzes page
                  window.location.href = "/quizzes";
                }}
                className="flex-1"
              >
                View All Quizzes
              </Button>
            </div>
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowSuccessDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
} 