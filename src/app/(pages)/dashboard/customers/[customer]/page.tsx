import Index from "@/components/customer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers Management | Manage and analyze customers",
  description: "Manage and analyze customers",
};

export default function SingleCustomer() {
  return (
    <div className="flex flex-col gap-4">
      <Index />
    </div>
  );
}
