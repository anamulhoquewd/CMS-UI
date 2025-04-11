import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PaymentStatusType = "paid" | "partially_paid" | "pending";

interface PaymentStatusBadgeProps {
  status: PaymentStatusType;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        status === "paid" && "border-green-500 text-green-500",
        status === "pending" && "border-blue-500 text-blue-500",
        status === "partially_paid" && "border-yellow-500 text-yellow-500"
      )}
    >
      {status}
    </Badge>
  );
}
