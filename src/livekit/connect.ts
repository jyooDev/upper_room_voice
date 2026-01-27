import {
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
  dispose,
} from "@livekit/rtc-node";
import config from "../config/config";

export async function startLiveKit(roomName: string, token: string) {
  const url = config.livekitUri;

  if (!url) {
    throw new Error("LIVEKIT_URL is missing in .env");
  }

  console.log("Connecting to LiveKit…");

  const room = new Room();

  room.on(RoomEvent.ConnectionStateChanged, (state) => {
    console.log(`LiveKit State: ${state}`);
  });

  room.on(
    RoomEvent.TrackSubscribed,
    (
      track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant,
    ) => {
      handleTrackSubscribed(track, publication, participant);
    },
  );
  room.on(RoomEvent.Disconnected, handleDisconnected);

  await room.connect(url, token, {
    autoSubscribe: true,
    dynacast: true,
  });

  process.on("SIGINT", async () => {
    await room.disconnect();
    await dispose();
  });
}

function handleTrackSubscribed(
  track: RemoteTrack,
  publication: RemoteTrackPublication,
  participant: RemoteParticipant,
) {}

function handleDisconnected() {}
