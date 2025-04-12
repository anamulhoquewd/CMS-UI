import React from "react";
import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import RegistrationForm from "./registerForm";
import { CustomerSchema } from "@/interface";

interface Props {
  isLoading: boolean;
  isAddOpen: boolean;
  setIsAddOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  values: any;
  setValues: React.Dispatch<React.SetStateAction<any>>;
  form: any;
  setId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedCustomer: React.Dispatch<
    React.SetStateAction<CustomerSchema | null>
  >;
  customerIds: CustomerSchema[];
  onSubmit: (data: any) => void;
  onUpdate: (data: any) => void;
}

function PaymentCardHeader({
  isLoading,
  isAddOpen,
  setIsAddOpen,
  isEditing,
  setIsEditing,
  values,
  setValues,
  form,
  setId,
  setSelectedCustomer,
  customerIds,
  onSubmit,
  onUpdate,
}: Props) {
  return (
    <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-2">
      <div className="space-y-2">
        <CardTitle>All Payments</CardTitle>
        <CardDescription>Manage and view all payments</CardDescription>
      </div>
      <Dialog
        open={isAddOpen}
        onOpenChange={(open) => {
          if (!open) {
            form.reset({
              customerId: "",
              amount: 0,
              note: "",
              transactionId: "",
              bkashNumber: "",
              nagadNumber: "",
              bankName: "",
              cashReceivedBy: "",
              paymentMethod: "",
            });
            setValues(null);
            setId(null);
            setIsEditing(false);
          }
          setIsAddOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <Button
            onChange={() => setIsAddOpen(true)}
            className="w-full sm:w-auto cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add new
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Registration Form</DialogTitle>
            <DialogDescription>
              Fill out the form below to complete new payment registration.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="sm:max-w-[525px] h-[65dvh] overflow-hidden pr-2 md:px-4">
            <RegistrationForm
              form={form}
              values={values}
              onSubmit={isEditing ? onUpdate : onSubmit}
              isEditing={isEditing}
              isLoading={isLoading}
              setSelectedCustomer={setSelectedCustomer}
              customerIds={customerIds}
            />
            <ScrollBar orientation="vertical" className="w-2.5" />
            <ScrollBar orientation="horizontal" className="w-2.5" />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </CardHeader>
  );
}

export default PaymentCardHeader;
