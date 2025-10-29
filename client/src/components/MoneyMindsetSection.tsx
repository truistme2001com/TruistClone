import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import savingsImage from "@assets/generated_images/Woman_savings_goals_jars_86c92ee3.png";
import sideHustleImage from "@assets/generated_images/Side_hustle_workspace_6deb6720.png";

export function MoneyMindsetSection() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary" data-testid="text-mindset-title">
            Money and Mindset
          </h2>
          <p className="text-xl text-foreground mb-2" data-testid="text-mindset-subtitle">
            Reach your goals. Feel good doing it.
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-mindset-description">
            It's time to upgrade your money mindset. Learn new skills, change your point of view, and take control of your finances.
          </p>
          <Button variant="outline" className="mt-6" data-testid="button-view-mindset">
            View Money and Mindset
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="overflow-hidden hover-elevate" data-testid="card-super-saver">
            <img 
              src={savingsImage} 
              alt="Super saver"
              className="w-full h-56 object-cover"
            />
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Your guide to becoming a super saver
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4" data-testid="text-super-saver-description">
                When it comes to saving, it's OK to put yourself first. Because when you build money habits that align to your unique goals, it makes for a smoother and more rewarding journey.
              </p>
              <a href="#" className="text-primary font-medium hover:underline" data-testid="link-super-saver">
                Read more →
              </a>
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover-elevate" data-testid="card-side-hustle">
            <img 
              src={sideHustleImage} 
              alt="Side hustle"
              className="w-full h-56 object-cover"
            />
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                7 tips for starting a side hustle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4" data-testid="text-side-hustle-description">
                Can you turn your skills into new income? These tips can help you start your side hustle journey.
              </p>
              <a href="#" className="text-primary font-medium hover:underline" data-testid="link-side-hustle">
                Go for it →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
