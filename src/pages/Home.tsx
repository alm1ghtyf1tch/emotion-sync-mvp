import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoodTracker } from "@/components/mood-tracker";
import { QuickActions } from "@/components/quick-actions";
import { MoodChart } from "@/components/mood-chart";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { 
  MessageCircle, 
  Sparkles, 
  Calendar,
  Clock,
  Shield,
  Heart
} from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

export default function Home() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [dailyInspiration, setDailyInspiration] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Set daily inspiration based on current date to ensure it changes daily
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('inspirationDate');
    const storedMessage = localStorage.getItem('dailyInspiration');

    if (storedDate === today && storedMessage) {
      setDailyInspiration(storedMessage);
    } else {
      const newMessage = getMotivationalMessage();
      setDailyInspiration(newMessage);
      localStorage.setItem('inspirationDate', today);
      localStorage.setItem('dailyInspiration', newMessage);
    }
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Every step forward is progress, no matter how small.",
      "Your feelings are valid, and you deserve support.",
      "Today is a new opportunity for growth and healing.",
      "You're stronger than you think, and you're not alone.",
      "Taking care of your mental health is a sign of strength."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center bg-no-repeat rounded-b-3xl overflow-hidden"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent" />
        <div className="relative z-10 h-full flex items-center px-6">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getGreeting()}, <span className="text-primary">{user?.user_metadata?.full_name || "friend"}</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Welcome to your safe space for emotional support and growth.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Motivational Quote */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-accent mt-1 animate-gentle-pulse" />
            <div>
              <h2 className="font-semibold mb-1">Daily Inspiration</h2>
              <p className="text-muted-foreground italic">"{dailyInspiration}"</p>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Mood Tracking */}
          <div className="lg:col-span-2 space-y-6">
            <MoodTracker onMoodSelect={setTodayMood} currentMood={todayMood} />
            <MoodChart />
          </div>

          {/* Right Column - Quick Actions & Stats */}
          <div className="space-y-6">
            <QuickActions />
            
            {/* Today's Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                Today's Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mood logged</span>
                  {todayMood ? (
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      Recorded
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Journal entries</span>
                  <Badge variant="outline">0</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">AI conversations</span>
                  <Badge variant="outline">0</Badge>
                </div>
              </div>
            </Card>

            {/* Privacy & Trust */}
            <Card className="p-6 bg-secondary/20">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-accent mt-1" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Your Privacy Matters</h4>
                  <p className="text-xs text-muted-foreground">
                    Your data is encrypted and secure. EmotionSync supports, 
                    never replaces, professional therapy.
                  </p>
                </div>
              </div>
            </Card>

            {/* Get Help Now */}
            <Card className="p-6 border-destructive/30 bg-destructive/5">
              <div className="text-center">
                <Heart className="w-8 h-8 text-destructive mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Need Immediate Support?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  If you're in crisis, please reach out for professional help.
                </p>
                <Button variant="destructive" size="sm" className="w-full">
                  Crisis Resources
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-4">Ready to start your conversation?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Your AI companion is here to listen, understand, and support you through 
              whatever you're experiencing. Every conversation is private and judgment-free.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Talking
            </Button>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}