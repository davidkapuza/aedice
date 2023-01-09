"use client";
import { User } from "@/core/types";
import Avatar from "@/core/ui/Avatar/Avatar";
import { Icons } from "@/core/ui/Icons/Icons";
import Dropdown from "app/components/Dropdown/Dropdown";
import { signOut } from "next-auth/react";

function HeaderDropdownMenu({ user }: { user: User }) {
  return (
    <Dropdown
      button={
        <Avatar src={user.image} className="w-7">
          <Icons.status className="absolute bottom-0 right-0 z-20 text-black" />
        </Avatar>
      }
      items={[
        {
          label: "Signout",
          icon: <Icons.logout className="w-4 h-4 mr-3" />,
          onClick: () => signOut(),
        },
      ]}
    />
  );
}

export default HeaderDropdownMenu;
