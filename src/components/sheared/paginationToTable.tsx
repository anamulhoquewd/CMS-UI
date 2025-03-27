import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { Badge } from "../ui/badge";
import { Pagination } from "@/interface";

function PaginationForTable({
  pagination,
  setPagination,
}: {
  pagination: Pagination;
  setPagination: Dispatch<SetStateAction<Pagination>>;
}) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="space-x-2">
        <Button
          variant={"outline"}
          className="cursor-pointer"
          size="sm"
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: prev.prevPage !== null ? prev.prevPage : prev.page,
            }))
          }
          disabled={pagination.prevPage === null}
        >
          Previous
        </Button>

        <Badge variant="outline" className="py-2 px-4">
          Page {pagination.page} of {pagination.totalPages}
        </Badge>

        <Button
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              page: prev.nextPage !== null ? prev.nextPage : prev.page,
            }))
          }
          disabled={pagination.nextPage === null}
          variant={"outline"}
          className="cursor-pointer"
          size="sm"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default PaginationForTable;
