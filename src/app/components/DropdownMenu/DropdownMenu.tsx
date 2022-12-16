"use client";
import { quitChat } from "@/lib/services/client/chats";
import { getChatFromPath } from "@/lib/utils/getChatFromPath";
import { Menu, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { signOut } from "next-auth/react";

export default function DropdownMenu() {
  const chat_id = getChatFromPath();

  const quit = async () => {
    await quitChat(chat_id!);
  };

  return (
    <Menu
      as="div"
      className="relative inline-flex justify-end flex-1 text-right"
    >
      <div>
        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <EllipsisVerticalIcon className="w-4 h-4 dark:text-white" />
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
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => quit()}
                  className={`${
                    active ? "text-black bg-gray-200" : "text-gray-800"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  Quit chat
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}
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
