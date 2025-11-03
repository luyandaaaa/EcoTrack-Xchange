import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LogOut, Download, Volume2, Languages, TrendingUp, Users, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// TypeScript module augmentation for leaflet.heat
declare module 'leaflet' {
  export function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: {
      minOpacity?: number;
      maxZoom?: number;
      max?: number;
      radius?: number;
      blur?: number;
      gradient?: { [key: number]: string };
    }
  ): Layer;
}

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);


  const mockStats = {
    totalReports: 245,
    activeUsers: 1890,
    recycledWeight: 5420,
    growthRate: 23.5
  };

  // Mock data for trend chart (last 12 months)
  const trendLabels = [
    'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'
  ];
  const trendData = [12, 18, 25, 30, 22, 28, 35, 40, 38, 44, 50, 60];
  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Waste Reports',
        data: trendData,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#22c55e',
      },
    ],
  };
  const trendChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#eee' } },
      x: { grid: { color: '#f3f3f3' } },
    },
  };

  // Mock data for heatmap (area hotspots)
  const areaHotspots = [
    { area: 'Sandton', count: 32 },
    { area: 'Rosebank', count: 27 },
    { area: 'Braamfontein', count: 21 },
    { area: 'Newtown', count: 18 },
    { area: 'Maboneng', count: 14 },
    { area: 'Soweto', count: 10 },
  ];
  const maxHotspot = Math.max(...areaHotspots.map(a => a.count));

  // Mock data for the heatmap points
  const heatmapPoints = [
    { lat: -26.1052, lng: 28.0567, intensity: 0.8, area: 'Sandton' },
    { lat: -26.1467, lng: 28.0436, intensity: 0.7, area: 'Rosebank' },
    { lat: -26.1925, lng: 28.0370, intensity: 0.6, area: 'Braamfontein' },
    { lat: -26.2022, lng: 28.0317, intensity: 0.5, area: 'Newtown' },
    { lat: -26.2044, lng: 28.0456, intensity: 0.4, area: 'Maboneng' },
    { lat: -26.2227, lng: 27.8900, intensity: 0.3, area: 'Soweto' },
  ];

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapRef.current).setView([-26.2041, 28.0473], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Add markers with popups for each point
      heatmapPoints.forEach(point => {
        const marker = L.marker([point.lat, point.lng])
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-bold mb-2">${point.area}</h3>
              <p>Reports: ${Math.round(point.intensity * 100)}</p>
              <p>Status: Active</p>
            </div>
          `)
          .addTo(map);
      });

      // Add heatmap layer
      const heatLayer = L.heatLayer(
        heatmapPoints.map(point => [
          point.lat,
          point.lng,
          point.intensity
        ]),
        { radius: 25, blur: 15, maxZoom: 10 }
      ).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
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
            <Button variant="secondary" size="sm" className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
              <Download className="w-4 h-4 mr-2" />
              Export
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
                  <TrendingUp className="w-8 h-8 text-primary" />
                  Analytics
                </h2>
                <p className="text-muted-foreground mt-2">System-wide metrics and insights</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Total Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.totalReports}</div>
                    <p className="text-xs text-green-500 mt-1">+{mockStats.growthRate}% from last month</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-accent/10 to-secondary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Active Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.activeUsers}</div>
                    <p className="text-xs text-muted-foreground mt-1">This month</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-secondary/10 to-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Recycled Weight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockStats.recycledWeight} kg</div>
                    <p className="text-xs text-muted-foreground mt-1">Total collected</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-accent/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{mockStats.growthRate}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Month over month</p>
                  </CardContent>
                </Card>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Trends</CardTitle>
                    <CardDescription>Waste reports over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg h-64 flex items-center justify-center border p-2">
                      <Line data={trendChartData} options={trendChartOptions} style={{ width: '100%', height: '100%' }} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Waste Distribution</CardTitle>
                    <CardDescription>Types of waste reported this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg h-64 flex items-center justify-center border p-2">
                      <Bar 
                        data={{
                          labels: ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'E-waste'],
                          datasets: [{
                            label: 'Reports',
                            data: [65, 45, 35, 28, 20, 15],
                            backgroundColor: [
                              'rgba(34, 197, 94, 0.8)',
                              'rgba(59, 130, 246, 0.8)',
                              'rgba(168, 85, 247, 0.8)',
                              'rgba(249, 115, 22, 0.8)',
                              'rgba(234, 179, 8, 0.8)',
                              'rgba(239, 68, 68, 0.8)'
                            ],
                          }]
                        }}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: { display: false },
                            title: { display: false }
                          },
                          scales: {
                            y: { 
                              beginAtZero: true,
                              grid: { color: '#eee' }
                            }
                          }
                        }}
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Card>
                  <CardHeader>
                    <CardTitle>Hotspot Heatmap</CardTitle>
                    <CardDescription>Areas with highest waste reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div ref={mapRef} className="w-full h-64 rounded-lg border bg-white"></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Materials</CardTitle>
                    <CardDescription>Most collected recyclables</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { material: 'Plastic', percentage: 35, weight: 1897 },
                        { material: 'Paper', percentage: 28, weight: 1518 },
                        { material: 'Glass', percentage: 20, weight: 1084 },
                        { material: 'Metal', percentage: 17, weight: 921 }
                      ].map((item) => (
                        <div key={item.material} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{item.material}</span>
                            <span className="text-muted-foreground">{item.weight} kg ({item.percentage}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all" 
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
