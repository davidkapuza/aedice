import * as z from "zod";

export const UniqueIdSchema = z.string().length(26);

export const MessageTextSchema = z.string().min(1).max(320);

export const NameSchema = z.string().min(6).max(30);

export const ImageSchema = z.string();

export const QuerySchema = z.string().min(2).max(30);

export const RolesSchema = z.enum(['owner', 'admin', 'member']);

