
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Subject options for the form
const subjectOptions = [
  { id: "biology", label: "Biology" },
  { id: "chemistry", label: "Chemistry" },
  { id: "physics", label: "Physics" },
  { id: "mathematics", label: "Mathematics" },
  { id: "english", label: "English" },
  { id: "history", label: "History" },
  { id: "geography", label: "Geography" },
  { id: "computer-science", label: "Computer Science" },
  { id: "medicine", label: "Medicine" },
  { id: "psychology", label: "Psychology" },
  { id: "economics", label: "Economics" },
  { id: "political-science", label: "Political Science" }
];

// Grade or class options
const classOptions = [
  { id: "grade-11", label: "Grade 11" },
  { id: "grade-12", label: "Grade 12" },
  { id: "undergraduate-1", label: "Undergraduate Year 1" },
  { id: "undergraduate-2", label: "Undergraduate Year 2" },
  { id: "undergraduate-3", label: "Undergraduate Year 3" },
  { id: "undergraduate-4", label: "Undergraduate Year 4" },
  { id: "graduate", label: "Graduate" },
  { id: "phd", label: "PhD" },
  { id: "professional", label: "Professional" }
];

// Default profile data
const defaultProfileData = {
  name: "John Doe",
  email: "john.doe@example.com",
  institution: "Medical University",
  grade: "undergraduate-2", // Default selected grade
  bio: "Medical student with an interest in cardiology and medical research.",
  subjects: ["medicine", "biology", "chemistry"] // Default selected subjects
};

export function ProfileSection() {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [profileData, setProfileData] = useState(defaultProfileData);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfileData(prev => ({
      ...prev,
      grade: e.target.value
    }));
  };

  const handleSubjectToggle = (subjectId: string) => {
    setProfileData(prev => {
      if (prev.subjects.includes(subjectId)) {
        return {
          ...prev,
          subjects: prev.subjects.filter(id => id !== subjectId)
        };
      } else {
        return {
          ...prev,
          subjects: [...prev.subjects, subjectId]
        };
      }
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarSrc(event.target?.result?.toString() || null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    }, 1500);
  };

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="text-2xl">{profile?.name || "My Profile"}</CardTitle>
        <CardDescription>Update your personal details and study preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-28 w-28 border-2 border-primary/20">
                  <AvatarImage src={avatarSrc || undefined} alt="Profile" />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {profile?.name?.split(' ').map(n => n[0]).join('') || <User className="h-10 w-10" />}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="profile-avatar" className="cursor-pointer">
                  <span className="text-sm text-primary hover:underline">Change Avatar</span>
                  <input 
                    id="profile-avatar" 
                    type="file" 
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
                <div className="mt-2 text-center">
                  <div className="font-bold">{profile?.name || "User"}</div>
                  <div className="text-sm text-muted-foreground">{profile?.email || ""}</div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={profileData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution/School</Label>
                  <Input 
                    id="institution" 
                    name="institution" 
                    value={profileData.institution}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Class/Grade</Label>
                  <select
                    id="grade"
                    name="grade"
                    value={profileData.grade}
                    onChange={handleGradeChange}
                    className="w-full p-2 border rounded-md"
                  >
                    {classOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio" 
                    name="bio" 
                    value={profileData.bio}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Subject Selection */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg">Your Subjects</h3>
                <p className="text-sm text-muted-foreground">Select the subjects you're interested in</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {subjectOptions.map(subject => (
                  <div key={subject.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`subject-${subject.id}`}
                      checked={profileData.subjects.includes(subject.id)}
                      onCheckedChange={() => handleSubjectToggle(subject.id)}
                    />
                    <label 
                      htmlFor={`subject-${subject.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {subject.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? (
                <>Saving Changes...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
