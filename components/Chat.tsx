

"use client";

import hitesh from "../public/hitesh.png";
import piyush from "../public/piyush.png";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const image = {
  HITESH: hitesh,
  PIYUSH: piyush,
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Persona = "HITESH" | "PIYUSH";

const personas: Persona[] = ["HITESH", "PIYUSH"];

const Chat = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [chat, setChat] = useState<Record<Persona, Message[]>>({
    HITESH: [],
    PIYUSH: [],
  });

  const [query, setQuery] = useState("");
  const [isThinking, setThinking] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const personaParam = searchParams.get("persona");

  const currentPersona: Persona | null =
    personaParam === "HITESH" || personaParam === "PIYUSH"
      ? personaParam
      : null;

  const messages = currentPersona ? chat[currentPersona] : [];

  const selectedImage = currentPersona ? image[currentPersona] : null;

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSelectPersona = (persona: Persona) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("persona", persona);

    router.push(`${pathname}?${params.toString()}`);

    setIsOpen(false);
  };

  const chatWithPersona = async () => {
    if (!currentPersona || !query.trim() || isThinking) return;

    const prompt = query.trim();

    setChat((prev) => ({
      ...prev,
      [currentPersona]: [
        ...prev[currentPersona],
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

    try {
      const response = await fetch(`/api/chat?persona=${currentPersona}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("Streaming is not supported");
      }

      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const textChunk = decoder.decode(value, {
          stream: true,
        });

        if (!textChunk) continue;

        setChat((prev) => {
          const updatedMessages = [...prev[currentPersona]];

          const lastMessage = updatedMessages[updatedMessages.length - 1];

          if (!lastMessage) return prev;

          updatedMessages[updatedMessages.length - 1] = {
            ...lastMessage,
            content: lastMessage.content + textChunk,
          };

          return {
            ...prev,
            [currentPersona]: updatedMessages,
          };
        });
      }
    } catch (error) {
      console.error(error);

      setChat((prev) => {
        const updatedMessages = [...prev[currentPersona]];

        updatedMessages[updatedMessages.length - 1] = {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        };

        return {
          ...prev,
          [currentPersona]: updatedMessages,
        };
      });
    } finally {
      setThinking(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#191724] px-3 py-4 sm:px-6">
      <div className="mx-auto flex h-[calc(100vh-2rem)] w-full max-w-4xl flex-col">
        {/* ================= HEADER ================= */}
        {currentPersona && selectedImage && (
          <header className="mb-3 flex shrink-0 items-center justify-between rounded-2xl border border-[#403d52] bg-[#26233a] px-4 py-3 sm:px-5">
            {/* Persona */}
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src={selectedImage}
                alt={`${currentPersona} profile`}
                width={42}
                height={42}
                className="shrink-0 rounded-full border-2 border-[#56526e]"
              />

              <div className="min-w-0">
                <h1 className="truncate font-semibold text-[#e0def4]">
                  {currentPersona}
                </h1>

                <p className="text-xs text-[#908caa] sm:text-sm">
                  Coding Educator
                </p>
              </div>
            </div>

            {/* Persona Selector */}
            <div className="relative ml-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded-xl border border-[#403d52] bg-[#393552] px-3 py-2 text-sm text-[#e0def4] transition hover:border-[#9ccfd8] hover:bg-[#9ccfd8]/10 hover:text-[#9ccfd8] sm:px-4"
              >
                <span className="hidden sm:inline">Change Persona</span>

                <span className="sm:hidden">Change</span>
              </button>

              {isOpen && (
                <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-[#403d52] bg-[#26233a] p-1 shadow-xl">
                  {personas.map((persona) => (
                    <button
                      key={persona}
                      type="button"
                      onClick={() => handleSelectPersona(persona)}
                      className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                        currentPersona === persona
                          ? "bg-[#9ccfd8]/15 text-[#9ccfd8]"
                          : "text-[#e0def4] hover:bg-[#393552]"
                      }`}
                    >
                      {persona}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </header>
        )}

        {/* ================= CHAT CONTAINER ================= */}
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#403d52] bg-[#26233a]">
          {/* Messages */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            {!currentPersona ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#393552] text-2xl">
                  💬
                </div>

                <h2 className="text-lg font-semibold text-[#e0def4]">
                  Choose a persona
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#908caa]">
                  Select a coding educator to start a conversation.
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <Image
                  src={selectedImage!}
                  alt={`${currentPersona} profile`}
                  width={64}
                  height={64}
                  className="mb-4 rounded-full border-2 border-[#56526e]"
                />

                <h2 className="text-lg font-semibold text-[#e0def4]">
                  Ask {currentPersona}
                </h2>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#908caa]">
                  Ask something about coding, development, projects, or your
                  learning journey.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((msg, index) => {
                  const isLastMessage = index === messages.length - 1;

                  const showThinking =
                    msg.role === "assistant" &&
                    isThinking &&
                    isLastMessage &&
                    msg.content === "";

                  return (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[78%] sm:text-[15px] ${
                          msg.role === "user"
                            ? "rounded-br-md bg-[#31748f] text-[#e0def4]"
                            : "rounded-bl-md bg-[#1f1d2e] text-[#e0def4]"
                        }`}
                      >
                        {showThinking ? (
                          <div className="flex items-center gap-1 py-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#908caa] [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#908caa] [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#908caa]" />
                          </div>
                        ) : (
                          <span className="whitespace-pre-wrap break-words">
                            {msg.content}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* ================= INPUT ================= */}
          <div className="shrink-0 border-t border-[#403d52] bg-[#26233a] p-3 sm:p-4">
            <div className="flex items-center gap-2 rounded-2xl border border-[#403d52] bg-[#1f1d2e] p-1.5 transition focus-within:border-[#6e6a86]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && query.trim()) {
                    e.preventDefault();
                    chatWithPersona();
                  }
                }}
                type="text"
                disabled={!currentPersona || isThinking}
                placeholder={
                  currentPersona
                    ? `Message ${currentPersona}...`
                    : "Select a persona first"
                }
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-[#e0def4] outline-none placeholder:text-[#6e6a86] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
              />

              <button
                type="button"
                onClick={chatWithPersona}
                disabled={!currentPersona || !query.trim() || isThinking}
                className="shrink-0 rounded-xl bg-[#31748f] px-4 py-2.5 text-sm font-medium text-[#e0def4] transition hover:bg-[#3d86a7] disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
              >
                {isThinking ? "..." : "Send"}
              </button>
            </div>

            <p className="mt-2 hidden text-center text-[11px] text-[#6e6a86] sm:block">
              Press Enter to send
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Chat;
