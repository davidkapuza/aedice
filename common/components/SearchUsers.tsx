"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import debounce from "lodash.debounce";

function SearchUsers() {
  // const [query, setQuery] = useState("");
  const [hits, setHits] = useState([]);

  
  const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;


    if (q.length > 2) {
      const params = new URLSearchParams({ q });
      const res = await fetch("./api/users/searchUsers?" + params);
      const result = await res.json();
      setHits(result["users"]);

    } else {
      setHits([])
    }
  };
  const debouncedSearch = useMemo(() => debounce(search, 300), [hits]);
  return (
    <div>
      <input
        onChange={debouncedSearch}
        type="text"
        placeholder="SearchUsers for friends..."
      ></input>
      <ul>
        {
          hits?.map((hit) => {
            const user = JSON.parse(hit);
            return (
              <li key={user.id}>
                <Image
                  width={40}
                  height={40}
                  src={user.image}
                  alt="avatar"
                ></Image>
                {user.email}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default SearchUsers;
