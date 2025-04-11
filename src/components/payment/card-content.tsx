import React from "react";
import { CardContent } from "../ui/card";
import UsersTable from "../sheared/table";
import PaginationForTable from "../sheared/paginationToTable";

function PaymentCardContent({ table, columns, pagination, setPagination }: any) {
  return (
    <CardContent>
      <UsersTable table={table} columns={columns} />
      {pagination.total > 0 && (
        <PaginationForTable
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </CardContent>
  );
}

export default PaymentCardContent;
