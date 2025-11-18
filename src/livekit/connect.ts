import {
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  dispose,
} from "@livekit/rtc-node";
import dotenv from "dotenv";

dotenv.config();

export async function startLiveKit() {
  const url = process.env.LIVEKIT_URL;
  const token = process.env.LIVEKIT_TOKEN;

  if (!url || !token) {
    throw new Error("LIVEKIT_URL or LIVEKIT_TOKEN is missing in .env");
  }

  console.log("Connecting to LiveKit…");

  const room = new Room();

  room.on(RoomEvent.ConnectionStateChanged, (state) => {
    console.log(`LiveKit State: ${state}`);
  });

  room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
  room.on(RoomEvent.Disconnected, handleDisconnected);

  await room.connect(url, token, {
    autoSubscribe: true,
    dynacast: true,
  });
}

function handleTrackSubscribed() {}

function handleDisconnected() {}
