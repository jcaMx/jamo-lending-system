import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "warning" | "danger" | "success";
}

export function StatCard({ title, value, icon: Icon, description, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "border-l-4 border-l-gold",
    warning: "border-l-4 border-l-warning",
    danger: "border-l-4 border-l-destructive",
    success: "border-l-4 border-l-success",
  };

  const iconStyles = {
    default: "text-gold bg-gold/10",
    warning: "text-warning bg-warning/10",
    danger: "text-destructive bg-destructive/10",
    success: "text-success bg-success/10",
  };

  return (
    <Card className={cn("shadow-sm transition-shadow hover:shadow-md", variantStyles[variant])}>
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", iconStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
