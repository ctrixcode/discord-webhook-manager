interface PaginationOptions {
  page: number;
  limit: number;
  totalItems: number;
}

interface PaginationResult {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export const createPagination = ({
  page,
  limit,
  totalItems,
}: PaginationOptions): PaginationResult => {
  const totalPages = Math.ceil(totalItems / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;

  return {
    page,
    limit,
    totalItems,
    totalPages,
    nextPage,
    prevPage,
  };
};
