import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CitizenSidebar } from '@/components/CitizenSidebar';
import { LogOut, Send, Volume2, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

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
          <CitizenSidebar />
          
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <div className="max-w-4xl mx-auto h-full">
              <div className="mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                  <Languages className="w-8 h-8 text-primary" />
                  EcoBot
                </h2>
                <p className="text-muted-foreground mt-2">Your AI assistant for all waste management questions</p>
              </div>
              
              <Card className="h-[calc(100vh-16rem)] flex flex-col">
                <CardHeader>
                  <CardTitle>Ask EcoBot Anything</CardTitle>
                  <CardDescription>Get answers about recycling, composting, and waste management</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm">👋 Hi {user?.name}! I'm EcoBot, your recycling assistant. Ask me anything about waste management, recycling, composting, or how to properly dispose of items!</p>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Try asking:</p>
                      <div className="grid gap-2">
                        <Button variant="outline" className="justify-start text-left h-auto py-3">
                          "How do I recycle plastic bottles?"
                        </Button>
                        <Button variant="outline" className="justify-start text-left h-auto py-3">
                          "What can I compost at home?"
                        </Button>
                        <Button variant="outline" className="justify-start text-left h-auto py-3">
                          "How should I dispose of electronic waste?"
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your question here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && setMessage('')}
                    />
                    <Button>
                      <Send className="w-4 h-4" />
                    </Button>
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

export default Chatbot;
