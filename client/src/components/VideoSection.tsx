import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary" data-testid="text-video-title">
              Let your light shine.
            </h2>
            <p className="text-xl text-foreground mb-8" data-testid="text-video-description">
              Hit all the right notes with someone by your side who knows a lot and cares even more.
            </p>
            <Button size="lg" data-testid="button-unstoppable">
              Start feeling unstoppable
            </Button>
          </div>

          <div className="relative group">
            <div 
              className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => setIsPlaying(!isPlaying)}
              data-testid="container-video"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {!isPlaying && (
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-white ml-1" fill="white" />
                  </div>
                )}
              </div>
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
                  Video Playing...
                </div>
              )}
            </div>
            <p className="mt-4 text-sm text-muted-foreground" data-testid="text-video-duration">
              Duration: 0:30
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
