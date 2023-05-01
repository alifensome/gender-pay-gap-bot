import DataImporter from "../importData";
import { Repository } from "../importData/Repository";
import { response } from "./response";

const d = new DataImporter();

const repo = new Repository(d);

const getCompanyByCompanyId = async (event: any) => {
  const companyNumber = event.pathParameters.id;

  const data = repo.getCompanyTwitterDataForCompany("", companyNumber);
  return response(data);
};

const getCompanyByTwitterId = async (event: any) => {
  const id = event.pathParameters.id;
  const data = repo.getCompanyTwitterDataForTwitterId(id);
  return response(data);
};

const getCompanyByTwitterHandle = async (event: any) => {
  const handle = event.pathParameters.handle;
  const data = repo.getCompanyTwitterDataForTwitterHandle(handle);
  return response(data);
};

export {
  getCompanyByCompanyId,
  getCompanyByTwitterId,
  getCompanyByTwitterHandle,
};
