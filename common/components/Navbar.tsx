import Devider from "./Devider";
import ProfileDropDown from "./ProfileDropDown";
import { unstable_getServerSession } from "next-auth";
import SignOutBtn from "./SignOutBtn";
import Link from "next/link";
import IconLink from "./IconLink";
import ChatIcon from "./icons/ChatIcon";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

async function Navbar() {
  const session = await unstable_getServerSession(authOptions);

  const navigation = [
    { title: "Profile", path: "/profile" },
    { title: "Settings", path: "/settings" },
  ];
  return (
    <nav className="Navbar">
      <ProfileDropDown
        img={session?.user?.image}
        content={
          <ul>
            {navigation.map((item) => (
              <li key={item.path}>
                <Link
                  className="block hover:text-gray-600 hover:bg-gray-50 p-2.5 rounded"
                  href={item.path}
                >
                  {item.title}
                </Link>
              </li>
            ))}
            <li>
              <SignOutBtn />
            </li>
          </ul>
        }
      />
      <Devider />

      <IconLink link="/chat" icon={<ChatIcon/>} />
    </nav>
  );
}

export default Navbar;
