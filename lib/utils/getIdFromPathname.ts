import { usePathname } from "next/navigation";

export function getIdFromPathname (): string {
  const pathname = usePathname()
  return /[^/]*$/.exec(pathname!)?.[0]!;
}