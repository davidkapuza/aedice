"use client";
import useDebounce from "@lib/hooks/useDebounce";
import { searchUserByEmail } from "@services/client/users";
import { useState } from "react";
import useSWR from "swr";
import SearchIcon from "@core/icons/SearchIcon";
import UsersSearchItem from "../UsersSearchItem/UsersSearchItem";
import "./UsersSearch.styles.css";

function UsersSearch() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const { data: users, error } = useSWR(
    () =>
      debouncedSearch
        ? `/api/users/searchUserByEmail?q=${debouncedSearch}`
        : null,
    searchUserByEmail
  );
  return (
    <>
      <div className="Search">
        <div className="Search-icon">
          <SearchIcon />
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
          )) ||
            "Loading...")}
      </ul>
    </>
  );
}

export default UsersSearch;
