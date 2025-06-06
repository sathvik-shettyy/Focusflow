import { 
  Coffee, 
  Book, 
  Leaf, 
  CloudRain, 
  Music, 
  Waves,
  Volume2
} from "lucide-react";

export function getIconForZone(iconName: string) {
  const iconMap: Record<string, any> = {
    coffee: Coffee,
    book: Book,
    leaf: Leaf,
    "cloud-rain": CloudRain,
    music: Music,
    "wave-square": Waves,
  };
  
  return iconMap[iconName] || Volume2;
}

export function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function createYouTubeEmbedUrl(videoId: string, options: {
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  modestbranding?: boolean;
} = {}): string {
  const params = new URLSearchParams();
  
  if (options.autoplay) params.append('autoplay', '1');
  if (options.loop) params.append('loop', '1');
  if (options.controls !== false) params.append('controls', '1');
  if (options.modestbranding) params.append('modestbranding', '1');
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
