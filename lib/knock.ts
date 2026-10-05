import { Knock } from "@knocklabs/node";

export const knock = new Knock(String(process.env.NEXT_PUBLIC_KNOCK_API_KEY));

const CHANNEL_ID = String(process.env.NEXT_PUBLIC_KNOCK_FCM_CHANNEL_ID);

// Example function to save the token in Knock for a specific user
export async function saveDeviceToken(userId: string, deviceToken: string) {
  await knock.users.setChannelData(userId, CHANNEL_ID, {
    tokens: [deviceToken],
  });
}