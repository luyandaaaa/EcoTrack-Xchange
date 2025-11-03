import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LogOut, UserPlus, MapPin, Volume2, Languages, Eye, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Collectors = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedCollector, setSelectedCollector] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);


  // Load collectors from localStorage (fallback to mock if none)
  const [collectors, setCollectors] = useState<any[]>([]);
  const [assignedCollectors, setAssignedCollectors] = useState<any[]>([]);

  useEffect(() => {
    let loadedCollectors = [];
    try {
      const stored = localStorage.getItem('collectors');
      if (stored) {
        loadedCollectors = JSON.parse(stored);
      } else {
        loadedCollectors = [
          { id: '1', name: 'David Phiri', area: 'Sandton', rating: 4.8, status: 'active' },
          { id: '2', name: 'Sarah Ndlovu', area: 'Rosebank', rating: 4.9, status: 'active' },
          { id: '3', name: 'Michael van der Merwe', area: 'Braamfontein', rating: 4.7, status: 'active' },
          { id: '4', name: 'Thabo Moloi', area: 'Newtown', rating: 4.6, status: 'offline' },
        ];
        localStorage.setItem('collectors', JSON.stringify(loadedCollectors));
      }
    } catch {
      loadedCollectors = [];
    }
    // Ensure at least 3 are active
    loadedCollectors = loadedCollectors.map((c, i) => i < 3 ? { ...c, status: 'active' } : c);
    setCollectors(loadedCollectors);

    // Find assigned collectors (those with at least one assigned task)
    const assigned: any[] = [];
    loadedCollectors.forEach((collector: any) => {
      const tasks = JSON.parse(localStorage.getItem(`collector_tasks_${collector.id}`) || '[]');
      if (tasks.length > 0) {
        assigned.push({ ...collector, assignedTasks: tasks });
      }
    });
    setAssignedCollectors(assigned);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
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
            <Button className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Collector
            </Button>
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
          <AdminSidebar />
          
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="mb-4 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/30 rounded-xl p-4 shadow-sm">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                  <Users className="w-8 h-8 text-primary" />
                  Collectors
                </h2>
                <p className="text-muted-foreground mt-2">Manage collector accounts and assignments</p>
              </div>
              

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Collectors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{collectors.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-accent/10 to-secondary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">{collectors.filter(c => c.status === 'active').length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Available</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{collectors.filter(c => c.status === 'active').length}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Assigned Collectors Section */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Assigned Collectors</CardTitle>
                  <CardDescription>Collectors with assigned waste reports</CardDescription>
                </CardHeader>
                <CardContent>
                  {assignedCollectors.length === 0 ? (
                    <div className="text-muted-foreground">No collectors have been assigned reports yet.</div>
                  ) : (
                    <div className="space-y-4">
                      {assignedCollectors.map((collector) => (
                        <div key={collector.id} className="border rounded-lg p-4 bg-gradient-to-r from-card to-card/50">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{collector.name}</h4>
                              <p className="text-sm text-muted-foreground">Area: {collector.area || '-'} • Rating: {collector.rating}⭐</p>
                            </div>
                            <Badge variant="secondary">Assigned</Badge>
                          </div>
                          <div className="ml-2">
                            <p className="font-semibold text-xs mb-1">Assigned Reports:</p>
                            <ul className="list-disc pl-5">
                              {collector.assignedTasks.map((task: any) => (
                                <li key={task.id} className="text-sm flex items-center gap-2">
                                  <span>{task.location} <span className="text-muted-foreground">({task.type})</span></span>
                                  <Button size="sm" variant="outline" onClick={() => setSelectedTask({ ...task, collector })}>View</Button>
                                </li>
                              ))}
                            </ul>
                          </div>
      {/* Assigned Report Details Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-lg">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> Assigned Report Details
                  </span>
                </DialogTitle>
                <DialogDescription>
                  Report assigned to <span className="font-semibold">{selectedTask.collector.name}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border bg-card p-4 shadow-sm space-y-3 mt-2">
                {selectedTask.image && (
                  <img
                    src={selectedTask.image}
                    alt={`Report at ${selectedTask.location}`}
                    className="w-full max-h-60 object-cover rounded mb-2 border"
                    onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&auto=format'; }}
                  />
                )}
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">Type: {selectedTask.type}</Badge>
                  <Badge variant="secondary">Status: {selectedTask.status}</Badge>
                </div>
                <div className="font-semibold text-lg">{selectedTask.location}</div>
                {selectedTask.description && (
                  <div className="text-muted-foreground text-sm">{selectedTask.description}</div>
                )}
                <div className="text-sm"><span className="font-semibold">Reporter:</span> {selectedTask.reporterName}</div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold">Assigned On:</span> {selectedTask.assignedAt ? new Date(selectedTask.assignedAt).toLocaleString() : '-'}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collector List</CardTitle>
                  <CardDescription>Manage collector accounts and assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {collectors.map((collector) => (
                      <div key={collector.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-shadow">
                        <div className="flex-1">
                          <h3 className="font-semibold">{collector.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Area: {collector.area || '-'} • Rating: {collector.rating}/5.0
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            collector.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'
                          }`}>
                            {collector.status}
                          </span>
                          <Button size="sm" variant="outline" onClick={() => setSelectedCollector(collector)}>View Details</Button>
                        </div>
                      </div>
                    ))}
      {/* Collector Details Dialog */}
      <Dialog open={!!selectedCollector} onOpenChange={() => setSelectedCollector(null)}>
        <DialogContent className="max-w-lg">
          {selectedCollector && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <span className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" /> Collector Details
                  </span>
                </DialogTitle>
                <DialogDescription>
                  Details for <span className="font-semibold">{selectedCollector.name}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border bg-card p-4 shadow-sm space-y-3 mt-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">Area: {selectedCollector.area || '-'}</Badge>
                  <Badge variant="secondary">Status: {selectedCollector.status}</Badge>
                  <Badge variant="outline">Rating: {selectedCollector.rating}/5.0</Badge>
                </div>
                {/* Assigned reports for this collector */}
                {(() => {
                  const tasks = JSON.parse(localStorage.getItem(`collector_tasks_${selectedCollector.id}`) || '[]');
                  if (tasks.length > 0) {
                    return (
                      <div className="mt-2">
                        <p className="font-semibold text-xs mb-2">Assigned Reports:</p>
                        <div className="grid grid-cols-1 gap-3">
                          {tasks.map((task: any) => (
                            <div key={task.id} className="rounded border bg-muted/30 p-3 flex gap-3 items-center">
                              {task.image && (
                                <img
                                  src={task.image}
                                  alt={`Report at ${task.location}`}
                                  className="w-20 h-16 object-cover rounded border"
                                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=200&h=120&fit=crop&auto=format'; }}
                                />
                              )}
                              <div className="flex-1">
                                <div className="font-semibold">{task.location}</div>
                                <div className="flex flex-wrap gap-1 mb-1">
                                  <Badge variant="outline">{task.type}</Badge>
                                  <Badge variant="secondary">{task.status}</Badge>
                                </div>
                                {task.description && <div className="text-xs text-muted-foreground line-clamp-2">{task.description}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return <div className="text-muted-foreground text-xs">No assigned reports.</div>;
                })()}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Collectors;
