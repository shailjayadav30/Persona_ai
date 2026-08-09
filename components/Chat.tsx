"use client";
import hitesh from "../../public/hitesh.png";
import piyush from "../../public/piyush.png";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
const image = {
  HITESH: hitesh,
  PIYUSH: piyush,
};

const Chat = () => {
  type Message = {
    role: "user" | "assistant";
    content: string;
  };
  type Persona = "HITESH" | "PIYUSH";
  const searchParams = useSearchParams();
  const [chat, setChat] = useState<Record<Persona, Message[]>>({
    HITESH: [],
    PIYUSH: [],
  });

  const [query, setQuery] = useState("");
  const [isThinking, setThinking] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const currentpersona = searchParams.get("persona") as
    | "HITESH"
    | "PIYUSH"
    | null;
  const options = ["HITESH", "PIYUSH"];
  const router = useRouter();
  const pathName = usePathname();
  const selectedImage = currentpersona ? image[currentpersona] : null;
  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  const handleSelectPersona = (value: "HITESH" | "PIYUSH") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("persona", value);
    router.push(`${pathName}?${params.toString()}`);
    setIsOpen(false);
  };
  const message = currentpersona ? chat[currentpersona] : [];

  async function chatWithPersona() {
    try {
      const prompt = query;
      if (!prompt.trim()) return;
      setChat((prev) => ({
        ...prev,
        [currentpersona!]: [
          ...prev[currentpersona!],
          {
            role: "user",
            content: prompt,
          },
          {
            role: "assistant",
            content: "",
          },
        ],
      }));
      setQuery("");
      setThinking(true);
      const chat = await fetch(`/api/chat?persona=${currentpersona}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: prompt }),
      });
      const reader = chat.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();

      if (!reader) return;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const textChunk = decoder.decode(value);
        if (!textChunk) continue;
        setChat((prev) => {
          const updatedMessage = [...prev[currentpersona!]];
          updatedMessage[updatedMessage.length - 1] = {
            ...updatedMessage[updatedMessage.length - 1],
            content:
              updatedMessage[updatedMessage.length - 1].content + textChunk,
          };
          return {
            ...prev,
            [currentpersona!]: updatedMessage,
          };
        });
      }
    } finally {
      setThinking(false);
    }
  }
  return (
    <div className="flex flex-col  min-h-screen bg-[#191724]">
      {selectedImage ? (
        <div className="mx-auto  flex w-full items-center justify-between  max-w-4xl   rounded-xl border border-[#403d52] bg-[#26233a] px-6 py-2   mt-6">
          <div className="flex items-center gap-4">
            <Image
              src={selectedImage}
              alt={`${currentpersona} profile`}
              height={40}
              width={40}
              className="rounded-full border-2 border-[#56526e]"
            />
            <div>
              <h1 className="font-semibold text-[#e0def4]">{currentpersona}</h1>
              <p className="text-sm text-[#908caa]">Coding Educator</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className=" rounded-xl border border-[#403d52] bg-[#393552] px-4 py-2 text-[#e0def4] transition-colors hover:border-[#9ccfd8] hover:bg-[#9ccfd8]/10 hover:text-[#9ccfd8]"
            >
              Change Persona
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-[#26233a] border-[#403d52] shadow-lg">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      handleSelectPersona(option as "HITESH" | "PIYUSH")
                    }
                    className={`block w-full px-4 py-2 text-left  hover:bg-[#31748f]/20 text-[#e0def4] transition-colors  ${currentpersona === option ? "bg-[#9ccfd8]/15 text-[#9ccfd8]" : "hover:bg-[#393552]"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="mx-auto  flex h-[70vh] w-full flex-col overflow-hidden max-w-4xl mt-6 rounded-2xl border border-[#403d52] bg-[#26233a] ">
        {message.length! === 0 ? (
          <div className="text-xl text-[#9ccfd8] flex h-full items-center justify-center">
            <h1 className="text-body-sm text-on-surface-variant">
              {" "}
              Ask something to start the conversation
            </h1>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* assistant message */}
            {message.map((msg, idx) => (
              <div
                key={idx}
                className={` flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%]  rounded-xl   px-4 py-3 text-body-md whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#31748f] text-[#e0def4]"
                      : "bg-[#1f1d2e] text-[#e0def4]"
                  }`}
                >
                  <div ref={messageRef} />
                  {msg.role === "assistant" &&
                  isThinking &&
                  idx === message.length - 1 &&
                  msg.content === "" ? (
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#908caa] [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#908caa] [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#908caa]" />
                    </span>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-7   left-1/2  w-full max-w-4xl -translate-x-1/2 ">
        <div className=" p-2 shadow-lg bg-[#26233a] flex rounded-2xl    border-[#403d52]     border items-center ">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) chatWithPersona();
            }}
            type="text"
            placeholder="Type a message"
            className=" flex-1 bg-transparent px-4 py-3 text-[#e0def4] placeholder:text-[#6e6a86] outline-none"
          />
          <button
            onClick={chatWithPersona}
            className="rounded-xl bg-[#31748f] px-6 py-3 text-[#e0def4] hover:bg-[#3d86a7]   transition-colors duration-200 "
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
