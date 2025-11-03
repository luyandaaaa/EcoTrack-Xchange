import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { LogOut, AlertCircle, Users, TrendingUp, Package, Languages } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';







import { useNavigate } from 'react-router-dom';

import i18n from '../i18n';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { t, i18n: i18nextInstance } = useTranslation();

  // Supported languages
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'zu', label: 'isiZulu' },
    { code: 'af', label: 'Afrikaans' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock data
  const mockActiveReports = 23;
  const mockActiveCollectors = 15;
  const mockTotalCitizens = 1247;
  const mockPendingApprovals = 7;

  const recentReports = [
    { id: 1, location: 'Oak Street', type: 'Overflowing bin', reporter: 'Sarah J.', time: '30 min ago', status: 'Pending' },
    { id: 2, location: 'Central Park', type: 'Illegal dumping', reporter: 'Mike T.', time: '2 hours ago', status: 'Assigned' },
    { id: 3, location: 'River Road', type: 'Damaged bin', reporter: 'Emma W.', time: '4 hours ago', status: 'Pending' },
  ];

  const topContributors = [
    { name: 'Sarah Johnson', score: 3450, reports: 28 },
    { name: 'Michael Chen', score: 3120, reports: 24 },
    { name: 'Emma Wilson', score: 2890, reports: 22 },
  ];

  const topCollectors = [
    { name: 'James Anderson', collections: 156, weight: 2340 },
    { name: 'Lisa Martinez', collections: 142, weight: 2180 },
    { name: 'Robert Taylor', collections: 138, weight: 2050 },
  ];

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Top Navigation Bar - Full Width */}
        <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary via-secondary to-accent shadow-lg">
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger className="text-primary-foreground" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-primary-foreground">{t('dashboardOverview')}, {user?.name}!</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm bg-background/20 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20">
                <span className="text-primary-foreground/80">Admin: </span>
                <span className="font-semibold text-primary-foreground">{user?.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20 flex items-center">
                    <Languages className="w-4 h-4 mr-2" />
                    {languages.find(l => l.code === i18nextInstance.language)?.label || 'English'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map(lang => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => i18nextInstance.changeLanguage(lang.code)}
                      className={
                        (i18nextInstance.language === lang.code ? 'font-semibold text-primary flex items-center gap-2' : '')
                      }
                    >
                      {i18nextInstance.language === lang.code && (
                        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      )}
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="secondary" size="sm" onClick={handleLogout} className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area with Sidebar */}
        <div className="flex flex-1 w-full">
          <AdminSidebar />
          
          {/* Main Content */}
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <div className="max-w-7xl mx-auto space-y-6">

              
              {/* Overview Section */}
              <div>
                <div className="mb-4 bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent border border-primary/30 rounded-xl p-4 shadow-sm">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">System Overview</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-primary/30 bg-gradient-to-br from-card via-primary/10 to-primary/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-primary" />
                        Active Reports
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-transparent">{mockActiveReports}</div>
                      <p className="text-xs text-muted-foreground">Pending allocation</p>
                    </CardContent>
                  </Card>

                  <Card className="border-accent/30 bg-gradient-to-br from-card via-accent/10 to-accent/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4 text-accent" />
                        Active Collectors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-br from-accent to-accent-glow bg-clip-text text-transparent">{mockActiveCollectors}</div>
                      <p className="text-xs text-muted-foreground">Currently on duty</p>
                    </CardContent>
                  </Card>

                  <Card className="border-secondary/30 bg-gradient-to-br from-card via-secondary/10 to-secondary/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-secondary" />
                        Total Citizens
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-secondary">{mockTotalCitizens}</div>
                      <p className="text-xs text-muted-foreground">Registered users</p>
                    </CardContent>
                  </Card>

                  <Card className="border-accent/30 bg-gradient-to-br from-card via-accent/10 to-primary/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Package className="w-4 h-4 text-accent" />
                        Marketplace
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{mockPendingApprovals}</div>
                      <p className="text-xs text-muted-foreground">Pending approval</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Recent Reports */}
              <Card className="border-border/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Recent Waste Reports</CardTitle>
                  <CardDescription>Latest reports from citizens requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/20 hover:border-primary/40 transition-all">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{report.location}</p>
                          <p className="text-sm text-muted-foreground">{report.type} • Reported by {report.reporter}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            report.status === 'Pending' 
                              ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30' 
                              : 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent border border-accent/30'
                          }`}>
                            {report.status}
                          </span>
                          <p className="text-xs text-muted-foreground mt-1">{report.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Top Contributors</CardTitle>
                    <CardDescription>Citizens with highest EcoScores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topContributors.map((contributor, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent border border-primary/20 hover:border-primary/40 transition-all">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold text-sm shadow-lg">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium text-foreground">{contributor.name}</p>
                              <p className="text-xs text-muted-foreground">{contributor.reports} reports</p>
                            </div>
                          </div>
                          <p className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{contributor.score} pts</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-xl">
                  <CardHeader>
                    <CardTitle className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Collection Performance</CardTitle>
                    <CardDescription>Top performing collectors this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topCollectors.map((collector, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-accent/10 via-primary/5 to-transparent border border-accent/20 hover:border-accent/40 transition-all">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-glow text-accent-foreground font-bold text-sm shadow-lg">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium text-foreground">{collector.name}</p>
                              <p className="text-xs text-muted-foreground">{collector.collections} collections</p>
                            </div>
                          </div>
                          <p className="font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">{collector.weight} kg</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="shadow-xl border-primary/20">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all">Create Campaign</Button>
                    <Button className="bg-gradient-to-r from-accent to-accent-glow hover:shadow-lg transition-all">Allocate Report</Button>
                    <Button className="bg-gradient-to-r from-secondary to-secondary/80 hover:shadow-lg transition-all">View Analytics</Button>
                    <Button variant="outline" className="border-primary/40 hover:bg-primary/10">Manage Users</Button>
                    <Button variant="outline" className="border-accent/40 hover:bg-accent/10">Export Report</Button>
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

export default AdminDashboard;
