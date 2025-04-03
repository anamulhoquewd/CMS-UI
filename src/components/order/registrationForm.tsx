"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, Loader2 } from "lucide-react";
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
import { DialogFooter } from "@/components/ui/dialog";
import { CustomerSchema } from "@/interface";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { ISODate } from "@/utils/date-converter";

interface OrderRegistrationFormProps {
  form: any;
  onSubmit: any;
  isLoading: boolean;
  values: any;
  isEditing: boolean;
  customers: CustomerSchema[];
  setSelectedCustomer: (customer: CustomerSchema | null) => void;
  selectedCustomer: CustomerSchema | null;
  setSelectOrderDate: (date: string) => void;
  selectOrderDate: string;
}

export default function RegistrationForm({
  form,
  onSubmit,
  isLoading,
  values,
  isEditing,
  customers,
  setSelectOrderDate,
  setSelectedCustomer,
  selectOrderDate,
}: OrderRegistrationFormProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(true);
  const [isEditingQuantity, setIsEditingQuantity] = useState(true);

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
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="cursor-pointer">Date of Order</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl className="w-full">
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal cursor-pointer",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {selectOrderDate ? (
                        format(selectOrderDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(selectOrderDate)}
                    onSelect={(date) => {
                      if (date) {
                        setSelectOrderDate(ISODate(date));
                        field.onChange(ISODate(date)); // Ensure string format is stored
                      }
                    }}
                    disabled={(date) =>
                      date > addDays(new Date(), 10) ||
                      date < new Date("2025-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select
                onValueChange={(value) => {
                  setSelectedCustomer(
                    customers.find((customer) => customer._id === value) || null
                  );
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl className="w-full cursor-pointer">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem
                      className="cursor-pointer"
                      key={customer._id}
                      value={customer._id}
                    >
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                onClick={() => setIsEditingPrice(false)}
                className="cursor-pointer"
              >
                Price
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="100"
                  type="number"
                  min="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : 0)
                  }
                  disabled={isEditingPrice}
                />
              </FormControl>
              <FormDescription>
                If you want to change the price, click on the label.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel
                onClick={() => setIsEditingQuantity(false)}
                className="cursor-pointer"
              >
                Quantity
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="10"
                  type="number"
                  min="1"
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : 0)
                  }
                  disabled={isEditingQuantity}
                />
              </FormControl>
              <FormDescription>
                If you want to change the quantity, click on the label.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="item"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="cursor-pointer">Item</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue
                      placeholder={`${field.value || "Select an item"}`}
                    />
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
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Note</FormLabel>
              <FormControl>
                <Input placeholder="Any note" type="text" {...field} />
              </FormControl>
              <FormMessage />
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
