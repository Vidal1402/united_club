import { PaginationMeta } from './pagination.types';
export declare function buildPaginationMeta(total: number, page?: number, limit?: number): PaginationMeta;
export declare function getSkipTake(page: number, limit: number): {
    skip: number;
    take: number;
};
