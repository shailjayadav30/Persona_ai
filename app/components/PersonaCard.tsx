"use client";
import Image, { StaticImageData } from "next/image";
import { PersonaId } from "../page";
interface IPersona {
  id: PersonaId;
  name: string;
  image: StaticImageData;
  onClick: (id: PersonaId) => void;
  desc: string;
  selected?: boolean;
}
const PersonaCard = ({ id, name, image, onClick, desc, selected }: IPersona) => {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-150 sm:w-80 ${
        selected
          ? "border-primary bg-primary-container/10 shadow-[0_0_0_1px_var(--primary)]"
          : "border-outline-variant bg-surface-container hover:border-outline hover:bg-surface-container-high"
      }`}
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-outline-variant">
        <Image
          src={image}
          alt={name}
          width={48}
          height={48}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="min-w-0">
        <h2 className="text-label-md capitalize text-on-surface">
          {name.toLowerCase()}
        </h2>
        <p className="mt-0.5 truncate text-body-sm text-on-surface-variant">
          {desc}
        </p>
      </div>
    </button>
  );
};

export default PersonaCard;
