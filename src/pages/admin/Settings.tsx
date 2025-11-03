import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LogOut, Save, Volume2, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!');
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
          <AdminSidebar />
          
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="mb-4 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/30 rounded-xl p-4 shadow-sm">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                  <Save className="w-8 h-8 text-primary" />
                  Settings
                </h2>
                <p className="text-muted-foreground mt-2">Configure platform settings and preferences</p>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Platform Configuration</CardTitle>
                  <CardDescription>Manage global platform settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input id="platformName" defaultValue="EcoTrack Xchange" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable New User Registration</Label>
                      <p className="text-sm text-muted-foreground">Allow new users to create accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Marketplace Auto-Approval</Label>
                      <p className="text-sm text-muted-foreground">Automatically approve new listings</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send email updates to users</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>EcoScore Settings</CardTitle>
                  <CardDescription>Configure point rewards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reportPoints">Points per Report</Label>
                      <Input id="reportPoints" type="number" defaultValue="10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scanPoints">Points per Scan</Label>
                      <Input id="scanPoints" type="number" defaultValue="5" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quizPoints">Base Quiz Points</Label>
                      <Input id="quizPoints" type="number" defaultValue="50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cleanupPoints">Cleanup Bonus Points</Label>
                      <Input id="cleanupPoints" type="number" defaultValue="100" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Configure user permissions and roles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Citizens to List Items</Label>
                      <p className="text-sm text-muted-foreground">Enable marketplace access for citizens</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Reset to Defaults</Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
