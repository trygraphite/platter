// types/pagination.ts
export type PaginationParams = {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};
