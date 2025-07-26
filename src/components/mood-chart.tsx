import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<Array<{day: string, mood: number, date: string}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMoodData();
    } else {
      setMoodData([]);
      setLoading(false);
    }
  }, [user]);

  const loadMoodData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get the last 7 days
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
      }

      const { data, error } = await supabase
        .from('daily_moods')
        .select('mood_value, mood_date')
        .eq('user_id', user.id)
        .in('mood_date', days)
        .order('mood_date', { ascending: true });

      if (error) {
        console.error('Error loading mood data:', error);
        return;
      }

      // Create chart data with all 7 days, filling in missing data
      const chartData = days.map(date => {
        const moodEntry = data?.find(entry => entry.mood_date === date);
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        
        return {
          day: dayName,
          mood: moodEntry?.mood_value || 0,
          date: date,
          hasData: !!moodEntry
        };
      });

      setMoodData(chartData);
    } catch (error) {
      console.error('Error loading mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dataWithMoods = moodData.filter(day => day.mood > 0);
  const averageMood = dataWithMoods.length > 0 ? 
    (dataWithMoods.reduce((sum, day) => sum + day.mood, 0) / dataWithMoods.length).toFixed(1) : 
    '0.0';

  if (loading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Mood Journey</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Loading your mood data...
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Mood Journey</h3>
        <div className="h-48 flex items-center justify-center text-muted-foreground">
          Sign in to see your mood tracking data
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Your Mood Journey</h3>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">7-day average</div>
          <div className="text-lg font-semibold text-accent">{averageMood}/5</div>
        </div>
      </div>

      {/* Mood Scale Legend */}
      <div className="mb-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>1 - Struggling</span>
          <span>2 - Low</span>
          <span>3 - Okay</span>
          <span>4 - Good</span>
          <span>5 - Great</span>
        </div>
      </div>
      
      <div className="h-48 w-full">
        {dataWithMoods.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Start tracking your daily mood to see your journey
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                domain={[0.5, 5.5]}
                ticks={[1, 2, 3, 4, 5]}
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
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  if (!payload.hasData) return null;
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={6} 
                      fill="hsl(var(--primary))" 
                      strokeWidth={2} 
                      stroke="hsl(var(--background))"
                    />
                  );
                }}
                activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Data Summary */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-sm text-muted-foreground">Days tracked</div>
          <div className="text-lg font-semibold text-primary">{dataWithMoods.length}/7</div>
        </div>
        <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
          <div className="text-sm text-muted-foreground">Recent trend</div>
          <div className="text-lg font-semibold text-accent">
            {dataWithMoods.length >= 2 ? 
              (dataWithMoods[dataWithMoods.length - 1].mood > dataWithMoods[dataWithMoods.length - 2].mood ? '↗' :
               dataWithMoods[dataWithMoods.length - 1].mood < dataWithMoods[dataWithMoods.length - 2].mood ? '↘' : '→')
              : '—'}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <p className="text-sm text-center text-muted-foreground">
          Track your mood daily to see patterns and build self-awareness over time.
        </p>
      </div>
    </Card>
  );
}