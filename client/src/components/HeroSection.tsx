import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Kids_jumping_in_lake_a684c46f.png";

export function HeroSection() {
  return (
    <section className="relative h-[600px] md:h-[650px] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/20"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 w-full">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4" data-testid="text-hero-title">
            Truist One Checking
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8" data-testid="text-hero-subtitle">
            No overdraft fees. Practical perks. Automatic upgrades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-white/90 backdrop-blur-sm border-white text-primary"
              data-testid="button-learn-more"
            >
              Learn more
            </Button>
            <Button 
              size="lg"
              data-testid="button-open-now"
            >
              Open now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
