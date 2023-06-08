import DataImporter from "../importData";
import { parseCompanyNumber } from "../read/parse";
import { TwitterData } from "../types";
import { writeJsonFile } from "../utils/write";

const importer = new DataImporter();
const twitterData = importer.twitterUserDataProdLocal();

const newData: TwitterData[] = [];
for (let index = 0; index < twitterData.length; index++) {
  const item = twitterData[index];
  newData.push({
    twitter_id_str: item.twitter_id_str, // "76642763",
    twitter_name: item.twitter_name, // "Abcam plc",
    twitter_screen_name: item.twitter_screen_name, // "AbcamPlc",
    companyName: item.companyName, // "ABCAM PLC",
    companyNumber: parseCompanyNumber(item.companyNumber), // 3509322,
  });
}

writeJsonFile("./src/dataFix/twitterUserData.json", newData);
