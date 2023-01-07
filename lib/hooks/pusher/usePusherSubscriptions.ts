import Pusher, { Channel } from "pusher-js";
import { useRef } from "react";
import { Action } from "./usePusherContext";

type Subscriptions = {
  [key: string]: {
    channel: Channel;
    events: Set<string>;
  };
};

function usePusherSubscriptions(clientPusher: Pusher) {
  const subscriptions = useRef<Subscriptions>({});

  function subscribe(
    channelName: string,
    events: string[],
    setEvent: (event: Action) => void
  ) {
    if (subscriptions.current?.[channelName]) {
      const currentEvents = subscriptions.current[channelName].events;
      if (
        currentEvents.size === events.length &&
        events.every((event) => currentEvents.has(event))
      )
        return;

      const newEvents = new Set([...currentEvents, ...events]);
      const pusherChannel = clientPusher.subscribe(channelName);
      for (const eventName of newEvents) {
        pusherChannel.bind(eventName, (payload: any) => {
          setEvent({ channelName, eventName, payload });
        });
      }
      subscriptions.current[channelName] = {
        channel: pusherChannel,
        events: newEvents,
      };
      return;
    }
    const pusherChannel = clientPusher.subscribe(channelName);
    events.forEach((eventName) => {
      pusherChannel.bind(eventName, (payload: any) => {
        setEvent({ channelName, eventName, payload });
      });
    });
    subscriptions.current[channelName] = {
      channel: pusherChannel,
      events: new Set(events),
    };
  }

  function unsubscribe(channelName: string) {
    if (
      subscriptions?.current?.[channelName] &&
      subscriptions.current[channelName].channel.subscribed
    ) {
      subscriptions.current[channelName].channel.unbind_all();
      clientPusher.unsubscribe(channelName);
      delete subscriptions.current[channelName];
    }
  }

  return { subscribe, unsubscribe };
}

export default usePusherSubscriptions;
