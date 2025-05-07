
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComingSoonProps {
  title: string;
  subtitle: string;
  features: string[];
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const ComingSoon = ({
  title,
  subtitle,
  features,
  buttonText = "Coming Soon",
  onButtonClick,
  className
}: ComingSoonProps) => {
  return (
    <div className={cn("max-w-4xl mx-auto p-6 rounded-lg bg-white dark:bg-gray-800 shadow-md", className)}>
      <div className="bg-primary text-white p-8 rounded-t-lg -mt-6 -mx-6 mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">{title}</h1>
        <p className="text-xl">{subtitle}</p>
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">Coming Soon!</h2>
      
      <p className="text-lg text-center text-muted-foreground mb-10">
        We're working hard to bring you an amazing {title.toLowerCase()} experience. The {title} will feature:
      </p>

      <div className="space-y-4 max-w-xl mx-auto mb-10">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="rounded-full bg-primary/20 p-1 mt-1">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <p className="text-lg">{feature}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          className="px-10 py-6 text-lg"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default ComingSoon;
