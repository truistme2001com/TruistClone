import appMockup from "@assets/generated_images/Banking_mobile_app_mockup_64163d74.png";
import { Button } from "@/components/ui/button";

export function MobileAppSection() {
  return (
    <section className="py-16 md:py-20 bg-accent/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground" data-testid="text-app-title">
              Crystal clear—created with care.
            </h2>
            <h3 className="text-2xl font-semibold mb-6 text-primary" data-testid="text-app-subtitle">
              Meet the Truist app.
            </h3>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-app-description">
              Get super-fast access to your accounts and bright insights into your spending with our mobile app.
            </p>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                <div className="w-32 h-32 bg-foreground rounded-md flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full p-2">
                    <rect x="0" y="0" width="100" height="100" fill="white"/>
                    <rect x="20" y="20" width="20" height="20" fill="black"/>
                    <rect x="60" y="20" width="20" height="20" fill="black"/>
                    <rect x="20" y="60" width="20" height="20" fill="black"/>
                    <rect x="60" y="60" width="20" height="20" fill="black"/>
                  </svg>
                </div>
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  Scan to download
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="h-auto px-0"
                  data-testid="button-app-store"
                >
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="w-6 h-6 bg-foreground rounded"></div>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-sm font-semibold">App Store</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto px-0"
                  data-testid="button-google-play"
                >
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="w-6 h-6 bg-foreground rounded"></div>
                    <div className="text-left">
                      <div className="text-xs">GET IT ON</div>
                      <div className="text-sm font-semibold">Google Play</div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 flex justify-center">
            <img 
              src={appMockup} 
              alt="Truist Mobile App"
              className="w-full max-w-sm rounded-3xl shadow-2xl"
              data-testid="img-app-mockup"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
