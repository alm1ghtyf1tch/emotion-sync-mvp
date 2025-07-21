import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  Upload,
  Calendar,
  School,
  MapPin,
  Globe,
  Eye,
  Users,
  TrendingUp
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    full_name: '',
    birthday: '',
    school: '',
    bio: '',
    phone_number: ''
  });

  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    moodAlerts: false,
    weeklyReports: true,
    emergencyContacts: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    share_statistics: false,
    show_mood_trends: false,
    allow_analytics: true,
    data_retention_months: 12,
    share_progress_therapist: false,
    public_profile: false
  });

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Load profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          birthday: profileData.birthday || '',
          school: profileData.school || '',
          bio: profileData.bio || '',
          phone_number: profileData.phone_number || ''
        });
      }

      // Load privacy settings
      const { data: privacyData, error: privacyError } = await supabase
        .from('privacy_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (privacyError && privacyError.code !== 'PGRST116') {
        throw privacyError;
      }

      if (privacyData) {
        setPrivacySettings({
          share_statistics: privacyData.share_statistics || false,
          show_mood_trends: privacyData.show_mood_trends || false,
          allow_analytics: privacyData.allow_analytics || true,
          data_retention_months: privacyData.data_retention_months || 12,
          share_progress_therapist: privacyData.share_progress_therapist || false,
          public_profile: privacyData.public_profile || false
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error loading settings",
        description: "Could not load your settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          ...profile
        });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully."
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: "Could not save your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const savePrivacySettings = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from('privacy_settings')
        .upsert({
          user_id: user.id,
          ...privacySettings
        });

      if (error) throw error;

      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved."
      });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: "Error saving settings",
        description: "Could not save your privacy settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
                    <Label className="text-base font-medium">Share progress with therapist</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow your connected therapist to view your mood trends and insights
                    </p>
                  </div>
                  <Switch 
                    checked={privacySettings.share_progress_therapist}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, share_progress_therapist: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Share statistics with community</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow other users to see your anonymized mood statistics and trends
                    </p>
                  </div>
                  <Switch 
                    checked={privacySettings.share_statistics}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, share_statistics: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Show mood trends publicly</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your mood trends on your public profile (if enabled)
                    </p>
                  </div>
                  <Switch 
                    checked={privacySettings.show_mood_trends}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, show_mood_trends: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Public profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other EmotionSync users
                    </p>
                  </div>
                  <Switch 
                    checked={privacySettings.public_profile}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, public_profile: checked }))
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
                    checked={privacySettings.allow_analytics}
                    onCheckedChange={(checked) => 
                      setPrivacySettings(prev => ({ ...prev, allow_analytics: checked }))
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Data retention period</Label>
                  <Select 
                    value={privacySettings.data_retention_months.toString()}
                    onValueChange={(value) => 
                      setPrivacySettings(prev => ({ ...prev, data_retention_months: parseInt(value) }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 months</SelectItem>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">1 year</SelectItem>
                      <SelectItem value="24">2 years</SelectItem>
                      <SelectItem value="0">Keep indefinitely</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How long to keep your conversation history and mood data
                  </p>
                </div>

                <Button onClick={savePrivacySettings} disabled={loading} className="w-full">
                  Save Privacy Settings
                </Button>

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
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input 
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input 
                      id="birthday"
                      type="date"
                      value={profile.birthday}
                      onChange={(e) => setProfile(prev => ({ ...prev, birthday: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school">School/Institution</Label>
                    <Input 
                      id="school"
                      value={profile.school}
                      onChange={(e) => setProfile(prev => ({ ...prev, school: e.target.value }))}
                      placeholder="Your school or workplace"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input 
                      id="phone_number"
                      type="tel"
                      value={profile.phone_number}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone_number: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us a bit about yourself..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h3 className="font-semibold text-sm mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile Information
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your profile information helps personalize your EmotionSync experience</li>
                    <li>• Only share information you're comfortable with</li>
                    <li>• You can update or remove any information at any time</li>
                    <li>• Your data is always kept secure and private</li>
                  </ul>
                </div>

                <Button onClick={saveProfile} disabled={loading} className="w-full">
                  Save Profile
                </Button>
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