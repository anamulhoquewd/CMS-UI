"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, Pencil, Trash2, ChevronRight, ChevronDown } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const categoryFormSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  parentId: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

// Mock data for categories
const categories = [
  { 
    id: "1", 
    name: "Electronics", 
    description: "Electronic devices and accessories",
    parentId: null,
    children: [
      { 
        id: "4", 
        name: "Smartphones", 
        description: "Mobile phones and accessories",
        parentId: "1",
        children: []
      },
      { 
        id: "5", 
        name: "Laptops", 
        description: "Notebook computers",
        parentId: "1",
        children: []
      },
    ]
  },
  { 
    id: "2", 
    name: "Clothing", 
    description: "Apparel and fashion items",
    parentId: null,
    children: [
      { 
        id: "6", 
        name: "Men's Clothing", 
        description: "Clothing for men",
        parentId: "2",
        children: []
      },
      { 
        id: "7", 
        name: "Women's Clothing", 
        description: "Clothing for women",
        parentId: "2",
        children: []
      },
    ]
  },
  { 
    id: "3", 
    name: "Home & Kitchen", 
    description: "Home appliances and kitchenware",
    parentId: null,
    children: []
  },
]

export function CategoryManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      parentId: "",
    },
  })

  function onSubmit(data: CategoryFormValues) {
    console.log("Submitted data:", data)
    
    resetForm()
    setIsDialogOpen(false)
  }

  function resetForm() {
    form.reset()
    setEditingCategory(null)
  }

  function handleEdit(category: any) {
    setEditingCategory(category)
    form.reset({
      name: category.name,
      description: category.description,
      parentId: category.parentId || "",
    })
    setIsDialogOpen(true)
  }

  function handleDelete(categoryId: string) {
    console.log(`Delete category with ID: ${categoryId}`)
  }

  function toggleExpand(categoryId: string) {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  // Flatten categories for parent selection
  function flattenCategories(categories: any[], result: any[] = [], level = 0) {
    categories.forEach(category => {
      result.push({
        ...category,
        level,
      })
      if (category.children && category.children.length > 0) {
        flattenCategories(category.children, result, level + 1)
      }
    })
    return result
  }

  const flatCategories = flattenCategories(categories)

  // Recursive function to render category tree
  function renderCategoryTree(categories: any[], level = 0) {
    return categories.map(category => (
      <div key={category.id} className="mb-2">
        <div 
          className={`flex items-center p-2 rounded-md ${level > 0 ? 'ml-6' : ''}`}
          style={{ backgroundColor: level === 0 ? 'hsl(var(--muted))' : 'transparent' }}
        >
          {category.children && category.children.length > 0 ? (
            <CollapsibleTrigger 
              onClick={() => toggleExpand(category.id)}
              className="mr-2 focus:outline-none"
            >
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
          ) : (
            <div className="w-6"></div>
          )}
          <span className="flex-1 font-medium">{category.name}</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
              <Pencil className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
        {category.children && category.children.length > 0 && (
          <Collapsible open={expandedCategories.includes(category.id)}>
            <CollapsibleContent>
              {renderCategoryTree(category.children, level + 1)}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Category Management</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                {editingCategory 
                  ? "Update the category details below." 
                  : "Fill in the category details below to add a new category."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
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
                          placeholder="Enter category description (optional)" 
                          className="resize-none" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="None (Top Level)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None (Top Level)</SelectItem>
                          {flatCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {Array(category.level).fill("—").join("")} {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a parent category or leave empty for a top-level category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingCategory ? "Update Category" : "Add Category"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your product categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {renderCategoryTree(categories)}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
