import { Button } from "@/components/ui/button";
import { Menu, Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      {/* Top navigation bar */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="text-foreground hover:text-primary" data-testid="link-top-personal">Personal</a>
              <a href="#" className="text-foreground hover:text-primary" data-testid="link-top-small-business">Small Business</a>
              <a href="#" className="text-foreground hover:text-primary" data-testid="link-top-wealth">Wealth</a>
              <a href="#" className="text-foreground hover:text-primary" data-testid="link-top-commercial">Commercial, Corporate & Institutional</a>
            </nav>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-foreground hover:text-primary" data-testid="link-top-search">Search</a>
              <a href="#" className="text-foreground hover:text-primary" data-testid="link-top-locations">Locations</a>
              <a href="#" className="text-foreground hover:text-primary" data-testid="link-top-contact">Contact</a>
              <a href="#" className="text-foreground hover:text-primary" data-testid="link-top-espanol">Español</a>
              <a href="#" className="text-foreground hover:text-primary flex items-center gap-1" data-testid="link-top-more">
                More <ChevronDown className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <svg className="w-24 h-8" viewBox="0 0 100 30" fill="none">
                <text x="0" y="22" className="text-2xl font-bold fill-primary">TRUIST</text>
              </svg>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-1">
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-checking-savings">
                Checking & savings <ChevronDown className="w-4 h-4" />
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-credit-cards">
                Credit cards <ChevronDown className="w-4 h-4" />
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-loans">
                Loans <ChevronDown className="w-4 h-4" />
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-mortgage">
                Mortgage <ChevronDown className="w-4 h-4" />
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-investing">
                Investing & retirement <ChevronDown className="w-4 h-4" />
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-premier-banking">
                Premier Banking
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-money-mindset">
                Money and Mindset <ChevronDown className="w-4 h-4" />
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              className="hidden md:flex bg-primary text-white hover:bg-primary/90"
              data-testid="button-open-account"
            >
              Open Account <ChevronDown className="w-4 h-4 ml-1" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-checking">Checking & savings</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-credit-cards">Credit cards</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-loans">Loans</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-mortgage">Mortgage</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-investing">Investing & retirement</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
