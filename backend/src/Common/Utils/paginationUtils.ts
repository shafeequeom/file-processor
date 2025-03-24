export const getPaginationInfo = (page: number, limit: number, count: number) => {
    return {
        page: +page,
        perPage: +limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
    };
};