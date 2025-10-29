import { Button } from "@/components/ui/button";
import { Menu, Search, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      {/* Top navigation bar - Deep purple background */}
      <div className="bg-[#2D1B4E] text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-end h-10">
            <div className="flex items-center gap-6 text-sm">
              <a href="https://www.truist.com/search" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/90 transition-colors" data-testid="link-top-search">Search</a>
              <a href="https://www.truist.com/locations" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/90 transition-colors" data-testid="link-top-locations">Locations</a>
              <a href="https://www.truist.com/contact-us" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/90 transition-colors" data-testid="link-top-contact">Contact</a>
              <a href="https://www.truist.com/espanol" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/90 transition-colors" data-testid="link-top-espanol">Español</a>
              <a href="#" className="text-white hover:text-white/90 transition-colors flex items-center gap-1" data-testid="link-top-more">
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
            <Link href="/" className="flex items-center" data-testid="link-home">
              <svg className="h-8" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Truist T+ Icon */}
                <g>
                  <rect x="0" y="4" width="24" height="24" rx="3" fill="#5D2A8F"/>
                  <path d="M6 10 L18 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M12 10 L12 22" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="19" cy="19" r="1.8" fill="white"/>
                </g>
                
                {/* TRUIST Text */}
                <text x="30" y="21" style={{
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                  fontSize: '18px',
                  fontWeight: '700',
                  fill: '#2D1B4E',
                  letterSpacing: '0.3px'
                }}>TRUIST</text>
              </svg>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('checking')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-checking-savings">
                  Checking & savings <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'checking' && (
                  <div className="absolute left-0 top-full mt-2 w-[800px] bg-white shadow-xl rounded-lg p-8 border border-border">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <h3 className="font-semibold text-foreground mb-4">Checking</h3>
                        <div className="space-y-3">
                          <a href="https://www.truist.com/checking/truist-one-checking" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist One Checking</a>
                          <a href="https://www.truist.com/checking/truist-confidence-account" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist Confidence Account</a>
                          <a href="https://www.truist.com/debit-cards" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Visa® Debit cards</a>
                          <a href="https://www.truist.com/gift-cards" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Visa® Gift card</a>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-4">Savings</h3>
                        <div className="space-y-3">
                          <a href="https://www.truist.com/savings" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">View all savings options</a>
                          <a href="https://www.truist.com/savings/truist-one-savings" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist One Savings</a>
                          <a href="https://www.truist.com/savings/money-market-account" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist One Money Market Account</a>
                          <a href="https://www.truist.com/savings/certificate-of-deposit" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist CDs</a>
                          <a href="https://www.truist.com/savings/truist-confidence-savings" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist Confidence Savings</a>
                        </div>
                        <h3 className="font-semibold text-foreground mb-4 mt-6">Additional services</h3>
                        <div className="space-y-3">
                          <a href="https://www.truist.com/health-savings-account" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Health Savings Account (HSA)</a>
                          <a href="https://www.truist.com/personal-insurance" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Personal Insurance</a>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-4">Banking services</h3>
                        <div className="space-y-3">
                          <a href="https://www.truist.com/premier-banking" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Premier banking</a>
                          <a href="https://www.truist.com/digital-banking" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Online & mobile banking</a>
                          <a href="https://www.truist.com/zelle" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Zelle®</a>
                          <a href="https://www.truist.com/paze" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Paze℠</a>
                          <a href="https://www.truist.com/checking/set-up-account" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Setting up your Truist Checking Account</a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('creditcards')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-credit-cards">
                  Credit cards <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'creditcards' && (
                  <div className="absolute left-0 top-full mt-2 w-[400px] bg-white shadow-xl rounded-lg p-8 border border-border">
                    <div className="space-y-3">
                      <a href="https://www.truist.com/credit-cards" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">View all credit cards</a>
                      <a href="https://www.truist.com/credit-cards/cash-rewards" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Cash Rewards</a>
                      <a href="https://www.truist.com/credit-cards/enjoy-travel" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Travel Rewards</a>
                      <a href="https://www.truist.com/credit-cards/balance-transfer" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Balance Transfer</a>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('loans')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-loans">
                  Loans <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'loans' && (
                  <div className="absolute left-0 top-full mt-2 w-[400px] bg-white shadow-xl rounded-lg p-8 border border-border">
                    <div className="space-y-3">
                      <a href="https://www.truist.com/loans" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">View all loans</a>
                      <a href="https://www.truist.com/loans/home-equity" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Home equity</a>
                      <a href="https://www.truist.com/loans/personal-loans" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Personal loans</a>
                      <a href="https://www.lightstream.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">LightStream</a>
                      <a href="https://www.truist.com/loans/auto-loans" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Auto loans</a>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('mortgage')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-mortgage">
                  Mortgage <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'mortgage' && (
                  <div className="absolute left-0 top-full mt-2 w-[400px] bg-white shadow-xl rounded-lg p-8 border border-border">
                    <div className="space-y-3">
                      <a href="https://www.truist.com/mortgage" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Mortgage overview</a>
                      <a href="https://www.truist.com/mortgage/home-purchase" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Buy a home</a>
                      <a href="https://www.truist.com/mortgage/refinance" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Refinance</a>
                      <a href="https://www.truist.com/mortgage/rates" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Mortgage rates</a>
                      <a href="https://www.truist.com/mortgage/calculator" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Mortgage calculator</a>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('investing')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md flex items-center gap-1" data-testid="link-investing">
                  Investing & retirement <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'investing' && (
                  <div className="absolute left-0 top-full mt-2 w-[400px] bg-white shadow-xl rounded-lg p-8 border border-border">
                    <div className="space-y-3">
                      <a href="https://www.truist.com/investing-and-retirement" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Investment services overview</a>
                      <a href="https://www.truist.com/wealth/investment-management" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Investment management</a>
                      <a href="https://www.truist.com/retirement-planning" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Retirement planning</a>
                      <a href="https://www.truist.com/wealth/wealth-planning" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Wealth planning</a>
                    </div>
                  </div>
                )}
              </div>

              <a href="https://www.truist.com/premier-banking" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-premier-banking">
                Premier Banking
              </a>
              
              <a href="https://www.truist.com/money-and-mindset" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-money-mindset">
                Money and Mindset
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              className="hidden md:flex bg-primary text-white hover:bg-primary/90"
              data-testid="button-open-account"
              asChild
            >
              <a href="https://www.truist.com/open-account" target="_blank" rel="noopener noreferrer">
                Open Account <ChevronDown className="w-4 h-4 ml-1" />
              </a>
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border" data-testid="mobile-menu">
            <nav className="flex flex-col gap-2">
              <a href="https://www.truist.com/checking" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-checking">Checking and savings</a>
              <a href="https://www.truist.com/credit-cards" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-credit-cards">Credit cards</a>
              <a href="https://www.truist.com/loans" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-loans">Loans</a>
              <a href="https://www.truist.com/mortgage" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-mortgage">Mortgage</a>
              <a href="https://www.truist.com/investing-and-retirement" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground hover-elevate px-3 py-2 rounded-md" data-testid="link-mobile-investing">Investing and retirement</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
