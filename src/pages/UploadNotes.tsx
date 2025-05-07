
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Upload, File, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const UploadNotes = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !subject || !file) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload a file.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Notes Uploaded Successfully!",
        description: "Your notes have been uploaded and will be available for viewing.",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setSubject("");
      setFile(null);
    }, 1500);
  };

  const subjects = [
    "Mathematics", 
    "Physics", 
    "Chemistry", 
    "Biology", 
    "Computer Science", 
    "Engineering", 
    "History", 
    "Geography", 
    "Literature", 
    "Economics"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard={true} />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link to="/userhub" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hub
            </Link>
            
            <h1 className="text-3xl font-bold mb-2">Upload Notes</h1>
            <p className="text-muted-foreground mb-6">Share your study notes and materials with the community</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Upload Study Notes</CardTitle>
              <CardDescription>Fill in the details below to share your notes with others</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                    <Input 
                      id="title" 
                      placeholder="Enter a descriptive title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject <span className="text-red-500">*</span></Label>
                    <Select value={subject} onValueChange={setSubject} required>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subj => (
                          <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide a brief description of your notes" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File <span className="text-red-500">*</span></Label>
                  {!file ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
                      <Input
                        id="file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                      />
                      <label 
                        htmlFor="file"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-lg font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          PDF, Word, PowerPoint or text files (max 20MB)
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                      <div className="flex items-center">
                        <File className="h-6 w-6 text-primary mr-2" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFile}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center md:justify-end">
                  <Button type="submit" className="w-full md:w-auto" disabled={isUploading}>
                    {isUploading ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Notes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadNotes;
