import type { RequestWithUser } from "@/core/types";
import type { NextApiResponse } from "next";
import { UniqueIdSchema } from "../../core/validations";
import { chatsRepository } from "../services/redis";

import ac from "server/services/accesscontrol";

export const checkAccess =
  (resource: string, action: string) =>
  async (
    req: RequestWithUser,
    res: NextApiResponse,
    next: () => Promise<void> | void
  ) => {
    let permission;
    try {
      if (resource === "messages") {
        const chat_id = UniqueIdSchema.parse(req.query.chat_id);
        const chat = await chatsRepository.fetch(chat_id);
        if (!chat.member_ids.includes(req.user.id)) {
          permission = { granted: false };
        } else {
          permission = ac.permission({
            role: req.user?.role,
            resource,
            action,
          });
        }
        return await next();
      }
      permission = ac.permission({
        role: req.user?.role,
        resource,
        action,
      });
    } catch {
      permission = { granted: false };
    }

    if (!permission.granted) {
      return res.status(403).json({
        ok: false,
        message: "You are not authorized to access this resource",
      });
    }

    return await next();
  };
