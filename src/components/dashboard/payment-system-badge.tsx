import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PaymentSystemType = "monthly" | "weekly";

interface PaymentSystemBadgeProps {
  system: PaymentSystemType;
}

export function PaymentSystemBadge({ system }: PaymentSystemBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        system === "monthly" && "border-blue-500 text-blue-500",
        system === "weekly" && "border-green-500 text-green-500"
      )}
    >
      {system}
    </Badge>
  );
}
