import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import CitizenDashboard from "./pages/CitizenDashboard";
import CollectorDashboard from "./pages/CollectorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ReportWaste from "./pages/citizen/ReportWaste";
import Scanner from "./pages/citizen/Scanner";
import Chatbot from "./pages/citizen/Chatbot";
import Quiz from "./pages/citizen/Quiz";
import Marketplace from "./pages/citizen/Marketplace";
import Rewards from "./pages/citizen/Rewards";
import AssignedAreas from "./pages/collector/AssignedAreas";
import LogCollection from "./pages/collector/LogCollection";
import SellRecyclables from "./pages/collector/SellRecyclables";
import Performance from "./pages/collector/Performance";
import WasteMap from "./pages/admin/WasteMap";
import Collectors from "./pages/admin/Collectors";
import Analytics from "./pages/admin/Analytics";
import MarketplaceModeration from "./pages/admin/MarketplaceModeration";
import Campaigns from "./pages/admin/Campaigns";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Citizen Routes */}
            <Route 
              path="/citizen" 
              element={
                <ProtectedRoute allowedRole="citizen">
                  <CitizenDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/citizen/report" 
              element={
                <ProtectedRoute allowedRole="citizen">
                  <ReportWaste />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/citizen/scanner" 
              element={
                <ProtectedRoute allowedRole="citizen">
                  <Scanner />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/citizen/chatbot" 
              element={
                <ProtectedRoute allowedRole="citizen">
                  <Chatbot />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/citizen/quiz" 
              element={
                <ProtectedRoute allowedRole="citizen">
                  <Quiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/citizen/marketplace" 
              element={
                <ProtectedRoute allowedRole="citizen">
                  <Marketplace />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/citizen/rewards" 
              element={
                <ProtectedRoute allowedRole="citizen">
                  <Rewards />
                </ProtectedRoute>
              } 
            />

            {/* Collector Routes */}
            <Route 
              path="/collector" 
              element={
                <ProtectedRoute allowedRole="collector">
                  <CollectorDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/collector/areas" 
              element={
                <ProtectedRoute allowedRole="collector">
                  <AssignedAreas />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/collector/log" 
              element={
                <ProtectedRoute allowedRole="collector">
                  <LogCollection />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/collector/sell" 
              element={
                <ProtectedRoute allowedRole="collector">
                  <SellRecyclables />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/collector/performance" 
              element={
                <ProtectedRoute allowedRole="collector">
                  <Performance />
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/map" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <WasteMap />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/collectors" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <Collectors />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/marketplace" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <MarketplaceModeration />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/campaigns" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <Campaigns />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/settings" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <Settings />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
