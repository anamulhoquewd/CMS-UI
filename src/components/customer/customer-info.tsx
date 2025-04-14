import { CustomerSchema } from "@/interface";
import {
  Calendar,
  Clock,
  Copy,
  KeyRound,
  MapPin,
  Phone,
  RefreshCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { shortToLong } from "@/utils/date-converter";
import { format } from "date-fns";
import { CardContent } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { PaymentStatusBadge } from "../dashboard/payment-status-badge";
import { PaymentSystemBadge } from "../dashboard/payment-system-badge";
import api from "@/protectedApi/Interceptor";
import { useEffect, useState } from "react";

export default function CustomerInfo({
  customer,
}: {
  customer: CustomerSchema;
}) {
  const [isExpired, setIsExpired] = useState(
    new Date(customer.accessKeyExpiredAt) < new Date()
  );

  useEffect(() => {
    const expired = new Date(customer.accessKeyExpiredAt) < new Date();
    setIsExpired(expired);
  }, [customer.accessKeyExpiredAt]);

  // Function to copy the access key to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRegenerateKey = async () => {
    try {
      const response = await api.post(
        `customers/regenerate-access-key?id=${customer._id}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }
      setIsExpired(false);
      console.log("Access key regenerated successfully");
    } catch (error) {
      console.log(
        "Error regenerating access key. The customer is: " + customer._id
      );
      console.error(error);
    }
  };

  return (
    <CardContent className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Personal Details
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-primary/5">
                  <span className="text-primary font-semibold text-lg">
                    {customer.name[0]}
                  </span>
                </div>

                <div>
                  <p className="font-medium">{customer.name}</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Customer ID:
                    </p>
                    <div className="flex items-center gap-2 flex-1">
                      <code className="px-2 py-1 bg-muted rounded text-xs font-mono truncate max-w-[180px]">
                        {customer._id.substring(0, 12)}...
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 cursor-pointer"
                              onClick={() =>
                                copyToClipboard(customer.accessKey)
                              }
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">Copy Customer ID</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy ID</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm pt-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{customer.address.substring(0, 20)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Customer since:
                  <span className="font-medium ml-2">
                    {format(new Date(customer.createdAt), "PPP")}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Access Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <KeyRound className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <p className="">Access Key</p>
                    <span className="flex items-center">
                      <code className="px-2 py-1 bg-muted rounded text-xs font-mono truncate max-w-[180px]">
                        {customer.accessKey.substring(0, 12)}...
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 cursor-pointer"
                              onClick={() =>
                                copyToClipboard(customer.accessKey)
                              }
                            >
                              <Copy className="h-3 w-3" />
                              <span className="sr-only">Copy access key</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy access key</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  Key Expires:
                  <span className="font-medium ml-2">
                    {format(new Date(customer.accessKeyExpiredAt), "PPP p")}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                <span>
                  Re-Generate Key:
                  <Button
                    variant={"outline"}
                    size={"sm"}
                    className="ml-2 cursor-pointer"
                    disabled={!isExpired}
                    onClick={() => {
                      if (isExpired) {
                        handleRegenerateKey();
                      } else {
                        console.log("Access key is not expired");
                      }
                    }}
                  >
                    Generate
                  </Button>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Preferences */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Order Preferences
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Default Item</p>
                <p className="font-medium capitalize">{customer.defaultItem}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Default Quantity
                </p>
                <p className="font-medium">{customer.defaultQuantity}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Default Price</p>
                <p className="font-medium">
                  {customer.defaultPrice.toFixed(2)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="hidden sm:block text-sm text-muted-foreground">
                  Default Off Days
                </p>
                <p className="sm:hidden text-sm text-muted-foreground">
                  Off Days
                </p>
                <p className="font-medium">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        className="cursor-pointer sm:hidden"
                        variant={"outline"}
                      >
                        Off Days
                      </Button>
                      <Button
                        className="cursor-pointer hidden sm:block"
                        variant={"outline"}
                      >
                        Default off Days
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Default Off Days</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {shortToLong(customer.defaultOffDays).length > 0 ? (
                        shortToLong(customer.defaultOffDays).map(
                          (element: string) => {
                            return (
                              <DropdownMenuItem
                                className="capitalize"
                                key={element}
                              >
                                {element}
                              </DropdownMenuItem>
                            );
                          }
                        )
                      ) : (
                        <DropdownMenuItem className="flex justify-center text-muted-foreground">
                          None
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Payment Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <div>
                  <PaymentStatusBadge status={customer.paymentStatus} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment System</p>
                <p className="font-medium capitalize">
                  <PaymentSystemBadge system={customer.paymentSystem} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
