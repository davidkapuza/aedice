"use client";

import { useState } from "react";
import useSWR from "swr";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import UsersSearchItem from "../UsersSearchItem/UsersSearchItem";
import "./UsersSearch.styles.css";

async function searchUsers(query: string) {
  const response = await fetch(query);
  if (!response?.ok) {
    console.log("Err..");
    return;
  }
  const { users } = await response.json();
  return users;
}

function UsersSearch() {
  const [search, setSearch] = useState("");

  const { data: users, error } = useSWR(
    () => (search ? `/api/users/searchUserByEmail?q=${search}` : null),
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
          (users?.map((user: any) => (
            <UsersSearchItem key={user.id} user={user} />
          )) || <p className="text-white">"Loading..."</p>)}
      </ul>
    </>
  );
}

export default UsersSearch;
