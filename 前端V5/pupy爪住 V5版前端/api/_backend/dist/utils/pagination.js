export const getPaginationParams = (query, defaultLimit = 20) => {
    let page = parseInt(query.page) || 1;
    let limit = parseInt(query.limit) || defaultLimit;
    if (page < 1)
        page = 1;
    if (limit < 1)
        limit = 1;
    if (limit > 100)
        limit = 100;
    return { page, limit };
};
export const calculateOffset = (page, limit) => {
    return (page - 1) * limit;
};
export default {
    getPaginationParams,
    calculateOffset,
};
//# sourceMappingURL=pagination.js.map