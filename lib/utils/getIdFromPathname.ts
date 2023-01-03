import { UniqueIdSchema } from "@/core/validations";
import { usePathname } from "next/navigation";
import { fromZodError } from "zod-validation-error";

export function getIdFromPathname(): string | null {
  const pathname = usePathname();
  const id = UniqueIdSchema.safeParse(/[^/]*$/.exec(pathname!)?.[0]);
  if (!id.success) {
    return null;
  }
  return id.data;
}
