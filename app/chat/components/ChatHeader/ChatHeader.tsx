"use client";
import { User } from "@/core/types";
import IconButton from "@/core/ui/IconButton/IconButton";
import { Icons } from "@/core/ui/Icons/Icons";
import useChats from "@/lib/hooks/swr/useChats";
import Dropdown from "app/components/Dropdown/Dropdown";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";

type ChatHeaderProps = {
  user: User;
  chat_id: string;
};

async function fetcher(url: string, { arg }: { arg: string }) {
  await fetch(`${url}/${arg}`, { method: "DELETE" });
}

function ChatHeader({ user, chat_id }: ChatHeaderProps) {
  const router = useRouter();
  const { chats } = useChats();
  const userChatId = chats?.find(
    (chat) => chat.chat_owner_id === user?.id
  )?.chat_id;
  const currentChat = chats?.find((chat) => chat.chat_id === chat_id);
  const { trigger, isMutating } = useSWRMutation("/api/chats", fetcher);
  const deleteChat = async () => {
    if (!chat_id) return;
    router.push(`/chat`);
    trigger(chat_id);
  };

  return (
    <div className="sticky left-0 top-0 w-full bg-black z-30 py-6 pr-6 pl-7 h-[88px] flex flex-row items-center justify-between">
      <div>
        <h1 className="mb-1 text-base text-white">{currentChat?.name}</h1>
        <span className="Badge">{currentChat?.access}</span>
      </div>

      <IconButton
        className="ml-auto mr-6"
        icon={<Icons.phone className="w-3 h-3" />}
        tooltip="Feature in progress... 👷"
        tooltipOrigin="top"
      />

      <Dropdown
        button={<Icons.more className="w-3 h-3 text-white" />}
        items={[
          {
            label: "Delete chat",
            icon: <Icons.trash className="w-4 h-4 mr-3" />,
            disabled: chat_id === null || userChatId === chat_id,
            onClick: () => deleteChat(),
          },
        ]}
        origin="right"
      />
    </div>
  );
}

export default ChatHeader;
