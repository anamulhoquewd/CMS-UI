import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import RegistrationForm from "./registerForm";
import { DateRange } from "react-day-picker";

interface Props {
  selectDate: Date;
  setSelectDate: React.Dispatch<React.SetStateAction<Date>>;
  handlePrevDay: () => void;
  handleNextDay: () => void;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  dateRange: DateRange | undefined;
  handleResetFilter: () => void;
  form: any;
  values: any;
  isAddOpen: boolean;
  setIsAddOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setValues: React.Dispatch<React.SetStateAction<any>>;
  setId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  onSubmit: () => void;
  onUpdate: () => void;
  filteredCustomers: any;
  isLoading: boolean;
  selectedCustomer: any;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<any>>;
}

function OrderCardHeader({
  selectDate,
  setSelectDate,
  handlePrevDay,
  handleNextDay,
  setDateRange,
  dateRange,
  handleResetFilter,
  form,
  values,
  isAddOpen,
  setIsAddOpen,
  setValues,
  setId,
  setIsEditing,
  isEditing,
  onSubmit,
  onUpdate,
  filteredCustomers,
  isLoading,
  selectedCustomer,
  setSelectedCustomer,
}: Props) {
  return (
    <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-3 space-y-0">
      <div className="space-y-2">
        <CardTitle>All Orders</CardTitle>
        <CardDescription>Manage and view all orders</CardDescription>
      </div>

      {/* filter with date */}
      <div className="flex items-center justify-between w-fit gap-2">
        <Button onClick={handlePrevDay} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-40 sm:w-[250px] cursor-pointer"
            >
              <CalendarIcon className="mr-2 h-4 w-4 hidden sm:block" />
              {selectDate ? (
                format(selectDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={new Date(selectDate)}
              onSelect={(date) => date && setSelectDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button onClick={handleNextDay} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* filter with date range */}
        <div className="flex items-center justify-between w-fit gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={"w-fit cursor-pointer"}
              >
                <span>Date Range</span>

                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={new Date()}
                selected={
                  dateRange?.from
                    ? {
                        from: new Date(dateRange.from),
                        to: dateRange.to ? new Date(dateRange.to) : undefined,
                      }
                    : undefined
                }
                onSelect={(range) =>
                  setDateRange({
                    from: range?.from
                      ? new Date(format(range.from, "yyyy-MM-dd"))
                      : undefined,
                    to: range?.to
                      ? new Date(format(range.to, "yyyy-MM-dd"))
                      : undefined,
                  })
                }
                numberOfMonths={1}
              />
            </PopoverContent>
          </Popover>
          <Button
            id="date"
            variant={"outline"}
            className={"w-fit cursor-pointer"}
            onClick={handleResetFilter}
          >
            <span>Reset</span>
          </Button>
        </div>

        <Dialog
          open={isAddOpen}
          onOpenChange={(open) => {
            if (!open) {
              form.reset({
                customerId: "",
                price: 0,
                quantity: 1,
                item: "",
                date: new Date(),
                note: "",
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
              <DialogTitle>Order Registration Form</DialogTitle>
              <DialogDescription>
                Fill out the form below to complete new order registration.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="sm:max-w-[525px] h-[65dvh] overflow-hidden pr-2 md:px-4">
              <RegistrationForm
                form={form}
                values={values}
                onSubmit={isEditing ? onUpdate : onSubmit}
                isEditing={isEditing}
                isLoading={isLoading}
                customers={filteredCustomers}
                setSelectedCustomer={setSelectedCustomer}
                selectedCustomer={selectedCustomer}
              />
              <ScrollBar orientation="vertical" className="w-2.5" />
              <ScrollBar orientation="horizontal" className="w-2.5" />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>
  );
}

export default OrderCardHeader;
