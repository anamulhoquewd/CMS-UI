export interface Pagination {
    page: number;
    total: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  }