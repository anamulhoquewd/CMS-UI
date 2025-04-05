"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DialogFooter } from "@/components/ui/dialog";

export default function RegistrationForm({
  form,
  onSubmit,
  isLoading,
  values,
  isEditing,
}: {
  values: any;
  form: any;
  onSubmit: any;
  isLoading: boolean;
  isEditing: boolean;
}) {
  // Reset form with default values of the customer. it's for editing purpose.
  useEffect(() => {
    if (values) {
      form.reset(values);
    }
  }, [values, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full px-1"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Anamul Hoque" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Email</FormLabel>
              <FormControl>
                <Input placeholder="anam@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="01987654321" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Address</FormLabel>
              <FormControl>
                <Input placeholder="House: 1, Road: 1, Block: A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="NID"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">National ID</FormLabel>
              <FormControl>
                <Input placeholder="1234567890" {...field} />
              </FormControl>
              <FormDescription>10 or 17 digits</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select payment system" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="admin">
                    Admin
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="manager">
                    Manager
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="cursor-pointer">Account Status</FormLabel>
                <FormDescription>
                  Account will be active and ready for use immediately after
                  registration
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  className="cursor-pointer"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" className="cursor-pointer" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isEditing ? (
              "Update"
            ) : (
              "Register"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
