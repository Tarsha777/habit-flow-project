
import React from 'react';
import { useHabits } from '@/context/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SmartReminders: React.FC = () => {
  const { getSmartReminders } = useHabits();
  const reminders = getSmartReminders();
  
  if (reminders.length === 0) return null;
  
  return (
    <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-amber-500" />
          Smart Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {reminders.map((reminder, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="bg-amber-200 dark:bg-amber-800 rounded-full p-1 mt-0.5">
                <Bell className="h-3 w-3 text-amber-700 dark:text-amber-300" />
              </div>
              <span className="text-sm">{reminder}</span>
            </li>
          ))}
        </ul>
        
        <div className="flex justify-end mt-3">
          <Button variant="ghost" size="sm" className="text-xs">
            Dismiss All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartReminders;
