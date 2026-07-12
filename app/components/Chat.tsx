"use client";

import PersonaCard from "./PersonaCard";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import hitesh from "../../public/hitesh.png";
// import piyush from "../../public/piyush.png";
// import { PersonaId } from "../page";

// const Chat = ({
//   personaId,
//   onChangeMentor,
// }: {
//   personaId: PersonaId | null;
//   onChangeMentor?: () => void;
// }) => {
//   const [query, setQuery] = useState("");
//   const [message, setMessage] = useState<
//     {
//       role: "user" | "assistant";
//       content: string;
//     }[]
//   >([]);
//   const personaImages = {
//     HITESH: hitesh,
//     PIYUSH: piyush,
//   };
//   const image = personaId ? personaImages[personaId] : null;
//   const [isThinking, setIsThinking] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [message]);
//   async function chatWithPersona() {
//     const prompt = query;
//     if (!prompt.trim()) return;
//     setMessage((prev) => [
//       ...prev,
//       {
//         role: "user",
//         content: query,
//       },
//     ]);
//     setMessage((prev) => [
//       ...prev,
//       {
//         role: "assistant",
//         content: "",
//       },
//     ]);
//     setQuery("");
//     setIsThinking(true);
//     try {
//       const chat = await fetch(`/api/chat?persona=${personaId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           content: prompt,
//         }),
//       });
//       const reader = chat.body?.getReader();
//       if (!reader) return;
//       const decoder = new TextDecoder();
//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         const chunk = decoder.decode(value);
//         if (!chunk) continue;
//         setIsThinking(false);
//         setMessage((prev) => {
//           const updated = [...prev];
//           updated[updated.length - 1] = {
//             ...updated[updated.length - 1],
//             content: updated[updated.length - 1].content + chunk,
//           };
//           return updated;
//         });
//       }
//     } finally {
//       setIsThinking(false);
//     }
//   }
//   return (
//     <div className="flex h-full flex-1 flex-col overflow-hidden">
//       <header className="flex items-center justify-between border-b border-outline-variant px-4 py-3 sm:px-6">
//         <div className="flex gap-4 items-center">
//           {image && (
//             <div className="h-10 w-10 shrink-0 overflow-hidden ring-1 ring-outline-variant rounded-full">
//               <Image src={image} alt={personaId!} height={48} width={48} className="h-full w-full object-cover" />
//             </div>
//           )}
//           <div>
//             <p className="text-label-md capitalize text-on-surface">
//               {personaId?.toLowerCase()}
//             </p>
//             <p className="text-body-sm text-on-surface-variant">AI mentor</p>
//           </div>
//         </div>
//         {onChangeMentor && (
//           <button
//             type="button"
//             onClick={onChangeMentor}
//             className="rounded-full border border-outline-variant px-3 py-1.5 text-body-sm text-on-surface-variant transition-colors hover:border-outline hover:text-on-surface"
//           >
//             Change mentor
//           </button>
//         )}
//       </header>

//       <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
//         {message.length === 0 ? (
//           <div className="flex h-full items-center justify-center">
//             <p className="text-body-sm text-on-surface-variant">
//               Ask something to start the conversation
//             </p>
//           </div>
//         ) : (
//           <div className="mx-auto flex max-w-3xl flex-col gap-4">
//             {message.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 <div
//                   className={`max-w-[80%] rounded-xl px-4 py-2.5 text-body-md whitespace-pre-wrap ${
//                     msg.role === "user"
//                       ? "bg-primary text-on-primary"
//                       : "bg-surface-container text-on-surface"
//                   }`}
//                 >
//                   {msg.role === "assistant" &&
//                   msg.content === "" &&
//                   isThinking &&
//                   idx === message.length - 1 ? (
//                     <span className="flex items-center gap-1">
//                       <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-on-surface-variant [animation-delay:-0.3s]" />
//                       <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-on-surface-variant [animation-delay:-0.15s]" />
//                       <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-on-surface-variant" />
//                     </span>
//                   ) : (
//                     msg.content
//                   )}
//                 </div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         )}
//       </div>

//       <div className="border-t border-outline-variant px-4 py-4 sm:px-6">
//         <div className="mx-auto flex max-w-3xl items-center gap-2">
//           <input
//             type="text"
//             name="chat"
//             id="chat"
//             placeholder="Message your mentor..."
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && query.trim()) chatWithPersona();
//             }}
//             className="flex-1 rounded-full border border-outline-variant bg-surface-container px-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
//           />
//           <button
//             type="button"
//             onClick={chatWithPersona}
//             className="rounded-full bg-primary px-5 py-2.5 text-label-md text-on-primary transition-opacity hover:opacity-90"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;
import hitesh from "../../public/hitesh.png";
import piyush from "../../public/piyush.png";
import { useState } from "react";
import {  useSearchParams } from "next/navigation";
import Image from "next/image";
const image = {
  HITESH: hitesh,
  PIYUSH: piyush,
};

const Chat = () => {
  const searchParams = useSearchParams();
const [message,setMessage]=useState([])
  const currentpersona = searchParams.get("persona") as
    | "HITESH"
    | "PIYUSH"
    | null;

  const selectedImage = currentpersona ? image[currentpersona] : null;
      

  return (
    <div className="flex flex-col  min-h-screen bg-[#191724]">
      {selectedImage ? (
        <div className="mx-auto  flex w-full items-center justify-between  max-w-4xl   rounded-xl border border-[#403d52] bg-[#26233a] px-6 py-2 mt-6">
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

          <button
            className=" border px-2 py-2  transition
hover:bg-[#31748f]/10
hover:border-[#31748f] border-[#403d52] rounded-lg  text-[#9ccfd8]"
          >
            Change Persona
          </button>
          {/* </div> */}
        </div>
      ) : null}

      <div className="mx-auto  flex h-[70vh] w-full flex-col overflow-hidden max-w-4xl mt-6 rounded-2xl border border-[#403d52] bg-[#26233a] ">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* assistant message */}
          <div className="text-white flex justify-start">
            <div className="max-w-[75%]  rounded-2xl bg-[#1f1d2e]  px-4 py-3 text-[#e0def4]">
              hello
            </div>
          </div>
          {/* user messsage */}
          <div className="text-white flex justify-end">
            <div className="max-w-[75%] rounded-2xl bg-[#31748f] px-4 py-3 text-[#e0def4]">
              what is closures
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-7   left-1/2  w-full max-w-4xl -translate-x-1/2 px-6">
        <div className=" p-2 shadow-lg bg-[#26233a] flex rounded-2xl    border-[#403d52]     border items-center ">
          <input
            type="text"
            placeholder="Type a message"
            className=" flex-1 bg-transparent px-4 py-3 text-[#e0def4] placeholder:text-[#6e6a86] outline-none"
          />
          <button className="rounded-xl bg-[#31748f] px-6 py-3 text-[#e0def4] hover:bg-[#3d86a7]   transition-colors duration-200 ">
            send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
