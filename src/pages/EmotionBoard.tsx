import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/Footer";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Settings as SettingsIcon,
  Download,
  Search,
  Filter,
  Bell,
  Calendar,
  Shield,
  Activity
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, BarChart, Bar } from "recharts";
import { InteractiveFlowChart } from "@/components/InteractiveFlowChart";

// Mock data for demonstration
const clientsData = [
  { 
    id: 1, 
    name: "Sarah M.", 
    avatar: "SM",
    lastSession: "2024-01-20",
    riskLevel: "low",
    moodTrend: "improving",
    sessions: 12,
    currentMood: 4
  },
  { 
    id: 2, 
    name: "James K.", 
    avatar: "JK",
    lastSession: "2024-01-19",
    riskLevel: "medium",
    moodTrend: "declining",
    sessions: 8,
    currentMood: 2
  },
  { 
    id: 3, 
    name: "Maria R.", 
    avatar: "MR",
    lastSession: "2024-01-21",
    riskLevel: "high",
    moodTrend: "stable",
    sessions: 15,
    currentMood: 1
  }
];

const moodTrendData = [
  { date: "Jan 15", sarah: 3, james: 4, maria: 2 },
  { date: "Jan 16", sarah: 4, james: 3, maria: 2 },
  { date: "Jan 17", sarah: 4, james: 2, maria: 1 },
  { date: "Jan 18", sarah: 5, james: 2, maria: 2 },
  { date: "Jan 19", sarah: 4, james: 3, maria: 1 },
  { date: "Jan 20", sarah: 5, james: 2, maria: 2 },
  { date: "Jan 21", sarah: 4, james: 3, maria: 1 },
];

const triggerAlertsData = [
  {
    id: 1,
    client: "Maria R.",
    trigger: "Mentioned feeling 'empty' and 'hopeless'",
    severity: "high",
    timestamp: "2024-01-21 14:30",
    status: "unreviewed"
  },
  {
    id: 2,
    client: "James K.",
    trigger: "Significant mood decline over 3 days",
    severity: "medium",
    timestamp: "2024-01-19 09:15",
    status: "reviewed"
  }
];

export default function EmotionBoard() {
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-muted';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'declining': return '↘️';
      case 'stable': return '→';
      default: return '→';
    }
  };

  const filteredClients = clientsData.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-primary" />
              EmotionBoard
            </h1>
            <p className="text-muted-foreground">
              Professional therapist dashboard for client emotional analytics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="mb-6 p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm mb-1">Professional Ethics & Privacy</h3>
              <p className="text-xs text-muted-foreground">
                All client data is encrypted and HIPAA compliant. EmotionBoard provides insights to support 
                your professional judgment—it does not replace clinical assessment or intervention decisions.
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Clients</p>
                    <p className="text-2xl font-bold text-primary">12</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Risk Alerts</p>
                    <p className="text-2xl font-bold text-destructive">2</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Mood Score</p>
                    <p className="text-2xl font-bold text-accent">3.2/5</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-accent" />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Sessions</p>
                    <p className="text-2xl font-bold">28</p>
                  </div>
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Client Mood Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={moodTrendData}>
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="sarah" stroke="hsl(var(--emotion-happy))" strokeWidth={2} />
                      <Line type="monotone" dataKey="james" stroke="hsl(var(--emotion-sad))" strokeWidth={2} />
                      <Line type="monotone" dataKey="maria" stroke="hsl(var(--emotion-angry))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
                <div className="space-y-3">
                  {triggerAlertsData.map((alert) => (
                    <div key={alert.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-sm">{alert.client}</div>
                        <Badge className={getRiskColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{alert.trigger}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{alert.timestamp}</span>
                        <Badge variant={alert.status === 'reviewed' ? 'secondary' : 'outline'}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <Card 
                  key={client.id} 
                  className={`p-6 cursor-pointer transition-all duration-200 ${
                    selectedClient === client.id ? 'ring-2 ring-primary border-primary' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedClient(client.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                        {client.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {client.sessions} sessions
                        </p>
                      </div>
                    </div>
                    <Badge className={getRiskColor(client.riskLevel)}>
                      {client.riskLevel} risk
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Mood</span>
                      <div className="flex items-center space-x-2">
                        <span>{client.currentMood}/5</span>
                        <div className={`w-3 h-3 rounded-full ${
                          client.currentMood >= 4 ? 'bg-green-500' :
                          client.currentMood >= 3 ? 'bg-yellow-500' :
                          client.currentMood >= 2 ? 'bg-orange-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Trend</span>
                      <span>{getTrendIcon(client.moodTrend)} {client.moodTrend}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Last Session</span>
                      <span>{client.lastSession}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <div className="space-y-4">
              {triggerAlertsData.map((alert) => (
                <Card key={alert.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        alert.severity === 'high' ? 'bg-destructive' :
                        alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div>
                        <h3 className="font-semibold mb-1">{alert.client}</h3>
                        <p className="text-muted-foreground">{alert.trigger}</p>
                        <p className="text-sm text-muted-foreground mt-2">{alert.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRiskColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                      <Button 
                        variant={alert.status === 'reviewed' ? 'secondary' : 'default'} 
                        size="sm"
                      >
                        {alert.status === 'reviewed' ? 'Reviewed' : 'Review'}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Recommended Actions</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Schedule immediate check-in session</li>
                      <li>• Review safety plan with client</li>
                      <li>• Consider involving support system</li>
                      <li>• Document intervention in client notes</li>
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Mood Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { mood: 'Great (5)', count: 15 },
                      { mood: 'Good (4)', count: 25 },
                      { mood: 'Okay (3)', count: 30 },
                      { mood: 'Low (2)', count: 20 },
                      { mood: 'Poor (1)', count: 10 },
                    ]}>
                      <XAxis dataKey="mood" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Daily Check-ins</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">AI Conversations</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Coping Tools Usage</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Interactive Flow Charts Section */}
            <Card className="p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Interactive Workflow Analysis</h3>
              <InteractiveFlowChart />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}