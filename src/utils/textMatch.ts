function getTextMatch(companyName: string, twitterName: string) {
    const companyNameParts = companyName.toLowerCase().split(" ")
    const twitterNameParts = twitterName.toLowerCase().split(" ")
    const twitterNameWords = twitterNameParts.length
    let includesCount = 0
    for (let index = 0; index < twitterNameWords; index++) {
        const part = twitterNameParts[index];
        if (companyNameParts.includes(part)) {
            includesCount++
        }
    }
    return includesCount / twitterNameWords
}

export { getTextMatch }
