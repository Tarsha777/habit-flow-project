
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine, Save, Image, Smile, Frown, Meh, ThumbsUp, Star, AlertCircle, Lightbulb } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface JournalEntryProps {
  date: Date;
  existingContent?: string;
  onSave?: (content: string) => void;
}

type MoodType = 'happy' | 'neutral' | 'sad' | 'excited' | 'stressed';

interface JournalStructure {
  gratitude: string;
  stressors: string;
  achievements: string;
  improvements: string;
  mood: MoodType;
  additionalNotes: string;
}

const defaultJournalStructure: JournalStructure = {
  gratitude: '',
  stressors: '',
  achievements: '',
  improvements: '',
  mood: 'neutral',
  additionalNotes: ''
};

const JournalEntry: React.FC<JournalEntryProps> = ({
  date,
  existingContent = '',
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(!existingContent);
  
  // Parse existing content if available
  const parseExistingContent = (): JournalStructure => {
    if (!existingContent) return defaultJournalStructure;
    
    try {
      return JSON.parse(existingContent);
    } catch (e) {
      // If the existing content is not in JSON format (from older entries)
      return {
        ...defaultJournalStructure,
        additionalNotes: existingContent
      };
    }
  };
  
  const [journalData, setJournalData] = useState<JournalStructure>(parseExistingContent());
  
  const handleInputChange = (field: keyof JournalStructure, value: string) => {
    setJournalData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = () => {
    // Validate that at least one field has content
    const hasContent = Object.entries(journalData).some(([key, value]) => {
      if (key === 'mood') return false; // Skip mood in validation
      return value.trim().length > 0;
    });
    
    if (!hasContent) {
      toast({
        title: "Cannot save empty entry",
        description: "Please write something in at least one section of your journal entry",
        variant: "destructive",
      });
      return;
    }
    
    if (onSave) {
      // Save the structured data as JSON string
      onSave(JSON.stringify(journalData));
    }
    
    setIsEditing(false);
    toast({
      title: "Journal entry saved",
      description: "Your thoughts have been saved successfully",
    });
  };
  
  const MoodIcon = ({ mood }: { mood: MoodType }) => {
    switch (mood) {
      case 'happy':
        return <Smile className="h-5 w-5 text-yellow-500" />;
      case 'sad':
        return <Frown className="h-5 w-5 text-blue-500" />;
      case 'neutral':
        return <Meh className="h-5 w-5 text-gray-500" />;
      case 'excited':
        return <Star className="h-5 w-5 text-purple-500" />;
      case 'stressed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Meh className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatJournalForDisplay = (data: JournalStructure) => {
    return (
      <div className="space-y-4">
        {data.gratitude && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-habit-primary" />
              What I'm grateful for:
            </h3>
            <p className="text-sm">{data.gratitude}</p>
          </div>
        )}
        
        {data.stressors && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              What made me upset or stressed:
            </h3>
            <p className="text-sm">{data.stressors}</p>
          </div>
        )}
        
        {data.achievements && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              What I achieved:
            </h3>
            <p className="text-sm">{data.achievements}</p>
          </div>
        )}
        
        {data.improvements && (
          <div className="space-y-1">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              What I can improve tomorrow:
            </h3>
            <p className="text-sm">{data.improvements}</p>
          </div>
        )}
        
        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm font-medium">Mood:</span>
          <MoodIcon mood={data.mood} />
          <span className="text-sm capitalize">{data.mood}</span>
        </div>
        
        {data.additionalNotes && (
          <div className="space-y-1 pt-2">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <PenLine className="h-4 w-4 text-habit-primary" />
              Additional notes:
            </h3>
            <p className="text-sm">{data.additionalNotes}</p>
          </div>
        )}
      </div>
    );
  };
  
  const formattedDate = format(date, 'EEEE, MMMM d, yyyy');
  
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="bg-gradient-to-r from-habit-primary/10 to-habit-tertiary/10">
        <CardTitle className="flex justify-between items-center">
          <span>{formattedDate}</span>
          {!isEditing && existingContent && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1"
            >
              <PenLine className="w-4 h-4" />
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-habit-primary" />
                What are you grateful for today?
              </label>
              <Textarea
                placeholder="List 3 things you're grateful for..."
                value={journalData.gratitude}
                onChange={(e) => handleInputChange('gratitude', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                What made you upset or stressed today?
              </label>
              <Textarea
                placeholder="What challenges did you face?"
                value={journalData.stressors}
                onChange={(e) => handleInputChange('stressors', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                What did you achieve today?
              </label>
              <Textarea
                placeholder="List your accomplishments, big or small..."
                value={journalData.achievements}
                onChange={(e) => handleInputChange('achievements', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-500" />
                What can you improve tomorrow?
              </label>
              <Textarea
                placeholder="How will you make tomorrow better?"
                value={journalData.improvements}
                onChange={(e) => handleInputChange('improvements', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Smile className="h-4 w-4 text-habit-primary" />
                Mood of the day
              </label>
              <Select
                value={journalData.mood}
                onValueChange={(value) => handleInputChange('mood', value as MoodType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy" className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Smile className="h-4 w-4 text-yellow-500" />
                      <span>Happy</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="neutral">
                    <div className="flex items-center gap-2">
                      <Meh className="h-4 w-4 text-gray-500" />
                      <span>Neutral</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sad">
                    <div className="flex items-center gap-2">
                      <Frown className="h-4 w-4 text-blue-500" />
                      <span>Sad</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="excited">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-purple-500" />
                      <span>Excited</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="stressed">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>Stressed</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <PenLine className="h-4 w-4 text-habit-primary" />
                Additional notes (optional)
              </label>
              <Textarea
                placeholder="Any other thoughts or reflections..."
                value={journalData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            {formatJournalForDisplay(parseExistingContent())}
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="justify-between border-t pt-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <Image className="w-4 h-4 mr-1" />
              Add Image
            </Button>
          </div>
          <Button onClick={handleSave} className="bg-habit-primary hover:bg-habit-primary/90">
            <Save className="w-4 h-4 mr-1" />
            Save Entry
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default JournalEntry;
