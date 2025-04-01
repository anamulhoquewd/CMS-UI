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
import { RoleBadge } from "../dashboard/role-badge";
import { format } from "date-fns";

interface UsersTableProps {
  table: any;
  columns: any[];
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

function UsersTable({ table, columns, setSearch }: UsersTableProps) {
  return (
    <>
      <div className="flex flex-row justify-between items-center py-4 gap-2">
        <Input
          placeholder="Search..."
          onChange={(event) => {
            setTimeout(() => {
              setSearch(event.target.value);
            }, 2000);
          }}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="cursor-pointer">
              Columns <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
                      className="cursor-pointer capitalize"
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
                            (cell.column.id === "defaultPrice" ||
                              cell.column.id === "price" ||
                              cell.column.id === "total") &&
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
                            ) : cell.column.id === "role" &&
                              cell.getValue() !== undefined ? (
                              // akoi vabe role er jonno eta kaj korbe.
                              cell.getValue() ? (
                                <RoleBadge role={cell.getValue()} />
                              ) : (
                                <Badge
                                  variant="outline"
                                  className={"border-red-500 text-red-500"}
                                >
                                  Inactive
                                </Badge>
                              )
                            ) : cell.column.id === "date" &&
                              cell.getValue() !== undefined ? (
                              format(cell.getValue(), "yyyy-MM-dd")
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
                                  {shortToLong(cell.row.original.defaultOffDays)
                                    .length > 0 ? (
                                    shortToLong(
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
                                    })
                                  ) : (
                                    <DropdownMenuItem className="flex justify-center text-muted-foreground">
                                      None
                                    </DropdownMenuItem>
                                  )}
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
                              className={`text-black-solid`}
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
    </>
  );
}

export default UsersTable;
