import { Mail, Phone, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-card/50 backdrop-blur">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-primary">About EmotionSync</h3>
            <p className="text-sm text-muted-foreground mb-2">
              EmotionSync - since July, 2025
            </p>
            <p className="text-sm text-muted-foreground">
              Supporting emotional well-being through AI-powered mental health tools 
              designed for educational environments and personal growth.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-primary">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href="mailto:segathess@gmail.com" className="text-muted-foreground hover:text-primary">
                  segathess@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href="https://wa.me/77076162130" className="text-muted-foreground hover:text-primary">
                  +7 707 616 2130
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <a href="https://t.me/zxcreizz" className="text-muted-foreground hover:text-primary">
                  @zxcreizz
                </a>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-primary">Our Mission</h3>
            <p className="text-sm text-muted-foreground">
              Empowering students and individuals with accessible mental health support 
              through innovative AI technology while maintaining privacy and fostering 
              genuine human connections.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 EmotionSync. Building the future of emotional well-being in education.
          </p>
        </div>
      </div>
    </footer>
  );
}