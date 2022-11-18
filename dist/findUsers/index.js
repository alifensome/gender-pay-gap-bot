"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const importData_1 = __importDefault(require("../importData"));
const findUserIds_1 = require("../twitter/findUserIds");
const fs_1 = __importDefault(require("fs"));
const wait_js_1 = require("../utils/wait.js");
const dataImporter = new importData_1.default();
const companyData = dataImporter.companiesGpgData();
console.log("Starting...");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const isTest = false;
        const testNumber = 500;
        let found = 0;
        let notFound = 0;
        let percentageDone = 0;
        let percentageFound = 0;
        const number = isTest ? testNumber : companyData.length;
        const foundCompanies = [];
        const notFoundCompanies = [];
        let errorsInARow = 0;
        let startTime = new Date();
        try {
            for (let index = 0; index < number; index++) {
                yield (0, wait_js_1.wait)();
                if (errorsInARow > 4) {
                    console.log("Too many failures!!!");
                    break;
                }
                if (index % 100 == 0) {
                    percentageDone = (index / number) * 100;
                    percentageFound = (found / index) * 100;
                    console.log(`PercentageDone: ${percentageDone}%\nFound: ${found}\nNotFound: ${notFound}\nPercentageFound: ${percentageFound}%\n`);
                }
                const company = companyData[index];
                let user = null;
                try {
                    user = yield (0, findUserIds_1.findUserByName)(company.companyName);
                    errorsInARow = 0;
                }
                catch (error) {
                    console.log("Error while finding user for:", company);
                    console.log(error);
                    errorsInARow++;
                }
                if (!user) {
                    notFound++;
                    notFoundCompanies.push(company);
                    continue;
                }
                found++;
                foundCompanies.push(Object.assign({ twitter_id: user.id, twitter_name: user.name, twitter_screen_name: user.screen_name }, company));
            }
            percentageFound = (found / number) * 100;
            console.log(`\nComplete!!!\nFound:${found}\nNotFound:${notFound}\nPercentageFound: ${percentageFound}%\n`);
        }
        catch (error) {
            console.log(`Threw error ${percentageDone}% through. Found: ${found}, Not found: ${notFound} `);
            console.log(error);
        }
        try {
            const date = new Date();
            const filePath = `./data/twitterAccountData/twitterUserData-${date.toISOString()}.json`;
            const stream = fs_1.default.createWriteStream(filePath, { flags: 'w' });
            stream.write(JSON.stringify(foundCompanies), () => { console.log(`Wrote file: ${filePath}`); });
            const notFoundFilePath = `./data/twitterAccountData/twitterUserData-notFound-${date.toISOString()}.json`;
            const notFoundStream = fs_1.default.createWriteStream(notFoundFilePath, { flags: 'w' });
            notFoundStream.write(JSON.stringify(notFoundCompanies), () => { console.log(`Wrote file: ${notFoundFilePath}`); });
            let finishingTime = new Date();
            console.log("Time taken:", (finishingTime.getTime() - startTime.getTime()) / (1000 * 60), " Minutes");
        }
        catch (error) {
            console.log(`Threw error while writing fie.`);
            console.log(foundCompanies);
            console.log(error);
        }
    });
}
run();
//# sourceMappingURL=index.js.map