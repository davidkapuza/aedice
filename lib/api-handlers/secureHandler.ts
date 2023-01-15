import apiLimiter from "@/core/middlewares/apiLimiter";
import bearerAuth from "@/core/middlewares/bearerAuth";
import { RequestWithUser } from "@/core/types";
import type { NextApiResponse } from "next";
import { createRouter, expressWrapper } from "next-connect";
import cors from "cors";

const secureHandler = createRouter<RequestWithUser, NextApiResponse>();
secureHandler
  .use(expressWrapper(cors()))
  .use(bearerAuth)
  .use(apiLimiter);

export default secureHandler.clone();
