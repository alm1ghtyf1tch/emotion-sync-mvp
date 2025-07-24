import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Focus, 
  Bell, 
  BellOff, 
  Briefcase, 
  Volume2, 
  VolumeX,
  ChevronDown
} from "lucide-react";

type FocusMode = 'none' | 'dnd' | 'work' | 'calm';

export function FocusModes() {
  const [currentMode, setCurrentMode] = useState<FocusMode>('none');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const focusModes = [
    {
      id: 'dnd' as const,
      name: 'Do Not Disturb',
      description: 'Disables all notifications',
      icon: BellOff,
      color: 'bg-red-500/20 text-red-600 border-red-500/30'
    },
    {
      id: 'work' as const,
      name: 'Work',
      description: 'Only system/classroom notifications',
      icon: Briefcase,
      color: 'bg-blue-500/20 text-blue-600 border-blue-500/30'
    },
    {
      id: 'calm' as const,
      name: 'Calm',
      description: 'Muted sounds + soft background music',
      icon: VolumeX,
      color: 'bg-green-500/20 text-green-600 border-green-500/30'
    }
  ];

  const handleModeToggle = (mode: FocusMode) => {
    setCurrentMode(currentMode === mode ? 'none' : mode);
    setIsDropdownOpen(false);
  };

  const getCurrentModeInfo = () => {
    if (currentMode === 'none') return null;
    return focusModes.find(mode => mode.id === currentMode);
  };

  const currentModeInfo = getCurrentModeInfo();

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`glass-effect ${currentModeInfo ? currentModeInfo.color : ''}`}
      >
        {currentModeInfo ? (
          <>
            <currentModeInfo.icon className="w-4 h-4 mr-2" />
            {currentModeInfo.name}
          </>
        ) : (
          <>
            <Focus className="w-4 h-4 mr-2" />
            Focus
          </>
        )}
        <ChevronDown className="w-3 h-3 ml-2" />
      </Button>

      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 glass-dropdown border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <h3 className="font-semibold text-sm">Focus Modes</h3>
            <p className="text-xs text-muted-foreground">Customize your environment</p>
          </div>
          
          <div className="p-2 space-y-1">
            {focusModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeToggle(mode.id)}
                className="w-full flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-colors text-left"
              >
                <div className="flex items-center space-x-3">
                  <mode.icon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{mode.name}</div>
                    <div className="text-xs text-muted-foreground">{mode.description}</div>
                  </div>
                </div>
                {currentMode === mode.id && (
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                )}
              </button>
            ))}
          </div>

          {currentMode !== 'none' && (
            <div className="p-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleModeToggle('none')}
                className="w-full text-xs"
              >
                Turn Off Focus Mode
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}