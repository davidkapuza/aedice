"use client";
import {useState} from "react"

function MessageInput() {
  const [input, setInput] = useState("");
  return (
    <form className="flex px-10">
      <input
        value={input}
        placeholder="Enter message..."
        type="text"
        className="flex-1 rounded border-gray-300"
        onChange={(e) => setInput(e.target.value)}
      ></input>
      <button
        type="submit"
        disabled={!input}

        className="bg-blue-500 text-white px-4 py-2 rounded disabled:cursor-not-allowed disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput;
