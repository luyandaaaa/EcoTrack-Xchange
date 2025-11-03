import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CollectorSidebar } from '@/components/CollectorSidebar';
import { LogOut, TrendingUp, Award, DollarSign, Volume2, Languages, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Performance = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock data
  const collectionsThisMonth = 18;
  const totalWeight = 245;
  const salesRevenue = 1850;
  const trends = [
    { date: '2025-10-01', value: 2 },
    { date: '2025-10-05', value: 4 },
    { date: '2025-10-10', value: 6 },
    { date: '2025-10-15', value: 3 },
    { date: '2025-10-20', value: 7 },
    { date: '2025-10-25', value: 8 },
    { date: '2025-10-30', value: 5 },
  ];
  const breakdown = [
    { type: 'Plastic', weight: 110 },
    { type: 'Metal', weight: 60 },
    { type: 'Glass', weight: 45 },
    { type: 'Paper', weight: 30 },
  ];

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
          
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="mb-6 bg-gradient-to-r from-accent/10 via-primary/5 to-transparent border border-accent/30 rounded-xl p-4 shadow-sm">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                  <BarChart3 className="w-8 h-8 text-primary" />
                  Performance
                </h2>
                <p className="text-muted-foreground mt-2">Track your collection efficiency and earnings</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Collections This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{collectionsThisMonth}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Award className="w-4 h-4 text-accent" />
                      Total Weight
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{totalWeight} kg</div>
                    <p className="text-xs text-muted-foreground mt-1">Collected this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      Sales Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">R{salesRevenue}</div>
                    <p className="text-xs text-muted-foreground mt-1">From marketplace</p>
                  </CardContent>
                </Card>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>Track your collection efficiency over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                      {/* Simple SVG line chart mock */}
                      <svg width="100%" height="100%" viewBox="0 0 400 200">
                        <polyline
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3"
                          points={trends.map((t, i) => `${i * 60 + 20},${200 - t.value * 20}`).join(' ')}
                        />
                        {trends.map((t, i) => (
                          <circle key={i} cx={i * 60 + 20} cy={200 - t.value * 20} r="5" fill="#10b981" />
                        ))}
                      </svg>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      {trends.map((t, i) => (
                        <span key={i}>{t.date.slice(5)}</span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Collection Breakdown</CardTitle>
                    <CardDescription>Materials collected by type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-4 w-full">
                      {/* Responsive Bar graph visualization */}
                      <div className="w-full" style={{ minWidth: 0 }}>
                        <svg width="100%" height="180" viewBox="0 0 400 180" preserveAspectRatio="none">
                          {(() => {
                            const max = Math.max(...breakdown.map(b => b.weight));
                            const n = breakdown.length;
                            const chartWidth = 400;
                            const chartHeight = 140;
                            const margin = 40;
                            const barGap = 24;
                            const barWidth = (chartWidth - 2 * margin - (n - 1) * barGap) / n;
                            const colors = ['#10b981', '#f59e42', '#3b82f6', '#a78bfa'];
                            return breakdown.map((b, i) => {
                              const barHeight = (b.weight / max) * (chartHeight - 20);
                              const x = margin + i * (barWidth + barGap);
                              return (
                                <g key={b.type}>
                                  <rect
                                    x={x}
                                    y={chartHeight - barHeight + 20}
                                    width={barWidth}
                                    height={barHeight}
                                    fill={colors[i % colors.length]}
                                    rx="6"
                                  />
                                  <text
                                    x={x + barWidth / 2}
                                    y={chartHeight + 38}
                                    textAnchor="middle"
                                    fontSize="13"
                                    fill="#666"
                                  >
                                    {b.type}
                                  </text>
                                  <text
                                    x={x + barWidth / 2}
                                    y={chartHeight - barHeight + 10}
                                    textAnchor="middle"
                                    fontSize="13"
                                    fill="#222"
                                    fontWeight="bold"
                                  >
                                    {b.weight}kg
                                  </text>
                                </g>
                              );
                            });
                          })()}
                          {/* Y axis line */}
                          <line x1="32" y1="20" x2="32" y2="160" stroke="#ddd" strokeWidth="2" />
                          {/* X axis line */}
                          <line x1="32" y1="160" x2="380" y2="160" stroke="#ddd" strokeWidth="2" />
                        </svg>
                      </div>
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

export default Performance;
