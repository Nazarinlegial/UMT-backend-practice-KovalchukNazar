// Pagination helpers shared by every list endpoint.

// Clamp the requested page into the valid range and compute Prisma skip/take.
export function getPaginationBounds({ page, perPage, totalItems }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage) || 1);
  const safePage = Math.min(Math.max(page, 1), totalPages);

  return {
    totalItems,
    totalPages,
    safePage,
    skip: (safePage - 1) * perPage,
    take: perPage,
  };
}

// Standard list envelope: { data: [...], meta: { ...pagination } }.
export function buildPaginatedResponse(items, { page, perPage, totalItems }) {
  const { totalPages, safePage } = getPaginationBounds({ page, perPage, totalItems });

  return {
    data: items,
    meta: {
      page: safePage,
      perPage,
      total: totalItems,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
    },
  };
}
