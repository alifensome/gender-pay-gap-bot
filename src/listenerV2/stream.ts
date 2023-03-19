import axios from "axios";
import dotEnv from "dotenv";
import { Stream } from "stream";
import { getEnvVar } from "../utils/getEnvVar";
import { replaceAll, replaceMultiple } from "../utils/replace";

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
  const { data } = await axios.get(
    "https://api.twitter.com/2/tweets/search/stream?tweet.fields=id,text&expansions=author_id&user.fields=id,name,username",
    {
      headers: {
        Authorization: `Bearer ${bt}`,
      },
      responseType: "stream",
    }
  );
  // console.log(data);
  // curl --request POST -u$API_KEY:$API_SECRET_KEY \
  //   --url 'https://api.twitter.com/oauth2/token?grant_type=client_credentials'

  const stream = data as Stream;

  stream.on("data", async (data: Buffer) => {
    // console.log(data.toJSON());
    // console.log(data.toString());
    // console.log(data.toLocaleString());
    const dataString = data.toString("utf-8");
    const dataNoNewLine = replaceMultiple(dataString, [
      { find: "\n" },
      { find: "\r" },
    ]);
    if (!dataNoNewLine) {
      return;
    }
    JSON.parse(dataNoNewLine);
    console.log({ data: dataString });

    // data.
    // if (data === null) throw new Error("No response returned from stream");
    // let buf = "";
    // for await (const chunk of data) {
    //   buf += chunk.toString();
    //   const lines = buf.split("\r\n");
    //   for (const [i, line] of lines.entries()) {
    //     if (i === lines.length - 1) {
    //       buf = line;
    //       console.log(JSON.parse(line));
    //     }
    //   }
    // }
  });

  stream.on("error", (data: Buffer) => {
    console.log(data);
    console.log({ data: data.toString("utf-8") });
  });

  stream.on("end", () => {
    console.log("stream done");
  });
}

run();

export interface TweetSearchStreamDataItem {
  data: Data;
  includes: Includes;
  matching_rules: MatchingRule[];
}

export interface Data {
  author_id: string;
  edit_history_tweet_ids: string[];
  id: string;
  text: string;
}

export interface Includes {
  users: User[];
}

export interface User {
  id: string;
  name: string;
  username: string;
}

export interface MatchingRule {
  id: string;
  tag: string;
}
