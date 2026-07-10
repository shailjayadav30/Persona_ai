"use client";

import axios from "axios";
import { useState } from "react";
import { PersonaId } from "../page";
const Chat = ({ personaId }: { personaId: PersonaId | null }) => {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<
    {
      role: "user" | "assistant";
      content: string;
    }[]
  >([]);

  async function chatWithPersona() {
    setMessage((prev) => [
      ...prev,
      {
        role: "user",
        content: query,
      },
    ]);
    setQuery("");

    const chat = await axios.post(`/api/chat?persona=${personaId}`, {
      content: query,
    });
    setMessage((prev) => [
      ...prev,
      {
        role: "assistant",
        content: chat.data.answer,
      },
    ]);
    console.log("chat response", typeof chat.data.answer);
  }
  return (
    <div className="h-full flex w-9/12 bg-red-300 flex-col">
      <div className="flex-1 overflow-y-auto pb-24">
        {message.map((msg, idx) => (
          <div key={idx} className="mb-4">
            <strong>{msg.role}</strong>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 ">
        <div className="mx-auto max-w-3xl  flex gap-2">
          <input
            type="text"
            name="chat"
            id="chat"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border rounded-full px-4   py-2"
          />
          <button className="text-pink-500" onClick={chatWithPersona}>
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
