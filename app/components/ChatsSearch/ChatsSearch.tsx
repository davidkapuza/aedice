"use client";
import type { User } from "@/core/types";
import { Icons } from "@/core/ui/Icons/Icons";
import Loader from "@/core/ui/Loader/Loader";
import useDebounce from "@/lib/hooks/useDebounce";
import useOutsideClick from "@/lib/hooks/useOutsideClick";
import { searchChats } from "@/lib/services/client/chats";
import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import useSWR from "swr";
import DefaultChatCard from "../DefaultChatCard/DefaultChatCard";

type Props = {
  user: User;
};

export default function ChatsSearch({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { debouncedValue, isDebouncing } = useDebounce(query, 500);
  const { data: chats, isLoading } = useSWR(
    () =>
      debouncedValue.length > 2
        ? `/api/chats/search?q=${debouncedValue}`
        : null,
    searchChats,
    {
      keepPreviousData: true,
    }
  );
  useEffect(() => {
    setOpen(() => debouncedValue.length > 2 && !!chats?.length);
  }, [debouncedValue]);

  const ref = useOutsideClick<HTMLDivElement>(() => {
    setOpen(() => !!chats?.length);
  }, ["button"]);

  return (
    <div ref={ref} className="relative mt-1">
      <div className="relative top-0 w-full mb-1">
        <span
          className={`absolute inset-y-0 left-0 flex items-center pl-4 text-white ${
            open ? "text-white" : "text-gray-500"
          }`}
        >
          {(isLoading || isDebouncing) && query ? (
            <Loader className="h-3.5 w-3.5" />
          ) : (
            <Icons.search size={16} />
          )}
        </span>

        <input
          autoComplete="off"
          className="w-full py-2 pl-10 pr-10 text-xs leading-5 text-left text-white placeholder-gray-500 bg-black border border-gray-500 rounded-lg focus:border-white focus:ring-0 focus:outline-none"
          value={query}
          placeholder="Search..."
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() =>
            debouncedValue.length > 2 && !!chats?.length && setOpen(true)
          }
        />
        {query && (
          <button
            disabled={!query}
            onClick={() => setQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-white"
          >
            <Icons.xcircle size={13} />
          </button>
        )}
      </div>
      <Transition
        as={Fragment}
        show={open}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ul className="w-full py-1 text-base bg-transparent cursor-default focus:outline-none">
          {chats?.map((chat) => (
            <DefaultChatCard key={chat.chat_id} user={user} chat={chat} />
          ))}
        </ul>
      </Transition>
      {debouncedValue.length > 2 && !isLoading && !chats?.length && (
        <div className="relative px-4 py-2 text-xs text-white cursor-default select-none">
          Nothing found.
        </div>
      )}
    </div>
  );
}
