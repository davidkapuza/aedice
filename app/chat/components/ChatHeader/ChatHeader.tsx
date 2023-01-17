"use client";
import { PrivateChat, User } from "@/core/types";
import IconButton from "@/core/ui/IconButton/IconButton";
import { Icons } from "@/core/ui/Icons/Icons";
import Tooltip from "@/core/ui/Tooltip/Tooltip";
import Dropdown from "app/components/Dropdown/Dropdown";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useSWRMutation from "swr/mutation";

type ChatHeaderProps = {
  user: User;
  chat: PrivateChat;
};

async function fetcher(url: string, { arg }: { arg: string }) {
  await toast.promise(fetch(`${url}/${arg}`, { method: "DELETE" }), {
    pending: "Deleting your chat...",
    success: "Chat deleted 👌",
    error: "We had an error 🤯",
  });
}

function ChatHeader({ user, chat }: ChatHeaderProps) {
  const router = useRouter();
  const isOwner = chat.chat_owner_id === user.id;
  const { trigger } = useSWRMutation("/api/chats", fetcher);
  const deleteChat = () => {
    if (!chat.chat_id) return;
    router.push(`/chat`);
    trigger(chat.chat_id);
  };

  return (
    <div className="sticky left-0 top-0 w-full bg-gradient-to-b from-black to-transparent z-30 py-6 pr-6 pl-7 h-[88px] flex flex-row items-center justify-between">
      <button className="mr-6 md:hidden" onClick={() => router.push(`/chat`)}>
        <Icons.arrowLeft className="w-4 h-4 text-white" />
      </button>
      <div className="flex-1">
        <h1 className="mb-1 text-base text-white">{chat?.name}</h1>
        <span className="Badge">{chat?.access}</span>
      </div>

      <Tooltip className="mr-6">
        <IconButton icon={<Icons.phone className="w-3 h-3" />} />
      </Tooltip>

      <Dropdown
        button={<Icons.more className="w-3 h-3 text-white" />}
        items={[
          {
            label: "Delete chat",
            icon: <Icons.trash className="w-4 h-4 mr-3" />,
            disabled: isOwner,
            onClick: () => deleteChat(),
          },
        ]}
        origin="right"
      />
    </div>
  );
}

export default ChatHeader;
