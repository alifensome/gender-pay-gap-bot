import { isValidCompanyNumber } from "./isValidCompanyNumber"

describe('isValidCompanyNumber', () => {
    it('should validate a company number', () => {
        expect(isValidCompanyNumber('asdsad')).toBe(true)
        expect(isValidCompanyNumber(null)).toBe(true)
        expect(isValidCompanyNumber(undefined as any)).toBe(false)
        expect(isValidCompanyNumber('')).toBe(false)
    })
})