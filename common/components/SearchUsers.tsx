"use client";
import React, { useState } from "react";

function SearchUsers() {
  const [hits, setHits] = useState([]);
  const search = async (e: any) => {
    const q = e.target.value;
    if (q.length > 2) {
      const params = new URLSearchParams({ q });
      const res = await fetch("./api/search?" + params);
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
        {hits?.map((hit) => (
          <li key={Math.random()}>
            {JSON.parse(hit)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchUsers;
