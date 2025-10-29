import { Button } from "@/components/ui/button";
import heroImage from "@assets/hero-truist-person.jpg";

export function HeroSection() {
  return (
    <section className="relative h-[600px] md:h-[650px] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 w-full">
        <div className="max-w-2xl">
          <p className="text-lg md:text-xl text-foreground mb-2 font-medium" data-testid="text-hero-badge">
            New checking customer offer
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4" data-testid="text-hero-title">
            Earn $400 with Truist One Checking.
          </h1>
          <p className="text-base md:text-lg text-foreground mb-8" data-testid="text-hero-subtitle">
            Must open online and complete qualifying activities.<sup>1</sup>
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-primary text-white hover:bg-primary/90"
              data-testid="button-get-offer"
            >
              Get offer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
