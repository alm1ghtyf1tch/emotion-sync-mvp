import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Footer } from "@/components/Footer";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Shield,
  Heart,
  User,
  CheckCircle
} from "lucide-react";

interface TherapistBooking {
  name: string;
  email: string;
  phone: string;
  preferredDate: Date | undefined;
  preferredTime: string;
  sessionType: 'in-person' | 'video' | 'phone';
  concerns: string;
  shareEmotionData: boolean;
}

export default function MeetTherapist() {
  const [booking, setBooking] = useState<TherapistBooking>({
    name: '',
    email: '',
    phone: '',
    preferredDate: undefined,
    preferredTime: '',
    sessionType: 'video',
    concerns: '',
    shareEmotionData: false
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', booking);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <Card className="p-8 text-center glass-card">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Booking Request Sent!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for reaching out. A qualified therapist from your educational organization 
              will contact you within 24-48 hours to confirm your appointment and discuss next steps.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 Confirmation email will be sent to: {booking.email}</p>
              <p>📱 Contact number: {booking.phone}</p>
              <p>🗓️ Preferred date: {booking.preferredDate?.toLocaleDateString()}</p>
            </div>
            <Button 
              onClick={() => setIsSubmitted(false)} 
              className="mt-6"
            >
              Book Another Session
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Meet a Therapist</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with qualified mental health professionals from your school, university, 
            or local organization. Professional support is just a conversation away.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 glass-card">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-primary" />
                Book Your Session
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <Input
                      required
                      value={booking.name}
                      onChange={(e) => setBooking({...booking, name: e.target.value})}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      required
                      value={booking.email}
                      onChange={(e) => setBooking({...booking, email: e.target.value})}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <Input
                    type="tel"
                    required
                    value={booking.phone}
                    onChange={(e) => setBooking({...booking, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Session Preferences */}
                <div>
                  <label className="block text-sm font-medium mb-3">Preferred Session Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { type: 'video', icon: MessageCircle, label: 'Video Call' },
                      { type: 'in-person', icon: MapPin, label: 'In-Person' },
                      { type: 'phone', icon: Phone, label: 'Phone Call' }
                    ].map(({ type, icon: Icon, label }) => (
                      <Button
                        key={type}
                        type="button"
                        variant={booking.sessionType === type ? "default" : "outline"}
                        onClick={() => setBooking({...booking, sessionType: type as any})}
                        className="flex flex-col items-center p-4 h-auto"
                      >
                        <Icon className="w-5 h-5 mb-1" />
                        <span className="text-xs">{label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Preferred Date</label>
                  <Calendar
                    mode="single"
                    selected={booking.preferredDate}
                    onSelect={(date) => setBooking({...booking, preferredDate: date})}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Time</label>
                  <select
                    value={booking.preferredTime}
                    onChange={(e) => setBooking({...booking, preferredTime: e.target.value})}
                    className="w-full p-2 border rounded-md bg-background"
                  >
                    <option value="">Select a time</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>

                {/* Concerns */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    What would you like to discuss? (Optional)
                  </label>
                  <Textarea
                    value={booking.concerns}
                    onChange={(e) => setBooking({...booking, concerns: e.target.value})}
                    placeholder="Share what's on your mind or any specific concerns you'd like to address..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Data Sharing Option */}
                <div className="p-4 bg-secondary/20 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="shareData"
                      checked={booking.shareEmotionData}
                      onCheckedChange={(checked) => 
                        setBooking({...booking, shareEmotionData: checked as boolean})
                      }
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor="shareData" 
                        className="text-sm font-medium cursor-pointer"
                      >
                        Share my EmotionSync mood tracking data
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Optional: Allow your therapist to access your mood patterns and 
                        emotional journey data to provide more personalized support.
                      </p>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Request Appointment
                </Button>
              </form>
            </Card>
          </div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            {/* Why Professional Help */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-primary" />
                Why See a Therapist?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Professional guidance for complex emotions</li>
                <li>• Develop healthy coping strategies</li>
                <li>• Work through academic stress</li>
                <li>• Address anxiety and depression</li>
                <li>• Improve relationships and communication</li>
              </ul>
            </Card>

            {/* Privacy Assurance */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Your Privacy
              </h3>
              <p className="text-sm text-muted-foreground">
                All sessions are completely confidential. Your EmotionSync data 
                is only shared if you explicitly consent, and therapists follow 
                strict privacy guidelines.
              </p>
            </Card>

            {/* What to Expect */}
            <Card className="p-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                What to Expect
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Initial Contact:</strong>
                  <p className="text-muted-foreground">Within 24-48 hours</p>
                </div>
                <div>
                  <strong>Session Length:</strong>
                  <p className="text-muted-foreground">45-50 minutes</p>
                </div>
                <div>
                  <strong>Follow-up:</strong>
                  <p className="text-muted-foreground">Ongoing support available</p>
                </div>
              </div>
            </Card>

            {/* Crisis Support */}
            <Card className="p-6 border-destructive/30 bg-destructive/5">
              <h3 className="font-semibold mb-3 text-destructive">Need Immediate Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you're in crisis or having thoughts of self-harm:
              </p>
              <Button variant="destructive" size="sm" className="w-full">
                Crisis Hotline: 988
              </Button>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}