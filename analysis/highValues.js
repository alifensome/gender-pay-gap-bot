const data = require("../data/companies_GPG_Data.json")
const { getMostRecentGPG} = require("../utils")
for (let index = 0; index < data.length; index++) {
    const company = data[index];
    gpg = getMostRecentGPG(company)
    if(gpg && gpg > 50){
        console.log(company.companyName, gpg)
    }
}