import Avatar from "@/core/ui/Avatar/Avatar";
import { getCurrentUser } from "@/lib/session";
import DropdownMenu from "app/components/DropdownMenu/DropdownMenu";
import Image from "next/image";
import "./Header.styles.css";

export default async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="Header">
      <div className="inline-flex items-center flex-1 gap-4">
        <Avatar src={user?.image!} className="w-7 h-7" />
        <span className="flex flex-col">
          <small className="text-gray-500 text-[10px]">Welcome back,</small>
          <h1 className="flex-1 font-sans font-medium">{user?.name}</h1>
        </span>
      </div>
      <div className="flex justify-center">
        <Image
          className="pt-1.5"
          width={100}
          height={20}
          src="/static/logo.svg"
          alt="Logo"
        />
      </div>
      <DropdownMenu user={user} />
    </header>
  );
}
