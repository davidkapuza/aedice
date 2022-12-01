"use client";
import debounce from "lodash.debounce";
import React, { useMemo, useState } from "react";
import SearchIcon from "../../icons/SearchIcon";
import SearchItem from "../SearchItem/SearchItem";

function Search() {
  const [hits, setHits] = useState([]);
  const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    if (q.length > 2) {
      const params = new URLSearchParams({ q });
      const res = await fetch("./api/users/searchUsers?" + params);
      const result = await res.json();
      setHits(result["users"]);
    } else {
      setHits([]);
    }
  };
  const debouncedSearch = useMemo(() => debounce(search, 300), [hits]);
  return (
    <>
      <div className="Search-group">
        <div className="Search-group-icon">
          <SearchIcon />
        </div>
        <input
          type="text"
          onChange={debouncedSearch}
          id="users-search-input-group"
          className="Search-group-input"
          placeholder="Search..."
        />
      </div>

      <ul>
        {hits?.map((hit) => {
          const user = JSON.parse(hit);
          return <SearchItem user={user} />;
        })}
      </ul>
    </>
  );
}

export default Search;
