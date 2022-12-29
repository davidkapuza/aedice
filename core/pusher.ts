import Pusher from "pusher";
import ClientPusher from "pusher-js";

export const serverPusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "eu",
  useTLS: true,
});

export const clientPusher = new ClientPusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: "eu",
  activityTimeout: 60,
  forceTLS: true,
  userAuthentication: { endpoint: "/api/pusher/user-auth", transport: "ajax" },
  channelAuthorization: { endpoint: "/api/pusher/auth", transport: "ajax" },
});

// ClientPusher.log = (message) => {
//   if (window.console && window.console.log) {
//     window.console.log(message);
//   }
// };