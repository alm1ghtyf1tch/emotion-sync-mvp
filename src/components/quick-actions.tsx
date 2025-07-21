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
              className={`h-auto min-h-[120px] p-3 flex flex-col items-center justify-center space-y-2 transition-all duration-300 hover:scale-105 ${
                action.primary 
                  ? "bg-gradient-to-br from-primary to-primary/80 gentle-glow" 
                  : action.urgent
                  ? "bg-gradient-to-br from-destructive to-destructive/80"
                  : "bg-gradient-to-br from-secondary/50 to-muted/30 hover:from-secondary/70 hover:to-muted/50 hover:shadow-lg"
              }`}
            >
              <a href={action.href} className="text-center w-full flex flex-col items-center justify-center h-full max-w-full">
                {action.color && (
                  <div className={`emotion-indicator w-3 h-3 ${action.color} rounded-full mx-auto mb-1`} />
                )}
                <IconComponent className="w-5 h-5 mx-auto mb-2 flex-shrink-0" />
                <div className="text-xs font-medium leading-tight px-2 line-clamp-2 max-w-full overflow-hidden text-ellipsis">{action.label}</div>
                <div className="text-[10px] opacity-80 leading-tight px-2 line-clamp-1 max-w-full overflow-hidden text-ellipsis">{action.description}</div>
              </a>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}