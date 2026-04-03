export interface PaginationParams {
  page: number;
  limit: number;
}

export const getPaginationParams = (
  query: any,
  defaultLimit: number = 20,
): PaginationParams => {
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || defaultLimit;

  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > 100) limit = 100;

  return { page, limit };
};

export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export default {
  getPaginationParams,
  calculateOffset,
};
