"use client";
import debounce from "lodash.debounce";
import React, { useMemo, useState } from "react";
import SearchIcon from "../../icons/SearchIcon";
import SearchItem from "../SearchItem/SearchItem";
import "./UsersSearch.styles.css";

function UsersSearch() {
  const [users, setUsers] = useState([]);

  const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    if (q.length > 2) {
      const params = new URLSearchParams({ q });
      const res = await fetch("/api/users/searchUsers?" + params);
      const { users } = await res.json();
      setUsers(users);
    } else {
      setUsers([]);
    }
  };

  const debouncedSearch = useMemo(() => debounce(search, 300), []);

  return (
    <>
      <div className="Search">
        <div className="Search-icon">
          <SearchIcon />
        </div>
        <input
          type="text"
          onChange={debouncedSearch}
          id="users-search-input"
          className="Search-input"
          placeholder="Search..."
        />
      </div>

      <ul>
        {users?.map((user: any) => {
          return <SearchItem key={user.id} user={user} />;
        })}
      </ul>
    </>
  );
}

export default UsersSearch;
