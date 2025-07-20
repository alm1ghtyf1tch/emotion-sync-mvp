import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Activity, 
  BookOpen, 
  Phone, 
  Wind,
  Heart
} from "lucide-react";

const quickActions = [
  {
    label: "Talk to AI Companion",
    description: "Start a conversation",
    icon: MessageCircle,
    href: "/companion",
    primary: true
  },
  {
    label: "Breathing Exercise",
    description: "5-minute calm",
    icon: Wind,
    href: "/coping-tools?tool=breathing",
    color: "emotion-calm"
  },
  {
    label: "Journal Entry",
    description: "Write your thoughts",
    icon: BookOpen,
    href: "/coping-tools?tool=journal",
    color: "emotion-happy"
  },
  {
    label: "Crisis Support",
    description: "Get immediate help",
    icon: Phone,
    href: "/crisis-support",
    urgent: true
  },
  {
    label: "Affirmations",
    description: "Positive reminders",
    icon: Heart,
    href: "/coping-tools?tool=affirmations",
    color: "emotion-calm"
  },
  {
    label: "Mood Reflection",
    description: "Deeper insights",
    icon: Activity,
    href: "/coping-tools?tool=reflection",
    color: "emotion-anxious"
  }
];

export function QuickActions() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          
          return (
            <Button
              key={action.label}
              variant={action.primary ? "default" : action.urgent ? "destructive" : "outline"}
              asChild
              className={`h-auto p-4 flex flex-col items-center space-y-2 transition-all duration-300 hover:scale-105 ${
                action.primary 
                  ? "bg-gradient-to-br from-primary to-primary/80 gentle-glow" 
                  : action.urgent
                  ? "bg-gradient-to-br from-destructive to-destructive/80"
                  : "hover:bg-secondary/80"
              }`}
            >
              <a href={action.href} className="text-center w-full">
                {action.color && (
                  <div className={`emotion-indicator w-3 h-3 ${action.color} rounded-full mx-auto mb-1`} />
                )}
                <IconComponent className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{action.label}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </a>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}