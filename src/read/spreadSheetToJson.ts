import { CsvParser } from "./parseCsv/parseCsv";
import { writeJsonFile } from "../utils/write";

export async function spreadSheetToJson(
  filePath: string,
  outputFileName: string
): Promise<void> {
  const csvParser = new CsvParser();
  const rows = await csvParser.parseFromFile(filePath);
  await writeJsonFile(outputFileName, rows);
}
