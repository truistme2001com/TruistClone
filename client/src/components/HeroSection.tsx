import { Button } from "@/components/ui/button";
import heroImage from "@assets/hero-truist-person.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[500px] h-[600px] md:h-[650px] flex items-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 w-full">
        <div className="max-w-2xl">
          <p className="text-base md:text-lg lg:text-xl text-foreground mb-2 font-medium" data-testid="text-hero-badge">
            New checking customer offer
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 leading-tight" data-testid="text-hero-title">
            Earn $400 with Truist One Checking.
          </h1>
          <p className="text-sm md:text-base lg:text-lg text-foreground mb-6 md:mb-8" data-testid="text-hero-subtitle">
            Must open online and complete qualifying activities.<sup>1</sup>
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg"
              className="bg-primary text-white hover:bg-primary/90"
              data-testid="button-get-offer"
              asChild
            >
              <a href="https://www.truist.com/checking/open-checking" target="_blank" rel="noopener noreferrer">
                Get offer
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
