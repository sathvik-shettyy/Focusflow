import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { getIconForZone } from "@/lib/youtube";
import type { Zone } from "@shared/schema";

interface ZoneCardProps {
  zone: Zone;
  onJoin: (zone: Zone) => void;
  presence?: { count: number; users: any[] };
}

export default function ZoneCard({ zone, onJoin, presence }: ZoneCardProps) {
  const IconComponent = getIconForZone(zone.icon);
  const colorClass = getColorClass(zone.color);

  return (
    <div className="zone-card bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center`}>
            <IconComponent className="text-lg" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{zone.name}</h4>
            <p className="text-sm text-soft-gray">
              {getZoneSubtitle(zone.name)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full presence-dot"></div>
          <span className="text-sm font-medium text-soft-gray">
            {presence?.count || zone.activeUsers}
          </span>
        </div>
      </div>
      
      <div className="youtube-container mb-4 rounded-lg overflow-hidden">
        <iframe 
          src={zone.youtubeUrl}
          title={`${zone.name} Ambiance`}
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      
      <p className="text-sm text-soft-gray mb-4">{zone.description}</p>
      
      <div className="flex space-x-2">
        <Button 
          onClick={() => onJoin(zone)}
          className="flex-1 bg-coffee text-white hover:bg-coffee/90 font-medium"
        >
          Join Zone
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-soft-gray hover:text-coffee"
        >
          <Play className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function getColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    slate: "bg-slate-100 text-slate-600",
    purple: "bg-purple-100 text-purple-600",
    gray: "bg-gray-100 text-gray-600",
  };
  return colorMap[color] || "bg-gray-100 text-gray-600";
}

function getZoneSubtitle(name: string): string {
  const subtitleMap: Record<string, string> = {
    "Coffee Shop": "Bustling café vibes",
    "Silent Library": "Pure focus mode",
    "Forest Retreat": "Natural calm",
    "Rainy Day": "Cozy indoors",
    "Lo-Fi Beats": "Chill vibes",
    "White Noise": "Pure focus",
  };
  return subtitleMap[name] || "Focus zone";
}
