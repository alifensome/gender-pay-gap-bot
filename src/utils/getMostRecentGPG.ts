function getMostRecentGPG(data) {
    if (data.gpg_2020_2021) {
        return data.gpg_2020_2021
    }
    if (data.gpg_2019_2020) {
        return data.gpg_2019_2020
    }
    if (data.gpg_2018_2019) {
        return data.gpg_2018_2019
    }
    if (data.gpg_2017_2018) {
        return data.gpg_2017_2018
    }
    return null
}

export { getMostRecentGPG }