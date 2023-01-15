"use client";
import type { User } from "@/core/types";
import Glow from "@/core/ui/Glow/Glow";
import { Icons } from "@/core/ui/Icons/Icons";
import Loader from "@/core/ui/Loader/Loader";
import useChatsSearch from "@/lib/hooks/swr/useChatsSearch";
import useDebounce from "@/lib/hooks/useDebounce";
import useOutsideClick from "@/lib/hooks/useOutsideClick";
import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import PublicChatCard from "../PublicChatCard/PublicChatCard";

type Props = {
  user: User;
  children: React.ReactNode;
};

export default function ChatsSearch({ user, children }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { debouncedValue, isDebouncing } = useDebounce(query, 500);
  const { chats, isLoading } = useChatsSearch(debouncedValue);
  useEffect(() => {
    setOpen(() => debouncedValue.length > 2);
  }, [debouncedValue]);

  const ref = useOutsideClick<HTMLDivElement>(() => {
    setOpen(() => !!chats?.length);
  }, ["button"]);

  return (
    <div ref={ref} className="relative">
      <div className="sticky top-0 z-10 w-full mb-1">
        <span
          className={`absolute inset-y-0 left-0 flex items-center pl-4 text-white ${
            open ? "text-white" : "text-gray-200"
          }`}
        >
          {(isLoading || isDebouncing) && query ? (
            <Loader className="h-3.5 w-3.5" />
          ) : (
            <Icons.search size={16}/>
          )}
        </span>
        <Glow border="rounded-lg ">
          <input
            autoComplete="off"
            className="w-full h-10 py-2 pl-10 pr-10 text-sm leading-5 text-left text-white placeholder-gray-500 bg-transparent focus:ring-0 focus:outline-none"
            value={query}
            placeholder="Search..."
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() =>
              query.length > 2 && !!chats?.length && setOpen(true)
            }
          />
        </Glow>
        {query && (
          <button
            disabled={!query}
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-white"
          >
            <Icons.xcircle size={13} className="z-20"/>
          </button>
        )}
      </div>
      <div>
        <Transition
          as={Fragment}
          show={open}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ul className="w-full py-1 text-base bg-transparent cursor-default focus:outline-none">
            {chats?.map((chat) => (
              <PublicChatCard key={chat.chat_id} user={user} chat={chat} />
            ))}
          </ul>
        </Transition>
        {debouncedValue.length > 2 && !isLoading && !chats?.length && (
          <div className="relative px-4 py-2 text-sm text-white cursor-default select-none">
            Nothing found.
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
