import { CompanyNumber } from "../types";

export function isValidCompanyNumber(companyNumber: CompanyNumber): boolean {
    return !!companyNumber || companyNumber === null;
}
