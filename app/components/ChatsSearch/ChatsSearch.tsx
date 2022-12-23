"use client";
import type { User } from "@/core/types";
import { Icons } from "@/core/ui/Icons/Icons";
import Loader from "@/core/ui/Loader/Loader";
import useDebounce from "@/lib/hooks/useDebounce";
import { searchChats } from "@/lib/services/client/chats";
import { Combobox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import useSWR from "swr";
import DefaultChatCard from "../DefaultChatCard/DefaultChatCard";

type Props = {
  user: User;
};

export default function ChatsSearch({ user }: Props) {
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
  const noResults = debouncedValue.length > 2 && !chats?.length && !isLoading;

  return (
    <Combobox value={query}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <div className="relative top-0 w-full">
              <span
                className={`absolute inset-y-0 left-0 flex items-center pl-4 text-white ${
                  open ? "text-white" : "text-gray-500"
                }`}
              >
                {(isLoading || isDebouncing) && query ? (
                  <Loader />
                ) : (
                  <Icons.search size={16} />
                )}
              </span>

              <Combobox.Input
                className="w-full py-2 pl-10 pr-10 text-xs leading-5 text-left text-white placeholder-gray-500 bg-black border border-gray-500 rounded-lg focus:border-white focus:ring-0 focus:outline-none"
                displayValue={(value: string) => value}
                placeholder="Search..."
                onChange={(event) => setQuery(event.target.value)}
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
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <ul className="w-full py-1 mt-1 text-base bg-transparent cursor-default focus:outline-none">
                {noResults ? (
                  <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                    Nothing found.
                  </div>
                ) : (
                  debouncedValue.length > 2 &&
                  chats?.map((chat) => (
                    <DefaultChatCard
                      key={chat.chat_id}
                      user={user}
                      chat={chat}
                    />
                  ))
                )}
              </ul>
            </Transition>
          </div>
        </>
      )}
    </Combobox>
  );
}
