
import React from 'react';
import { HabitType, FrequencyType } from '@/types/habit';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHabits } from '@/context/HabitContext';

interface HabitFormProps {
  open: boolean;
  onClose: () => void;
  editingHabit: HabitType | null;
}

const HabitForm: React.FC<HabitFormProps> = ({ open, onClose, editingHabit }) => {
  const { addHabit, editHabit } = useHabits();
  
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [frequency, setFrequency] = React.useState<FrequencyType>('daily');
  
  React.useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description || '');
      setFrequency(editingHabit.frequency);
    } else {
      setName('');
      setDescription('');
      setFrequency('daily');
    }
  }, [editingHabit]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    if (editingHabit) {
      editHabit(editingHabit.id, {
        name,
        description: description || undefined,
        frequency,
      });
    } else {
      addHabit(name, description, frequency);
    }
    
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Drink water"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Drink 8 glasses of water daily"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(value) => setFrequency(value as FrequencyType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingHabit ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;
