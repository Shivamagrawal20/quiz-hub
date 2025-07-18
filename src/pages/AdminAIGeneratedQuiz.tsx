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

export default function AdminAIGeneratedQuiz() {
  const { role, profile } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only allow admin/administrator
  if (role !== "admin" && role !== "administrator") {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-destructive font-bold">
        Forbidden: Admins only.
      </div>
    );
  }

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
      // Upload PDF to Supabase Storage with a unique filename
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
      // Extract text from PDF in browser
      let text = "";
      if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => ('str' in item ? item.str : '')).join(" ") + "\n";
        }
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
        setError("DOCX parsing in browser is not supported yet. Please use PDF or TXT.");
        setLoading(false);
        return;
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        text = await file.text();
      } else {
        setError("Unsupported file type");
        setLoading(false);
        return;
      }
      setExtractedText(text);
      // Generate quiz JSON (split text into multiple questions)
      const chunkSize = 200;
      const questions = [];
      for (let i = 0; i < extractedText.length; i += chunkSize) {
        questions.push({
          question: extractedText.slice(i, i + chunkSize) + (i + chunkSize < extractedText.length ? "..." : ""),
          options: ["A", "B", "C", "D"],
          answer: "A"
        });
      }
      const quiz = { title: file.name, pdfUrl: url, questions };
      setQuiz(quiz);
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
      const res = await fetch("/api/quiz-gen/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": role || "",
        },
        body: JSON.stringify({
          quiz,
          meta: {
            title: quiz.title || file?.name || "AI Generated Quiz",
            createdBy: profile?.name || "admin",
            createdAt: new Date().toISOString(),
          },
        }),
      });
      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("Server error: Invalid response. Please try again or check backend logs.");
      }
      if (!res.ok) throw new Error((data && data.error) || "Failed to save quiz");
      setSuccess("Quiz saved successfully!");
      setQuiz(null);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-2 bg-gradient-to-br from-white to-blue-50">
      <Card className="w-full max-w-xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-primary">AI Made Quiz Generator</h1>
        <p className="mb-6 text-muted-foreground">Upload a PDF, DOCX, or TXT file. The AI will generate a quiz based on the document content. You can preview and confirm before saving.</p>
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="mb-4"
        />
        <Button onClick={handleGenerateQuiz} disabled={!file || loading} className="mb-4 w-full">
          {loading ? "Generating..." : "Generate Quiz"}
        </Button>
        {extractedText && (
          <div className="mb-4">
            <label className="font-semibold mb-1 block">Extracted Text (editable):</label>
            <textarea
              value={extractedText}
              onChange={e => setExtractedText(e.target.value)}
              rows={10}
              className="w-full border rounded p-2"
              readOnly={loading}
            />
          </div>
        )}
        {error && <div className="text-destructive font-semibold mb-2">{error}</div>}
        {quiz && (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h2 className="font-bold text-lg mb-2 text-primary">Quiz Preview</h2>
            <pre className="text-sm whitespace-pre-wrap break-words max-h-96 overflow-y-auto bg-white p-2 rounded border border-blue-100">
              {JSON.stringify(quiz, null, 2)}
            </pre>
            <Button onClick={handleSaveQuiz} disabled={saving} className="mt-4 w-full">
              {saving ? "Saving..." : "Confirm & Save"}
            </Button>
          </div>
        )}
        {success && <div className="text-green-600 font-semibold mt-2">{success}</div>}
      </Card>
    </div>
  );
} 