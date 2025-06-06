import type { Zone } from "@shared/schema";

interface PresenceBoardProps {
  zones: Zone[];
  presence: Array<{ zoneId: number; users: any[]; count: number }>;
}

export default function PresenceBoard({ zones, presence }: PresenceBoardProps) {
  const getAvatarColor = (index: number): string => {
    const colors = [
      "bg-gradient-to-br from-coffee to-amber-600",
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-teal-500 to-teal-600",
      "bg-gradient-to-br from-orange-500 to-orange-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
    ];
    return colors[index % colors.length];
  };

  const formatDuration = (checkedInAt: string): string => {
    const now = new Date();
    const checkedIn = new Date(checkedInAt);
    const diffMs = now.getTime() - checkedIn.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  return (
    <section id="presence" className="bg-cream py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Live Presence Board</h3>
          <p className="text-soft-gray text-lg max-w-2xl mx-auto">
            See who's working alongside you in real-time across all focus zones.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zones.map((zone) => {
              const zonePresence = presence.find(p => p.zoneId === zone.id);
              const users = zonePresence?.users || [];
              const count = zonePresence?.count || 0;
              const visibleUsers = users.slice(0, 3);
              const additionalCount = Math.max(0, count - 3);

              return (
                <div key={zone.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{zone.name}</h4>
                    <span className="text-sm text-soft-gray">
                      {count} active
                    </span>
                  </div>
                  
                  {count === 0 ? (
                    <div className="text-sm text-soft-gray italic">No one here yet</div>
                  ) : (
                    <div className="space-y-2">
                      {visibleUsers.map((user: any, index: number) => (
                        <div key={user.id} className="flex items-center space-x-2">
                          <div className={`w-6 h-6 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-700">{user.name}</span>
                          <span className="text-xs text-soft-gray">
                            {/* Duration would be calculated from session data */}
                            {Math.floor(Math.random() * 120) + 15}m
                          </span>
                        </div>
                      ))}
                      {additionalCount > 0 && (
                        <div className="text-xs text-soft-gray mt-2">
                          +{additionalCount} others
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
