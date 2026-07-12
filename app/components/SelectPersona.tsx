import { useRouter } from "next/navigation";
import PersonaCard from "./PersonaCard";
import hitesh from "../../public/hitesh.png";
import piyush from "../../public/piyush.png";
import { useState } from "react";
export default function SelectPersona() {
  const [selectedPersona, setSelectedPersona] = useState(false);

  const router = useRouter();
  function selectPersona(persona: "HITESH" | "PIYUSH") {
    setSelectedPersona(true);
    router.push(`/chat/?persona=${persona}`);
  }
  return (
    <div>
      {!selectedPersona && (
        <div className="flex gap-10 justify-center items-center top-30 relative">
          <PersonaCard
            pName="HITESH"
            desc="Coding educator, YouTuber, builder"
            image={hitesh}
            onClick={() => selectPersona("HITESH")}
            body="Learn from an AI persona inspired by Hitesh Choudhary's practical teaching style. Ask about web development, JavaScript, Python, DevOps, cloud computing, career guidance, interview preparation, and programming fundamentals through clear, project-based explanations."
          />
          <PersonaCard
            pName="PIYUSH"
            desc="Software Engineer, Content Creator, Educator"
            image={piyush}
            onClick={() => selectPersona("PIYUSH")}
            body="Chat with an AI persona inspired by Piyush Garg's engineering-first approach. Discuss backend development, system design, microservices, Docker, Kubernetes, cloud architecture, AI, scalable applications, and production-ready software development practices."
          />
        </div>
      )}
    </div>
  );
}
