export function Footer() {
  return (
    <footer className="bg-[#2D1B4E] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Top Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm border-b border-white/20 pb-8">
          <a href="https://www.truist.com/privacy" className="text-white/90 hover:text-white hover:underline transition-colors">Privacy</a>
          <a href="#" className="text-white/90 hover:text-white hover:underline transition-colors">Limit the use of my sensitive personal information</a>
          <a href="#" className="text-white/90 hover:text-white hover:underline transition-colors">Fraud & security</a>
          <a href="#" className="text-white/90 hover:text-white hover:underline transition-colors">Terms and conditions</a>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-white mb-4">Banking products</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.truist.com/checking/truist-one-banking" className="text-white/80 hover:text-white hover:underline transition-colors">Checking</a></li>
              <li><a href="https://www.truist.com/commercial-corporate-institutional" className="text-white/80 hover:text-white hover:underline transition-colors">Commercial</a></li>
              <li><a href="https://www.truist.com/credit-cards" className="text-white/80 hover:text-white hover:underline transition-colors">Credit cards</a></li>
              <li><a href="https://www.truist.com/loans" className="text-white/80 hover:text-white hover:underline transition-colors">Loans</a></li>
              <li><a href="https://www.truist.com/mortgage" className="text-white/80 hover:text-white hover:underline transition-colors">Mortgage</a></li>
              <li><a href="https://www.truist.com/digital-banking" className="text-white/80 hover:text-white hover:underline transition-colors">Online & mobile</a></li>
              <li><a href="https://www.truist.com/open-account" className="text-white/80 hover:text-white hover:underline transition-colors">Open an account</a></li>
              <li><a href="https://www.truist.com/savings" className="text-white/80 hover:text-white hover:underline transition-colors">Savings</a></li>
              <li><a href="https://www.truist.com/small-business" className="text-white/80 hover:text-white hover:underline transition-colors">Small business</a></li>
              <li><a href="https://www.truist.com/wealth" className="text-white/80 hover:text-white hover:underline transition-colors">Wealth</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">About Truist</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.truist.com/who-we-are/about-truist" className="text-white/80 hover:text-white hover:underline transition-colors">About us</a></li>
              <li><a href="https://www.truist.com/unstoppable" className="text-white/80 hover:text-white hover:underline transition-colors">Knowledge and Care</a></li>
              <li><a href="https://www.truist.com/purpose/community" className="text-white/80 hover:text-white hover:underline transition-colors">Community</a></li>
              <li><a href="https://www.truist.com/purpose" className="text-white/80 hover:text-white hover:underline transition-colors">Purpose</a></li>
              <li><a href="https://www.truist.com/content/truist-bank/us/en/purpose/truist-foundation" className="text-white/80 hover:text-white hover:underline transition-colors">Truist Foundation</a></li>
              <li><a href="https://www.truistleadershipinstitute.com/" className="text-white/80 hover:text-white hover:underline transition-colors">Truist Leadership Institute</a></li>
              <li><a href="https://www.truist.com/commercial-corporate-institutional/investment-banking" className="text-white/80 hover:text-white hover:underline transition-colors">Truist Securities</a></li>
              <li><a href="https://www.truist.com/who-we-are/truist-ventures/about-us" className="text-white/80 hover:text-white hover:underline transition-colors">Truist Ventures</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://careers.truist.com/us/en" className="text-white/80 hover:text-white hover:underline transition-colors">Careers</a></li>
              <li><a href="https://www.truist.com/purpose/cra" className="text-white/80 hover:text-white hover:underline transition-colors">Community Reinvestment Act</a></li>
              <li><a href="https://www.truist.com/corporate-responsibility-sustainability" className="text-white/80 hover:text-white hover:underline transition-colors">Corporate Responsibility & Sustainability</a></li>
              <li><a href="https://www.truist.com/who-we-are/belonging" className="text-white/80 hover:text-white hover:underline transition-colors">Belonging</a></li>
              <li><a href="https://www.truist.com/facts-about-banking" className="text-white/80 hover:text-white hover:underline transition-colors">Facts about banking</a></li>
              <li><a href="https://www.truist.com/fdic" className="text-white/80 hover:text-white hover:underline transition-colors">FDIC Insurance</a></li>
              <li><a href="https://ir.truist.com/" className="text-white/80 hover:text-white hover:underline transition-colors">Investor relations</a></li>
              <li><a href="https://www.truist.com/money-mindset" className="text-white/80 hover:text-white hover:underline transition-colors">Money and Mindset</a></li>
              <li><a href="https://media.truist.com/" className="text-white/80 hover:text-white hover:underline transition-colors">Newsroom</a></li>
              <li><a href="https://www.truist.com/who-we-are/suppliers" className="text-white/80 hover:text-white hover:underline transition-colors">Suppliers</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.truist.com/accessibility" className="text-white/80 hover:text-white hover:underline transition-colors">Accessibility</a></li>
              <li><a href="https://www.truist.com/contact#" className="text-white/80 hover:text-white hover:underline transition-colors">Client emergency resources</a></li>
              <li><a href="https://www.truist.com/payment-relief/personal-loans" className="text-white/80 hover:text-white hover:underline transition-colors">Consumer payment relief hub</a></li>
              <li><a href="https://www.truist.com/finder" className="text-white/80 hover:text-white hover:underline transition-colors">Find a banker or advisor</a></li>
              <li><a href="https://www.truist.com/locations" className="text-white/80 hover:text-white hover:underline transition-colors">Find a branch or ATM</a></li>
              <li><a href="https://www.truist.com/contact" className="text-white/80 hover:text-white hover:underline transition-colors">Help Center</a></li>
              <li><a href="https://truistconsumerbank.my.site.com/s/" className="text-white/80 hover:text-white hover:underline transition-colors">Schedule a branch appointment</a></li>
              <li><a href="#" className="text-white/80 hover:text-white hover:underline transition-colors">844-4TRUIST (844-487-8478)</a></li>
              <li><a href="https://www.truist.com/privacy#" className="text-white/80 hover:text-white hover:underline transition-colors">AdChoices</a></li>
              <li><a href="https://privacyportal.onetrust.com/webform/cccaa63d-8471-45fc-9ef6-ffa187576844/727cbfbd-56ce-406e-905e-69b9693e04f9" className="text-white/80 hover:text-white hover:underline transition-colors">Do not sell or share my personal information</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center gap-6 mb-8 border-t border-white/20 pt-8">
          <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Twitter">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="LinkedIn">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Facebook">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="YouTube">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
          <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Instagram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-white/70">
          <p>© 2025 Truist Financial Corporation. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
