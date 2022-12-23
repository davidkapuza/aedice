"use client";
import type { User } from "@/core/types";
import useDebounce from "@/lib/hooks/useDebounce";
import { searchChats } from "@/lib/services/client/chats";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import useSWR from "swr";
import ChatCard from "../DefaultChatCard/DefaultChatCard";
import "./Search.styles.css";

type Props = {
  user: User;
};

function Search({ user }: Props) {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const { data: chats, isLoading } = useSWR(
    () =>
      debouncedSearch.length > 2
        ? `/api/chats/search?q=${debouncedSearch}`
        : null,
    searchChats,
    {
      keepPreviousData: true,
    }
  );
  const noResults = debouncedSearch.length > 2 && !chats?.length && !isLoading;
  return (
    <>
      <div className="Search">
        <div className="Search-icon">
          <MagnifyingGlassIcon className="w-4 h-4 dark:text-white" />
        </div>
        <input
          autoComplete="off"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          id="users-search-input"
          className="Search-input"
          placeholder="Search..."
        />
      </div>

      <ul>
        {debouncedSearch &&
          chats?.map((chat) => (
            <ChatCard key={chat.chat_id} chat={chat} user={user} />
          ))}
        {noResults && <p className="text-sm text-white">No results.</p>}
      </ul>
    </>
  );
}

export default Search;
