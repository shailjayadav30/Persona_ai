"use client";
const URL = process.env.NEXT_PUBLIC_BACKEND_URL;

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [reply, setReply] = useState("");
  const [ques, setQues] = useState("");
  const router = useRouter();
  function selectPersona(persona: "HITESH" | "PIYUSH") {
    router.push(`/?persona=${persona}`);
  }
  const searchParams = useSearchParams();
  const persona = searchParams.get("persona");
  console.log("Persona", persona);
  const sendMessage = async () => {
    const response = await axios.post(`${URL}/api/chat?persona=${persona}`,{
      content:ques
    });
    console.log("Response", response.data);

    setReply(response.data.answer);
  };

  return (
    <div className="bg-green-600 p-10">
      <div>{reply}</div>
      <input
        type="text"
        name=""
        id=""
        value={ques}
        onChange={(e) => setQues(e.target.value)}
      />
     <div className="gap-4">
       <button onClick={() => selectPersona("HITESH")}>HITESH</button>
      <button style={{backgroundColor:"red",padding:10}} onClick={() => selectPersona("PIYUSH")}>PIYUSH</button>
      <button onClick={() => sendMessage()}>Send</button>
     </div>
    </div>
  );
}
