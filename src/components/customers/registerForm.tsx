"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DialogFooter } from "@/components/ui/dialog";
import { shortToLong } from "@/utils/date-converter";

const days = [
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
];

export default function RegistrationForm({
  form,
  onSubmit,
  isLoading,
  values,
  isEditing,
}: {
  values: any;
  isEditing: boolean;
  form: any;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [daysPopoverOpen, setDaysPopoverOpen] = useState(false);

  // Reset form with default values of the customer. it's for editing purpose.
  useEffect(() => {
    if (values) {
      form.reset({
        ...values,
        defaultOffDays: shortToLong(values.defaultOffDays),
      });
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
          name="defaultItem"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="cursor-pointer">Default Item</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select default item" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="lunch">
                    Lunch
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="dinner">
                    Dinner
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="lunch&dinner">
                    Lunch & Dinner
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Default Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="100"
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultQuantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Default Quantity</FormLabel>
              <FormControl>
                <Input
                  placeholder="10"
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : 1)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultOffDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Off Days</FormLabel>
              <Popover open={daysPopoverOpen} onOpenChange={setDaysPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={daysPopoverOpen}
                    className="w-full font-medium justify-between cursor-pointer"
                  >
                    {field.value.length > 0
                      ? `Selected: ${field.value.length} Day${
                          field.value.length > 1 ? "s" : ""
                        }`
                      : "Select Days"}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <div className="bg-popover text-popover-foreground relative z-50 max-h-(--radix-select-content-available-height) min-w-[10rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md p-2">
                    {days.map((day) => (
                      <div
                        key={day.id}
                        className="hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm p-2 text-sm"
                      >
                        <Checkbox
                          id={`day-${day.id}`}
                          className="cursor-pointer"
                          checked={field.value?.includes(day.id)}
                          onCheckedChange={(checked) => {
                            const updatedDays = checked
                              ? [...field.value, day.id]
                              : field.value.filter(
                                  (value: string) => value !== day.id
                                );
                            field.onChange(updatedDays);
                          }}
                        />
                        <label
                          htmlFor={`day-${day.id}`}
                          className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Payment Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="paid">
                    Paid
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="partially_paid">
                    Partially Paid
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="pending">
                    Pending
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentSystem"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Payment System</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="Select payment system" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="weekly">
                    Weekly
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="monthly">
                    Monthly
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
              "Submit"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
