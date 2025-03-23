"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Bell, Mail, MessageSquare, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const notificationFormSchema = z.object({
  emailNotifications: z.object({
    newOrder: z.boolean().default(true),
    orderStatusChange: z.boolean().default(true),
    lowInventory: z.boolean().default(true),
    newCustomer: z.boolean().default(false),
    productReview: z.boolean().default(false),
  }),
  inAppNotifications: z.object({
    newOrder: z.boolean().default(true),
    orderStatusChange: z.boolean().default(true),
    lowInventory: z.boolean().default(true),
    newCustomer: z.boolean().default(true),
    productReview: z.boolean().default(true),
  }),
  emailSettings: z.object({
    senderName: z.string().min(1, {
      message: "Sender name is required.",
    }),
    senderEmail: z.string().email({
      message: "Please enter a valid email address.",
    }),
    replyToEmail: z
      .string()
      .email({
        message: "Please enter a valid email address.",
      })
      .optional(),
    emailSignature: z.string().optional(),
  }),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

const defaultValues: NotificationFormValues = {
  emailNotifications: {
    newOrder: true,
    orderStatusChange: true,
    lowInventory: true,
    newCustomer: false,
    productReview: false,
  },
  inAppNotifications: {
    newOrder: true,
    orderStatusChange: true,
    lowInventory: true,
    newCustomer: true,
    productReview: true,
  },
  emailSettings: {
    senderName: "Your Company",
    senderEmail: "notifications@yourcompany.com",
    replyToEmail: "support@yourcompany.com",
    emailSignature: "Thank you,\nThe Your Company Team",
  },
};

export function NotificationSettings() {
  const [activeTab, setActiveTab] = useState("email");

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues,
  });

  function onSubmit(data: NotificationFormValues) {
    console.log(" Data", data);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure how you receive notifications.
        </p>
      </div>

      <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="email">
            <Mail className="mr-2 h-4 w-4" />
            Email Notifications
          </TabsTrigger>
          <TabsTrigger value="inapp">
            <Bell className="mr-2 h-4 w-4" />
            In-App Notifications
          </TabsTrigger>
          <TabsTrigger value="settings">
            <MessageSquare className="mr-2 h-4 w-4" />
            Email Settings
          </TabsTrigger>
        </TabsList>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="email" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>
                    Configure which emails you want to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="emailNotifications.newOrder"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New Order</FormLabel>
                          <FormDescription>
                            Receive an email when a new order is placed.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailNotifications.orderStatusChange"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Order Status Change
                          </FormLabel>
                          <FormDescription>
                            Receive an email when an order status changes.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailNotifications.lowInventory"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Low Inventory
                          </FormLabel>
                          <FormDescription>
                            Receive an email when product inventory is low.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailNotifications.newCustomer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            New Customer
                          </FormLabel>
                          <FormDescription>
                            Receive an email when a new customer registers.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailNotifications.productReview"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Product Review
                          </FormLabel>
                          <FormDescription>
                            Receive an email when a product receives a review.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Email Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="inapp" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>In-App Notifications</CardTitle>
                  <CardDescription>
                    Configure which in-app notifications you want to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="inAppNotifications.newOrder"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">New Order</FormLabel>
                          <FormDescription>
                            Receive a notification when a new order is placed.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inAppNotifications.orderStatusChange"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Order Status Change
                          </FormLabel>
                          <FormDescription>
                            Receive a notification when an order status changes.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inAppNotifications.lowInventory"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Low Inventory
                          </FormLabel>
                          <FormDescription>
                            Receive a notification when product inventory is
                            low.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inAppNotifications.newCustomer"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            New Customer
                          </FormLabel>
                          <FormDescription>
                            Receive a notification when a new customer
                            registers.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="inAppNotifications.productReview"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Product Review
                          </FormLabel>
                          <FormDescription>
                            Receive a notification when a product receives a
                            review.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save In-App Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Email Settings</CardTitle>
                  <CardDescription>
                    Configure your email notification settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="emailSettings.senderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The name that will appear as the sender of
                          notification emails.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailSettings.senderEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sender Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          The email address that will be used to send
                          notifications.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailSettings.replyToEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reply-To Email</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>
                          The email address that recipients can reply to.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailSettings.emailSignature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Signature</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            value={field.value || ""}
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormDescription>
                          The signature that will be added to the end of
                          notification emails.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Email Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
