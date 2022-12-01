import React from "react";
import Image from "next/image";

function SearchItem({ user }: any) {
  return (
    <li key={user.id} className="Users-list-item">
      <Image className="Avatar mr-2" width={40} height={40} src={user.image} alt="Avatar"></Image>
      <div>
        <h1 className="text-sm leading-3">{user.name}</h1>
        <span className="text-xs text-gray-500">{user.email}</span>
      </div>
    </li>
  );
}

export default SearchItem;
