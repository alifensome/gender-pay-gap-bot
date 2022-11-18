"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCompanyDataByTwitterScreenName = exports.getCompanyDataByTwitterId = void 0;
function getCompanyDataByTwitterId(twitterId, companies) {
    for (let index = 0; index < companies.length; index++) {
        const c = companies[index];
        if (c.twitter_id_str == twitterId) {
            return c;
        }
    }
    return null;
}
exports.getCompanyDataByTwitterId = getCompanyDataByTwitterId;
function getAllCompanyDataByTwitterScreenName(twitterScreenName, companies) {
    const results = [];
    for (let index = 0; index < companies.length; index++) {
        const c = companies[index];
        const name = c.twitter_screen_name || c.twitter_name || "";
        if (name.toLowerCase() == twitterScreenName.toLowerCase()) {
            results.push(c);
        }
    }
    return results;
}
exports.getAllCompanyDataByTwitterScreenName = getAllCompanyDataByTwitterScreenName;
//# sourceMappingURL=getCompanyDataByTwitterId.js.map