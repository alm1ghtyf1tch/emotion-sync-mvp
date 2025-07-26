import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDailyMood } from "@/hooks/useDailyMood";
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2,
  VolumeX,
  Heart,
  Sparkles,
  MessageCircle
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotion?: 'calm' | 'anxious' | 'sad' | 'happy' | 'angry';
}

// Template responses based on user's mood level
const templateResponses = {
  1: [ // Struggling
    "I can see you're going through a really tough time right now. Your feelings are completely valid, and I want you to know that you're not alone.",
    "It takes incredible strength to reach out when you're struggling. I'm here to listen and support you through this difficult moment.",
    "What you're experiencing is real and significant. Remember that difficult times don't last forever, even when they feel overwhelming.",
    "I hear your pain, and I want you to know that it's okay to not be okay. You're taking an important step by talking about how you feel.",
    "If you're having thoughts of self-harm, please reach out to emergency services (112) or a crisis hotline immediately. Your safety matters."
  ],
  2: [ // Low
    "I can sense that things feel heavy for you right now. It's completely understandable to feel this way, and I'm here to listen.",
    "Low periods are part of the human experience, and you're not alone in feeling this way. What's been weighing on your mind lately?",
    "Sometimes when we're feeling low, small steps forward can make a difference. Is there something that usually brings you a bit of comfort?",
    "Thank you for sharing your feelings with me. It shows self-awareness and courage to acknowledge when we're struggling.",
    "Your feelings are valid, and it's okay to have difficult days. What kind of support feels most helpful to you right now?"
  ],
  3: [ // Okay
    "It sounds like you're in a neutral space today. That's perfectly okay - not every day has to be amazing or terrible.",
    "Being 'okay' is actually a stable place to be. How are you taking care of yourself today?",
    "I appreciate you checking in and sharing how you're feeling. Is there anything on your mind you'd like to talk about?",
    "Stability can be valuable too. Sometimes okay days give us space to process and recharge. What's been going on for you?",
    "Thank you for being here. Even on okay days, it's good to stay connected with how we're feeling."
  ],
  4: [ // Good
    "I'm glad to hear you're feeling good today! It's wonderful when we can appreciate the positive moments in life.",
    "That's great news! When we're feeling good, it can be a nice time to reflect on what's contributing to those positive feelings.",
    "I love hearing that you're doing well. What's been going right for you lately?",
    "It's beautiful to hear the positivity in your message. Good days are precious - I hope you're able to savor this feeling.",
    "Your positive energy comes through in your words. What's been helping you feel good today?"
  ],
  5: [ // Great
    "What an amazing energy you're bringing today! I can feel your joy and enthusiasm - it's wonderful.",
    "I'm so happy to hear you're feeling great! These moments of joy are truly special. What's been bringing you such happiness?",
    "Your positive spirit is infectious! It's beautiful when life feels this good. I hope you're taking time to really appreciate this feeling.",
    "What a gift to feel this great! I love celebrating these high moments with you. What's been the highlight of your day?",
    "You're radiating such positive energy today! These are the moments that make everything worthwhile. How are you planning to enjoy this feeling?"
  ]
};

// General fallback responses when mood is unknown
const generalResponses = [
  "I hear you, and I want you to know that your feelings are completely valid. What you're experiencing matters.",
  "Thank you for sharing that with me. It takes courage to open up about how you're feeling.",
  "I'm here to listen without judgment. Would you like to tell me more about what's been on your mind?",
  "Your emotional awareness is a strength. How are you taking care of yourself today?",
  "I notice you mentioned feeling overwhelmed. That's a lot to carry. What usually helps you when you feel this way?",
  "You're not alone in feeling this way. Many people experience similar emotions, and it's okay to feel what you're feeling."
];

export default function Companion() {
  const { todayMood } = useDailyMood();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your AI companion, here to listen and support you. How are you feeling today? You can share anything that's on your mind - I'm here for you.",
      sender: 'ai',
      timestamp: new Date(),
      emotion: 'calm'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectEmotion = (text: string): 'calm' | 'anxious' | 'sad' | 'happy' | 'angry' => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) {
      return 'anxious';
    }
    if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('down')) {
      return 'sad';
    }
    if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
      return 'angry';
    }
    if (lowerText.includes('happy') || lowerText.includes('excited') || lowerText.includes('great')) {
      return 'happy';
    }
    return 'calm';
  };

  const getTemplateResponse = (): string => {
    // Use mood-based responses if mood is available
    if (todayMood && todayMood >= 1 && todayMood <= 5) {
      const responses = templateResponses[todayMood as keyof typeof templateResponses];
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Fall back to general responses
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'user',
      timestamp: new Date(),
      emotion: detectEmotion(newMessage)
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      // Call the Flask API
      const response = await fetch('https://54823ca99089.ngrok-free.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply || "I'm here to listen and support you.",
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'calm'
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    } catch (error) {
      console.error('API Error:', error);
      
      // Use template response based on user's current mood level
      const templateMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getTemplateResponse(),
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'calm'
      };
      
      setMessages(prev => [...prev, templateMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here you would integrate with Web Speech API
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // Here you would integrate with Web Speech Synthesis API
  };

  const getEmotionColor = (emotion?: string) => {
    switch (emotion) {
      case 'calm': return 'emotion-calm';
      case 'anxious': return 'emotion-anxious';
      case 'sad': return 'emotion-sad';
      case 'happy': return 'emotion-happy';
      case 'angry': return 'emotion-angry';
      default: return 'emotion-calm';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <Card className="glass-effect mb-6 p-6 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-gentle-pulse">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">AI Companion</h1>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-gentle-pulse" />
                  <span className="text-sm text-muted-foreground">Online & listening</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSpeaking}
                className={isSpeaking ? "bg-accent/20 border-accent" : ""}
              >
                {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </Card>

        {/* Chat Container */}
        <Card className="glass-effect flex flex-col h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.sender === 'ai' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs text-muted-foreground">AI Companion</span>
                      {message.emotion && (
                        <div className={`emotion-indicator w-3 h-3 ${getEmotionColor(message.emotion)} rounded-full`} />
                      )}
                    </div>
                  )}
                  
                  <div className={message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {message.sender === 'user' && message.emotion && (
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <div className={`emotion-indicator w-3 h-3 ${getEmotionColor(message.emotion)} rounded-full`} />
                      <span className="text-xs text-muted-foreground capitalize">{message.emotion}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs text-muted-foreground">AI Companion is typing...</span>
                  </div>
                  <div className="chat-bubble-ai">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleListening}
                className={`${isListening ? "bg-destructive/20 border-destructive animate-gentle-pulse" : ""} flex-shrink-0`}
              >
                {isListening ? <Mic className="w-4 h-4 text-destructive" /> : <MicOff className="w-4 h-4" />}
              </Button>
              
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind... I'm here to listen."
                className="flex-1 border-primary/20 focus:border-primary/40"
              />
              
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                size="sm"
                className="flex-shrink-0 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>Press Enter to send</span>
                {isListening && (
                  <Badge variant="secondary" className="bg-destructive/20 text-destructive">
                    Listening...
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-3 h-3" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Helpful Tips */}
        <Card className="mt-6 p-4 bg-secondary/20">
          <h3 className="font-semibold text-sm mb-2">💡 Tips for better conversations</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Be as open and honest as you feel comfortable</li>
            <li>• There's no judgment here - share whatever is on your mind</li>
            <li>• If you're in crisis, please reach out to a human professional immediately</li>
            <li>• Your conversations are private and never shared</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}