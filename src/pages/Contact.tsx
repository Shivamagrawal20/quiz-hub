
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState, useRef } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Contact = () => {
  const { isLoggedIn } = useAuth();
  // Formspree handles submission, no local state needed
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormspreeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    try {
      const response = await fetch("https://formspree.io/f/mgvzeonk", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        });
        form.reset();
      } else {
        toast({
          title: "Error sending message.",
          description: "Please try again later or contact us by email.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error sending message.",
        description: "Please try again later or contact us by email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [infoRef, infoRevealed] = useScrollReveal<HTMLDivElement>();
  const [formRevealRef, formRevealed] = useScrollReveal<HTMLDivElement>();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard={isLoggedIn} />
      
      <main className="flex-grow pt-20 bg-background">
        {/* Scrolling Announcement */}
        <div className="w-full overflow-x-auto whitespace-nowrap bg-primary/10 py-2 mb-4">
          <div className="animate-marquee inline-block min-w-full text-primary font-semibold text-base md:text-lg px-4">
            📬 Contact Examify: We value your feedback and questions! 📬
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Information */}
            <div ref={infoRef} className={`transition-all duration-700 ${infoRevealed ? 'reveal-in' : 'reveal-hidden'}`}>
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Have questions or feedback? We're here to help! Feel free to reach out to us using any of the methods below.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Email</h3>
                    <a href="mailto:th702878@gmail.com" className="text-primary hover:underline">
                      support@examify.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Phone</h3>
                    <p>+91 ***** *****</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Location</h3>
                    <p>India<br /></p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div ref={formRevealRef} className={`bg-white rounded-lg shadow-md p-6 border transition-all duration-700 ${formRevealed ? 'reveal-in' : 'reveal-hidden'}`}>
              <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
              <form ref={formRef} onSubmit={handleFormspreeSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    required
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Your message here..."
                    className="min-h-32"
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 18s linear infinite;
        }
        .reveal-hidden {
          opacity: 0;
          transform: translateY(40px);
        }
        .reveal-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default Contact;
