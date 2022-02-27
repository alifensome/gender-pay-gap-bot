// TODO refactor this to be cleaner :P

export function parseCompanyNumber(companyNumber) {
    if (typeof companyNumber === "number") {
        if (companyNumber.toString().length === 7) {
            return `0${companyNumber}`;
        }

        if (companyNumber.toString().length === 6) {
            return `00${companyNumber}`;
        }


        if (companyNumber.toString().length === 5) {
            return `000${companyNumber}`;
        }

        return companyNumber.toString();
    }
    return companyNumber;
}
export function parseGpg(gpg) {
    if (typeof gpg === "string") {
        return parseFloat(gpg.replace("\t", ""));
    }
    if (gpg > 1000 || gpg < -1000) {
        throw new Error(`gpg out of bounds: ${gpg}`);
    }
    return gpg;
}
