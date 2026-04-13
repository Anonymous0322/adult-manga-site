export const parsePagination = (query) => {
  const page = Math.max(Number.parseInt(query.page || '1', 10), 1);
  const limitRaw = Math.max(Number.parseInt(query.limit || '12', 10), 1);
  const limit = Math.min(limitRaw, 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginatedResponse = ({ docs, total, page, limit }) => {
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return {
    data: docs,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};
