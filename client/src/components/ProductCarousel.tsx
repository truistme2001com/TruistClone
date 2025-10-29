import { Wallet, PiggyBank, CreditCard, Store, HandCoins, Home, Handshake, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  { icon: Wallet, label: "Checking", href: "https://www.truist.com/checking" },
  { icon: PiggyBank, label: "Savings", href: "https://www.truist.com/savings" },
  { icon: CreditCard, label: "Credit Card", href: "https://www.truist.com/credit-cards" },
  { icon: Store, label: "Small Business", href: "https://www.truist.com/small-business" },
  { icon: HandCoins, label: "Loans", href: "https://www.truist.com/loans" },
  { icon: Home, label: "Mortgage", href: "https://www.truist.com/mortgage" },
  { icon: Handshake, label: "Premier Banking", href: "https://www.truist.com/premier-banking" },
  { icon: Sprout, label: "Investments", href: "https://www.truist.com/investing-and-retirement" },
];

export function ProductCarousel() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground" data-testid="text-products-title">
          What can we help you with?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <a
                key={index}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-4 rounded-lg hover-elevate active-elevate-2 group"
                data-testid={`link-product-${product.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-accent">
                  <Icon className="w-8 h-8 text-primary" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium text-center text-foreground">
                  {product.label}
                </span>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <Button variant="outline" data-testid="button-view-all-products" asChild>
            <a href="https://www.truist.com/personal-banking" target="_blank" rel="noopener noreferrer">
              View all products
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
