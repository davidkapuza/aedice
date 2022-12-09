"use client"
import { clientPusher } from "@core/pusher";
import { getUserChats } from "@lib/services/client/chats";
import { Session } from "next-auth";
import React, { useEffect } from "react";
import useSWR from "swr";
import ChatsListItem from "../ChatsListItem/ChatsListItem";

type Props = {
  prerenderedChats: string[];
  session: Session | null;
};

function ChatsList({ prerenderedChats, session }: Props) {
  // const query = "/api/chats/getUserChats?=" + session?.user.uid

  // const { data: chats, error, mutate } = useSWR(query, getUserChats);
  // useEffect(() => {
  //   const channel = clientPusher.subscribe("user-chats-" + session?.user.uid);
  //   channel.bind("new-chat", async (members: any) => {
  //     if (!members) {
  //       mutate(() => getUserChats(query));
  //     } else {
  //       mutate(() => getUserChats(query), {
  //         optimisticData: [...chats!, members],
  //         rollbackOnError: true,
  //       });
  //     }
  //   });
  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //   };
  // }, [chats, mutate, clientPusher]);


  return (
    <ul>
      <h1 className="py-3 dark:text-white">Chats.</h1>
      {(prerenderedChats /* || chats */)?.map(({ members, chat_id }: any) => {

        const chatOwner = members.filter(
          (member: any) => member.uid !== session?.user.uid
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
