import DataImporter from "../importData"

const d = new DataImporter()

const getCompany = async (event) => {
  const id = event.pathParameters.id
  const company = (d.companiesGpgData() as any[]).find((c) => c.companyNumber == id)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        company,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

export { getCompany }