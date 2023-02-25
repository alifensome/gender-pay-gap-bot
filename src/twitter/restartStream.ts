import Twit from "twit";
import { wait } from "../utils/wait";

export async function restartStream(stream: Twit.Stream) {
  console.log("restarting stream.");
  await wait(10000);
  stream.stop();
  await wait(10000);
  stream.start();
  console.log("started stream.");
}
