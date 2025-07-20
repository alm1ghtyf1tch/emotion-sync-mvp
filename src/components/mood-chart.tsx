import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Mock data for the last 7 days
const moodData = [
  { day: "Mon", mood: 3, date: "2024-01-15" },
  { day: "Tue", mood: 4, date: "2024-01-16" },
  { day: "Wed", mood: 2, date: "2024-01-17" },
  { day: "Thu", mood: 3, date: "2024-01-18" },
  { day: "Fri", mood: 4, date: "2024-01-19" },
  { day: "Sat", mood: 5, date: "2024-01-20" },
  { day: "Sun", mood: 4, date: "2024-01-21" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const mood = payload[0].value;
    const getMoodLabel = (value: number) => {
      if (value >= 5) return "Great";
      if (value >= 4) return "Good";
      if (value >= 3) return "Okay";
      if (value >= 2) return "Low";
      return "Struggling";
    };

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-primary">
          Mood: {getMoodLabel(mood)} ({mood}/5)
        </p>
      </div>
    );
  }
  return null;
};

export function MoodChart() {
  const averageMood = (
    moodData.reduce((sum, day) => sum + day.mood, 0) / moodData.length
  ).toFixed(1);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Mood Journey</h3>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">7-day average</div>
          <div className="text-lg font-semibold text-accent">{averageMood}/5</div>
        </div>
      </div>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moodData}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              domain={[1, 5]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <p className="text-sm text-center">
          Your emotional patterns help us understand your journey better. 
          Keep tracking to build self-awareness.
        </p>
      </div>
    </Card>
  );
}