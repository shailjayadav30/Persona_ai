"use client";

import PersonaCard from "./components/PersonaCard";
import hitesh from "../public/hitesh.png";
import piyush from "../public/piyush.png";
import Chat from "./components/Chat";
import { useState } from "react";
export type PersonaId = "HITESH" | "PIYUSH";
export default function Home() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(
    null,
  );

  return (
    <div className="flex h-dvh flex-col bg-background">
      {!selectedPersona ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
          <div className="text-center">
            <h1 className="text-headline-lg-mobile sm:text-headline-lg text-on-background">
              Select your AI mentor
            </h1>
            <p className="mt-2 text-body-sm text-on-surface-variant">
              Choose a persona tailored to your current task
            </p>
          </div>

          <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
            <PersonaCard
              name="HITESH"
              id="HITESH"
              image={hitesh}
              onClick={setSelectedPersona}
              desc="Coding educator, YouTuber, builder"
              selected={selectedPersona === "HITESH"}
            />
            <PersonaCard
              name="PIYUSH"
              id="PIYUSH"
              image={piyush}
              onClick={setSelectedPersona}
              desc="Software Engineer, Content Creator, Educator"
              selected={selectedPersona === "PIYUSH"}
            />
          </div>
        </div>
      ) : (
        <Chat personaId={selectedPersona} onChangeMentor={() => setSelectedPersona(null)} />
      )}
    </div>
  );
}
