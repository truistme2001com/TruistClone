export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Personal Banking</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-checking">Checking</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-savings">Savings</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-credit-cards">Credit Cards</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-loans">Loans</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-mortgage">Mortgage</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Business Banking</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-small-business">Small Business</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-commercial">Commercial</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-corporate">Corporate & Investment</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">About Truist</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-our-story">Our Story</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-careers">Careers</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-news">News & Insights</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-investor">Investor Relations</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-contact">Contact Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-locations">Find Locations</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-security">Security Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary" data-testid="link-footer-help">Help & Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 space-y-4">
          <div className="text-xs text-muted-foreground space-y-2">
            <p>
              <sup>1</sup> Eligible clients include new Truist Business Money Market accounts opened between April 1, 2025 and June 30, 2025.
            </p>
            <p>
              <sup>2</sup> Annual Percentage Yield (APY) accurate as of October 29, 2025. Rates are variable and subject to change.
            </p>
            <p>
              <sup>3</sup> After the promotional period, the rate will be the standard approved variable rate. Excellent credit required.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground pt-4">
            <div className="flex items-center gap-4">
              <span>Truist Bank, Member FDIC.</span>
              <div className="w-12 h-8 bg-muted-foreground/20 rounded flex items-center justify-center text-xs font-bold">
                FDIC
              </div>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary" data-testid="link-footer-privacy">Privacy</a>
              <a href="#" className="hover:text-primary" data-testid="link-footer-legal">Legal</a>
              <a href="#" className="hover:text-primary" data-testid="link-footer-accessibility">Accessibility</a>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center md:text-left">
            © 2025 Truist Financial Corporation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
