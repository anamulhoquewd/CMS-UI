import Index from "@/components/order";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders Management | Manage and analyze orders",
  description: "Manage and analyze orders",
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-4">
      <Index />
    </div>
  );
}
