-- Create a table to store daily mood entries
CREATE TABLE public.daily_moods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood_value INTEGER NOT NULL CHECK (mood_value >= 1 AND mood_value <= 5),
  mood_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, mood_date)
);

-- Enable Row Level Security
ALTER TABLE public.daily_moods ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own daily moods" 
ON public.daily_moods 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily moods" 
ON public.daily_moods 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily moods" 
ON public.daily_moods 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily moods" 
ON public.daily_moods 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_daily_moods_updated_at
BEFORE UPDATE ON public.daily_moods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();