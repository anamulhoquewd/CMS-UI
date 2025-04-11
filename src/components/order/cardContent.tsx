import { CardContent } from "../ui/card";
import UsersTable from "../sheared/table";
import PaginationForTable from "../sheared/paginationToTable";
import { Pagination } from "@/interface";

interface Props {
  table: any;
  columns: any[];
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}

function OrderCardContent({
  table,
  columns,
  setSearch,
  pagination,
  setPagination,
}: Props) {
  return (
    <CardContent>
      <UsersTable table={table} columns={columns} setSearch={setSearch} />
      {pagination.total > 0 && (
        <PaginationForTable
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </CardContent>
  );
}

export default OrderCardContent;
