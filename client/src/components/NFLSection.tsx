import { Button } from "@/components/ui/button";
import nflPlayer1 from "@assets/generated_images/NFL_player_Bradley_Chubb_730d41b4.png";
import nflPlayer2 from "@assets/generated_images/NFL_player_Bijan_Robinson_a4e2666f.png";

export function NFLSection() {
  return (
    <>
      {/* Beyond the Field Banner */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-lg">
            {/* Left side - Purple background with text */}
            <div className="bg-[#2D1B4E] text-white p-12 md:p-16 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  Beyond the<br />Field
                </h2>
              </div>
            </div>
            
            {/* Right side - Light background with content */}
            <div className="bg-gray-100 p-12 md:p-16 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <svg className="w-16 h-10" viewBox="0 0 80 50">
                  <text x="0" y="35" className="text-2xl font-bold fill-[#2D1B4E]">TRUIST</text>
                </svg>
                <svg className="w-12 h-12" viewBox="0 0 48 48">
                  <rect width="48" height="48" fill="#013369" rx="4"/>
                  <text x="24" y="32" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">NFL</text>
                </svg>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                See the power of care.
              </h3>
              
              <p className="text-gray-700 mb-8 text-base">
                Football players are known for their expertise on the field. But what about in their communities? See how Bradley Chubb and Bijan Robinson use their knowledge and care to support local kids in Miami and Atlanta.
              </p>
              
              <div>
                <Button 
                  className="bg-[#2D1B4E] hover:bg-[#3D2B5E] text-white px-8"
                  data-testid="button-beyond-field-banner"
                >
                  Watch Beyond the Field
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NFL Players Section */}
      <section className="py-16 md:py-20 bg-accent/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-8">
            <svg className="w-16 h-16" viewBox="0 0 64 64">
              <rect width="64" height="64" fill="#013369" rx="8"/>
              <text x="32" y="40" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">NFL</text>
            </svg>
            <span className="text-3xl font-bold text-muted-foreground">×</span>
            <svg className="w-32 h-16" viewBox="0 0 120 60">
              <text x="60" y="40" textAnchor="middle" className="text-3xl font-bold fill-primary">Truist</text>
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground" data-testid="text-nfl-title">
            See the power of care.
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto" data-testid="text-nfl-description">
            Football players are known for their expertise on the field. But what about in their communities? See how Bradley Chubb and Bijan Robinson use their knowledge and care to support local kids in Miami and Atlanta.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src={nflPlayer1} 
                alt="Bradley Chubb"
                className="w-full h-96 object-cover"
                data-testid="img-player-bradley-chubb"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-bold text-white">Bradley Chubb</h3>
                <p className="text-white/90">Miami Community Leader</p>
              </div>
            </div>

            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src={nflPlayer2} 
                alt="Bijan Robinson"
                className="w-full h-96 object-cover"
                data-testid="img-player-bijan-robinson"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-bold text-white">Bijan Robinson</h3>
                <p className="text-white/90">Atlanta Community Leader</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" data-testid="button-beyond-field">
              Watch Beyond the Field
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
