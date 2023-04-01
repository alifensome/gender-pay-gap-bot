import { config } from "dotenv";
config();
console.log(process.env);
import { handler } from "./handler";
handler();
