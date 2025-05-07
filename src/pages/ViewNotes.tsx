
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Filter, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const ViewNotes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  // Sample notes data
  const notes = [
    {
      id: "1",
      title: "Environmental Engineering Fundamentals",
      subject: "Engineering",
      author: "Dr. Smith",
      uploadDate: "2025-04-01",
      description: "Comprehensive notes covering environmental engineering concepts, sustainability, and pollution control methods."
    },
    {
      id: "2",
      title: "Data Structures and Algorithms",
      subject: "Computer Science",
      author: "Prof. Johnson",
      uploadDate: "2025-03-15",
      description: "Notes on essential data structures like trees, graphs, and common algorithms with time complexity analysis."
    },
    {
      id: "3",
      title: "Cell Biology Review",
      subject: "Biology",
      author: "Dr. Williams",
      uploadDate: "2025-02-28",
      description: "Detailed review of cell structure, function, and cellular processes including mitosis and meiosis."
    },
  ];

  const subjects = [...new Set(notes.map(note => note.subject))];
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === "all" || note.subject === subjectFilter;
    
    return matchesSearch && matchesSubject;
  });

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
            
            <h1 className="text-3xl font-bold mb-2">Study Notes</h1>
            <p className="text-muted-foreground mb-6">Browse and search through available study notes and materials</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search notes..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Subject" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map(note => (
                <Card key={note.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{note.title}</CardTitle>
                      <Badge>{note.subject}</Badge>
                    </div>
                    <CardDescription>By {note.author} • {new Date(note.uploadDate).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{note.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Notes</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-muted/20 rounded-lg">
              <h3 className="text-lg font-medium mb-1">No notes found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria or upload your own notes</p>
              <Button asChild>
                <Link to="/upload-notes">Upload Notes</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ViewNotes;
