import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CollectorSidebar } from '@/components/CollectorSidebar';
import { LogOut, Camera, Volume2, Languages, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const LogCollection = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'log' | 'recent'>('recent');
  const [formData, setFormData] = useState({
    taskId: '',
    wasteType: '',
    weight: '',
    photo: '',
  });
  const [userCollections, setUserCollections] = useState<any[]>([]);
  const [viewedCollection, setViewedCollection] = useState<any | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const mockPreviousCollections = [
    { id: 1, date: '2024-01-15', location: 'Main St', type: 'Plastic', weight: 25.5 },
    { id: 2, date: '2024-01-14', location: 'Park Ave', type: 'Organic', weight: 18.2 },
    { id: 3, date: '2024-01-13', location: '5th Ave', type: 'Mixed', weight: 32.1 },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('userCollections');
    if (stored) {
      setUserCollections(JSON.parse(stored));
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Find task info
    const task = mockPreviousCollections.find(t => String(t.id) === formData.taskId);
    const newCollection = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      location: task ? task.location : 'Unknown',
      type: formData.wasteType,
      weight: formData.weight,
      photo: formData.photo,
    };
    const updated = [newCollection, ...userCollections];
    setUserCollections(updated);
    localStorage.setItem('userCollections', JSON.stringify(updated));
    toast.success('Collection logged successfully!');
    setFormData({ taskId: '', wasteType: '', weight: '', photo: '' });
    setActiveView('recent');
  };

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary via-accent to-secondary shadow-lg">
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger className="text-primary-foreground" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-primary-foreground">Welcome, {user?.name}!</h1>
            </div>
            <Button variant="secondary" size="sm" className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button variant="secondary" size="sm" className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
              <Languages className="w-4 h-4 mr-2" />
              EN
            </Button>
            <Button variant="secondary" size="sm" onClick={handleLogout} className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="flex flex-1 w-full">
          <CollectorSidebar />
          
          <main className="flex-1 p-6 pt-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="mb-6 bg-gradient-to-r from-accent/10 via-primary/5 to-transparent border border-accent/30 rounded-xl p-4 shadow-sm">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                  <CheckCircle className="w-8 h-8 text-primary" />
                  Log Collection
                </h2>
                <p className="text-muted-foreground mt-2">Record waste collection details</p>
              </div>

              <div className="flex gap-4 mb-6">
                <Button
                  size="lg"
                  variant={activeView === 'log' ? 'default' : 'outline'}
                  className="flex-1 text-lg font-semibold"
                  onClick={() => setActiveView('log')}
                >
                  New Collection
                </Button>
                <Button
                  size="lg"
                  variant={activeView === 'recent' ? 'default' : 'outline'}
                  className="flex-1 text-lg font-semibold"
                  onClick={() => setActiveView('recent')}
                >
                  View Recent Collections
                </Button>
              </div>
              
              {activeView === 'log' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Record Waste Collection</CardTitle>
                    <CardDescription>Log the details of collected waste</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="task">Select Task</Label>
                          <Select value={formData.taskId} onValueChange={(value) => setFormData({ ...formData, taskId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose active task" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockPreviousCollections.map((task) => (
                                <SelectItem key={task.id} value={String(task.id)}>
                                  {task.location} ({task.type})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="wasteType">Waste Type</Label>
                          <Select value={formData.wasteType} onValueChange={(value) => setFormData({ ...formData, wasteType: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select waste type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="plastic">Plastic</SelectItem>
                              <SelectItem value="organic">Organic</SelectItem>
                              <SelectItem value="glass">Glass</SelectItem>
                              <SelectItem value="metal">Metal</SelectItem>
                              <SelectItem value="electronic">Electronic</SelectItem>
                              <SelectItem value="mixed">Mixed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            placeholder="Enter weight in kilograms"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            required
                          />
                        </div>


                        <div>
                          <Label>Upload Photo</Label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="mb-2"
                          />
                          {formData.photo && (
                            <img src={formData.photo} alt="Preview" className="max-h-32 rounded-lg border mx-auto" />
                          )}
                        </div>

                        <Button type="submit" className="w-full">Log Collection</Button>
                      </form>
                  </CardContent>
                </Card>
              )}
              {activeView === 'recent' && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Previous Collections</CardTitle>
                      <CardDescription>Your recent collection history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[...userCollections, ...mockPreviousCollections].map((collection) => (
                          <div key={collection.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-card to-card/50">
                            <div className="flex items-center gap-4">
                              {collection.photo && (
                                <img src={collection.photo} alt="Collection" className="h-16 w-16 object-cover rounded border" />
                              )}
                              <div>
                                <p className="font-semibold">{collection.location}</p>
                                <p className="text-sm text-muted-foreground">{collection.date}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="text-right">
                                <p className="font-semibold">{collection.weight} kg</p>
                                <p className="text-sm text-muted-foreground">{collection.type}</p>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => setViewedCollection(collection)}>
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Dialog open={!!viewedCollection} onOpenChange={open => !open && setViewedCollection(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Collection Details</DialogTitle>
                        <DialogDescription>
                          {viewedCollection ? `Details for collection at ${viewedCollection.location}` : ''}
                        </DialogDescription>
                      </DialogHeader>
                      {viewedCollection && (
                        <div className="space-y-4 mt-2">
                          {viewedCollection.photo ? (
                            <img src={viewedCollection.photo} alt="Collection" className="max-h-64 rounded border mx-auto" />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                              <Camera className="w-10 h-10 mb-2" />
                              <span>No photo available</span>
                            </div>
                          )}
                          <div>
                            <div><span className="font-semibold">Location:</span> {viewedCollection.location}</div>
                            <div><span className="font-semibold">Date:</span> {viewedCollection.date}</div>
                            <div><span className="font-semibold">Type:</span> {viewedCollection.type}</div>
                            <div><span className="font-semibold">Weight:</span> {viewedCollection.weight} kg</div>
                          </div>
                        </div>
                      )}
                      <DialogClose asChild>
                        <Button className="mt-4 w-full" variant="default">Close</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LogCollection;
