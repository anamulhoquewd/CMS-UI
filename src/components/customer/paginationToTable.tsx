import { Button } from "@/components/ui/button";

function PaginationForTable({ table }: { table: any }) {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="space-x-2">
        <Button
          variant={"ghost"}
          className="border sm:hover:bg-white-2x"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant={"ghost"}
          className="border sm:hover:bg-white-2x"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default PaginationForTable;