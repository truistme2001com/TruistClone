import { Button } from "@/components/ui/button";

export function VideoSection() {
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
              className="relative aspect-video rounded-xl overflow-hidden"
              data-testid="container-video"
            >
              <iframe 
                src="https://fast.wistia.net/embed/iframe/lmuw3qp9vl" 
                title="Truist Video"
                allow="autoplay; fullscreen" 
                allowFullScreen
                className="w-full h-full absolute top-0 left-0"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
