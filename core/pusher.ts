import Pusher from "pusher";
import ClientPusher from "pusher-js";

export const serverPusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "eu",
  useTLS: true,
});

export const clientPusher = new ClientPusher("a6439a174650a7871d35", {
  cluster: "eu",
  forceTLS: true,
  userAuthentication: { endpoint: "/api/pusher/user-auth", transport: "ajax" },
  channelAuthorization: { endpoint: "/api/pusher/auth", transport: "ajax" },
});
