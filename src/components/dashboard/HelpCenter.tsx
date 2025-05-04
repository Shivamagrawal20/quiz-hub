
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HelpCircle, BookOpen, Video, MessageSquare } from "lucide-react";

const helpItems = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of using our quiz platform",
    icon: BookOpen,
    link: "#",
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step video guides",
    icon: Video,
    link: "#",
  },
  {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions",
    icon: HelpCircle,
    link: "#",
  },
  {
    title: "Contact Support",
    description: "Get in touch with our support team",
    icon: MessageSquare,
    link: "#",
  },
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
              <div>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <a 
                href={item.link} 
                className="text-sm text-primary hover:underline"
              >
                Learn more
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
