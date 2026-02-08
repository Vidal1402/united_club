"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = buildPaginationMeta;
exports.getSkipTake = getSkipTake;
const pagination_types_1 = require("./pagination.types");
function buildPaginationMeta(total, page = pagination_types_1.DEFAULT_PAGE, limit = pagination_types_1.DEFAULT_LIMIT) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), pagination_types_1.MAX_LIMIT);
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
function getSkipTake(page, limit) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), pagination_types_1.MAX_LIMIT);
    return {
        skip: (safePage - 1) * safeLimit,
        take: safeLimit,
    };
}
//# sourceMappingURL=pagination.util.js.map