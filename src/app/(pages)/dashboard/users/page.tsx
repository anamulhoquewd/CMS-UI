import Index from "@/components/user";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Management | Manage and analyze users",
  description: "Manage and analyze users",
};

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <Index />
    </div>
  );
}
