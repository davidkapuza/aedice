"use client";
import { useState } from "react";
import useSWR from "swr";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import UsersSearchItem from "../UsersSearchItem/UsersSearchItem";
import "./UsersSearch.styles.css";
import useDebounce from "@/lib/hooks/useDebounce";
import { searchUsers } from "@/lib/services/client/users";

function UsersSearch({ user }: any) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { data: users, error } = useSWR(
    () => (debouncedSearch ? `/api/users/search?q=${debouncedSearch}` : null),
    searchUsers
  );
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
        {search &&
          (users?.map((owner: any) => (
            <UsersSearchItem key={owner.id} owner={owner} user={user} />
          )) || <p className="text-white">"Loading..."</p>)}
      </ul>
    </>
  );
}

export default UsersSearch;
