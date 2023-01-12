import { UniqueIdSchema } from "@/core/validations";

export function getIdFromString(string: string | null): string | null {
  if (!string) return null;
  const id = UniqueIdSchema.safeParse(string.match(/(\w{26})/)?.[1]);
  if (!id.success) {
    return null;
  }
  return id.data;
}
