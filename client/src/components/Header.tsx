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
                  <div className="absolute left-0 top-full mt-2 w-[1000px] bg-white shadow-xl rounded-lg p-8 border border-border">
                    <div className="grid grid-cols-4 gap-8">
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
                      <div className="bg-[#B8D8D8] rounded-lg p-6">
                        <p className="text-lg font-semibold text-[#2D1B4E] mb-4">Can't get to the bank? No problem.</p>
                        <p className="text-sm text-[#2D1B4E] mb-4">Truist One Digital Banking makes it easy to take care of everything—online or in the app.</p>
                        <a href="https://www.truist.com/digital-banking" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2D1B4E] underline hover:no-underline font-medium">See how it works.</a>
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
                  <div className="absolute left-0 top-full mt-2 w-[800px] bg-white shadow-xl rounded-lg p-8 border border-border">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <h3 className="font-semibold text-foreground mb-4">Our products</h3>
                        <div className="space-y-3">
                          <a href="https://www.truist.com/credit-cards" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Credit cards</a>
                          <a href="https://www.truist.com/credit-cards/enjoy-cash" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist Enjoy Cash</a>
                          <a href="https://www.truist.com/credit-cards/enjoy-travel" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist Enjoy Travel</a>
                          <a href="https://www.truist.com/credit-cards/future-card" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist Future Card</a>
                          <a href="https://www.truist.com/credit-cards/enjoy-beyond" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist Enjoy Beyond</a>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-4">&nbsp;</h3>
                        <div className="space-y-3 mt-7">
                          <a href="https://www.truist.com/credit-cards/enjoy-cash-secured" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Truist Enjoy Cash (secured)</a>
                        </div>
                        <h3 className="font-semibold text-foreground mb-4 mt-8">Offers</h3>
                        <div className="space-y-3">
                          <a href="https://www.truist.com/credit-cards/check-for-offers" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Check for Offers</a>
                        </div>
                      </div>
                      <div className="bg-[#B8D8D8] rounded-lg p-6">
                        <p className="text-lg font-semibold text-[#2D1B4E] mb-4">Nights out and weekend getaways, upgraded.</p>
                        <p className="text-sm text-[#2D1B4E] mb-4">Perks. Rewards. Status. Sometimes you just want a little more.</p>
                        <a href="https://www.truist.com/credit-cards/enjoy-beyond" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2D1B4E] underline hover:no-underline font-medium">Go Beyond ordinary.</a>
                      </div>
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
                  <div className="absolute left-0 top-full mt-2 w-[600px] bg-white shadow-xl rounded-lg p-8 border border-border">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <a href="https://www.truist.com/loans" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">View all loans</a>
                        <a href="https://www.truist.com/loans/home-equity" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Home equity</a>
                        <a href="https://www.truist.com/loans/personal-loans" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Personal loans</a>
                        <a href="https://www.lightstream.com" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">LightStream</a>
                        <a href="https://www.truist.com/loans/auto-loans" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Auto loans</a>
                      </div>
                      <div className="bg-[#B8D8D8] rounded-lg p-6">
                        <p className="text-lg font-semibold text-[#2D1B4E] mb-4">Turn possibilities into reality.</p>
                        <p className="text-sm text-[#2D1B4E] mb-4">From home improvements to debt consolidation, find the right loan for your needs.</p>
                        <a href="https://www.truist.com/loans" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2D1B4E] underline hover:no-underline font-medium">Explore loan options.</a>
                      </div>
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
                  <div className="absolute left-0 top-full mt-2 w-[600px] bg-white shadow-xl rounded-lg p-8 border border-border">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <a href="https://www.truist.com/mortgage" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Mortgage overview</a>
                        <a href="https://www.truist.com/mortgage/home-purchase" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Buy a home</a>
                        <a href="https://www.truist.com/mortgage/refinance" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Refinance</a>
                        <a href="https://www.truist.com/mortgage/rates" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Mortgage rates</a>
                        <a href="https://www.truist.com/mortgage/calculator" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Mortgage calculator</a>
                      </div>
                      <div className="bg-[#B8D8D8] rounded-lg p-6">
                        <p className="text-lg font-semibold text-[#2D1B4E] mb-4">Your dream home awaits.</p>
                        <p className="text-sm text-[#2D1B4E] mb-4">Whether you're buying or refinancing, we're here to help every step of the way.</p>
                        <a href="https://www.truist.com/mortgage" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2D1B4E] underline hover:no-underline font-medium">Start your journey.</a>
                      </div>
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
                  <div className="absolute left-0 top-full mt-2 w-[600px] bg-white shadow-xl rounded-lg p-8 border border-border">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <a href="https://www.truist.com/investing-and-retirement" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Investment services overview</a>
                        <a href="https://www.truist.com/wealth/investment-management" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Investment management</a>
                        <a href="https://www.truist.com/retirement-planning" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Retirement planning</a>
                        <a href="https://www.truist.com/wealth/wealth-planning" target="_blank" rel="noopener noreferrer" className="block text-sm text-foreground hover:text-primary">Wealth planning</a>
                      </div>
                      <div className="bg-[#B8D8D8] rounded-lg p-6">
                        <p className="text-lg font-semibold text-[#2D1B4E] mb-4">Plan for tomorrow, today.</p>
                        <p className="text-sm text-[#2D1B4E] mb-4">Build a strategy for a confident financial future with our investment and retirement services.</p>
                        <a href="https://www.truist.com/investing-and-retirement" target="_blank" rel="noopener noreferrer" className="text-sm text-[#2D1B4E] underline hover:no-underline font-medium">Learn more.</a>
                      </div>
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
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('openaccount')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Button 
                className="hidden md:flex bg-primary text-white hover:bg-primary/90"
                data-testid="button-open-account"
              >
                Open Account <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              {activeDropdown === 'openaccount' && (
                <div className="absolute right-0 top-full mt-2 w-[280px] bg-white shadow-xl rounded-lg border border-border overflow-hidden">
                  <div className="py-2">
                    <a href="https://www.truist.com/open-account/featured" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 text-sm text-[#5D2A8F] hover:bg-purple-50 transition-colors">
                      <span className="font-medium">Featured accounts</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </a>
                    <Link href="/open-account">
                      <a className="flex items-center justify-between px-4 py-3 text-sm text-[#5D2A8F] hover:bg-purple-50 transition-colors w-full" data-testid="link-banking-accounts">
                        <span className="font-medium">Banking accounts</span>
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </a>
                    </Link>
                    <a href="https://www.truist.com/savings" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 text-sm text-[#5D2A8F] hover:bg-purple-50 transition-colors">
                      <span className="font-medium">Savings accounts</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </a>
                    <a href="https://www.truist.com/credit-cards" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 text-sm text-[#5D2A8F] hover:bg-purple-50 transition-colors">
                      <span className="font-medium">Credit cards</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </a>
                    <a href="https://www.truist.com/loans" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 text-sm text-[#5D2A8F] hover:bg-purple-50 transition-colors">
                      <span className="font-medium">Loans</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </a>
                    <a href="https://www.truist.com/mortgage" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 text-sm text-[#5D2A8F] hover:bg-purple-50 transition-colors">
                      <span className="font-medium">Mortgages</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </a>
                    <a href="https://www.truist.com/small-business" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 text-sm text-[#5D2A8F] hover:bg-purple-50 transition-colors">
                      <span className="font-medium">Small Business</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </a>
                    <a href="https://www.truist.com/investing-and-retirement" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 text-sm text-[#5D2A8F] hover:bg-purple-50 transition-colors">
                      <span className="font-medium">Investments</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </a>
                    <a href="https://www.truist.com/wealth" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 text-sm text-[#5D2A8F] hover:bg-purple-50 transition-colors">
                      <span className="font-medium">Wealth</span>
                      <ChevronDown className="w-4 h-4 -rotate-90" />
                    </a>
                  </div>
                </div>
              )}
            </div>
            
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
