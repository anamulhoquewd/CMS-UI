import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRegistrationForm } from "@/components/settings/user-registration-form";
import { CustomerRegistrationForm } from "@/components/settings/customer-registration-form";
import { OrderRegistrationForm } from "@/components/settings/order-registration-form";
import { PaymentIntegrationForm } from "@/components/settings/payment-integration-form";
import { ProductManagement } from "@/components/settings/product-management";
import { CategoryManagement } from "@/components/settings/category-management";
import { DiscountManagement } from "@/components/settings/discount-management";
import { ReportGeneration } from "@/components/settings/report-generation";
import { NotificationSettings } from "@/components/settings/notification-settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your application settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your application settings and configurations.
        </p>
      </div>
      <Tabs defaultValue="user-registration" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="user-registration">User Registration</TabsTrigger>
          <TabsTrigger value="customer-registration">
            Customer Registration
          </TabsTrigger>
          <TabsTrigger value="order-registration">
            Order Registration
          </TabsTrigger>
          <TabsTrigger value="payment-integration">
            Payment Integration
          </TabsTrigger>
          <TabsTrigger value="product-management">
            Product Management
          </TabsTrigger>
          <TabsTrigger value="category-management">
            Category Management
          </TabsTrigger>
          <TabsTrigger value="discount-management">
            Discounts & Promotions
          </TabsTrigger>
          <TabsTrigger value="report-generation">Reports</TabsTrigger>
          <TabsTrigger value="notification-settings">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="user-registration" className="space-y-4">
          <UserRegistrationForm />
        </TabsContent>
        <TabsContent value="customer-registration" className="space-y-4">
          <CustomerRegistrationForm />
        </TabsContent>
        <TabsContent value="order-registration" className="space-y-4">
          <OrderRegistrationForm />
        </TabsContent>
        <TabsContent value="payment-integration" className="space-y-4">
          <PaymentIntegrationForm />
        </TabsContent>
        <TabsContent value="product-management" className="space-y-4">
          <ProductManagement />
        </TabsContent>
        <TabsContent value="category-management" className="space-y-4">
          <CategoryManagement />
        </TabsContent>
        <TabsContent value="discount-management" className="space-y-4">
          <DiscountManagement />
        </TabsContent>
        <TabsContent value="report-generation" className="space-y-4">
          <ReportGeneration />
        </TabsContent>
        <TabsContent value="notification-settings" className="space-y-4">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
