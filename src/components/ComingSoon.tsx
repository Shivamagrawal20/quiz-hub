
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ComingSoonProps {
  title: string;
  subtitle: string;
  features: string[];
  buttonText?: string;
  bgColor?: string;
  textColor?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title, 
  subtitle, 
  features, 
  buttonText = "Coming Soon",
  bgColor = "from-primary to-primary/90",
  textColor = "text-primary"
}) => {
  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="w-full max-w-4xl">
        <Card className="border-none shadow-xl overflow-hidden">
          <div className={`bg-gradient-to-r ${bgColor} text-white p-10 flex flex-col items-center`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
            <p className="text-xl opacity-90 max-w-xl">{subtitle}</p>
            
            <div className="mt-10">
              <div className={`inline-block py-2 px-4 rounded-full bg-white ${textColor} font-medium`}>
                {buttonText}
              </div>
            </div>
          </div>
          
          <CardContent className="p-8">
            <h3 className="text-xl font-medium mb-6">Coming soon with these features:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className={`h-5 w-5 mt-0.5 ${textColor}`} />
                  <p className="text-left">{feature}</p>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t p-6 bg-gray-50 dark:bg-gray-900/30">
            <p className="text-muted-foreground text-center max-w-md">
              We're working hard to bring you this feature soon. Check back for updates!
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ComingSoon;
