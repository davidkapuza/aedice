import IconButton from "@/core/ui/IconButton/IconButton";
import { Icons } from "@/core/ui/Icons/Icons";
import Tooltip from "@/core/ui/Tooltip/Tooltip";
import { getCurrentUser } from "@/lib/session";
import "./Header.styles.css";
import HeaderDropdownMenu from "./HeaderDropdownMenu";

export default async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="Header">
      <div className="inline-flex items-center gap-3">
        <HeaderDropdownMenu user={user} />
        <span>
          <small className="text-xs text-gray-500">Welcome back,</small>
          <h1 className="leading-[15px] mb-3">{user.name}</h1>
        </span>
      </div>

      <h1 className="hidden text-center sm:block">Aedice</h1>

      <div className="flex flex-row items-center justify-end gap-6">
        <Tooltip>
          <IconButton
            icon={<Icons.bell className="w-3 h-3" />}
            badge="5"
            badgeStyles="absolute left-1 top-0.5 px-1 aspect-square min-h-[18px]"
          />
        </Tooltip>
        <a
          href="https://github.com/davidkapuza/aedice"
          target="_blank"
          className="hidden Link md:inline"
        >
          <Icons.github size={12} />
        </a>
      </div>
    </header>
  );
}
