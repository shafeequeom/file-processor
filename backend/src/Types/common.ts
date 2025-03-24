export type WhereConditionType = Array<{ key: string | Array<string>, value: string | string[], type?: string, isInnerAnd?: boolean, isAnd?: boolean }>

export type JoinQueryType = Array<{ relationName: string, isDeleted?: boolean, isActive?: boolean, joinType?: string, joinQuery?: any, whereQuery?: any, select?: Array<string>, joinAlias?: string, joinToAlias?: string }>