import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart,
  X,
  Music,
  Volume2
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  isLiked?: boolean;
}

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onLike: (trackId: string) => void;
  onClose: () => void;
}

export function MusicPlayer({
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onLike,
  onClose
}: MusicPlayerProps) {
  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 glass-effect border border-border rounded-lg shadow-lg z-50 animate-slide-in-right">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Music className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Now Playing</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm truncate">{currentTrack.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrevious}
              className="h-8 w-8 p-0"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={isPlaying ? onPause : onPlay}
              size="sm"
              className="h-10 w-10 p-0 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              className="h-8 w-8 p-0"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(currentTrack.id)}
                className={`h-8 w-8 p-0 ${currentTrack.isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-4 h-4 ${currentTrack.isLiked ? 'fill-current' : ''}`} />
              </Button>
              <Volume2 className="w-3 h-3 text-muted-foreground" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {currentTrack.duration}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}