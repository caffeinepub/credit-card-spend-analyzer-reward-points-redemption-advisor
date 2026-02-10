import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

interface DateRangePickerProps {
  value: { from: Date; to: Date };
  onChange: (range: { from: Date; to: Date }) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { label: 'Last 3 months', months: 3 },
    { label: 'Last 6 months', months: 6 },
    { label: 'Last 12 months', months: 12 },
    { label: 'Year to date', ytd: true },
  ];

  const handlePreset = (preset: { months?: number; ytd?: boolean }) => {
    const to = new Date();
    let from: Date;

    if (preset.ytd) {
      from = new Date(to.getFullYear(), 0, 1);
    } else {
      from = new Date(to.getFullYear(), to.getMonth() - (preset.months || 3), 1);
    }

    onChange({ from, to });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          {value.from.toLocaleDateString()} - {value.to.toLocaleDateString()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Quick Select</div>
            <div className="grid gap-2">
              {presets.map((preset) => (
                <Button key={preset.label} variant="outline" size="sm" onClick={() => handlePreset(preset)}>
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
