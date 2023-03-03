import DataImporter from ".";
import { Repository } from "./Repository";

const importer = new DataImporter();
const repo = new Repository(importer);

repo.checkSetData();

const results = repo.fuzzyFindCompanyByName(process.argv[2]);
console.log(results);
console.log("Close matches:" + results?.closeMatches?.length);
