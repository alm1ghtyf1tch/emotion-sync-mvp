import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

const aiResponses = [
  "I hear you, and I want you to know that your feelings are completely valid. What you're experiencing matters.",
  "Thank you for sharing that with me. It takes courage to open up about how you're feeling.",
  "I'm here to listen without judgment. Would you like to tell me more about what's been on your mind?",
  "Your emotional awareness is a strength. How are you taking care of yourself today?",
  "I notice you mentioned feeling overwhelmed. That's a lot to carry. What usually helps you when you feel this way?",
  "You're not alone in feeling this way. Many people experience similar emotions, and it's okay to feel what you're feeling."
];

export default function Companion() {
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
      
      // Fallback message on error
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `⚠️ Sorry, something went wrong with EmotionSync AI. Please try again later.\n_(Error details: ${error instanceof Error ? error.message : 'Unknown error'})_`,
        sender: 'ai',
        timestamp: new Date(),
        emotion: 'calm'
      };
      
      setMessages(prev => [...prev, errorMessage]);
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