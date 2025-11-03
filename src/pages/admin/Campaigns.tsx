import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LogOut, Plus, Calendar, Volume2, Languages, MapPin, Users, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Campaigns = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [campaignData, setCampaignData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
  });

  const [campaigns, setCampaigns] = useState([
    { id: 1, title: 'Beach Cleanup Drive', date: '2024-02-15', location: 'Sunset Beach', participants: 45, status: 'active', description: 'Join us for a beach cleanup' },
    { id: 2, title: 'Park Restoration', date: '2024-02-20', location: 'Central Park', participants: 32, status: 'upcoming', description: 'Help restore our local park' },
    { id: 3, title: 'River Cleanup', date: '2024-01-28', location: 'River Walk', participants: 67, status: 'completed', description: 'Clean up the river banks' },
  ]);
  const [createOpen, setCreateOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    participants: 0,
    status: 'upcoming',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEditCampaign = (campaign: any) => {
    setEditingCampaign(campaign);
    setCampaignData({
      title: campaign.title,
      date: campaign.date,
      location: campaign.location,
      description: campaign.description,
    });
  };

  const handleSaveCampaign = () => {
    // Update campaign in campaigns state
    setCampaigns(current => current.map(c =>
      c.id === editingCampaign.id ? { ...c, ...campaignData } : c
    ));
    toast.success('Campaign updated successfully!');
    setEditingCampaign(null);
    setCampaignData({ title: '', date: '', location: '', description: '' });
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.title || !newCampaign.date || !newCampaign.location) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCampaigns(current => [
      ...current,
      {
        ...newCampaign,
        id: Date.now(),
      }
    ]);
    toast.success('Campaign created successfully!');
    setNewCampaign({ title: '', date: '', location: '', description: '', participants: 0, status: 'upcoming' });
    setCreateOpen(false);
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
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Campaign</DialogTitle>
                  <DialogDescription>Fill in the details to launch a new campaign</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-title">Title</Label>
                    <Input
                      id="new-title"
                      value={newCampaign.title}
                      onChange={e => setNewCampaign({ ...newCampaign, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-date">Date</Label>
                    <Input
                      id="new-date"
                      type="date"
                      value={newCampaign.date}
                      onChange={e => setNewCampaign({ ...newCampaign, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-location">Location</Label>
                    <Input
                      id="new-location"
                      value={newCampaign.location}
                      onChange={e => setNewCampaign({ ...newCampaign, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-description">Description</Label>
                    <Textarea
                      id="new-description"
                      value={newCampaign.description}
                      onChange={e => setNewCampaign({ ...newCampaign, description: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleCreateCampaign} className="w-full">
                    Create Campaign
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                  <Calendar className="w-8 h-8 text-primary" />
                  Campaigns
                </h2>
                <p className="text-muted-foreground mt-2">Create and manage environmental campaigns</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{campaigns.filter(c => c.status === 'active').length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-accent/10 to-secondary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">{campaigns.filter(c => c.status === 'upcoming').length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{campaigns.reduce((sum, c) => sum + c.participants, 0)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Campaigns</CardTitle>
                  <CardDescription>Manage cleanup drives and community events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <Calendar className="w-10 h-10 text-primary" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{campaign.title}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {campaign.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {campaign.participants} participants
                              </span>
                              <span>{campaign.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={
                            campaign.status === 'active' ? 'default' :
                            campaign.status === 'upcoming' ? 'secondary' :
                            'outline'
                          }>
                            {campaign.status}
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => handleEditCampaign(campaign)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Campaign</DialogTitle>
                                <DialogDescription>Update campaign details</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="title">Title</Label>
                                  <Input
                                    id="title"
                                    value={campaignData.title}
                                    onChange={(e) => setCampaignData({ ...campaignData, title: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="date">Date</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={campaignData.date}
                                    onChange={(e) => setCampaignData({ ...campaignData, date: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="location">Location</Label>
                                  <Input
                                    id="location"
                                    value={campaignData.location}
                                    onChange={(e) => setCampaignData({ ...campaignData, location: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="description">Description</Label>
                                  <Textarea
                                    id="description"
                                    value={campaignData.description}
                                    onChange={(e) => setCampaignData({ ...campaignData, description: e.target.value })}
                                  />
                                </div>
                                <Button onClick={handleSaveCampaign} className="w-full">
                                  Save Changes
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
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

export default Campaigns;
