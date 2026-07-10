"use client";

import { useEffect, useRef, useState } from "react";
import { PersonaId } from "../page";
const Chat = ({
  personaId,
  onChangeMentor,
}: {
  personaId: PersonaId | null;
  onChangeMentor?: () => void;
}) => {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<
    {
      role: "user" | "assistant";
      content: string;
    }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  async function chatWithPersona() {
    const prompt=query
    if(!prompt.trim()) return
    setMessage((prev) => [
      ...prev,
      {
        role: "user",
        content: query,
      },
    ]);
    setMessage((prev)=>[
      ...prev,
      {
        role:"assistant",
        content:""
      }
    ])
    setQuery("");
    const chat = await fetch(`/api/chat?persona=${personaId}`, {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        content:prompt
      })
    });
    const reader=chat.body?.getReader()
    if(!reader) return
    const decoder=new TextDecoder()
    while(true){
      const {done,value}=await reader.read()
      if(done) break 
      const chunk=decoder.decode(value)
      setMessage((prev) => {
        const updated=[...prev]
        updated[updated.length-1]={
          ...updated[updated.length-1],
          content:updated[updated.length-1].content+chunk,
        }
        return updated;
    })
    }
  }
  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b border-outline-variant px-4 py-3 sm:px-6">
        <div>
          <p className="text-label-md capitalize text-on-surface">
            {personaId?.toLowerCase()}
          </p>
          <p className="text-body-sm text-on-surface-variant">
            AI mentor
          </p>
        </div>
        {onChangeMentor && (
          <button
            type="button"
            onClick={onChangeMentor}
            className="rounded-full border border-outline-variant px-3 py-1.5 text-body-sm text-on-surface-variant transition-colors hover:border-outline hover:text-on-surface"
          >
            Change mentor
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {message.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-body-sm text-on-surface-variant">
              Ask something to start the conversation
            </p>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {message.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl px-4 py-2.5 text-body-md whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-on-primary"
                      : "bg-surface-container text-on-surface"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-outline-variant px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <input
            type="text"
            name="chat"
            id="chat"
            placeholder="Message your mentor..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) chatWithPersona();
            }}
            className="flex-1 rounded-full border border-outline-variant bg-surface-container px-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
          />
          <button
            type="button"
            onClick={chatWithPersona}
            className="rounded-full bg-primary px-5 py-2.5 text-label-md text-on-primary transition-opacity hover:opacity-90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat
