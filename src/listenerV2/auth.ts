import axios from "axios";
import dotEnv from "dotenv";
import { getEnvVar } from "../utils/getEnvVar";

dotEnv.config();

const apiKey = getEnvVar("TWITTER_API_KEY");
const apiSecret = getEnvVar("TWITTER_API_SECRET");
async function getBearerToken(): Promise<string> {
  const { data } = await axios.post(
    "https://api.twitter.com/oauth2/token?grant_type=client_credentials",
    {},
    {
      auth: {
        username: apiKey,
        password: apiSecret,
      },
      headers: {},
    }
  );
  return data.access_token;
}

async function run() {
  const bt = await getBearerToken();

  console.log(bt);
}

run();
