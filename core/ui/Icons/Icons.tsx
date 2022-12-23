import {
  Github,
  LogOut,
  ArrowLeftCircle,
  Mail,
  Search,
  XCircle,
  CheckCheck
} from "lucide-react"
import type { Icon as LucideIcon } from "lucide-react"
import { SVGProps } from "react";

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="1.5" cy="1.5" r="1.3" fill="currentColor" />
      <circle cx="8.75" cy="1.5" r="1.3" fill="currentColor" />
      <circle cx="1.5" cy="8.75" r="1.3" fill="currentColor" />
      <circle cx="8.75" cy="8.75" r="1.3" fill="currentColor" />
    </svg>
  );
}

export type Icon = LucideIcon

export const Icons = {
  github: Github,
  menu: MenuIcon,
  logout: LogOut,
  arrowLeftCircle: ArrowLeftCircle,
  mail: Mail,
  search: Search,
  xcircle: XCircle,
  checkCheck: CheckCheck,
}
