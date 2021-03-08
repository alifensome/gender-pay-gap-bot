export function getCompanyDataByTwitterId(twitterId, companies) {
    for (let index = 0; index < companies.length; index++) {
        const c = companies[index];
        if (c.twitter_id_str == twitterId) {
            return c;
        }
    }
    return null;
}
