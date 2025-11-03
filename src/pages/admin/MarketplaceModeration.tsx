import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, CheckCircle, XCircle, Volume2, Languages, Flag, ShoppingBag, Eye, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const MarketplaceModeration = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [flaggedItems, setFlaggedItems] = useState([]);
  type PendingItem = {
    id: number;
    title: string;
    seller: string;
    category: string;
    price: number;
    date: string;
    description: string;
    images: string[];
    materials: string[];
    sustainability: string;
  };

  const [pendingItems, setPendingItems] = useState<PendingItem[]>([
    { 
      id: 1, 
      title: 'Recycled Glass Lamp', 
      seller: 'EcoCrafter', 
      category: 'Decor', 
      price: 45, 
      date: '2024-01-15',
      description: 'Handcrafted lamp made from recycled wine bottles. Each piece is unique and eco-friendly.',
      images: [
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&auto=format',
        'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=500&auto=format',
      ],
      materials: ['Recycled Glass', 'LED Components', 'Recycled Metal'],
      sustainability: 'Made from 100% recycled materials. Energy-efficient LED lighting included.'
    },
    { 
      id: 2, 
      title: 'Upcycled Denim Jacket', 
      seller: 'FashionGreen', 
      category: 'Clothing', 
      price: 65, 
      date: '2024-01-14',
      description: 'Unique denim jacket made from recycled jeans. Features hand-painted designs and custom patches.',
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format',
        'https://images.unsplash.com/photo-1541840031508-7b1084d29857?w=500&auto=format',
      ],
      materials: ['Recycled Denim', 'Eco-friendly Paint', 'Organic Cotton Thread'],
      sustainability: 'Saved 2 pairs of jeans from landfill. Uses non-toxic, eco-friendly paints.'
    },
  ]);

  const [activeListings, setActiveListings] = useState([
    { id: 3, title: 'Plastic Bottle Planter', seller: 'GreenThumb', sales: 12, revenue: 96 },
    { id: 4, title: 'Pallet Coffee Table', seller: 'WoodWorker', sales: 3, revenue: 360 },
  ]);

  const handleFlag = (id) => {
    const itemToFlag = activeListings.find(item => item.id === id);
    if (!itemToFlag) return;
    setActiveListings(current => current.filter(item => item.id !== id));
    setFlaggedItems(current => [...current, itemToFlag]);
    toast.info(`"${itemToFlag.title}" has been flagged and moved to flagged items.`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleApprove = (id: number, title: string) => {
    // Find the item in pending items
    const itemToApprove = pendingItems.find(item => item.id === id);
    if (!itemToApprove) return;

    // Create new active listing from the approved item
    const newActiveListing = {
      id: itemToApprove.id,
      title: itemToApprove.title,
      seller: itemToApprove.seller,
      sales: 0,
      revenue: 0
    };

    // Update state
    setPendingItems(current => current.filter(item => item.id !== id));
    setActiveListings(current => [...current, newActiveListing]);
    setSelectedItem(null);
    toast.success(`"${title}" approved and moved to active listings!`);
  };

  const handleReject = (id: number, title: string) => {
    // Remove from pending items
    setPendingItems(current => current.filter(item => item.id !== id));
    setSelectedItem(null);
    toast.error(`"${title}" rejected and removed from pending items`);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
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
                  <ShoppingBag className="w-8 h-8 text-primary" />
                  Marketplace
                </h2>
                <p className="text-muted-foreground mt-2">Moderate marketplace listings and sales</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-orange-500/10 to-accent/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{pendingItems.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-primary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">{activeListings.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-destructive/10 to-accent/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Flagged Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{flaggedItems.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R{activeListings.reduce((sum, item) => sum + item.revenue, 0)}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Listings</CardTitle>
                  <CardDescription>Items awaiting approval</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-card to-card/50 hover:shadow-md transition-shadow">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                            {item.images?.[0] ? (
                              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {item.seller} • {item.category} • R{item.price} • {item.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="hover:bg-accent/10" onClick={() => handleViewDetails(item)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-500 border-green-500 hover:bg-green-500/10" onClick={() => handleApprove(item.id, item.title)}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleReject(item.id, item.title)}>
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Item Details Dialog */}
              <Dialog open={selectedItem !== null} onOpenChange={() => setSelectedItem(null)}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Review Item</DialogTitle>
                    <DialogDescription>Review the item details before making a decision</DialogDescription>
                  </DialogHeader>
                  {selectedItem && (
                    <div className="mt-4">
                      <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="details">Details</TabsTrigger>
                          <TabsTrigger value="images">Images</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="mt-4">
                          <ScrollArea className="h-[400px] rounded-md border p-4">
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold mb-1">Title</h3>
                                <p>{selectedItem.title}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-1">Seller</h3>
                                <p>{selectedItem.seller}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-1">Price</h3>
                                <p>R{selectedItem.price}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-1">Category</h3>
                                <p>{selectedItem.category}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-1">Description</h3>
                                <p className="text-muted-foreground">{selectedItem.description}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-1">Materials Used</h3>
                                <div className="flex gap-2 flex-wrap">
                                  {selectedItem.materials.map((material, index) => (
                                    <Badge key={index} variant="secondary">{material}</Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h3 className="font-semibold mb-1">Sustainability Impact</h3>
                                <p className="text-muted-foreground">{selectedItem.sustainability}</p>
                              </div>
                            </div>
                          </ScrollArea>
                        </TabsContent>
                        <TabsContent value="images" className="mt-4">
                          <ScrollArea className="h-[400px]">
                            <div className="grid grid-cols-2 gap-4">
                              {selectedItem.images.map((image, index) => (
                                <div key={index} className="relative aspect-square rounded-lg border overflow-hidden">
                                  <img src={image} alt={`${selectedItem.title} ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setSelectedItem(null)}>
                          Close
                        </Button>
                        <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleReject(selectedItem.id, selectedItem.title)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button variant="outline" className="text-green-500 border-green-500 hover:bg-green-500/10" onClick={() => handleApprove(selectedItem.id, selectedItem.title)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Card>
                <CardHeader>
                  <CardTitle>Active Listings</CardTitle>
                  <CardDescription>Approved items currently for sale</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeListings.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-card to-card/50">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">by {item.seller}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold">{item.sales} sales</p>
                            <p className="text-sm text-muted-foreground">R{item.revenue} revenue</p>
                          </div>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => handleFlag(item.id)}>
                            <Flag className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
              {/* Flagged Items List */}
              {flaggedItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Flagged Items</CardTitle>
                    <CardDescription>Items flagged by admin for review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {flaggedItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-destructive/10 to-card/50">
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">by {item.seller}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold">{item.sales ?? 0} sales</p>
                              <p className="text-sm text-muted-foreground">R{item.revenue ?? 0} revenue</p>
                            </div>
                            <Flag className="w-4 h-4 text-destructive" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
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

export default MarketplaceModeration;
