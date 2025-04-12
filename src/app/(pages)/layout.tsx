import { AppSidebar } from "@/components/dashboard/app-sidebar";
import Header from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider className="flex" defaultOpen={false}>
        <Header />
        <AppSidebar />
        <main className="flex-1 mx-4 mt-20 w-0">{children}</main>
      </SidebarProvider>
    </>
  );
}
