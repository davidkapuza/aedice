import apiLimiter from "server/middlewares/apiLimiter";
import bearerAuth from "server/middlewares/bearerAuth";
import { RequestWithUser } from "@/core/types";
import type { NextApiResponse } from "next";
import { createRouter } from "next-connect";

const secureHandler = createRouter<RequestWithUser, NextApiResponse>();
secureHandler.use(bearerAuth).use(async (req, res, next) => {
  try {
    await apiLimiter.check(res, 300, req.user.id); // 300 request's per minute
    await next();
  } catch (e) {
    return res.status(429).send({ message: "Request rate limit exceeded" });
  }
});

export default secureHandler.clone();
