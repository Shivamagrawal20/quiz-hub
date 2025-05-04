
import { useState } from "react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock performance data
const performanceData = [
  { date: "Jan", score: 65 },
  { date: "Feb", score: 72 },
  { date: "Mar", score: 68 },
  { date: "Apr", score: 85 },
  { date: "May", score: 92 }
];

const categoryScores = [
  { name: "Biology", score: 78 },
  { name: "Chemistry", score: 65 },
  { name: "Physics", score: 82 },
  { name: "Anatomy", score: 90 },
  { name: "Pathology", score: 72 },
];

const chartConfig = {
  score: {
    label: "Score",
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))",
    },
  },
};

export function PerformanceDashboard() {
  const [activeChart, setActiveChart] = useState<"trend" | "category">("trend");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Performance Analysis</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveChart("trend")}
            className={`px-3 py-1 text-sm rounded-md ${
              activeChart === "trend" 
                ? "bg-primary text-white" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            Score Trends
          </button>
          <button
            onClick={() => setActiveChart("category")}
            className={`px-3 py-1 text-sm rounded-md ${
              activeChart === "category" 
                ? "bg-primary text-white" 
                : "bg-muted text-muted-foreground"
            }`}
          >
            By Category
          </button>
        </div>
      </div>
      
      {activeChart === "trend" ? (
        <Card>
          <CardHeader>
            <CardTitle>Score Trends Over Time</CardTitle>
            <CardDescription>Your quiz performance month by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Performance By Subject</CardTitle>
            <CardDescription>Your average scores across different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer config={chartConfig}>
                <BarChart data={categoryScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
