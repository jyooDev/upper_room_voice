import { generateLivekitToken } from "../utils/generateToken";
const room = "test-room";
const identity = "voice-server";

async function main() {
  const token = await generateLivekitToken(room, identity);
  console.log("Generated Token:\n", token);
}

main();
