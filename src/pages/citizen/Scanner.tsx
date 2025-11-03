import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { CitizenSidebar } from '@/components/CitizenSidebar';
import { LogOut, Camera, Upload, Volume2, Languages, ScanLine, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const wasteClasses = {
  en: ['Plastic', 'Paper', 'Metal', 'Glass', 'Organic', 'E-waste'],
  zu: ['Ipulasitiki', 'Iphepha', 'Insimbi', 'Ingilazi', 'Okwemvelo', 'I-e-waste'],
  af: ['Plastiek', 'Papier', 'Metaal', 'Glas', 'Organies', 'E-afval'],
};

// Map Hugging Face classifications to our waste categories
const classificationMap = {
  'cardboard': 'Paper',
  'glass': 'Glass',
  'metal': 'Metal',
  'paper': 'Paper',
  'plastic': 'Plastic',
  'trash': 'Organic'
};

const wasteDetails = {
  Plastic: {
    description: "Recyclable plastic container",
    disposal: "Yellow recycling bin",
    icon: "♻️",
    color: "#3498db",
    tips: ["Rinse before recycling", "Remove caps and lids", "Flatten containers to save space"],
    features: ["Varied colors", "Smooth texture", "Manufactured shapes"]
  },
  Paper: {
    description: "Paper or cardboard material",
    disposal: "Blue recycling bin",
    icon: "📄",
    color: "#e74c3c",
    tips: ["Flatten cardboard boxes", "Remove any plastic packaging", "Keep dry and clean"],
    features: ["White/light colors", "Fibrous texture", "Rectangular forms"]
  },
  Metal: {
    description: "Metal can or container",
    disposal: "Green recycling bin",
    icon: "🥫",
    color: "#95a5a6",
    tips: ["Rinse cans before recycling", "Remove paper labels if possible", "Crush aluminum cans to save space"],
    features: ["High reflectivity", "Silvery tones", "Smooth surfaces"]
  },
  Glass: {
    description: "Glass bottle or jar",
    disposal: "Purple glass bin",
    icon: "🍾",
    color: "#9b59b6",
    tips: ["Rinse thoroughly", "Remove metal caps and lids", "Don't mix with other recyclables"],
    features: ["Transparency", "Smoothness", "Blue-green tints"]
  },
  Organic: {
    description: "Food waste or compostable material",
    disposal: "Brown compost bin",
    icon: "🍎",
    color: "#27ae60",
    tips: ["No plastic in compost", "Collect in compostable bags", "Mix with yard waste"],
    features: ["Natural colors", "Irregular shapes", "Rough textures"]
  },
  "E-waste": {
    description: "Electronic waste or batteries",
    disposal: "Special e-waste facility",
    icon: "🔋",
    color: "#f39c12",
    tips: ["Never put in regular bins", "Check for drop-off locations", "Remove batteries if possible"],
    features: ["Complex shapes", "Mixed materials", "Metallic components"]
  }
};

const Scanner = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [showScanAnimation, setShowScanAnimation] = useState(false);
  const [currentStep, setCurrentStep] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Function to convert image to base64
  const imageToBase64 = (imageElement: HTMLVideoElement | HTMLImageElement): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    if (imageElement instanceof HTMLVideoElement) {
      canvas.width = imageElement.videoWidth || 300;
      canvas.height = imageElement.videoHeight || 300;
    } else if (imageElement instanceof HTMLImageElement) {
      canvas.width = imageElement.width || 300;
      canvas.height = imageElement.height || 300;
    } else {
      canvas.width = 300;
      canvas.height = 300;
    }
    
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // Function to classify using Hugging Face API
  const classifyWithHuggingFace = async (imageBase64: string) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/vit-base-patch16-224",
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: imageBase64,
          options: {
            wait_for_model: true
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    return await response.json();
  };

  // MOCK MODE: set to true to use mock scan results
  const MOCK_SCAN = true;
  const mockCategories = [
    'Plastic',
    'Paper',
    'Metal',
    'Glass',
    'Organic',
    'E-waste'
  ];
  const analyzeWasteWithAI = async (imageSource: 'camera' | 'upload') => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      setShowScanAnimation(true);
      setScanProgress(0);
      setCurrentStep('Initializing...');

      // MOCK: Always return Plastic for plastic bottle scanning
      if (MOCK_SCAN) {
        setTimeout(() => {
          setScanProgress(80);
          setCurrentStep('Processing results...');
          const detectedClass = 'Plastic';
          const confidence = 95; // High confidence for plastic bottle
          const wasteInfo = (wasteDetails as any)[detectedClass] || {};
          setResult({
            type: detectedClass,
            confidence,
            points: Math.floor(confidence / 10) + 5,
            description: wasteInfo.description || 'Unknown waste type',
            disposal: wasteInfo.disposal || 'General waste bin',
            icon: wasteInfo.icon || '❓',
            color: wasteInfo.color || '#888',
            tips: wasteInfo.tips || [],
            features: wasteInfo.features || [],
          });
          setShowScanAnimation(false);
          setLoading(false);
        }, 1200);
        return;
      }

      // ...existing code for real API call...
    } catch (err) {
      console.error('AI Classification error:', err);
      setError(err instanceof Error ? err.message : 'Classification failed');
      setLoading(false);
      setShowScanAnimation(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'environment'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStarted(true);
        setError(null);
        setUploadedImage(null);
      }
    } catch (err) {
      setError('Camera access denied');
      toast.error('Failed to access camera');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraStarted(false);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const logDisposal = () => {
    if (result) {
      toast.success(`Disposal logged: ${result.type} → ${result.disposal}`);
      setResult(null);
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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
              <div className="mb-4 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/30 rounded-xl p-4 shadow-sm">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent flex items-center gap-2">
                  <Camera className="w-8 h-8 text-primary" />
                  AI Waste Scanner
                </h2>
                <p className="text-muted-foreground mt-2">Use AI to identify waste and get proper disposal instructions</p>
              </div>

              <Card className="border-primary/30 bg-gradient-to-br from-card via-primary/10 to-primary/5 shadow-xl hover:shadow-2xl transition-all">
                <CardHeader>
                  <CardTitle>Scan Your Waste</CardTitle>
                  <CardDescription>Upload or capture an image to identify waste type and get disposal guidance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {error && (
                      <div className="flex items-center gap-2 bg-destructive/10 text-destructive rounded-lg p-4">
                        <AlertCircle className="w-5 h-5" />
                        <p>{error}</p>
                      </div>
                    )}

                    <div className="relative border-2 border-dashed border-border rounded-lg p-4 aspect-video overflow-hidden bg-background/50 max-w-md mx-auto">
                      {uploadedImage ? (
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded waste item" 
                          className="scan-preview-image w-full h-full object-contain"
                        />
                      ) : cameraStarted ? (
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline 
                          muted
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
                          <Camera className="w-12 h-12" />
                          <p>Start camera or upload an image to begin scanning</p>
                        </div>
                      )}

                      {showScanAnimation && (
                        <div className="absolute inset-0 bg-primary/5">
                          <div 
                            className="absolute left-0 w-full h-0.5 bg-primary/50 transition-all duration-300 shadow-lg"
                            style={{ top: `${scanProgress}%` }}
                          >
                            <ScanLine className="absolute -top-4 left-1/2 -translate-x-1/2 text-primary animate-pulse" />
                          </div>
                          <div className="absolute bottom-4 left-4 bg-background/90 rounded-lg p-2 text-sm flex items-center gap-2">
                            <span>{currentStep}</span>
                            <span className="text-primary">{scanProgress}%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                      <Button
                        onClick={startCamera}
                        disabled={cameraStarted || !!uploadedImage || loading}
                        className="min-w-[150px]"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {cameraStarted ? 'Camera Active' : 'Start Camera'}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="min-w-[150px]"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>

                      {(cameraStarted || uploadedImage) && (
                        <Button
                          variant="default"
                          onClick={() => analyzeWasteWithAI(cameraStarted ? 'camera' : 'upload')}
                          disabled={loading}
                          className="min-w-[150px]"
                        >
                          <ScanLine className="w-4 h-4 mr-2" />
                          {loading ? 'Analyzing...' : 'Scan with AI'}
                        </Button>
                      )}

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    {result && (
                      <div className={`mt-6 rounded-lg border-2 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4`}
                           style={{ borderColor: result.color }}>
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-full text-2xl" style={{ backgroundColor: `${result.color}20` }}>
                            {result.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold" style={{ color: result.color }}>
                              {result.type} → {result.disposal}
                            </h3>
                            <p className="text-sm text-primary">+{result.points} points earned!</p>
                          </div>
                        </div>

                        <div className="grid gap-4 p-4 rounded-lg bg-muted/50">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Confidence:</span>
                            <span className="font-medium">{result.confidence}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Description:</span>
                            <span className="font-medium">{result.description}</span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Material Features</h4>
                            <ul className="space-y-1">
                              {result.features.map((feature: string, index: number) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Disposal Tips</h4>
                            <ul className="space-y-1">
                              {result.tips.map((tip: string, index: number) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <Button 
                          onClick={logDisposal}
                          className="w-full"
                          variant="default"
                        >
                          Log Disposal (+{result.points} points)
                        </Button>
                      </div>
                    )}

                    {!result && !loading && (
                      <div className="rounded-lg bg-muted/30 p-6 space-y-6">
                        <h3 className="text-lg font-medium">How to Use AI Waste Scanner</h3>
                        <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                          <li>Take a photo or upload an image of your waste item</li>
                          <li>Our AI will analyze and classify the material type</li>
                          <li>Follow the disposal instructions</li>
                          <li>Earn points for proper waste disposal</li>
                        </ol>

                        <div className="bg-warning/20 border-l-4 border-warning p-4 rounded-r-lg">
                          <h4 className="font-medium text-warning mb-2">For Best Results</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>Ensure good lighting</li>
                            <li>Hold camera steady</li>
                            <li>Get close to the item</li>
                            <li>Use a plain background</li>
                          </ul>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          {[
                            { icon: '🥤', label: 'Plastic' },
                            { icon: '📦', label: 'Paper' },
                            { icon: '🥫', label: 'Metal' },
                            { icon: '🍾', label: 'Glass' }
                          ].map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background/80">
                              <span className="text-2xl">{item.icon}</span>
                              <span className="text-sm">{item.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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

export default Scanner;