
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, BookOpen, Video, MessageSquare, Mail, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const helpItems = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of using our quiz platform",
    icon: BookOpen,
    link: "#",
    comingSoon: false,
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step video guides",
    icon: Video,
    link: "#",
    comingSoon: true,
  },
  {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions",
    icon: HelpCircle,
    link: "#",
    comingSoon: false,
  },
  {
    title: "Contact Support",
    description: "Get in touch with our support team",
    icon: MessageSquare,
    link: "#",
    comingSoon: false,
  },
];

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "To reset your password, click on the 'Forgot Password' link on the sign-in page. You'll receive an email with instructions to reset your password."
  },
  {
    question: "Can I retake a quiz multiple times?",
    answer: "Yes, you can retake quizzes as many times as you want. Your highest score will be saved in your profile."
  },
  {
    question: "How are the quiz scores calculated?",
    answer: "Quiz scores are calculated as the percentage of correct answers out of the total number of questions. For example, if you answer 9 out of 10 questions correctly, your score will be 90%."
  },
  {
    question: "Is there a time limit for quizzes?",
    answer: "Yes, most quizzes have a time limit specified before you start the quiz. The timer will be displayed during the quiz session."
  },
  {
    question: "Can I save my progress in a quiz?",
    answer: "Currently, you cannot save your progress mid-quiz. You need to complete the quiz in one session. This feature is coming soon."
  }
];

export function HelpCenter() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Help Center</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {helpItems.map((item, i) => (
          <Card key={i} className="transition-all hover:shadow-md hover:-translate-y-1">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-full bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  {item.comingSoon && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded">
                      Coming Soon
                    </span>
                  )}
                </div>
                <CardDescription>{item.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a 
                href={item.link} 
                className={`text-sm ${item.comingSoon ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:underline'}`}
              >
                {item.comingSoon ? "Available soon" : "Learn more"}
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find quick answers to common questions about our platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
          <CardDescription>
            Need more help? Contact our support team directly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto flex-col px-4 py-6 space-y-2 justify-start items-center">
              <Mail className="h-6 w-6 mb-2" />
              <span className="font-medium">Email Support</span>
              <span className="text-xs text-muted-foreground">support@examify.com</span>
            </Button>
            
            <Button variant="outline" className="h-auto flex-col px-4 py-6 space-y-2 justify-start items-center">
              <Globe className="h-6 w-6 mb-2" />
              <span className="font-medium">Knowledge Base</span>
              <span className="text-xs text-muted-foreground">Find articles & guides</span>
            </Button>
            
            <Button variant="outline" className="h-auto flex-col px-4 py-6 space-y-2 justify-start items-center">
              <FileText className="h-6 w-6 mb-2" />
              <span className="font-medium">Documentation</span>
              <span className="text-xs text-muted-foreground">Technical guides</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
