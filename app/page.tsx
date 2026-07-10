"use client";

import PersonaCard from "./components/PersonaCard";
import hitesh from "../public/hitesh.png";
import piyush from "../public/piyush.png";
import Chat from "./components/Chat";
import { useState } from "react";
export  type PersonaId = "HITESH" | "PIYUSH";
export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(
    null,
  );

  return (
    <div className=" flex flex-col items-center gap-2">
      <h1 className="mt-10 text-3xl font-semibold">Select your AI Mentor</h1>
      <h1 className="text-sm pb-4">Choose a person tailored to your current task</h1>
     <div className="flex gap-2">
       <PersonaCard
        name="HITESH"
        id="HITESH"
        image={hitesh}
        onClick={setSelectedPersona}
        desc="Coding educator, YouTuber, builder"
      />
      <PersonaCard
        name="PIYUSH"
        id="PIYUSH"
        image={piyush}
        onClick={setSelectedPersona}
        desc="Software Engineer, Content Creator, Educator"
      />
     </div> 
      <Chat personaId={selectedPersona}/>
    </div>
  );
}


      {/* {selectedPersona && <Chat personaId={selectedPersona} />} */}
