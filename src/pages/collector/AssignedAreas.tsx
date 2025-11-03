import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CollectorSidebar } from '@/components/CollectorSidebar';
import { LogOut, Volume2, Languages, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '@/components/MapView';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

const AssignedAreas = () => {
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
          // Default to a fallback location
          setCurrentLocation({ lat: -26.2041, lng: 28.0473 }); // Johannesburg
        }
      );
    }
  }, []);

  // Generate mock reports spread out over the map area
  const baseLat = currentLocation?.lat ?? -26.2041;
  const baseLng = currentLocation?.lng ?? 28.0473;
  const mockReports = [
    { id: 1, location: 'Main St & 5th Ave', lat: baseLat + 0.002, lng: baseLng + 0.002, type: 'Plastic', priority: 'High' },
    { id: 2, location: 'Central Park South', lat: baseLat - 0.003, lng: baseLng - 0.001, type: 'Mixed', priority: 'Medium' },
    { id: 3, location: 'River Road', lat: baseLat + 0.001, lng: baseLng - 0.002, type: 'Organic', priority: 'Low' },
    { id: 4, location: 'Market Square', lat: baseLat + 0.005, lng: baseLng + 0.004, type: 'Plastic', priority: 'Medium' },
    { id: 5, location: 'Industrial Park', lat: baseLat - 0.006, lng: baseLng + 0.003, type: 'Mixed', priority: 'High' },
    { id: 6, location: 'Green Valley', lat: baseLat + 0.004, lng: baseLng - 0.005, type: 'Organic', priority: 'Medium' },
    { id: 7, location: 'Sunset Blvd', lat: baseLat - 0.007, lng: baseLng - 0.004, type: 'Plastic', priority: 'Low' },
    { id: 8, location: 'Tech Hub', lat: baseLat + 0.008, lng: baseLng + 0.006, type: 'Mixed', priority: 'Low' },
    { id: 9, location: 'Riverbank', lat: baseLat - 0.009, lng: baseLng + 0.007, type: 'Organic', priority: 'High' },
  ];

  // Read user-created reports from localStorage
  let userReports: any[] = [];
  try {
    const stored = localStorage.getItem('reports');
    if (stored) {
      userReports = JSON.parse(stored);
    }
  } catch (e) {
    userReports = [];
  }

  // Merge mockReports and userReports
  const allReports = [...mockReports, ...userReports];

  // Assign different icons for each report type
  const typeIcons = {
    Plastic: '🧴', // bottle
    Mixed: '♻️',   // recycle
    Organic: '🌱', // leaf
    Default: '📦', // box
  };

  const mapMarkers = [
    ...(currentLocation ? [{
      lat: currentLocation.lat,
      lng: currentLocation.lng,
      popup: `<div><h3 style=\"font-weight: bold; color: #10b981;\">Your Location</h3></div>`,
      isCurrentLocation: true,
    }] : []),
    ...allReports.map(report => ({
      lat: report.lat,
      lng: report.lng,
      popup: `<div><h3 style=\"font-weight: bold;\">${report.location}</h3><p>Type: ${report.type}</p><p>Priority: ${report.priority}</p></div>`,
      isCurrentLocation: false,
      type: report.type,
    }))
  ];

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
                  <MapPin className="w-8 h-8 text-primary" />
                  Assigned Areas
                </h2>
                <p className="text-muted-foreground mt-2">View your collection routes and assigned zones</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Collection Map</CardTitle>
                  <CardDescription>View your assigned collection zones and routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] rounded-lg overflow-hidden border relative z-0 mx-auto max-w-[1200px]">
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
                  <CardTitle>Active Collection Tasks</CardTitle>
                  <CardDescription>Reports assigned to you for collection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {allReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-shadow">
                        <div className="flex-1">
                          <h3 className="font-semibold">{report.location}</h3>
                          <p className="text-sm text-muted-foreground">Type: {report.type}</p>
                          {!mockReports.find(mock => mock.id === report.id) && (
                            <Badge variant="outline" className="mt-1">User Reported</Badge>
                          )}
                        </div>
                        <Badge variant={report.priority === 'High' ? 'destructive' : report.priority === 'Medium' ? 'default' : 'secondary'}>
                          {report.priority}
                        </Badge>
                        <Button
                          size="sm"
                          className="ml-4"
                          onClick={() => {
                            const destination = `${report.lat},${report.lng}`;
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
                          }}
                        >
                          Navigate
                        </Button>
                      </div>
                    ))}
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

export default AssignedAreas;
