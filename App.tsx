import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./context/SettingsContext"; // 👈 Ушул маанилүү
import Index from "./pages/Index";
import MapPage from "./pages/MapPage";
import SavedPage from "./pages/SavedPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <TooltipProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
          <Toaster />
          <Sonner />
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;