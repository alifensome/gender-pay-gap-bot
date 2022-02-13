export function findCompany<T>(name, companyNumber, list: T[]): T | null {
    const upperCaseName = name.toUpperCase();
    for (let index = 0; index < list.length; index++) {
        const item = list[index] as any;
        if (item.companyName?.toUpperCase() === upperCaseName || item.companyNumber === companyNumber) {
            return item;
        }
    }
    return null;
}
