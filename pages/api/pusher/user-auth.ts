import { serverPusher } from "@/core/pusher";
import type { RequestWithUser } from "@/core/types";
import secureHandler from "@/lib/api-handlers/secureHandler";
import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";

const router = createRouter<RequestWithUser, NextApiResponse>();

router.use(secureHandler).all(async (req, res) => {
  const socketId = req.body.socket_id;
  const user = {
    id: req.user.id,
    user_info: {
      name: req.user.name,
    },
  };
  const authResponse = serverPusher.authenticateUser(socketId, user);
  return res.send(authResponse);
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err);
    res.status(403).end("Access denied");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});
