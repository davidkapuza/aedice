"use client";
import { quitChat } from "@/lib/services/client/chats";
import { getChatFromPath } from "@/lib/utils/getChatFromPath";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { signOut } from "next-auth/react";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="1.5" cy="1.5" r="1.3" fill="currentColor" />
      <circle cx="8.75" cy="1.5" r="1.3" fill="currentColor" />
      <circle cx="1.5" cy="8.75" r="1.3" fill="currentColor" />
      <circle cx="8.75" cy="8.75" r="1.3" fill="currentColor" />
    </svg>
  );
}
type Props = {
  user_chat_id: string;
};

export default function DropdownMenu({ user_chat_id }: Props) {
  const router = useRouter();
  const chat_id = getChatFromPath();
  const quit = async () => {
    router.push(`/chat`);
    await quitChat(chat_id!);
  };

  return (
    <Menu
      as="div"
      className="relative inline-flex justify-end flex-1 text-right"
    >
      <div>
        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <MenuIcon className="w-3 h-3 dark:text-white" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg top-10 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item disabled={user_chat_id === chat_id}>
              {({ active, disabled }) => (
                <button
                  onClick={() => quit()}
                  className={`${
                    disabled
                      ? "text-gray-500 cursor-not-allowed"
                      : active
                      ? "text-black bg-gray-200"
                      : "text-gray-800"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <ArrowLeftCircleIcon className="w-4 h-4 mr-3" />
                  Quit chat
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() =>
                    signOut({ callbackUrl: "http://localhost:3000/" })
                  }
                  className={`${
                    active ? "text-black bg-gray-200" : "text-gray-800"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <ArrowLeftOnRectangleIcon className="w-4 h-4 mr-3" />
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
