import DataImporter from ".";
import { Repository } from "./Repository";

const importer = new DataImporter();
const repo = new Repository(importer);

repo.checkSetData();

console.log(repo.fuzzyFindCompanyByName("Accenture"));
