import { Button } from "@/components/ui/button";
import nflPlayer1 from "@assets/generated_images/NFL_player_Bradley_Chubb_730d41b4.png";
import nflPlayer2 from "@assets/generated_images/NFL_player_Bijan_Robinson_a4e2666f.png";

export function NFLSection() {
  return (
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
  );
}
