import React from "react";
import MessageInput from "./MessageInput";
import MessagesList from "./MessagesList";

function Home() {
  return (
    <main>
      <MessagesList />
      <MessageInput />
    </main>
  );
}

export default Home;
