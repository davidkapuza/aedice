import Pusher from "pusher-js";
import { useRef, useCallback } from "react";
import usePusherSubscriptions from "./usePusherSubscriptions";

export type ChannelEvents = Record<string, Record<string, any>>;
export type Action = {
  channelName: string;
  eventName: string;
  payload: any;
}

export default function usePusherContext(): {
  getEvent: () => ChannelEvents;
  setEvent: (event: Action) => void;
  subscribeToEvents: (callback: () => void) => () => void;
  subscribeToChannel: (channel: string, events: string[]) => void;
  pusher: Pusher;
} {
  const clientPusher = useRef<Pusher>(
    new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: "eu",
      activityTimeout: 60,
      forceTLS: true,
      userAuthentication: {
        endpoint: "/api/pusher/user-auth",
        transport: "ajax",
      },
      channelAuthorization: { endpoint: "/api/pusher/auth", transport: "ajax" },
    })
  );

  const { subscribe, unsubscribe } = usePusherSubscriptions(
    clientPusher.current
  );

  const channelEvents = useRef<ChannelEvents>({});
  const subscribers = useRef(new Set<() => void>());
  const subscribeToEvents = useCallback((callback: () => void) => {
    subscribers.current.add(callback);
    return () => subscribers.current.delete(callback);
  }, []);
  const getEvent = useCallback(() => channelEvents.current, []);
  const setEvent = useCallback(
    ({
      channelName,
      eventName,
      payload,
    }: {
      channelName: string;
      eventName: string;
      payload: any;
    }) => {
      if (
        !channelEvents.current?.[channelName] ||
        !channelEvents.current?.[channelName]?.[eventName]
      ) {
        channelEvents.current[channelName] = { [eventName]: payload };
        subscribers.current.forEach((callback) => callback());
        return;
      }
      channelEvents.current[channelName][eventName] = payload;
      subscribers.current.forEach((callback) => callback());
    },
    []
  );
  const subscribeToChannel = useCallback(
    (channel: string, events: string[]) => {
      subscribe(channel, events, setEvent);
      return () => unsubscribe(channel);
    },
    []
  );

  return {
    getEvent,
    setEvent,
    subscribeToEvents,
    subscribeToChannel,
    pusher: clientPusher.current,
  };
}
