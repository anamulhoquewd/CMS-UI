import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function AlertDestructive({
  error = "Alert",
  message = "Alert message",
}: {
  error: string;
  message: string;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{error}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export default AlertDestructive;