import { Button } from "@/components/ui/button";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <svg className="w-32 h-8" viewBox="0 0 120 30" fill="none">
                <text x="0" y="22" className="text-2xl font-bold fill-primary">Truist</text>
              </svg>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-personal">Personal</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-small-business">Small Business</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-commercial">Commercial</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-wealth">Wealth</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-about">About Truist</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex" data-testid="button-search">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="hidden md:flex" data-testid="button-locations">Find Locations</Button>
            <Button variant="outline" className="hidden md:flex" data-testid="button-contact">Contact Us</Button>
            
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
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-personal">Personal</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-small-business">Small Business</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-commercial">Commercial</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-wealth">Wealth</a>
              <a href="#" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-about">About Truist</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
