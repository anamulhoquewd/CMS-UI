import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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

export default function RegistrationForm({
  form,
  onSubmit,
  isLoading,
  values,
  isEditing,
  setSelectedCustomer,
  customerIds,
}: {
  values: any;
  form: any;
  onSubmit: any;
  isLoading: boolean;
  isEditing: boolean;
  setSelectedCustomer: (customer: CustomerSchema) => void;
  customerIds: CustomerSchema[];
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
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <Select
                onValueChange={(value) => {
                  setSelectedCustomer(
                    customerIds.find(
                      (customer) => customer._id === value
                    ) as CustomerSchema
                  );
                  field.onChange(value);
                }}
                disabled={isEditing}
                defaultValue={field.value}
              >
                <FormControl className="w-full cursor-pointer">
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`${
                        isEditing ? values.customerName : "Select a customer"
                      }`}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customerIds.map((customer) => (
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter amount"
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
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="cursor-pointer">Methods</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue
                      placeholder={`${field.value || "Select an item"}`}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem className="cursor-pointer" value="cash">
                    Cash
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="bank">
                    Bank
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="bkash">
                    Bkash
                  </SelectItem>
                  <SelectItem className="cursor-pointer" value="nagad">
                    Nagad
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("paymentMethod") === "cash" && (
          <FormField
            control={form.control}
            name="cashReceivedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">Received By</FormLabel>
                <FormControl>
                  <Input placeholder="Enter receiver name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(form.watch("paymentMethod") === "bkash" ||
          form.watch("paymentMethod") === "nagad" ||
          form.watch("paymentMethod") === "bank") && (
          <FormField
            control={form.control}
            name="transactionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">Transaction ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter transaction ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("paymentMethod") === "bkash" && (
          <FormField
            control={form.control}
            name="bkashNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">Bkash Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Bkash number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("paymentMethod") === "nagad" && (
          <FormField
            control={form.control}
            name="nagadNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="cursor-pointer">Nagad Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Nagad number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("paymentMethod") === "bank" && (
          <>
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="cursor-pointer">Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="cursor-pointer">Note</FormLabel>
              <FormControl>
                <Input placeholder="Enter any additional notes" {...field} />
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
              "Register"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
