
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Award, LucideGraduationCap, Target } from "lucide-react";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      position: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      bio: "Alex founded QuizHub with a vision to make learning engaging and accessible to everyone."
    },
    {
      name: "Sarah Williams",
      position: "Chief Academic Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1188&q=80",
      bio: "With over 15 years in education, Sarah ensures our quizzes meet the highest academic standards."
    },
    {
      name: "David Chen",
      position: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      bio: "David leads our technical team, building the platform that powers millions of quizzes daily."
    },
    {
      name: "Maria Garcia",
      position: "Content Director",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
      bio: "Maria oversees the creation of diverse quiz content across all academic subjects."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/20 to-transparent py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About QuizHub</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to transform education through interactive quizzes that make learning fun, 
              engaging, and effective for students of all ages.
            </p>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Our Story</h2>
            <div className="space-y-4 text-lg">
              <p>
                QuizHub began in 2020 when a group of educators and technologists came together with a shared 
                vision: to make learning more engaging, interactive, and accessible for students everywhere.
              </p>
              <p>
                We recognized that traditional testing methods often created anxiety and failed to inspire a 
                genuine love for learning. Our team set out to create a platform that transforms assessments 
                from a source of stress into an opportunity for growth and discovery.
              </p>
              <p>
                Today, QuizHub serves millions of students, educators, and lifelong learners across the globe. 
                Our platform offers thousands of quizzes across diverse subjects, from mathematics and sciences 
                to literature and history.
              </p>
              <p>
                As we continue to grow, our commitment remains the same: to empower learners of all ages with 
                the tools they need to succeed and cultivate a lifelong passion for knowledge.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Mission & Values */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Mission & Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <LucideGraduationCap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Accessible Education</h3>
                <p className="text-muted-foreground">
                  We believe quality education should be accessible to everyone, regardless of background.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  We foster a supportive community where educators and learners can collaborate and grow together.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-muted-foreground">
                  We're committed to excellence in content, technology, and user experience.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border text-center">
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly innovate to create the most effective learning experiences possible.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Team */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-primary mb-2">{member.position}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="bg-primary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Learning Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Start your learning journey with QuizHub today and join thousands of students 
              who are transforming how they learn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/signup">
                  Create an Account
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
