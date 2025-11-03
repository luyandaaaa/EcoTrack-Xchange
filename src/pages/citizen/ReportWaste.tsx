import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CitizenSidebar } from '@/components/CitizenSidebar';
import { LogOut, MapPin, Camera, Volume2, Languages, Recycle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const ReportWaste = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: '',
    wasteType: '',
    description: '',
    urgency: '',
    image: null as string | null,
  });
  const [showForm, setShowForm] = useState(false);


  // Key for localStorage per user
  const storageKey = user?.id ? `reportedWaste_${user.id}` : null;
  const defaultReports = [
    { id: 1, location: 'Main St & 5th Ave', type: 'Plastic', urgency: 'High', date: '2024-01-15', image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&h=300&fit=crop&auto=format', status: 'Pending' },
    { id: 2, location: 'Central Park', type: 'Mixed', urgency: 'Medium', date: '2024-01-14', image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300&fit=crop&auto=format', status: 'Assigned' },
    { id: 3, location: 'River Road', type: 'Organic', urgency: 'Low', date: '2024-01-13', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&auto=format', status: 'Completed' },
  ];
  const [reportedWaste, setReportedWaste] = useState(() => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return defaultReports;
        }
      }
    }
    return defaultReports;
  });
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport = {
      id: Date.now(),
      location: formData.location,
      type: formData.wasteType.charAt(0).toUpperCase() + formData.wasteType.slice(1),
      urgency: formData.urgency.charAt(0).toUpperCase() + formData.urgency.slice(1),
      date: new Date().toISOString().slice(0, 10),
      image: formData.image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&auto=format',
      status: 'Pending',
      description: formData.description,
    };
    const updatedReports = [newReport, ...reportedWaste];
    setReportedWaste(updatedReports);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updatedReports));
    }
    toast.success('Report submitted successfully! You earned 10 EcoPoints.');
    setFormData({ location: '', wasteType: '', description: '', urgency: '', image: null });
    setShowForm(false);
    setTimeout(() => {
      const el = document.getElementById('user-reported-wastes');
      if (el) el.scrollIntoView({behavior: 'smooth'});
    }, 200);
  };

  // Sync localStorage when user changes (e.g., login/logout)
  useEffect(() => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setReportedWaste(JSON.parse(stored));
        } catch {
          setReportedWaste(defaultReports);
        }
      } else {
        setReportedWaste(defaultReports);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Top Navigation Bar - Full Width */}
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

        {/* Content Area with Sidebar */}
        <div className="flex flex-1 w-full">
          <CitizenSidebar />
          
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="mb-6 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/30 rounded-xl p-6 shadow-sm">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                  <Recycle className="w-8 h-8 text-primary" />
                  Report Waste
                </h2>
                <p className="text-muted-foreground mt-2">Help keep your community clean by reporting waste issues</p>
              </div>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button
                  className="flex-1 min-w-0 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all"
                  onClick={() => {
                    setShowForm(true);
                    setTimeout(() => window.scrollTo({top: 0, behavior: 'smooth'}), 100);
                  }}
                >
                  Add New Report
                </Button>
                <Button className="flex-1 min-w-0 bg-gradient-to-r from-accent to-accent-glow hover:shadow-lg transition-all" onClick={() => {
                  const el = document.getElementById('user-reported-wastes');
                  if (el) el.scrollIntoView({behavior: 'smooth'});
                }}>
                  View Recent Waste Reports
                </Button>
              </div>
              
              {showForm && (
                <Card id="recent-waste-reports" className="relative">
                  <button
                    type="button"
                    aria-label="Close form"
                    className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors z-10"
                    onClick={() => setShowForm(false)}
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <CardHeader>
                    <CardTitle>Report Overflowing Bin or Illegal Dump</CardTitle>
                    <CardDescription>Help keep your community clean by reporting waste issues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <div className="flex gap-2">
                          <Input
                            id="location"
                            placeholder="Enter address or use GPS"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                          />
                          <Button type="button" variant="outline" size="icon">
                            <MapPin className="w-4 h-4" />
                          </Button>
                        </div>
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
                        <Label htmlFor="urgency">Urgency Level</Label>
                        <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - Can wait a few days</SelectItem>
                            <SelectItem value="medium">Medium - Should be collected soon</SelectItem>
                            <SelectItem value="high">High - Needs immediate attention</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Provide additional details about the waste issue..."
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={4}
                        />
                      </div>

                      <div>
                        <Label>Upload Photo</Label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="block border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                          {formData.image ? (
                            <img src={formData.image} alt="Upload preview" className="max-h-48 mx-auto mb-2 rounded" />
                          ) : (
                            <>
                              <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                            </>
                          )}
                        </label>
                      </div>

                      <Button type="submit" className="w-full">Submit Report</Button>
                    </form>
                  </CardContent>
                </Card>
              )}

              <Card id="user-reported-wastes">
                <CardHeader>
                  <CardTitle>Your Reported Waste</CardTitle>
                  <CardDescription>Track the status of your waste reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reportedWaste.map((report) => (
                      <Card
                        key={report.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="aspect-video relative bg-muted">
                          <img
                            src={report.image}
                            alt={`Report at ${report.location}`}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&auto=format';
                            }}
                          />
                          <Badge
                            className="absolute top-2 right-2"
                            variant={report.status === 'Completed' ? 'default' : report.status === 'Assigned' ? 'secondary' : 'outline'}
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{report.location}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Type: {report.type}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant={report.urgency === 'High' ? 'destructive' : report.urgency === 'Medium' ? 'default' : 'secondary'}>
                              {report.urgency}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{report.date}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
              {/* Waste Report Details Dialog */}
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
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop&auto=format';
                          }}
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
                          {selectedReport.description && (
                            <div className="mt-2">
                              <p className="font-semibold">Description:</p>
                              <p className="text-sm text-muted-foreground">{selectedReport.description}</p>
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

export default ReportWaste;
