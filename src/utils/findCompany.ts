export function findCompany<T>(name: string, companyNumber: string | null, list: T[]): T | null {
    const exactMatch = findCompanyFullMatch(name, companyNumber, list)
    if (exactMatch) {
        return exactMatch
    }
    return findCompanyPartialMatch(name, companyNumber, list);
}
export function findCompanyFullMatch<T>(name: string, companyNumber: string | null, list: T[]): T | null {
    const upperCaseName = name?.toUpperCase();
    for (let index = 0; index < list.length; index++) {
        const item = list[index] as any;
        if (companyNumber !== null &&
            item.companyNumber !== null &&
            item.companyNumber === companyNumber &&
            upperCaseName !== "" &&
            item.companyName?.toUpperCase() &&
            item.companyName?.toUpperCase() === upperCaseName) {
            return item
        }
    }
    return null;
}

export function findCompanyPartialMatch<T>(name: string, companyNumber: string | null, list: T[]): T | null {
    const upperCaseName = name?.toUpperCase();
    for (let index = 0; index < list.length; index++) {
        const item = list[index] as any;
        if (companyNumber !== null && item.companyNumber !== null && item.companyNumber === companyNumber) {
            return item
        }
        if (upperCaseName !== "" && item.companyName?.toUpperCase() && item.companyName?.toUpperCase() === upperCaseName) {
            return item;
        }
    }
    return null;
}
