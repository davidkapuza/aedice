import { usePathname } from "next/navigation";

export function getChatFromPath (): string {
  const pathname = usePathname()
  return /[^/]*$/.exec(pathname!)?.[0]!;
}