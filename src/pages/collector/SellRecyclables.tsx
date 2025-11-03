import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CollectorSidebar } from '@/components/CollectorSidebar';
import { LogOut, Volume2, Languages, Package, CheckCircle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SellRecyclables = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    material: '',
    weight: '',
    price: '',
    description: '',
    image: null as string | null,
  });

  const [activeListings, setActiveListings] = useState([
    { id: 1, material: 'Plastic', weight: 50, price: 75, description: 'Clean PET bottles', status: 'active', orders: 2, image: 'https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=400' },
    { id: 2, material: 'Metal', weight: 30, price: 120, description: 'Aluminum cans', status: 'active', orders: 1, image: 'https://images.unsplash.com/photo-1625223416870-0c40c7a8b6d9?w=400' },
  ]);

  const [orders, setOrders] = useState([
    { id: 1, buyer: 'RecyclingCorp', material: 'Plastic', weight: 25, amount: 37.50, status: 'pending', date: '2024-01-15' },
    { id: 2, buyer: 'GreenIndustries', material: 'Metal', weight: 30, amount: 120, status: 'pending', date: '2024-01-14' },
    { id: 3, buyer: 'EcoFactory', material: 'Glass', weight: 40, amount: 60, status: 'completed', date: '2024-01-10' },
  ]);

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
    const newListing = {
      id: activeListings.length + 1,
      ...formData,
      weight: parseFloat(formData.weight),
      price: parseFloat(formData.price),
      status: 'active',
      orders: 0,
      image: formData.image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400'
    };
    setActiveListings([...activeListings, newListing]);
    toast.success('Listing created successfully!');
    setFormData({ material: '', weight: '', price: '', description: '', image: null });
  };

  const handleConfirmOrder = (orderId: number) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'completed' } : order
    ));
    toast.success('Order confirmed and marked as completed!');
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
          
          <main className="flex-1 p-6 bg-gradient-to-br from-background via-primary/5 to-accent/10">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="mb-6 bg-gradient-to-r from-accent/10 via-primary/5 to-transparent border border-accent/30 rounded-xl p-4 shadow-sm">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                  <Package className="w-8 h-8 text-primary" />
                  Sell Recyclables
                </h2>
                <p className="text-muted-foreground mt-2">List and manage your recyclable materials</p>
              </div>
              
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="create">Create Listing</TabsTrigger>
                  <TabsTrigger value="listings">
                    My Listings
                    <Badge variant="secondary" className="ml-2">{activeListings.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="orders">
                    Orders
                    <Badge variant="secondary" className="ml-2">{orders.filter(o => o.status === 'pending').length}</Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>List Sorted Materials</CardTitle>
                      <CardDescription>Create a listing for your collected recyclable materials</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="material">Material Type</Label>
                          <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Plastic">Plastic</SelectItem>
                              <SelectItem value="Glass">Glass</SelectItem>
                              <SelectItem value="Metal">Metal</SelectItem>
                              <SelectItem value="Paper">Paper/Cardboard</SelectItem>
                              <SelectItem value="Electronic">Electronic Waste</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="weight">Total Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            step="0.1"
                            placeholder="e.g., 20"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="price">Price (R)</Label>
                          <Input
                            id="price"
                            type="number"
                            step="0.01"
                            placeholder="Your asking price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Describe the condition and quality of materials..."
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
                            id="listing-image-upload"
                          />
                          <label htmlFor="listing-image-upload" className="block border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                            {formData.image ? (
                              <img src={formData.image} alt="Upload preview" className="max-h-48 mx-auto mb-2 rounded" />
                            ) : (
                              <>
                                <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Click to upload photo of materials</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                              </>
                            )}
                          </label>
                        </div>

                        <Button type="submit" className="w-full">Create Listing</Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="listings" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Active Listings</CardTitle>
                      <CardDescription>Materials you're currently selling</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {activeListings.map((listing) => (
                          <div key={listing.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-shadow">
                            {listing.image ? (
                              <img 
                                src={listing.image} 
                                alt={listing.material}
                                className="w-24 h-24 object-cover rounded border"
                                onError={e => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            {/* Fallback if image is missing or broken */}
                            <div style={{display: listing.image ? 'none' : 'flex'}} className="w-24 h-24 items-center justify-center bg-muted rounded border flex-col text-muted-foreground">
                              <Camera className="w-8 h-8 mb-1 mx-auto" />
                              <span className="text-xs">No image</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{listing.material}</h3>
                              <p className="text-sm text-muted-foreground">{listing.description}</p>
                              <p className="text-sm mt-1">
                                <span className="font-medium">{listing.weight} kg</span> • 
                                <span className="ml-2">{listing.orders} orders</span>
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">R{listing.price}</p>
                              <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                                {listing.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Incoming Orders</CardTitle>
                      <CardDescription>Manage orders for your recyclable materials</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-shadow">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold">{order.buyer}</h3>
                                <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {order.material} • {order.weight} kg • {order.date}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xl font-bold text-primary">R{order.amount}</p>
                              </div>
                              {order.status === 'pending' && (
                                <Button size="sm" onClick={() => handleConfirmOrder(order.id)}>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Confirm
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SellRecyclables;
