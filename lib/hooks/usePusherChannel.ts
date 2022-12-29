import Pusher from "pusher-js";
import { useContext, useEffect, useSyncExternalStore } from "react";
import { PusherContext } from "../contexts/PusherContext";
import { Action, ChannelEvents } from "./usePusherContext";

export default function usePusherChannel(
  channel: string,
  events: string[]
): [
  ChannelEvents,
  (event: Action) => void,
  Pusher
] {
  const pusherCtx = useContext(PusherContext);
  if (!pusherCtx) {
    throw new Error("Context not found");
  }
  useEffect(() => pusherCtx.subscribeToChannel(channel, events), []);

  const channelEvents = useSyncExternalStore(
    pusherCtx.subscribeToEvents,
    () => pusherCtx.getEvent()[channel],
    () => pusherCtx.getEvent()[channel]
  );

  return [channelEvents, pusherCtx.setEvent, pusherCtx.pusher];
}
