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
    channel: string,
    events: string[],
    setEvent: (event: Action) => void
  ) {
    if (subscriptions.current?.[channel]) {
      const currentEvents = subscriptions.current[channel].events;
      if (
        currentEvents.size === events.length &&
        events.every((event) => currentEvents.has(event))
      )
        return;
      
      const newEvents = new Set([...currentEvents, ...events]);
      const pusherChannel = clientPusher.subscribe(channel);
      for (const event of newEvents) {
        pusherChannel.bind(event, (data: any) => {
          setEvent({ channelName: channel, eventName: event, payload: data });
        });
      }
      subscriptions.current[channel] = {
        channel: pusherChannel,
        events: newEvents,
      };
      return;
    }
    const pusherChannel = clientPusher.subscribe(channel);
    pusherChannel.bind("pusher:subscription_error", (error: Error) => {
      console.log(error.message);
    });
    events.forEach((event) => {
      pusherChannel.bind(event, (data: any) => {
        setEvent({ channelName: channel, eventName: event, payload: data });
      });
    });
    subscriptions.current[channel] = {
      channel: pusherChannel,
      events: new Set(events),
    };
  }

  function unsubscribe(channel: string) {
    if (subscriptions?.current?.[channel]) {
      subscriptions.current[channel].channel.unbind_all();
      clientPusher.unsubscribe(channel);
      delete subscriptions.current[channel];
    }
  }

  return { subscribe, unsubscribe };
}

export default usePusherSubscriptions;
