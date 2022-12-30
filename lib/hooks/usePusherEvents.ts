import Pusher from "pusher-js";
import { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { PusherContext } from "../contexts/PusherContext";
import { Action, ChannelEvents } from "./usePusherContext";

export default function usePusherEvents(
  channel: string,
  events?: string[]
): [ChannelEvents, (event: Action) => void, Pusher] {
  const pusherCtx = useContext(PusherContext);
  if (!pusherCtx) {
    throw new Error("Context not found");
  }
  const channelEvents = useSyncExternalStore(
    pusherCtx.subscribeToEvents,
    () => pusherCtx.getEvent(channel),
    () => pusherCtx.getEvent(channel)
  );

  useEffect(() => events && pusherCtx.subscribeToChannel(channel, events), []);

  return [channelEvents, pusherCtx.setEvent, pusherCtx.pusher];
}
