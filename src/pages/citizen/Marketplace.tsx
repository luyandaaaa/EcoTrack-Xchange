import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CitizenSidebar } from '@/components/CitizenSidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Volume2, Languages, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Marketplace = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Cart state (must be inside component)
  const [cart, setCart] = useState<any[]>(() => {
    const stored = localStorage.getItem('marketplaceCart');
    return stored ? JSON.parse(stored) : [];
  });
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Orders state (per user)
  const ordersStorageKey = user?.id ? `userOrders_${user.id}` : null;
  const [orders, setOrders] = useState<any[]>(() => {
    if (ordersStorageKey) {
      const stored = localStorage.getItem(ordersStorageKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('marketplaceCart', JSON.stringify(cart));
  }, [cart]);

  // Update localStorage when orders change
  useEffect(() => {
    if (ordersStorageKey) {
      localStorage.setItem(ordersStorageKey, JSON.stringify(orders));
    }
  }, [orders, ordersStorageKey]);

  const [products, setProducts] = useState([
    { id: 1, title: 'Upcycled Denim Bag', category: 'Bags', price: '250.00', seller: 'EcoUser123', description: 'Handmade bag from recycled denim jeans', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400' },
    { id: 2, title: 'Recycled Glass Vase', category: 'Decor', price: '150.00', seller: 'GreenCrafter', description: 'Beautiful vase made from recycled glass bottles', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400' },
    { id: 3, title: 'Wooden Pallet Table', category: 'Furniture', price: '1200.00', seller: 'WoodWorker99', description: 'Rustic coffee table from reclaimed pallets', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400' },
    { id: 4, title: 'Plastic Bottle Planter', category: 'Decor', price: '80.00', seller: 'PlantLover', description: 'Cute planters made from recycled plastic bottles', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400' },
  ]);

  // Key for localStorage per user
  const listingsStorageKey = user?.id ? `userListings_${user.id}` : null;
  const defaultListings = [
    { id: 5, title: 'Tire Ottoman', category: 'Furniture', price: '450.00', status: 'active', views: 12, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', stock: 1 },
  ];
  const [userListings, setUserListings] = useState(() => {
    if (listingsStorageKey) {
      const stored = localStorage.getItem(listingsStorageKey);
      if (stored) {
        try {
          // Ensure stock field exists for all listings
          return JSON.parse(stored).map((item: any) => ({ ...item, stock: item.stock ?? 1 }));
        } catch {
          return defaultListings.map((item) => ({ ...item, stock: item.stock ?? 1 }));
        }
      }
    }
    return defaultListings.map((item) => ({ ...item, stock: item.stock ?? 1 }));
  });


  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    image: null as string | null,
  });

  // Edit dialog state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    price: '',
    stock: 1,
  });
  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = (listing: any) => {
    setEditForm({ id: listing.id, price: listing.price, stock: listing.stock ?? 1 });
    setShowEditDialog(true);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.price || editForm.stock === undefined || editForm.stock === null) {
      toast.error('Please provide price and stock amount.');
      return;
    }
    const updatedListings = userListings.map((item) =>
      item.id === editForm.id ? { ...item, price: editForm.price, stock: editForm.stock } : item
    );
    setUserListings(updatedListings);
    if (listingsStorageKey) {
      localStorage.setItem(listingsStorageKey, JSON.stringify(updatedListings));
    }
    toast.success('Product updated successfully!');
    setShowEditDialog(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.title || !addForm.category || !addForm.price || !addForm.image) {
      toast.error('Please fill all fields and attach a product image.');
      return;
    }
    const newListing = {
      id: Date.now(),
      title: addForm.title,
      category: addForm.category,
      price: addForm.price,
      description: addForm.description,
      image: addForm.image,
      status: 'active',
      views: 0,
    };
    const updatedListings = [...userListings, newListing];
    setUserListings(updatedListings);
    if (listingsStorageKey) {
      localStorage.setItem(listingsStorageKey, JSON.stringify(updatedListings));
    }
    toast.success('Product listed successfully!');
    setAddForm({ title: '', category: '', price: '', description: '', image: null });
    setShowAddDialog(false);
  };

  const handleProductAdded = (product: any) => {
    // Ensure image is present
    if (!product.image) {
      toast.error('Please attach a picture of your product.');
      return;
    }
    const newListing = { ...product, id: Date.now(), status: 'active', views: 0 };
    const updatedListings = [...userListings, newListing];
    setUserListings(updatedListings);
    if (listingsStorageKey) {
      localStorage.setItem(listingsStorageKey, JSON.stringify(updatedListings));
    }
    toast.success('Product listed successfully!');
  };
  // Sync localStorage when user changes (e.g., login/logout)
  useEffect(() => {
    if (listingsStorageKey) {
      const stored = localStorage.getItem(listingsStorageKey);
      if (stored) {
        try {
          setUserListings(JSON.parse(stored));
        } catch {
          setUserListings(defaultListings);
        }
      } else {
        setUserListings(defaultListings);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingsStorageKey]);

  const handleAddToCart = (product: any) => {
    // Check if already in cart (by id)
    if (cart.some((item) => item.id === product.id)) {
      toast.info('Item already in cart.');
      return;
    }
    setCart([...cart, { ...product, quantity: 1 }]);
    toast.success('Added to cart!');
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
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex justify-between items-center bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/30 rounded-xl p-6 shadow-sm">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-2">
                    <ShoppingCart className="w-8 h-8 text-primary" />
                    Marketplace
                  </h2>
                  <p className="text-muted-foreground mt-2">Buy & sell recycled goods</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" aria-label="View Cart" onClick={() => setShowCartDialog(true)} className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-1 min-w-[1.25rem] h-5 flex items-center justify-center border border-background">
                        {cart.length}
                      </span>
                    )}
                  </Button>
                  <Button onClick={() => setShowAddDialog(true)}>
                    List a Product
                  </Button>
                  {/* Cart Dialog */}
                  <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Your Cart</DialogTitle>
                        <DialogDescription>Items you have added to your cart</DialogDescription>
                      </DialogHeader>
                      {cart.length === 0 ? (
                        <p className="text-center text-muted-foreground">Your cart is empty.</p>
                      ) : (
                        <div className="space-y-4">
                          {cart.map((item, idx) => (
                            <div key={item.id} className="flex items-center gap-4 border-b pb-2 last:border-b-0">
                              <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                              <div className="flex-1">
                                <div className="font-semibold">{item.title}</div>
                                <div className="text-sm text-muted-foreground">R{item.price}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" type="button" aria-label="Decrease quantity" onClick={() => {
                                  setCart((prev) => prev.map((c, i) => i === idx ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c));
                                }}>-</Button>
                                <span className="w-6 text-center">{item.quantity}</span>
                                <Button size="icon" variant="outline" type="button" aria-label="Increase quantity" onClick={() => {
                                  setCart((prev) => prev.map((c, i) => i === idx ? { ...c, quantity: c.quantity + 1 } : c));
                                }}>+</Button>
                              </div>
                            </div>
                          ))}
                          <div className="flex justify-between items-center pt-4 border-t mt-2">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-primary text-lg">
                              R{cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2)}
                            </span>
                          </div>
                          <Button className="w-full mt-2" onClick={() => setShowPaymentDialog(true)}>Checkout</Button>
                          {/* Payment Dialog */}
                          <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                            <DialogContent className="max-w-sm">
                              <DialogHeader>
                                <DialogTitle>Payment Details</DialogTitle>
                                <DialogDescription>Enter your card details to complete the purchase</DialogDescription>
                              </DialogHeader>
                              <form
                                onSubmit={e => {
                                  e.preventDefault();
                                  setShowPaymentDialog(false);
                                  // Add cart items to orders with pending status
                                  if (cart.length > 0) {
                                    const newOrders = cart.map(item => ({
                                      ...item,
                                      orderId: Date.now() + Math.random(),
                                      status: 'pending',
                                      orderedAt: new Date().toISOString(),
                                    }));
                                    setOrders(prev => [...newOrders, ...prev]);
                                  }
                                  setCart([]);
                                  toast.success('Payment successful!');
                                }}
                                className="space-y-4"
                              >
                                <div>
                                  <Label htmlFor="card-number">Card Number</Label>
                                  <Input id="card-number" type="text" inputMode="numeric" pattern="[0-9 ]*" maxLength={19} placeholder="1234 5678 9012 3456" required />
                                </div>
                                <div className="flex gap-2">
                                  <div className="flex-1">
                                    <Label htmlFor="expiry">Expiry</Label>
                                    <Input id="expiry" type="text" inputMode="numeric" pattern="[0-9/]*" maxLength={5} placeholder="MM/YY" required />
                                  </div>
                                  <div className="flex-1">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input id="cvc" type="text" inputMode="numeric" pattern="[0-9]*" maxLength={4} placeholder="123" required />
                                  </div>
                                </div>
                                <Button type="submit" className="w-full">Pay</Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>List a Product</DialogTitle>
                      <DialogDescription>Add your recycled or upcycled product to the marketplace</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Product Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Handmade Recycled Bag"
                          value={addForm.title}
                          onChange={(e) => setAddForm((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={addForm.category} onValueChange={(value) => setAddForm((prev) => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bags">Bags</SelectItem>
                            <SelectItem value="Decor">Decor</SelectItem>
                            <SelectItem value="Furniture">Furniture</SelectItem>
                            <SelectItem value="Planters">Planters</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">Price (R)</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={addForm.price}
                          onChange={(e) => setAddForm((prev) => ({ ...prev, price: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your product..."
                          value={addForm.description}
                          onChange={(e) => setAddForm((prev) => ({ ...prev, description: e.target.value }))}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Upload Product Image</Label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="product-image-upload"
                        />
                        <label htmlFor="product-image-upload" className="block border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                          {addForm.image ? (
                            <img src={addForm.image} alt="Upload preview" className="max-h-40 mx-auto mb-2 rounded" />
                          ) : (
                            <>
                              <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                            </>
                          )}
                        </label>
                      </div>
                      <Button type="submit" className="w-full">List Product</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Available Items</CardTitle>
                  <CardDescription>Recycled and upcycled products from the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card key={product.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                        <div className="aspect-video relative overflow-hidden bg-muted">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            className="object-cover w-full h-full hover:scale-105 transition-transform"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{product.title}</CardTitle>
                              <Badge variant="secondary" className="mt-2">{product.category}</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <p className="text-2xl font-bold text-primary">R{product.price}</p>
                              <p className="text-xs text-muted-foreground">by {product.seller}</p>
                            </div>
                            <Button size="sm" onClick={() => handleAddToCart(product)}>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Listings</CardTitle>
                  <CardDescription>Items you've listed for sale</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userListings.map((listing) => (
                      <div key={listing.id} className="flex items-center gap-4 p-4 border rounded-lg bg-gradient-to-r from-card to-card/50">
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">{listing.category} • R{listing.price}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                              {listing.status}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">{listing.views} views</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleEditClick(listing)}>Edit</Button>
                        </div>
                      </div>
                    ))}
                    {/* Edit Product Dialog: Only price and stock */}
                    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Edit Product</DialogTitle>
                          <DialogDescription>Update price and stock amount</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEditProduct} className="space-y-4">
                          <div>
                            <Label htmlFor="edit-price">Price (R)</Label>
                            <Input
                              id="edit-price"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={editForm.price}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-stock">Stock Amount</Label>
                            <Input
                              id="edit-stock"
                              type="number"
                              min="0"
                              step="1"
                              placeholder="1"
                              value={editForm.stock}
                              onChange={(e) => setEditForm((prev) => ({ ...prev, stock: Number(e.target.value) }))}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full">Save Changes</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {/* My Orders Section */}
              <Card>
                <CardHeader>
                  <CardTitle>My Orders</CardTitle>
                  <CardDescription>Items you have purchased</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <p className="text-center text-muted-foreground">You have no orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <div key={order.orderId} className="flex items-center gap-4 p-4 border rounded-lg bg-gradient-to-r from-card to-card/50">
                          <img 
                            src={order.image} 
                            alt={order.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{order.title}</h3>
                            <p className="text-sm text-muted-foreground">{order.category} • R{order.price} x {order.quantity}</p>
                            <p className="text-xs text-muted-foreground">Ordered on {new Date(order.orderedAt).toLocaleString()}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="secondary">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Marketplace;
