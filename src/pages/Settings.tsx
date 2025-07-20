import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Bell, 
  Palette, 
  User, 
  Database,
  Phone,
  Heart,
  Trash2,
  Download,
  Upload
} from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    moodAlerts: false,
    weeklyReports: true,
    emergencyContacts: true
  });

  const [privacy, setPrivacy] = useState({
    shareWithTherapist: false,
    anonymousData: true,
    dataRetention: "1year"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your EmotionSync experience and privacy preferences.
          </p>
        </div>

        <Tabs defaultValue="privacy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Privacy & Security</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Share data with therapist</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow your connected therapist to view your mood trends and insights
                    </p>
                  </div>
                  <Switch 
                    checked={privacy.shareWithTherapist}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, shareWithTherapist: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Anonymous analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve EmotionSync by sharing anonymous usage data
                    </p>
                  </div>
                  <Switch 
                    checked={privacy.anonymousData}
                    onCheckedChange={(checked) => 
                      setPrivacy(prev => ({ ...prev, anonymousData: checked }))
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Data retention period</Label>
                  <Select 
                    value={privacy.dataRetention}
                    onValueChange={(value) => 
                      setPrivacy(prev => ({ ...prev, dataRetention: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3months">3 months</SelectItem>
                      <SelectItem value="6months">6 months</SelectItem>
                      <SelectItem value="1year">1 year</SelectItem>
                      <SelectItem value="2years">2 years</SelectItem>
                      <SelectItem value="indefinite">Keep indefinitely</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How long to keep your conversation history and mood data
                  </p>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-sm mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Your Privacy Rights
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All conversations are encrypted end-to-end</li>
                    <li>• You can export or delete your data at any time</li>
                    <li>• EmotionSync never sells personal information</li>
                    <li>• Data is stored securely and HIPAA compliant</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Bell className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Daily check-in reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Gentle reminders to log your mood and check in with yourself
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.dailyReminders}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, dailyReminders: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Mood pattern alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Notifications when we detect concerning mood patterns
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.moodAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, moodAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Weekly progress reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Summary of your emotional journey and insights
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Emergency contact alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow emergency contacts to be notified if you're in crisis
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.emergencyContacts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, emergencyContacts: checked }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reminder time</Label>
                    <Input type="time" defaultValue="19:00" />
                  </div>
                  <div className="space-y-2">
                    <Label>Time zone</Label>
                    <Select defaultValue="pst">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                        <SelectItem value="cst">Central Time (CST)</SelectItem>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Profile Settings</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Preferred name</Label>
                    <Input placeholder="How should we address you?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Age range</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-25">18-25</SelectItem>
                        <SelectItem value="26-35">26-35</SelectItem>
                        <SelectItem value="36-45">36-45</SelectItem>
                        <SelectItem value="46-55">46-55</SelectItem>
                        <SelectItem value="56-65">56-65</SelectItem>
                        <SelectItem value="65+">65+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Communication style preference</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="How should your AI companion communicate?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="formal">Formal and professional</SelectItem>
                      <SelectItem value="casual">Casual and friendly</SelectItem>
                      <SelectItem value="empathetic">Warm and empathetic</SelectItem>
                      <SelectItem value="direct">Direct and concise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Goals & focus areas (optional)</Label>
                  <Textarea 
                    placeholder="What would you like to work on with EmotionSync? (e.g., anxiety management, mood tracking, building resilience)"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Therapist connection code (optional)</Label>
                  <Input placeholder="Enter code provided by your therapist" />
                  <p className="text-sm text-muted-foreground">
                    This allows your therapist to view anonymized insights from your EmotionSync usage
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Emergency */}
          <TabsContent value="emergency">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Phone className="w-6 h-6 text-destructive" />
                <h2 className="text-xl font-semibold">Crisis Support</h2>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <h3 className="font-semibold text-sm mb-2 flex items-center text-destructive">
                    <Heart className="w-4 h-4 mr-2" />
                    Important: EmotionSync is not a crisis intervention service
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    If you're having thoughts of self-harm or suicide, please contact emergency services 
                    or a crisis hotline immediately. EmotionSync supports your mental health journey 
                    but cannot replace professional crisis intervention.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Emergency Contacts</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contact name</Label>
                      <Input placeholder="Trusted friend or family member" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone number</Label>
                      <Input placeholder="(555) 123-4567" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Input placeholder="e.g., Partner, Parent, Best friend" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Crisis Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-secondary/20">
                      <h4 className="font-medium mb-2">National Suicide Prevention Lifeline</h4>
                      <p className="text-2xl font-bold text-primary">988</p>
                      <p className="text-sm text-muted-foreground">24/7 crisis support</p>
                    </Card>
                    <Card className="p-4 bg-secondary/20">
                      <h4 className="font-medium mb-2">Crisis Text Line</h4>
                      <p className="text-lg font-bold text-accent">Text HOME to 741741</p>
                      <p className="text-sm text-muted-foreground">24/7 text-based support</p>
                    </Card>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Personal safety plan (optional)</Label>
                  <Textarea 
                    placeholder="What helps you feel safe? Who can you call? What coping strategies work for you?"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Database className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Data Management</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-center">
                      <Download className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="font-medium">Export My Data</div>
                      <div className="text-xs text-muted-foreground">Download all your data</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4">
                    <div className="text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <div className="font-medium">Import Data</div>
                      <div className="text-xs text-muted-foreground">Upload previous exports</div>
                    </div>
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Data Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <div className="font-medium">Mood entries</div>
                      <div className="text-2xl font-bold text-primary">143</div>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <div className="font-medium">AI conversations</div>
                      <div className="text-2xl font-bold text-accent">27</div>
                    </div>
                    <div className="p-3 bg-secondary/20 rounded-lg">
                      <div className="font-medium">Journal entries</div>
                      <div className="text-2xl font-bold text-green-500">15</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-destructive/20 pt-6">
                  <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete All Conversations
                    </Button>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account & All Data
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    These actions cannot be undone. Please consider exporting your data first.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8 text-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}