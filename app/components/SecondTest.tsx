"use client";
import usePusherChannel from "@/lib/hooks/usePusherEvents";

function SecondTest() {
  const [events] = usePusherChannel("private-test-channel", ["test-event2"]);

  return (
    <div>
      Second
      {JSON.stringify(events)}
    </div>
  );
}

export default SecondTest;
