"use client";
import usePusherChannel from "@/lib/hooks/usePusherChannel";

function TestComponent() {
  const [event] = usePusherChannel("private-test-channel", ["test-event"]);

  return (
    <div>
      First
      {JSON.stringify(event)}
    </div>
  );
}

export default TestComponent;
