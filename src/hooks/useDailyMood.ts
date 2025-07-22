import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme, MoodTheme } from "@/contexts/ThemeContext";

export function useDailyMood() {
  const { user } = useAuth();
  const { setTheme } = useTheme();
  const [todayMood, setTodayMood] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const moodToTheme: Record<number, MoodTheme> = {
    5: 'great',
    4: 'good', 
    3: 'okay',
    2: 'low',
    1: 'struggling'
  };

  // Load today's mood on component mount
  useEffect(() => {
    if (user) {
      loadTodayMood();
    } else {
      // Reset to default theme for non-authenticated users
      setTheme('default');
      setTodayMood(null);
    }
  }, [user, setTheme]);

  const loadTodayMood = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_moods')
        .select('mood_value')
        .eq('user_id', user.id)
        .eq('mood_date', today)
        .maybeSingle();

      if (error) {
        console.error('Error loading mood:', error);
        return;
      }

      if (data) {
        setTodayMood(data.mood_value);
        setTheme(moodToTheme[data.mood_value]);
      } else {
        setTodayMood(null);
        setTheme('default');
      }
    } catch (error) {
      console.error('Error loading mood:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMood = async (mood: number) => {
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('daily_moods')
        .upsert({
          user_id: user.id,
          mood_value: mood,
          mood_date: today
        });

      if (error) {
        console.error('Error saving mood:', error);
        return;
      }

      setTodayMood(mood);
      setTheme(moodToTheme[mood]);
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    todayMood,
    loading,
    saveMood
  };
}