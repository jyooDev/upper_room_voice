// src/livekit/roomService.ts
import { RoomServiceClient, type Room } from "livekit-server-sdk";
import config from "../config/config";

const roomService = new RoomServiceClient(
  config.livekitUri,
  config.livekitApikey,
  config.livekitSecret,
);

export async function getRoomBySermonId(
  sermonId: string,
): Promise<Room | null> {
  const prefix = `sermon-${sermonId}-`;

  const rooms = await roomService.listRooms();

  for (const room of rooms) {
    if (room.name.startsWith(prefix)) {
      return room;
    }
  }

  return null;
}
