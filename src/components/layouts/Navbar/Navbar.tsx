import "./Navbar.styles.css"
import { authOptions } from "@api/auth/[...nextauth]";
import DropDown from "@ui/DropDown/DropDown";
import IconButton from "@ui/IconButton/IconButton";
import ChatIcon from "src/core/icons/ChatIcon";
import { unstable_getServerSession } from "next-auth";
import Image from "next/image";
import Airplane from "@core/icons/AirplaneIcon";

async function Navbar() {
  const session = await unstable_getServerSession(authOptions);

  const navigation = [
    { title: "Profile", path: "/profile" },
    { title: "Settings", path: "/settings" },
  ];

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
      <IconButton link="/1" tooltip="chat1" icon={<ChatIcon />} />
      <IconButton link="/2" tooltip="chat2" icon={<Airplane />} />
    </nav>
  );
}

export default Navbar;
