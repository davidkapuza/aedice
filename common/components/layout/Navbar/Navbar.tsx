import { authOptions } from "@api/auth/[...nextauth]";
import DropDown from "@components/features/DropDown/DropDown";
import IconButton from "@elements/buttons/IconButton/IconButton";
import Devider from "@elements/Devider/Devider";
import ChatIcon from "@icons/ChatIcon";
import { unstable_getServerSession } from "next-auth";

async function Navbar() {
  const session = await unstable_getServerSession(authOptions);

  const navigation = [
    { title: "Profile", path: "/profile" },
    { title: "Settings", path: "/settings" },
  ];
  return (
    <nav className="Navbar">
      <DropDown img={session?.user?.image} />
      <Devider />
      <IconButton link="/chat" tooltip="chat" icon={<ChatIcon />} />
    </nav>
  );
}

export default Navbar;
