"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, Pencil, Trash2, Calendar, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const discountFormSchema = z.object({
  name: z.string().min(2, {
    message: "Discount name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  type: z.enum(["percentage", "fixed_amount", "free_shipping", "buy_x_get_y"]),
  value: z.number().min(0, {
    message: "Value must be 0 or greater.",
  }),
  minPurchaseAmount: z.number().min(0).optional(),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }),
  endDate: z.string().min(1, {
    message: "End date is required.",
  }),
  isActive: z.boolean().default(true),
  applyToAllProducts: z.boolean().default(false),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  usageLimit: z.number().min(0).optional(),
  couponCode: z.string().optional(),
})

type DiscountFormValues = z.infer<typeof discountFormSchema>

// Mock data for discounts
const discounts = [
  {
    id: "1",
    name: "Summer Sale",
    description: "20% off all summer items",
    type: "percentage",
    value: 20,
    minPurchaseAmount: 0,
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    isActive: true,
    applyToAllProducts: false,
    productIds: ["1", "3"],
    categoryIds: ["2"],
    usageLimit: 0,
    couponCode: "",
  },
  {
    id: "2",
    name: "Free Shipping",
    description: "Free shipping on all orders over $50",
    type: "free_shipping",
    value: 0,
    minPurchaseAmount: 50,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    isActive: true,
    applyToAllProducts: true,
    productIds: [],
    categoryIds: [],
    usageLimit: 0,
    couponCode: "",
  },
  {
    id: "3",
    name: "Welcome10",
    description: "$10 off your first order",
    type: "fixed_amount",
    value: 10,
    minPurchaseAmount: 0,
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    isActive: true,
    applyToAllProducts: true,
    productIds: [],
    categoryIds: [],
    usageLimit: 1,
    couponCode: "WELCOME10",
  },
]

// Mock data for products and categories
const products = [
  { id: "1", name: "Smartphone X" },
  { id: "2", name: "Laptop Pro" },
  { id: "3", name: "Cotton T-Shirt" },
]

const categories = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Clothing" },
  { id: "3", name: "Home & Kitchen" },
]

export function DiscountManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDiscount, setEditingDiscount] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("discounts")

  const form = useForm<DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "percentage",
      value: 0,
      minPurchaseAmount: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
      isActive: true,
      applyToAllProducts: true,
      productIds: [],
      categoryIds: [],
      usageLimit: 0,
      couponCode: "",
    },
  })

  const discountType = form.watch("type")
  const applyToAllProducts = form.watch("applyToAllProducts")

  function onSubmit(data: DiscountFormValues) {
   console.log("    Submitted data:", data)

    resetForm()
    setIsDialogOpen(false)
  }

  function resetForm() {
    form.reset()
    setEditingDiscount(null)
  }

  function handleEdit(discount: any) {
    setEditingDiscount(discount)
    form.reset({
      name: discount.name,
      description: discount.description || "",
      type: discount.type,
      value: discount.value,
      minPurchaseAmount: discount.minPurchaseAmount || 0,
      startDate: discount.startDate,
      endDate: discount.endDate,
      isActive: discount.isActive,
      applyToAllProducts: discount.applyToAllProducts,
      productIds: discount.productIds || [],
      categoryIds: discount.categoryIds || [],
      usageLimit: discount.usageLimit || 0,
      couponCode: discount.couponCode || "",
    })
    setIsDialogOpen(true)
  }

  function handleDelete(discountId: string) {
    console.log("Delete discount with ID:", discountId)
  }

  function handleToggleActive(discountId: string, isActive: boolean) {
   console.log("Toggle active for discount ID:", discountId, "to", isActive)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="discounts" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>
        <TabsContent value="discounts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Discount Management</h3>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="mr-2 h-4 w-4" /> Add Discount
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingDiscount ? "Edit Discount" : "Add New Discount"}</DialogTitle>
                  <DialogDescription>
                    {editingDiscount
                      ? "Update the discount details below."
                      : "Fill in the discount details below to add a new discount."}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discount Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter discount name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter discount description (optional)"
                              className="resize-none"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select discount type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">Percentage</SelectItem>
                                <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                                <SelectItem value="free_shipping">Free Shipping</SelectItem>
                                <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {discountType !== "free_shipping" && (
                        <FormField
                          control={form.control}
                          name="value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {discountType === "percentage"
                                  ? "Percentage (%)"
                                  : discountType === "fixed_amount"
                                    ? "Amount ($)"
                                    : "Quantity"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minPurchaseAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Purchase Amount ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>0 for no minimum</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="usageLimit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Usage Limit</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
                              />
                            </FormControl>
                            <FormDescription>0 for unlimited</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="couponCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coupon Code (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter coupon code" {...field} value={field.value || ""} />
                          </FormControl>
                          <FormDescription>Leave empty to apply discount automatically</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active</FormLabel>
                            <FormDescription>Enable or disable this discount</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="applyToAllProducts"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Apply to All Products</FormLabel>
                            <FormDescription>Apply this discount to all products</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {!applyToAllProducts && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="productIds"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-base">Select Products</FormLabel>
                                <FormDescription>Select specific products for this discount</FormDescription>
                              </div>
                              <div className="space-y-2">
                                {products.map((product) => (
                                  <FormField
                                    key={product.id}
                                    control={form.control}
                                    name="productIds"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={product.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(product.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...(field.value || []), product.id])
                                                  : field.onChange(field.value?.filter((value) => value !== product.id))
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">{product.name}</FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="categoryIds"
                          render={() => (
                            <FormItem>
                              <div className="mb-4">
                                <FormLabel className="text-base">Select Categories</FormLabel>
                                <FormDescription>Select specific categories for this discount</FormDescription>
                              </div>
                              <div className="space-y-2">
                                {categories.map((category) => (
                                  <FormField
                                    key={category.id}
                                    control={form.control}
                                    name="categoryIds"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={category.id}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(category.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([...(field.value || []), category.id])
                                                  : field.onChange(
                                                      field.value?.filter((value) => value !== category.id),
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">{category.name}</FormLabel>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">{editingDiscount ? "Update Discount" : "Add Discount"}</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Discounts</CardTitle>
              <CardDescription>Manage your discounts and promotions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <div className="font-medium">{discount.name}</div>
                        <div className="text-sm text-muted-foreground">{discount.description}</div>
                      </TableCell>
                      <TableCell>
                        {discount.type === "percentage"
                          ? "Percentage"
                          : discount.type === "fixed_amount"
                            ? "Fixed Amount"
                            : discount.type === "free_shipping"
                              ? "Free Shipping"
                              : "Buy X Get Y"}
                      </TableCell>
                      <TableCell>
                        {discount.type === "percentage"
                          ? `${discount.value}%`
                          : discount.type === "fixed_amount"
                            ? `$${discount.value.toFixed(2)}`
                            : discount.type === "free_shipping"
                              ? "Free Shipping"
                              : `Buy ${discount.value} Get 1 Free`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {new Date(discount.startDate).toLocaleDateString()} -{" "}
                            {new Date(discount.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={discount.isActive}
                          onCheckedChange={(checked) => handleToggleActive(discount.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(discount)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDelete(discount.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="promotions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Promotion Management</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Promotion
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Promotions</CardTitle>
              <CardDescription>Manage your promotional campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-center">
                <div className="space-y-2">
                  <Tag className="h-8 w-8 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Promotions Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Create your first promotion to start a marketing campaign.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

