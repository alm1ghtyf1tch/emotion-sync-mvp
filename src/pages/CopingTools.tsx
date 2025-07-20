import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wind, 
  BookOpen, 
  Heart, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw,
  Save,
  Mic,
  Volume2
} from "lucide-react";

export default function CopingTools() {
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [journalEntry, setJournalEntry] = useState('');
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const affirmations = [
    "I am worthy of love and respect.",
    "I have the strength to overcome challenges.",
    "My feelings are valid and important.",
    "I am growing and learning every day.",
    "I deserve happiness and peace.",
    "I am enough, just as I am.",
    "I have the power to create positive change in my life.",
    "I am resilient and can handle whatever comes my way."
  ];

  const breathingCycles = {
    inhale: 4,
    hold: 4,
    exhale: 6
  };

  useEffect(() => {
    if (isBreathingActive) {
      setCountdown(breathingCycles[breathingPhase]);
      
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            // Move to next phase
            if (breathingPhase === 'inhale') {
              setBreathingPhase('hold');
              return breathingCycles.hold;
            } else if (breathingPhase === 'hold') {
              setBreathingPhase('exhale');
              return breathingCycles.exhale;
            } else {
              setBreathingPhase('inhale');
              return breathingCycles.inhale;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isBreathingActive, breathingPhase, breathingCycles]);

  const startBreathing = () => {
    setIsBreathingActive(true);
    setBreathingPhase('inhale');
    setCountdown(breathingCycles.inhale);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
    setBreathingPhase('inhale');
    setCountdown(4);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

  const previousAffirmation = () => {
    setCurrentAffirmation((prev) => (prev - 1 + affirmations.length) % affirmations.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Coping Tools</h1>
          <p className="text-muted-foreground">
            Gentle tools to help you find calm, process emotions, and build resilience.
          </p>
        </div>

        <Tabs defaultValue="breathing" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="breathing" className="flex items-center space-x-2">
              <Wind className="w-4 h-4" />
              <span className="hidden sm:inline">Breathing</span>
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Journal</span>
            </TabsTrigger>
            <TabsTrigger value="affirmations" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Affirmations</span>
            </TabsTrigger>
            <TabsTrigger value="reflection" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Reflection</span>
            </TabsTrigger>
          </TabsList>

          {/* Breathing Exercise */}
          <TabsContent value="breathing">
            <Card className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Guided Breathing</h2>
                <p className="text-muted-foreground mb-8">
                  Find your calm with the 4-4-6 breathing technique. Inhale for 4, hold for 4, exhale for 6.
                </p>

                {/* Breathing Circle */}
                <div className="flex justify-center mb-8">
                  <div 
                    className={`w-48 h-48 rounded-full border-4 border-primary/30 flex items-center justify-center transition-all duration-1000 ${
                      isBreathingActive 
                        ? 'bg-gradient-to-br from-primary/20 to-accent/20 scale-110 gentle-glow' 
                        : 'bg-gradient-to-br from-secondary/20 to-muted/20'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {isBreathingActive ? (
                          breathingPhase === 'inhale' ? 'Breathe In' :
                          breathingPhase === 'hold' ? 'Hold' : 'Breathe Out'
                        ) : 'Ready?'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {isBreathingActive && `${countdown} seconds`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  {!isBreathingActive ? (
                    <Button 
                      onClick={startBreathing}
                      size="lg"
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Start Breathing
                    </Button>
                  ) : (
                    <>
                      <Button onClick={stopBreathing} variant="outline" size="lg">
                        <Pause className="w-5 h-5 mr-2" />
                        Pause
                      </Button>
                      <Button onClick={stopBreathing} variant="secondary" size="lg">
                        <RotateCcw className="w-5 h-5 mr-2" />
                        Reset
                      </Button>
                    </>
                  )}
                </div>

                {isBreathingActive && (
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-center">
                      Focus on your breath. Let thoughts come and go without judgment. 
                      You're creating space for calm and peace.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Journal */}
          <TabsContent value="journal">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Journal Entry</h2>
                  <p className="text-muted-foreground">
                    Write freely about your thoughts and feelings. No judgment, just expression.
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Dear journal... What's on my mind today?"
                className="min-h-[300px] text-base leading-relaxed border-primary/20 focus:border-primary/40"
              />

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  {journalEntry.length} characters • Auto-saved
                </div>
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Entry
                </Button>
              </div>

              <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
                <h3 className="font-semibold text-sm mb-2">💡 Journaling prompts</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• What am I feeling right now, and where do I feel it in my body?</li>
                  <li>• What are three things I'm grateful for today?</li>
                  <li>• What would I tell a friend going through this situation?</li>
                  <li>• What small step can I take to care for myself today?</li>
                </ul>
              </div>
            </Card>
          </TabsContent>

          {/* Affirmations */}
          <TabsContent value="affirmations">
            <Card className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-4">Daily Affirmations</h2>
                <p className="text-muted-foreground mb-8">
                  Positive reminders to strengthen your self-compassion and resilience.
                </p>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-2xl p-8 mb-6">
                    <div className="text-2xl font-medium leading-relaxed text-center">
                      "{affirmations[currentAffirmation]}"
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <Button onClick={previousAffirmation} variant="outline">
                      Previous
                    </Button>
                    <Badge variant="secondary">
                      {currentAffirmation + 1} of {affirmations.length}
                    </Badge>
                    <Button onClick={nextAffirmation} variant="outline">
                      Next
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4">
                      <div className="text-center">
                        <Heart className="w-6 h-6 mx-auto mb-2 text-primary" />
                        <div className="font-medium">Save Favorite</div>
                        <div className="text-xs text-muted-foreground">Keep this affirmation</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto p-4">
                      <div className="text-center">
                        <Volume2 className="w-6 h-6 mx-auto mb-2 text-accent" />
                        <div className="font-medium">Read Aloud</div>
                        <div className="text-xs text-muted-foreground">Listen to affirmation</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Reflection */}
          <TabsContent value="reflection">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Mood Reflection</h2>
              <p className="text-muted-foreground mb-6">
                Take a moment to explore your emotions with guided questions.
              </p>

              <div className="space-y-6">
                {[
                  "What emotions am I experiencing right now?",
                  "What might have triggered these feelings?",
                  "Where do I feel these emotions in my body?",
                  "What do these emotions need from me?",
                  "How can I show myself compassion in this moment?"
                ].map((question, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <h3 className="font-medium mb-3">{question}</h3>
                    <Textarea 
                      placeholder="Take your time to reflect..."
                      className="min-h-[100px] border-primary/20 focus:border-primary/40"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Reflection
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}