import ElipsisIcon from "@core/icons/ElipsisIcon";
import { DropDown, IconButton } from "@core/ui";
import AvatarsGroup from "@core/ui/AvatarsGroup/AvatarsGroup";
import Image from "next/image";
import "./Header.styles.css";

export default function Header() {
  return (
    <header className="Header">
      <h1 className="flex-1">LOGO</h1>
      <p className="flex-1 text-xs whitespace-nowrap">{"Welcome back David Kapuza | You have 0 unread messages."}</p>
      <DropDown
        button={<ElipsisIcon />}
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
