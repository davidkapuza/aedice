import { authOptions } from "@api/auth/[...nextauth]";
import Airplane from "@core/icons/AirplaneIcon";
import ChatIcon from "@core/icons/ChatIcon";
import { DropDown, IconButton } from "@ui/index";
import { unstable_getServerSession } from "next-auth";
import Image from "next/image";
import "./Navbar.styles.css";

async function Navbar() {
  const session = await unstable_getServerSession(authOptions);
  return (
    <nav className="Navbar">
      <DropDown
        button={
          <Image
            width={30}
            height={30}
            src={session?.user?.image || ""}
            alt="Profile"
            className="Avatar"
          />
        }
        content={[
          { link: "#", text: "Account settings" },
          { link: "#", text: "Support" },
          { link: "#", text: "License" },
          { link: "/api/auth/signout", text: "Sign out" },
        ]}
      />
      <IconButton link="/chat/2" tooltip="chat2" icon={<ChatIcon />} />
      <IconButton link="/chat/1" tooltip="chat1" icon={<Airplane />} />
    </nav>
  );
}

export default Navbar;
