import Avatar from "@/core/ui/Avatar/Avatar";
import IconButton from "@/core/ui/IconButton/IconButton";
import { Icons } from "@/core/ui/Icons/Icons";
import { getCurrentUser } from "@/lib/session";
import DropdownMenu from "app/components/DropdownMenu/DropdownMenu";
import "./Header.styles.css";

export default async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="Header">
      <DropdownMenu user={user} />
      
      <h1 className="text-center">Aedice</h1>
      
      <div className="flex flex-row items-center justify-end gap-6">
        <IconButton
          icon={<Icons.bell className="w-3 h-3" />}
          badge="5"
          badgeStyles="absolute left-1 top-0.5 px-1 aspect-square min-h-[18px]"
          tooltip="Feature in progress... 👷"
          tooltipOrigin="right"
        />
        <a
          href="https://github.com/davidkapuza/aedice"
          target="_blank"
          className="Link"
        >
          <Icons.github size={12} />
        </a>
      </div>
    </header>
  );
}
