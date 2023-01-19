import { serverPusher } from "server/services/pusher";
import type { RequestWithUser } from "@/core/types";
import secureHandler from "server/api-handlers/secureHandler";
import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { fromZodError } from "zod-validation-error";
import * as z from "zod";

const router = createRouter<RequestWithUser, NextApiResponse>();

router.use(secureHandler).get(async (req, res) => {
  const socketId = req.body.socket_id;
  const user = {
    id: req.user.id,
    user_info: req.user,
  };
  const authResponse = serverPusher.authenticateUser(socketId, user);
  return res.send(authResponse);
});

export default router.handler({
  onNoMatch: (req, res) =>
    res.status(404).send({
      message: `API route not found: ${req.url}`,
    }),

  onError: (err, req, res) => {
    if (err instanceof z.ZodError) {
      const zodErr = fromZodError(err);
      console.error(zodErr);
      return res.status(422).json(zodErr);
    }
    console.error(err);
    res.status(500).send({
      message: `Unexpected error.`,
      error: err,
    });
  },
});
