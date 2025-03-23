import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RoleType = "admin" | "manager" | "super_admin" | "user";

interface RoleBadgeProps {
  role: RoleType;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        role === "admin" && "border-green-500 text-green-500",
        role === "manager" && "border-blue-500 text-blue-500",
        role === "super_admin" && "border-red-500 text-red-500"
      )}
    >
      {role}
    </Badge>
  );
}
