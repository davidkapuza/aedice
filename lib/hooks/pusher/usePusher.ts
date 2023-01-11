import Pusher from "pusher-js";
import { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { PusherContext } from "../../contexts/PusherContext";
import { Action, ChannelEvents } from "./usePusherContext";

export default function usePusher({
  channel,
  events,
}: {
  channel: string | null;
  events?: string[];
}): [ChannelEvents | undefined, (event: Action) => void, Pusher] {
  const pusherCtx = useContext(PusherContext);
  if (!pusherCtx) {
    throw new Error("Context not found");
  }
  if (channel === null)
    return [undefined, pusherCtx.setEvent, pusherCtx.pusher];

  const channelEvents = useSyncExternalStore(
    pusherCtx.subscribeToEvents,
    () => pusherCtx.getEvent(channel),
    () => pusherCtx.getEvent(channel)
  );

  useEffect(() => events && pusherCtx.subscribeToChannel(channel, events), []);

  return [channelEvents, pusherCtx.setEvent, pusherCtx.pusher];
}
