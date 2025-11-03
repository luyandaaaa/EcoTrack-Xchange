import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface AssignCollectorDialogProps {
  reportId: number;
  reportLocation: string;
}

export function AssignCollectorDialog({ reportId, reportLocation }: AssignCollectorDialogProps) {
  const [selectedCollector, setSelectedCollector] = useState('');
  const [open, setOpen] = useState(false);

  const mockCollectors = [
    { id: 1, name: 'James Anderson', area: 'District A', status: 'Available' },
    { id: 2, name: 'Lisa Martinez', area: 'District B', status: 'Available' },
    { id: 3, name: 'Robert Taylor', area: 'District C', status: 'Busy' },
  ];

  const handleAssign = () => {
    if (!selectedCollector) {
      toast.error('Please select a collector');
      return;
    }
    toast.success(`Report assigned to ${selectedCollector} successfully!`);
    setOpen(false);
    setSelectedCollector('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Assign Collector
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Collector</DialogTitle>
          <DialogDescription>
            Assign a collector to handle the waste report at {reportLocation}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="collector">Select Collector</Label>
            <Select value={selectedCollector} onValueChange={setSelectedCollector}>
              <SelectTrigger id="collector">
                <SelectValue placeholder="Choose a collector" />
              </SelectTrigger>
              <SelectContent>
                {mockCollectors.map((collector) => (
                  <SelectItem key={collector.id} value={collector.name} disabled={collector.status === 'Busy'}>
                    {collector.name} - {collector.area} ({collector.status})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAssign} className="w-full">
            Confirm Assignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
