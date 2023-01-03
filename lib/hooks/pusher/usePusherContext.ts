import Pusher from "pusher-js";
import { useRef, useCallback } from "react";
import usePusherSubscriptions from "./usePusherSubscriptions";

export type ChannelEvents = Record<string, Record<string, any>>;
export type Action = {
  channelName: string;
  eventName: string;
  payload: any;
};

export default function usePusherContext(): {
  getEvent: (channelName: string) => ChannelEvents;
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
  const getEvent = useCallback(
    (channelName: string) => channelEvents.current[channelName],
    []
  );
  const setEvent = useCallback(
    ({ channelName, eventName, payload }: Action) => {
        channelEvents.current = {
          ...channelEvents.current,
          [channelName]: { [eventName]: payload },
        };
      subscribers.current.forEach((callback) => callback());
    },
    []
  );
  const subscribeToChannel = useCallback(
    (channelName: string, events: string[]) => {
      subscribe(channelName, events, setEvent);
      return () => unsubscribe(channelName);
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
