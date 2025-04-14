
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine, Save, Image, Smile } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface JournalEntryProps {
  date: Date;
  existingContent?: string;
  onSave?: (content: string) => void;
}

const JournalEntry: React.FC<JournalEntryProps> = ({
  date,
  existingContent = '',
  onSave,
}) => {
  const [content, setContent] = useState(existingContent);
  const [isEditing, setIsEditing] = useState(!existingContent);
  
  const handleSave = () => {
    if (!content.trim()) {
      toast({
        title: "Cannot save empty entry",
        description: "Please write something in your journal entry",
        variant: "destructive",
      });
      return;
    }
    
    if (onSave) {
      onSave(content);
    }
    
    setIsEditing(false);
    toast({
      title: "Journal entry saved",
      description: "Your thoughts have been saved successfully",
    });
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
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts, reflections, and experiences..."
            className="min-h-[200px] text-base"
          />
        ) : (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {content}
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
            <Button variant="outline" size="sm" disabled>
              <Smile className="w-4 h-4 mr-1" />
              Mood
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
