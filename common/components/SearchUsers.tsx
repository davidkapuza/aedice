"use client";
import Image from "next/image";
import React, { useState } from "react";

function SearchUsers() {
  const [q, setQuery] = useState("");
  const [hits, setHits] = useState([]);
  const search = async (e: any) => {
    setQuery(() => e.target.value);
    const q = e.target.value;
    if (q.length > 2) {
      const params = new URLSearchParams({ q });
      const res = await fetch("./api/users/searchUsers?" + params);
      const result = await res.json();
      setHits(result["users"]);
    }
  };
  return (
    <div>
      <input
        onChange={search}
        type="text"
        placeholder="SearchUsers for friends..."
      ></input>
      <ul>
        {q &&
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
