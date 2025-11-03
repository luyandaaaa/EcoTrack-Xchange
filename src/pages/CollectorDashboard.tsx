import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CollectorSidebar } from '@/components/CollectorSidebar';
import { LogOut, Truck, Weight, Package, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CollectorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock data
  const mockPendingTasks = 5;
  const mockCompleted = 12;
  const mockWeightCollected = 345;
  const mockListedItems = 8;

  const assignedTasks = [
    { id: 1, location: 'Oak Avenue Area', bins: 8, priority: 'High', time: '9:00 AM' },
    { id: 2, location: 'Downtown District', bins: 15, priority: 'Medium', time: '11:30 AM' },
    { id: 3, location: 'Riverside Park', bins: 6, priority: 'Low', time: '2:00 PM' },
  ];

  const recentCollections = [
    { id: 1, location: 'Park Street', weight: 45, type: 'Mixed', time: '8:30 AM' },
    { id: 2, location: 'Main Square', weight: 62, type: 'Recyclable', time: 'Yesterday' },
    { id: 3, location: 'Industrial Zone', weight: 128, type: 'Mixed', time: '2 days ago' },
  ];

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Top Navigation Bar - Full Width */}
        <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-accent via-primary to-accent shadow-lg">
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger className="text-accent-foreground" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-accent-foreground">Welcome, {user?.name}!</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm bg-background/20 backdrop-blur-sm px-4 py-2 rounded-full border border-accent-foreground/20">
                <span className="text-accent-foreground/80">Collector: </span>
                <span className="font-semibold text-accent-foreground">{user?.name}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout} className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-accent-foreground border border-accent-foreground/20">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area with Sidebar */}
        <div className="flex flex-1 w-full">
          <CollectorSidebar />
          
          {/* Main Content */}
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-accent/5 to-primary/10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="mb-4 bg-gradient-to-r from-accent/10 via-primary/5 to-transparent border border-accent/30 rounded-xl p-4 shadow-sm">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent flex items-center gap-2">
                  <Truck className="w-8 h-8 text-accent" />
                  Overview
                </h2>
                <p className="text-muted-foreground mt-2">Your collector dashboard</p>
              </div>
              
              {/* Overview Section */}
              <div className="mb-4 bg-gradient-to-r from-accent/10 via-primary/5 to-transparent border border-accent/30 rounded-xl p-4 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">Today's Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-primary/30 bg-gradient-to-br from-card via-primary/10 to-primary/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Pending Tasks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-transparent">{mockPendingTasks}</div>
                      <p className="text-xs text-muted-foreground">Assigned collections</p>
                    </CardContent>
                  </Card>

                  <Card className="border-accent/30 bg-gradient-to-br from-card via-accent/10 to-accent/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4 text-accent" />
                        Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-br from-accent to-accent-glow bg-clip-text text-transparent">{mockCompleted}</div>
                      <p className="text-xs text-muted-foreground">Collections today</p>
                    </CardContent>
                  </Card>

                  <Card className="border-secondary/30 bg-gradient-to-br from-card via-secondary/10 to-secondary/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Weight className="w-4 h-4 text-secondary" />
                        Weight Collected
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-secondary">{mockWeightCollected} kg</div>
                      <p className="text-xs text-muted-foreground">Total this week</p>
                    </CardContent>
                  </Card>

                  <Card className="border-accent/30 bg-gradient-to-br from-card via-accent/10 to-primary/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Package className="w-4 h-4 text-accent" />
                        Listed Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{mockListedItems}</div>
                      <p className="text-xs text-muted-foreground">Active listings</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Assigned Tasks */}
              <Card className="border-border/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Assigned Collection Tasks</CardTitle>
                  <CardDescription>Your scheduled waste collection routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {assignedTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/20 hover:border-primary/40 transition-all">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{task.location}</p>
                          <p className="text-sm text-muted-foreground">{task.bins} bins • Priority: <span className={task.priority === 'High' ? 'text-primary font-semibold' : task.priority === 'Medium' ? 'text-accent font-semibold' : ''}>{task.priority}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{task.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Collections */}
              <Card className="border-border/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recent Collections</CardTitle>
                  <CardDescription>Your latest waste collection activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentCollections.map((collection) => (
                      <div key={collection.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-accent/10 via-primary/5 to-transparent border border-accent/20 hover:border-accent/40 transition-all">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{collection.location}</p>
                          <p className="text-sm text-muted-foreground">Type: {collection.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{collection.weight} kg</p>
                          <p className="text-xs text-muted-foreground">{collection.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="shadow-xl border-accent/20">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-gradient-to-r from-accent to-accent-glow hover:shadow-lg transition-all">Log New Collection</Button>
                    <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all">View Map</Button>
                    <Button className="bg-gradient-to-r from-secondary to-secondary/80 hover:shadow-lg transition-all">List Recyclables</Button>
                    <Button variant="outline" className="border-accent/40 hover:bg-accent/10">View Performance Stats</Button>
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

export default CollectorDashboard;
