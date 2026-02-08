import { PaginationMeta, DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT } from './pagination.types';

export function buildPaginationMeta(
  total: number,
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT,
): PaginationMeta {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
  const totalPages = Math.ceil(total / safeLimit);
  return {
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}

export function getSkipTake(page: number, limit: number): { skip: number; take: number } {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
}
