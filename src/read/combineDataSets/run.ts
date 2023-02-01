import { isDebugMode } from "../../utils/debug";
import { combineDataWriteFile } from "./combineDataWriteFile";

const debug = isDebugMode();

combineDataWriteFile(debug);
