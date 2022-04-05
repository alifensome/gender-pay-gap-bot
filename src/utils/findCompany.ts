export function findCompany<T>(name: string, companyNumber: string | null, list: T[]): T | null {
    const result = findCompanyWithIndex(name, companyNumber, list)
    if (result) {
        return result.item
    }
    return null
}

export function findCompanyWithIndex<T>(name: string, companyNumber: string | null, list: T[]): SearchResult<T> | null {
    const exactMatch = findCompanyFullMatch(name, companyNumber, list)
    if (exactMatch) {
        return exactMatch
    }
    const partialMatchResult = findCompanyPartialMatch(name, companyNumber, list);
    if (partialMatchResult) {
        return partialMatchResult
    }
    return null
}

export function findCompanyFullMatch<T>(name: string, companyNumber: string | null, list: T[]): SearchResult<T> | null {
    const upperCaseName = name?.toUpperCase();
    for (let index = 0; index < list.length; index++) {
        const item = list[index] as any;
        if (companyNumber !== null &&
            item.companyNumber !== null &&
            item.companyNumber === companyNumber &&
            upperCaseName !== "" &&
            item.companyName?.toUpperCase() &&
            item.companyName?.toUpperCase() === upperCaseName) {
            return { item, index }
        }
    }
    return null;
}

export function findCompanyPartialMatch<T>(name: string, companyNumber: string | null, list: T[]): SearchResult<T> | null {
    const upperCaseName = name?.toUpperCase();
    for (let index = 0; index < list.length; index++) {
        const item = list[index] as any;
        if (companyNumber !== null && item.companyNumber !== null && item.companyNumber === companyNumber) {
            return { item, index }
        }
        if (upperCaseName !== "" && item.companyName?.toUpperCase() && item.companyName?.toUpperCase() === upperCaseName) {
            return { item, index };
        }
    }
    return null;
}

export interface SearchResult<T> {
    item: T
    index: number
}