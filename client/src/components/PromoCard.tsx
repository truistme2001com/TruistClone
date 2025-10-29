import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PromoCardProps {
  title: string;
  subtitle: string;
  description: string;
  learnMoreHref?: string;
  actionHref?: string;
  actionText?: string;
  badge?: string;
  image?: string;
  variant?: "default" | "image";
  testId?: string;
}

export function PromoCard({
  title,
  subtitle,
  description,
  learnMoreHref = "#",
  actionHref = "#",
  actionText = "Open now",
  badge,
  image,
  variant = "default",
  testId = "promo-card",
}: PromoCardProps) {
  if (variant === "image" && image) {
    return (
      <div className="relative rounded-xl overflow-hidden group" data-testid={testId}>
        <img 
          src={image} 
          alt={title}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2" data-testid={`text-${testId}-title`}>{title}</h3>
          <h4 className="text-lg font-semibold mb-3" data-testid={`text-${testId}-subtitle`}>{subtitle}</h4>
          <p className="mb-4 text-white/90" data-testid={`text-${testId}-description`}>{description}</p>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="bg-white/90 backdrop-blur-sm border-white text-primary"
              data-testid={`button-${testId}-action`}
            >
              {actionText}
            </Button>
            <Button 
              variant="outline"
              className="bg-transparent backdrop-blur-sm border-white text-white"
              data-testid={`button-${testId}-learn-more`}
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="shadow-lg hover-elevate" data-testid={testId}>
      <CardHeader className="space-y-2">
        {badge && (
          <div className="text-sm font-semibold text-primary" data-testid={`text-${testId}-badge`}>
            {badge}
          </div>
        )}
        <CardTitle className="text-xl text-foreground" data-testid={`text-${testId}-title`}>
          {title}
        </CardTitle>
        <CardDescription className="text-lg font-semibold text-foreground" data-testid={`text-${testId}-subtitle`}>
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground" data-testid={`text-${testId}-description`}>
          {description}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button data-testid={`button-${testId}-action`}>{actionText}</Button>
          <Button variant="outline" data-testid={`button-${testId}-learn-more`}>Learn more</Button>
        </div>
      </CardContent>
    </Card>
  );
}
