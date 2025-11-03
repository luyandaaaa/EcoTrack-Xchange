import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LogOut, Filter, Volume2, Languages, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '@/components/MapView';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AssignCollectorDialog } from '@/components/AssignCollectorDialog';

const WasteMap = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setCurrentLocation({ lat: -26.2041, lng: 28.0473 });
        }
      );
    }
  }, []);


  // Aggregate all reported waste from localStorage
  const [allWasteReports, setAllWasteReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [reportToAssign, setReportToAssign] = useState<any | null>(null);
  const [collectors, setCollectors] = useState<any[]>([]);

  // Load collectors from localStorage
  useEffect(() => {
    try {
      const storedCollectors = localStorage.getItem('collectors');
      if (storedCollectors) {
        setCollectors(JSON.parse(storedCollectors));
      } else {
        // Mock collectors for demo
        const mockCollectors = [
          { id: '1', name: 'David Phiri', area: 'Sandton', rating: 4.8, status: 'Available' },
          { id: '2', name: 'Sarah Ndlovu', area: 'Rosebank', rating: 4.9, status: 'Available' },
          { id: '3', name: 'Michael van der Merwe', area: 'Braamfontein', rating: 4.7, status: 'Available' },
          { id: '4', name: 'Thabo Moloi', area: 'Newtown', rating: 4.6, status: 'Available' },
        ];
        localStorage.setItem('collectors', JSON.stringify(mockCollectors));
        setCollectors(mockCollectors);
      }
    } catch (error) {
      console.error('Error loading collectors:', error);
    }
  }, []);

  // Function to handle collector assignment
  const handleAssignCollector = (report: any, collector: any) => {
    // Ensure report has a unique id
    const reportId = report.id || `${report.location.replace(/\s+/g, '_')}_${report.date || Date.now()}`;
    // Update the report with collector assignment
    const updatedReport = {
      ...report,
      id: reportId,
      status: 'Assigned',
      assignedCollector: collector,
      assignedAt: new Date().toISOString()
    };

    // Update in localStorage
    const key = `reportedWaste_${report.location.replace(/\s+/g, '_')}`;
    const existingReports = JSON.parse(localStorage.getItem(key) || '[]');
    const updatedReports = existingReports.map((r: any) =>
      (r.id || `${r.location.replace(/\s+/g, '_')}_${r.date || Date.now()}`) === reportId ? updatedReport : r
    );
    localStorage.setItem(key, JSON.stringify(updatedReports));

    // Store only minimal data for collector's task list (include image)
    const minimalTask = {
      id: updatedReport.id,
      location: updatedReport.location,
      lat: updatedReport.lat,
      lng: updatedReport.lng,
      type: updatedReport.type,
      status: updatedReport.status,
      assignedAt: updatedReport.assignedAt,
      description: updatedReport.description || '',
      reporterName: updatedReport.reporterName || updatedReport.reporter || 'Unknown',
      image: updatedReport.image || '',
    };
    const collectorTasksKey = `collector_tasks_${collector.id}`;
    let collectorTasks = [];
    try {
      collectorTasks = JSON.parse(localStorage.getItem(collectorTasksKey) || '[]');
    } catch {}
    // Prevent duplicates
    if (!collectorTasks.some((t: any) => t.id === minimalTask.id)) {
      collectorTasks.push(minimalTask);
      // Limit to last 100 tasks (optional, to avoid quota)
      if (collectorTasks.length > 100) collectorTasks = collectorTasks.slice(-100);
      localStorage.setItem(collectorTasksKey, JSON.stringify(collectorTasks));
    }

    // Update state so pending reports disappear immediately
    setAllWasteReports(current =>
      current.map(r => {
        const rid = r.id || `${r.location.replace(/\s+/g, '_')}_${r.date || Date.now()}`;
        return rid === reportId ? updatedReport : r;
      })
    );
    setReportToAssign(null);
  };

  useEffect(() => {
    // Get all keys from localStorage that start with 'reportedWaste_'
    const reports: any[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('reportedWaste_')) {
        try {
          const arr = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(arr)) {
            arr.forEach(r => reports.push({ ...r }));
          }
        } catch {}
      }
    }
    setAllWasteReports(reports);
  }, []);

  // If no real reports, use mock data for demo
  const mockMapReports = [
    { location: 'Sandton City Mall', lat: -26.1072, lng: 28.0470, type: 'Plastic', status: 'Pending', reporterName: 'John D.', description: 'Large pile of plastic waste near the mall entrance' },
    { location: 'Rosebank Station', lat: -26.1453, lng: 28.0395, type: 'Mixed', status: 'Assigned', reporterName: 'Sarah M.', description: 'Mixed waste around the station area' },
    { location: 'Melrose Arch', lat: -26.1316, lng: 28.0668, type: 'Organic', status: 'Completed', reporterName: 'Mike R.', description: 'Restaurant waste properly collected' },
    { location: 'Newtown Junction', lat: -26.2022, lng: 28.0320, type: 'Glass', status: 'Pending', reporterName: 'Lebo P.', description: 'Broken glass waste near marketplace' },
    { location: 'Braamfontein', lat: -26.1925, lng: 28.0373, type: 'Metal', status: 'Assigned', reporterName: 'Zanele P.', description: 'Construction debris and metal waste' },
    { location: 'Constitution Hill', lat: -26.1882, lng: 28.0416, type: 'Plastic', status: 'Pending', reporterName: 'Thabo M.', description: 'Plastic litter in tourist area' },
    { location: 'Orlando Stadium', lat: -26.2328, lng: 27.9322, type: 'Mixed', status: 'Pending', reporterName: 'Blessing N.', description: 'Post-event waste accumulation' },
    { location: 'Gold Reef City', lat: -26.2342, lng: 28.0169, type: 'Mixed', status: 'Completed', reporterName: 'Emma K.', description: 'Theme park area cleaned' },
    { location: 'Maboneng Precinct', lat: -26.2127, lng: 28.0500, type: 'Glass', status: 'Assigned', reporterName: 'David L.', description: 'Bar and restaurant waste' },
    { location: 'Park Station', lat: -26.1967, lng: 28.0407, type: 'Mixed', status: 'Pending', reporterName: 'Grace M.', description: 'Commuter waste around station' }
  ];

  const reportsForMap = allWasteReports.length > 0 ? allWasteReports : mockMapReports;
  const mapMarkers = reportsForMap.filter(r => r.location && r.lat && r.lng).map(report => ({
    lat: report.lat,
    lng: report.lng,
    popup: `
      <div style="min-width: 200px;">
        <h3 style="font-weight: bold; margin-bottom: 8px;">${report.location}</h3>
        <p style="margin: 4px 0;"><strong>Type:</strong> ${report.type}</p>
        <p style="margin: 4px 0;"><strong>Status:</strong> ${report.status}</p>
        <p style="margin: 4px 0;"><strong>Reporter:</strong> ${report.reporterName || 'Unknown'}</p>
        ${report.description ? `<p style="margin: 4px 0;"><strong>Description:</strong> ${report.description}</p>` : ''}
      </div>
    `
  }));

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
            <Button variant="secondary" size="sm" className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
              <Filter className="w-4 h-4 mr-2" />
              Filters
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
                  <MapPin className="w-8 h-8 text-primary" />
                  Waste Map
                </h2>
                <p className="text-muted-foreground mt-2">Track and manage waste reports across the city</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Live Waste Reports</CardTitle>
                  <CardDescription>View and manage all incoming waste reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative rounded-lg overflow-hidden border z-0" style={{ height: 350, minHeight: 250, maxHeight: 400 }}>
                    {currentLocation ? (
                      <MapView markers={mapMarkers} center={[currentLocation.lat, currentLocation.lng]} />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <p className="text-muted-foreground">Loading map...</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Reports</CardTitle>
                  <CardDescription>Reports awaiting collector assignment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allWasteReports.filter(r => r.status === 'Pending').map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-shadow">
                        <div className="flex-1">
                          <h3 className="font-semibold">{report.location}</h3>
                          <p className="text-sm text-muted-foreground">Type: {report.type} • Reporter: {report.reporterName || report.reporter || 'Unknown'}</p>
                        </div>
                        <Badge variant="secondary">{report.status}</Badge>
                        <Button size="sm" className="ml-4" onClick={() => setSelectedReport(report)}>View</Button>
                        <Button size="sm" className="ml-2" onClick={() => setReportToAssign(report)}>Assign Collector</Button>
                      </div>
                    ))}
                  </div>

                  {/* Assign Collector Dialog */}
                  <Dialog open={!!reportToAssign} onOpenChange={() => setReportToAssign(null)}>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Assign Collector</DialogTitle>
                        <DialogDescription>
                          Select a collector to assign to the waste report at {reportToAssign?.location}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        {collectors.map((collector) => (
                          <div
                            key={collector.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 cursor-pointer"
                            onClick={() => handleAssignCollector(reportToAssign, collector)}
                          >
                            <div>
                              <h4 className="font-semibold">{collector.name}</h4>
                              <p className="text-sm text-muted-foreground">Area: {collector.area} • Rating: {collector.rating}⭐</p>
                            </div>
                            <Badge variant={collector.status === 'Available' ? 'default' : 'secondary'}>
                              {collector.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Report Details Dialog (shadcn/ui) */}
                  <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
                    <DialogContent className="max-w-lg">
                      {selectedReport && (
                        <>
                          <DialogHeader>
                            <DialogTitle>Waste Report Details</DialogTitle>
                            <DialogDescription>Submitted waste report information</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <img
                              src={selectedReport.image}
                              alt={`Report at ${selectedReport.location}`}
                              className="w-full max-h-60 object-cover rounded"
                              onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&auto=format'; }}
                            />
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{selectedReport.location}</h3>
                              <p className="text-sm text-muted-foreground mb-2">Reported on: {selectedReport.date}</p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                <Badge variant="outline">Type: {selectedReport.type}</Badge>
                                <Badge variant={selectedReport.urgency === 'High' ? 'destructive' : selectedReport.urgency === 'Medium' ? 'default' : 'secondary'}>
                                  Urgency: {selectedReport.urgency}
                                </Badge>
                                <Badge variant={selectedReport.status === 'Completed' ? 'default' : selectedReport.status === 'Assigned' ? 'secondary' : 'outline'}>
                                  {selectedReport.status}
                                </Badge>
                              </div>
                              <div className="mb-2"><span className="font-semibold">Reporter:</span> {selectedReport.reporterName || selectedReport.reporter || 'Unknown'}</div>
                              {selectedReport.description && (
                                <div className="mt-2">
                                  <p className="font-semibold">Description:</p>
                                  <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
                                </div>
                              )}
                              {selectedReport.assignedCollector && (
                                <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                                  <p className="font-semibold mb-1">Assigned Collector:</p>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">{selectedReport.assignedCollector.name}</p>
                                      <p className="text-sm text-muted-foreground">Area: {selectedReport.assignedCollector.area}</p>
                                    </div>
                                    <Badge>Rating: {selectedReport.assignedCollector.rating}⭐</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Assigned on: {new Date(selectedReport.assignedAt).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default WasteMap;
