import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smile, Meh, Frown, Heart, Zap } from "lucide-react";
import { useDailyMood } from "@/hooks/useDailyMood";
import { useAuth } from "@/contexts/AuthContext";

const moodOptions = [
  { 
    label: "Great", 
    value: 5, 
    icon: Heart, 
    color: "emotion-happy",
    description: "Feeling wonderful"
  },
  { 
    label: "Good", 
    value: 4, 
    icon: Smile, 
    color: "emotion-calm",
    description: "Pretty good day"
  },
  { 
    label: "Okay", 
    value: 3, 
    icon: Meh, 
    color: "emotion-anxious",
    description: "Just okay"
  },
  { 
    label: "Low", 
    value: 2, 
    icon: Frown, 
    color: "emotion-sad",
    description: "Not feeling great"
  },
  { 
    label: "Struggling", 
    value: 1, 
    icon: Zap, 
    color: "emotion-angry",
    description: "Having a tough time"
  },
];

interface MoodTrackerProps {
  onMoodSelect?: (mood: number) => void;
  currentMood?: number;
}

export function MoodTracker({ onMoodSelect, currentMood }: MoodTrackerProps) {
  const { user } = useAuth();
  const { todayMood, saveMood, loading } = useDailyMood();
  const [selectedMood, setSelectedMood] = useState<number | null>(currentMood || null);

  // Update selected mood when todayMood changes
  useEffect(() => {
    if (todayMood !== null) {
      setSelectedMood(todayMood);
    }
  }, [todayMood]);

  const handleMoodSelect = async (mood: number) => {
    setSelectedMood(mood);
    onMoodSelect?.(mood);
    
    // Save mood if user is authenticated
    if (user) {
      await saveMood(mood);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-card via-card to-secondary/20 border-primary/20">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">How are you feeling today?</h3>
        <p className="text-muted-foreground text-sm">
          Your feelings are valid. Let's check in together.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {moodOptions.map((mood) => {
          const IconComponent = mood.icon;
          const isSelected = selectedMood === mood.value;
          
          return (
            <Button
              key={mood.value}
              variant={isSelected ? "default" : "outline"}
              onClick={() => handleMoodSelect(mood.value)}
              disabled={loading}
              className={`h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? "bg-primary/20 border-primary ring-2 ring-primary/30" 
                  : "hover:bg-secondary/80"
              }`}
            >
              <div className={`emotion-indicator w-4 h-4 ${mood.color} rounded-full mb-1`} />
              <IconComponent className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              <div className="text-center">
                <div className={`text-xs font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {mood.label}
                </div>
                <div className="text-xs text-muted-foreground">
                  {mood.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {selectedMood !== null && (
        <div className="text-center mt-6 space-y-3">
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm font-medium mb-2">
              Thank you for sharing how you're feeling today!
            </p>
            <p className="text-xs text-muted-foreground">
              {user ? 
                "Your mood has been saved and will help us provide better support." :
                "Sign in to track your mood over time and unlock personalized insights."
              }
            </p>
          </div>
          
          <Button 
            onClick={() => setSelectedMood(null)} 
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            Reset Choice
          </Button>
        </div>
      )}
    </Card>
  );
}