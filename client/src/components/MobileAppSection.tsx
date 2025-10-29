import appMockup from "@assets/generated_images/Banking_mobile_app_mockup_64163d74.png";
import qrCode from "@assets/Screenshot 2025-10-29 at 10.19.05 AM_1761747565477.png";
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
                <img 
                  src={qrCode} 
                  alt="Scan to download Truist app"
                  className="w-32 h-32 rounded-md"
                />
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
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
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
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
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
