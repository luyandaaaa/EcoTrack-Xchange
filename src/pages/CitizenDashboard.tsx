import { useEffect } from 'react';

// ...existing code...
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CitizenSidebar } from '@/components/CitizenSidebar';
import { LogOut, TrendingUp, Award, Recycle, Volume2, Languages } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';





import { useNavigate } from 'react-router-dom';


import { useTranslation } from 'react-i18next';


const CitizenDashboard = () => {
  // Inject Chatbase widget script on mount
  useEffect(() => {
    if (document.getElementById('DN_RwJAbK6LtVlvH_Xy7c')) return;
    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.id = 'DN_RwJAbK6LtVlvH_Xy7c';
    script.setAttribute('domain', 'www.chatbase.co');
    document.body.appendChild(script);
  }, []);

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
  const mockEcoScore = 2450;
  const mockReports = 8;
  const mockScannedItems = 24;
  const mockRank = 12;

  const recentActivities = [
    { id: 1, action: t('reportOverflowingBin'), location: 'Park Street', points: 50, time: '2 hours ago' },
    { id: 2, action: t('scanWasteItem'), category: 'Recyclable', points: 10, time: '5 hours ago' },
    { id: 4, action: t('browseMarketplace'), item: 'Metal containers', points: 25, time: '2 days ago' },
  ];

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen w-full">
        {/* Top Navigation Bar - Full Width */}
        <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-primary via-accent to-secondary shadow-lg">
          <div className="flex h-16 items-center gap-4 px-6">
            <SidebarTrigger className="text-primary-foreground" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-primary-foreground">{t('dashboardOverview')}, {user?.name}!</h1>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-background/20 backdrop-blur-sm hover:bg-background/30 text-primary-foreground border border-primary-foreground/20"
              onClick={() => {
                const synth = window.speechSynthesis;
                if (synth.speaking) {
                  synth.cancel();
                  return;
                }
                const welcome = t('dashboardOverview') + ', ' + (user?.name || '') + '! ' + t('yourCitizenDashboard');
                const utterance = new window.SpeechSynthesisUtterance(welcome);
                utterance.lang = i18nextInstance.language === 'zu' ? 'zu-ZA' : i18nextInstance.language === 'af' ? 'af-ZA' : 'en-US';
                synth.speak(utterance);
              }}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
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
              {t('Logout', 'Logout')}
            </Button>
          </div>
        </header>

        {/* Content Area with Sidebar */}
        <div className="flex flex-1 w-full">
          <CitizenSidebar />
          
          {/* Main Content */}
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Overview section title and subtitle removed */}
              
              {/* Overview Section */}
              <div>
                <div className="mb-4 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/30 rounded-xl p-4 shadow-sm">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">{t('dashboardOverview')}</h2>
                    <p className="text-muted-foreground mt-2">{t('yourCitizenDashboard')}</p>
                  </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="border-primary/30 bg-gradient-to-br from-card via-primary/10 to-primary/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary" />
                          {t('ecoScore')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-transparent">{mockEcoScore}</div>
                        <p className="text-xs text-muted-foreground">{t('totalPoints')}</p>
                      </CardContent>
                  </Card>

                  <Card className="border-accent/30 bg-gradient-to-br from-card via-accent/10 to-accent/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Recycle className="w-4 h-4 text-accent" />
                          {t('reports')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-br from-accent to-accent-glow bg-clip-text text-transparent">{mockReports}</div>
                        <p className="text-xs text-muted-foreground">{t('wasteReports')}</p>
                      </CardContent>
                  </Card>

                  <Card className="border-secondary/30 bg-gradient-to-br from-card via-secondary/10 to-secondary/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-secondary" />
                          {t('scannedItems')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-secondary">{mockScannedItems}</div>
                        <p className="text-xs text-muted-foreground">{t('itemsIdentified')}</p>
                      </CardContent>
                  </Card>

                  <Card className="border-primary/30 bg-gradient-to-br from-card via-accent/10 to-primary/5 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{t('rank')}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">#{mockRank}</div>
                        <p className="text-xs text-muted-foreground">{t('communityRanking')}</p>
                      </CardContent>
                  </Card>
                </div>
              </div>

              {/* Quick Actions */}
              <Card className="shadow-xl border-primary/20">
                <CardHeader>
                  <CardTitle>{t('quickActions')}</CardTitle>
                  <CardDescription>{t('quickActionsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="flex-1 min-w-0 bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all"
                      onClick={() => navigate('/citizen/report')}
                    >
                      {t('reportOverflowingBin')}
                    </Button>
                    <Button
                      className="flex-1 min-w-0 bg-gradient-to-r from-accent to-accent-glow hover:shadow-lg transition-all"
                      onClick={() => navigate('/citizen/scanner')}
                    >
                      {t('scanWasteItem')}
                    </Button>
                    <Button
                      className="flex-1 min-w-0 bg-gradient-to-r from-secondary to-secondary/80 hover:shadow-lg transition-all"
                      onClick={() => navigate('/citizen/marketplace')}
                    >
                      {t('browseMarketplace')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border/50 shadow-xl">
                <CardHeader>
                  <CardTitle className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{t('recentActivity')}</CardTitle>
                  <CardDescription>{t('recentActivityDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/20 hover:border-primary/40 transition-all">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.location || activity.category || activity.item}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">+{activity.points} pts</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
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

export default CitizenDashboard;
