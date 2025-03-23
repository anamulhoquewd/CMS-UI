import PaginationForTable from "./paginationToTable";
import { Input } from "@/components/ui/input";
import { shortToLong } from "@/utils/date-converter";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import {
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

interface CustomTableProps {
  table: any;
  columns: any[];
  users: any[];
}

function CustomTable({ table, columns, users }: CustomTableProps) {
  return (
    <>
      <div className="flex flex-row justify-between items-center py-4 gap-2">
        <Input
          placeholder="Search by Name"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="cursor-pointer">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            {table
              .getAllColumns()
              .filter(
                (column: {
                  id: string;
                  getCanHide: () => boolean;
                  getIsVisible: () => boolean;
                  toggleVisibility: (value: boolean) => void;
                }) => column.getCanHide()
              )
              .map(
                (column: {
                  id: string;
                  getCanHide: () => boolean;
                  getIsVisible: () => boolean;
                  toggleVisibility: (value: boolean) => void;
                }) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="cursor-pointer capitalize transition-all duration-300 sm:hover:bg-white-2x"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                }
              )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="w-full overflow-x-auto">
        <Table className="">
          <TableHeader>
            {table
              .getHeaderGroups()
              .map((headerGroup: { id: string; headers: any[] }) => (
                <TableRow key={headerGroup.id} className="">
                  {headerGroup.headers.map(
                    (header: {
                      id: string;
                      isPlaceholder: boolean;
                      column: any;
                    }) => {
                      return (
                        <TableHead
                          className="font-semibold text-muted-foreground"
                          key={header.id}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                (
                                  header as {
                                    id: string;
                                    isPlaceholder: boolean;
                                    column: any;
                                    getContext: () => any;
                                  }
                                ).getContext()
                              )}
                        </TableHead>
                      );
                    }
                  )}
                </TableRow>
              ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map(
                  (row: {
                    id: string;
                    getIsSelected: () => boolean;
                    getVisibleCells: () => any[];
                  }) => {
                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => {
                          const cellValue =
                            cell.column.id === "defaultPrice" &&
                            cell.getValue() !== undefined ? (
                              // jodi price hoy tahole just .00 add korar jonno eti kora hoyeche.
                              Number.parseFloat(cell.getValue()).toFixed(2)
                            ) : cell.column.id === "active" &&
                              cell.getValue() !== undefined ? (
                              // active inactive ke aktu sundon kore dekhanor jonno badge use korechi. jodi active hoy tahole green, otherwise red
                              cell.getValue() ? (
                                <Badge
                                  variant="outline"
                                  className={"border-green-500 text-green-500"}
                                >
                                  Active
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className={"border-red-500 text-red-500"}
                                >
                                  Inactive
                                </Badge>
                              )
                            ) : cell.column.id === "defaultOffDays" &&
                              cell.getValue() !== undefined ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <Button
                                    className="cursor-pointer"
                                    variant={"outline"}
                                  >
                                    Off Days
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>
                                    Default Off Days
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {shortToLong(
                                    cell.row.original.defaultOffDays
                                  ).map((element: string) => {
                                    return (
                                      <DropdownMenuItem
                                        className="capitalize"
                                        key={element}
                                      >
                                        {element}
                                      </DropdownMenuItem>
                                    );
                                  })}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )
                            );

                          return (
                            <TableCell
                              key={cell.id}
                              className="text-black-solid capitalize"
                            >
                              {cellValue}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  }
                )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No result found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" className="cursor-pointer" />
      </ScrollArea>

      {users.length > 0 && <PaginationForTable table={table} />}
    </>
  );
}

export default CustomTable;
