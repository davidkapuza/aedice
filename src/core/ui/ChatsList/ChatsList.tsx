import { Session } from "next-auth";
import React from "react";
import ChatsListItem from "../ChatsListItem/ChatsListItem";

type Props = {
  chats: any;
  // session: Session | null;
};

function ChatsList({ chats, /* session */ }: Props) {
  return (
    <ul>
      <h1 className="py-3 dark:text-white">Chats.</h1>
      {chats.map(({ members, chat_id }: any) => {
        const chatOwner = members.filter(
          (member: any) => member.uid !== /* session?.user.uid */"64a90ce6-7017-4a45-9dd2-d17c6168495d"
        )[0];
        return (
          <ChatsListItem
            key={chat_id}
            members={members}
            chatOwner={chatOwner}
            chat_id={chat_id}
          />
        );
      })}
    </ul>
  );
}

export default ChatsList;
