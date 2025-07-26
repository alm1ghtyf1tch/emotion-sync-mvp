import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { FocusModes } from "@/components/FocusModes";
import { Heart, MessageCircle, Activity, Settings, Menu, X, Shield, LogOut, LogIn, Stethoscope } from "lucide-react";

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut, user } = useAuth();

  const navItems = [
    { to: "/", label: "Home", icon: Heart },
    ...(user ? [
      { to: "/companion", label: "AI Companion", icon: MessageCircle },
      { to: "/coping-tools", label: "Coping Tools", icon: Activity },
      { to: "/emotion-board", label: "EmotionBoard", icon: Shield },
      { to: "/meet-therapist", label: "Meet a Therapist", icon: Stethoscope },
      { to: "/settings", label: "Settings", icon: Settings },
    ] : [])
  ];

  return (
    <nav className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 text-xl font-semibold">
            <Heart className="w-6 h-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EmotionSync
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
            
            <div className="flex items-center space-x-2 ml-2">
              <FocusModes />
              
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <NavLink
                  to="/auth"
                  className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </NavLink>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground justify-start"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </Button>
              ) : (
                <NavLink
                  to="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}