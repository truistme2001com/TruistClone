import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { LoginForm } from "@/components/LoginForm";
import { ProductCarousel } from "@/components/ProductCarousel";
import { PromoCard } from "@/components/PromoCard";
import { MobileAppSection } from "@/components/MobileAppSection";
import { VideoSection } from "@/components/VideoSection";
import { NFLSection } from "@/components/NFLSection";
import { MoneyMindsetSection } from "@/components/MoneyMindsetSection";
import { Footer } from "@/components/Footer";
import trickortreatImage from "@assets/generated_images/Kids_trick-or-treating_Halloween_33a4af10.png";
import homeImage from "@assets/generated_images/Modern_family_home_exterior_c68486de.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative">
        <HeroSection />
        
        {/* Login Form - Desktop Only, Fixed Position */}
        <div className="hidden lg:block fixed top-20 right-8 w-80 z-40">
          <LoginForm />
        </div>
      </div>

      {/* Mobile Login - Show below hero on mobile */}
      <div className="lg:hidden px-4 py-8 bg-muted/50">
        <LoginForm />
      </div>

      {/* Rate Banner */}
      <div className="bg-accent/30 border-y border-border py-4">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-center text-foreground">
            Special introductory variable rate as low as <span className="font-bold text-primary">Prime minus 1.51%</span> for 9 months from the date of account opening. Currently <span className="font-bold">5.99% APR</span>.
            <sup className="text-primary">2,3</sup> After the 9 months, the rate will be the standard approved variable rate, currently ranging between 7.50% to 14.85% APR.
          </p>
        </div>
      </div>

      <ProductCarousel />

      {/* Promotional Sections */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <PromoCard
              badge="Truist One Money Market Account"
              title="Maximize your savings."
              subtitle=""
              description="With a Truist One Money Market account, keep your savings growing while having easy access."
              actionText="Open now"
              testId="money-market"
            />
            <PromoCard
              badge="LightStream unsecured loan"
              title="Explore the possibilities."
              subtitle=""
              description="Consolidate debt, improve your home, or manage big expenses with a low fixed-rate loan—and no fees. Good-to-excellent credit required."
              actionText="Apply now"
              testId="lightstream"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <PromoCard
              title="Truist One Checking"
              subtitle="No tricks, just treats. Like no overdraft fees."
              description="Plus, eligible clients enjoy a balance buffer for some extra cushion."
              variant="image"
              image={trickortreatImage}
              actionText="Open now"
              testId="checking"
            />
            <PromoCard
              title="Home Equity Lending"
              subtitle="Turn your home's equity into opportunity."
              description="Remodel, invest, or take care of big expenses."
              variant="image"
              image={homeImage}
              actionText="Apply now"
              testId="home-equity"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <PromoCard
              badge="Credit card offers"
              title="A great credit card may be waiting for you."
              subtitle=""
              description="Cash back, travel rewards, or our lowest APR. You could find the credit card that fits just right—in minutes."
              actionText="Check for offers"
              testId="credit-offers"
            />
            <PromoCard
              badge="Fraud and Security"
              title="Be careful where you click."
              subtitle=""
              description="Make sure links are legitimate before you click. Sometimes it's hard to tell. Find out what to look for."
              actionText="Learn to spot scams"
              testId="fraud-security"
            />
          </div>

          <div className="mt-8">
            <PromoCard
              badge="Small Business Money Market Account"
              title="Kickstart cash reserves"
              subtitle=""
              description="Eligible clients can earn a 3.50% annual percentage yield (APY) with a new Truist Business Money Market account."
              actionText="Learn more"
              showLearnMore={false}
              testId="small-business-mm"
            />
          </div>
        </div>
      </section>

      <MobileAppSection />
      <VideoSection />
      <NFLSection />
      <MoneyMindsetSection />
      <Footer />
    </div>
  );
}
