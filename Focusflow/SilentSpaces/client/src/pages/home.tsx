import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Coffee, Users } from "lucide-react";
import ZoneCard from "@/components/zone-card";
import PresenceBoard from "@/components/presence-board";
import CheckInModal from "@/components/check-in-modal";
import type { Zone } from "@shared/schema";

export default function Home() {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const { data: zones = [], isLoading: zonesLoading } = useQuery<Zone[]>({
    queryKey: ["/api/zones"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: presence = [] } = useQuery({
    queryKey: ["/api/presence"],
    refetchInterval: 10000, // Refresh every 10 seconds for real-time feel
  });

  const totalUsers = presence.reduce((sum: number, zone: any) => sum + zone.count, 0);

  const handleJoinZone = (zone: Zone) => {
    setSelectedZone(zone);
    setIsCheckInOpen(true);
  };

  const handleCheckIn = () => {
    setIsCheckInOpen(true);
    setSelectedZone(null);
  };

  return (
    <div className="bg-off-white min-h-screen">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-coffee rounded-lg flex items-center justify-center">
                <Coffee className="text-white h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold coffee">Focus Flow</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-2 text-sm text-soft-gray">
                <div className="w-2 h-2 bg-green-400 rounded-full presence-dot"></div>
                <span>{totalUsers} coworkers online</span>
              </div>
              <Button onClick={handleCheckIn} className="bg-coffee hover:bg-coffee/90">
                <Users className="w-4 h-4 mr-2" />
                Check In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cream to-off-white py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="coffee ml-3">Focus Zone</span>
          </h2>
          <p className="text-lg md:text-xl text-soft-gray mb-8 max-w-2xl mx-auto leading-relaxed">
            Join a curated coworking experience with ambient sounds, live presence, and distraction-free focus spaces designed for deep work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-coffee text-white hover:bg-coffee/90 px-8 py-3 rounded-xl font-medium shadow-lg"
              onClick={() => document.getElementById('zones')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Browse Zones
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-coffee text-coffee hover:bg-coffee hover:text-white px-8 py-3 rounded-xl font-medium"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Zone Selection */}
      <section id="zones" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Choose Your Vibe</h3>
          <p className="text-soft-gray text-lg max-w-2xl mx-auto">
            Each zone offers a unique ambiance with curated background audio to enhance your focus and productivity.
          </p>
        </div>

        {zonesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {zones.map((zone) => (
              <ZoneCard 
                key={zone.id} 
                zone={zone} 
                onJoin={handleJoinZone}
                presence={presence.find((p: any) => p.zoneId === zone.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Live Presence Board */}
      <PresenceBoard zones={zones} presence={presence} />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-coffee rounded-lg flex items-center justify-center">
                  <Coffee className="text-white h-4 w-4" />
                </div>
                <h4 className="text-xl font-bold coffee">Focus Flow</h4>
              </div>
              <p className="text-soft-gray text-sm leading-relaxed max-w-md">
                A minimalist virtual coworking experience that helps you find focus through ambient soundscapes and community presence.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Quick Links</h5>
              <ul className="space-y-2 text-sm text-soft-gray">
                <li><a href="#zones" className="hover:text-coffee transition-colors">Browse Zones</a></li>
                <li><a href="#presence" className="hover:text-coffee transition-colors">Presence Board</a></li>
                <li><a href="#" className="hover:text-coffee transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-coffee transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Support</h5>
              <ul className="space-y-2 text-sm text-soft-gray">
                <li><a href="#" className="hover:text-coffee transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-coffee transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-coffee transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-coffee transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 mt-8 text-center text-sm text-soft-gray">
            <p>&copy; 2024 Focus Flow. Developed by @sathvik.shetty</p>
            <p className="mt-2">Made with care for focused minds everywhere.</p>
          </div>
        </div>
      </footer>

      <CheckInModal 
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        zones={zones}
        selectedZone={selectedZone}
      />
    </div>
  );
}
