import { Wallet, PiggyBank, CreditCard, Store, HandCoins, Home, Handshake, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  { icon: Wallet, label: "Checking", href: "#" },
  { icon: PiggyBank, label: "Savings", href: "#" },
  { icon: CreditCard, label: "Credit Card", href: "#" },
  { icon: Store, label: "Small Business", href: "#" },
  { icon: HandCoins, label: "Loans", href: "#" },
  { icon: Home, label: "Mortgage", href: "#" },
  { icon: Handshake, label: "Premier Banking", href: "#" },
  { icon: Sprout, label: "Investments", href: "#" },
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
          <Button variant="outline" data-testid="button-view-all-products">
            View all products
          </Button>
        </div>
      </div>
    </section>
  );
}
