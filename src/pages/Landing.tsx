import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Recycle, Truck, Shield, User } from 'lucide-react';
import heroBackground from '@/assets/hero-background-new.jpg';
import { toast } from 'sonner';

type UserRole = 'citizen' | 'collector' | 'admin';

const Landing = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsDialogOpen(true);
    setActiveTab('login');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      if (activeTab === 'login') {
        await login(formData.email, formData.password, selectedRole);
        toast.success('Welcome back!');
      } else {
        await signup(formData.name, formData.email, formData.password, selectedRole);
        toast.success('Account created successfully!');
      }
      setIsDialogOpen(false);
      navigate(`/${selectedRole}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const roles = [
    {
      id: 'citizen' as UserRole,
      title: 'Citizen',
      icon: User,
    },
    {
      id: 'collector' as UserRole,
      title: 'Collector',
      icon: Truck,
    },
    {
      id: 'admin' as UserRole,
      title: 'Admin',
      icon: Shield,
    },
  ];

  const getRoleTitle = (role: UserRole) => {
    return roles.find(r => r.id === role)?.title || role;
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl backdrop-blur-md bg-card/70 shadow-2xl border-white/20">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                EcoTrack Xchange
              </h1>
              <p className="text-sm md:text-base mb-2 opacity-90">
                From Waste to Wealth — A Smart Waste Management Platform
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-center mb-6">
                Select your role to access
              </h2>
              
              {/* Role Selection Cards */}
              <div className="flex justify-center gap-4 flex-wrap">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-border/50 bg-background/50 hover:bg-background/70 hover:border-primary hover:shadow-lg transition-all min-w-[120px] backdrop-blur-sm"
                  >
                    <role.icon className="w-8 h-8" />
                    <span className="font-medium">{role.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center text-sm opacity-80">
              <p>Sign in and select your role to access the appropriate dashboard</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auth Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl text-primary">
              {selectedRole && getRoleTitle(selectedRole)} Portal
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <form onSubmit={handleAuth}>
              <TabsContent value="login" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full mt-2">
                  Login
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </TabsContent>
            </form>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Landing;
