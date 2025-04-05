import Index from "@/components/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Manage and analyze your business",
  description: "Manage and analyze your business",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <Index />
    </div>
  );
}
