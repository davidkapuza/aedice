

import DropDown from "@/core/ui/DropDown/DropDown";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import "./Header.styles.css";

export default function Header() {
  return (
    <header className="Header">
      <h1 className="flex-1">LOGO</h1>
      <p className="flex-1 text-xs whitespace-nowrap">
        {"Welcome back David Kapuza | You have 0 unread messages."}
      </p>
      <DropDown
        button={<EllipsisVerticalIcon className="w-4 h-4 dark:text-white" />}
        content={[
          { link: "#", text: "Account settings" },
          { link: "#", text: "Support" },
          { link: "#", text: "License" },
          { link: "/api/auth/signout", text: "Sign out" },
        ]}
      />
    </header>
  );
}
