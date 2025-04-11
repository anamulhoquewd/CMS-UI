import Index from "@/components/customers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers Management | Manage and analyze customers",
  description: "Manage and analyze customers",
};

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-4">
      <Index />
    </div>
  );
}
