"use client";
import { User } from "@/core/types";
import Avatar from "@/core/ui/Avatar/Avatar";
import { Icons } from "@/core/ui/Icons/Icons";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import { Fragment } from "react";

type DropdownMenuProps = {
  user: User;
};

export default function DropdownMenu({ user }: DropdownMenuProps) {
  return (
    <Menu
      as="div"
      className="relative"
    >
      <div>
        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <div className="inline-flex items-center flex-1 gap-4">
            <Avatar src={user?.image!} className="w-7 h-7" />
            <span className="flex flex-col text-left">
              <small className="text-gray-500 text-[10px]">Welcome back,</small>
              <h1 className="flex-1 text-base">{user?.name}</h1>
            </span>
          </div>
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
        <Menu.Items className="absolute w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg left-8 top-12 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => signOut()}
                  className={`${
                    active ? "text-black bg-gray-200" : "text-gray-800"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <Icons.logout className="w-4 h-4 mr-3" />
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
