export interface Pagination {
  total: number;
  pageIndex: number;
  pageSize: number;
}

export type PartialPaginationWithoutTotal = Omit<Pagination, 'total'> & Partial<Pick<Pagination, 'total'>>;