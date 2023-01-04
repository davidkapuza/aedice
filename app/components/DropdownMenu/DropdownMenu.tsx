"use client";
import { User } from "@/core/types";
import { Icons } from "@/core/ui/Icons/Icons";
import useChats from "@/lib/hooks/swr/useChats";
import { getIdFromPathname } from "@/lib/utils/getIdFromPathname";
import { Menu, Transition } from "@headlessui/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import useSWRMutation from "swr/mutation";

type DropdownMenuProps = {
  user: User;
};

async function quitChat(url: string, { arg }: { arg: string }) {
  await fetch(`${url}/${arg}`, { method: "DELETE" });
}

export default function DropdownMenu({ user }: DropdownMenuProps) {
  const router = useRouter();
  const chat_id = getIdFromPathname();
  const { chats } = useChats();
  const user_chat_id = chats?.find(
    (chat) => chat.chat_owner_id === user?.id
  )?.chat_id;
  const { trigger, isMutating } = useSWRMutation("/api/chats", quitChat);
  const quit = async () => {
    if (!chat_id) return;
    router.push(`/chat`);
    trigger(chat_id);
  };

  return (
    <Menu
      as="div"
      className="relative inline-flex justify-end flex-1 text-right"
    >
      <div>
        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          <Icons.menu className="w-3 h-3 dark:text-white" />
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
            <Menu.Item disabled={chat_id === null || user_chat_id === chat_id}>
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
                  <Icons.arrowLeftCircle className="w-4 h-4 mr-3" />
                  Quit chat
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() =>
                    signOut({
                      callbackUrl:
                        process.env.NEXT_PUBLIC_VERCEL_URL ||
                        "http://localhost:3000",
                    })
                  }
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
