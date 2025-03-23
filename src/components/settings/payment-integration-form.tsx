"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const paymentFormSchema = z.object({
  apiKey: z.string().min(1, {
    message: "API Key is required.",
  }),
  secretKey: z.string().min(1, {
    message: "Secret Key is required.",
  }),
  paymentGateway: z.enum(["stripe", "paypal", "square"], {
    required_error: "Please select a payment gateway.",
  }),
  testMode: z.boolean().default(false),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

const defaultValues: Partial<PaymentFormValues> = {
  paymentGateway: "stripe",
  testMode: false,
}

export function PaymentIntegrationForm() {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
  })

  function onSubmit(data: PaymentFormValues) {
    console.log("Submitted data:", data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="paymentGateway"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Gateway</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment gateway" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the payment gateway you want to integrate.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Key</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormDescription>Enter the API Key provided by your payment gateway.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secretKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret Key</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormDescription>Enter the Secret Key provided by your payment gateway.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="testMode"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Test Mode</FormLabel>
                <FormDescription>Enable test mode for development and testing.</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save Payment Settings</Button>
      </form>
    </Form>
  )
}

