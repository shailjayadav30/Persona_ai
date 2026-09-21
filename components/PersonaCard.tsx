import { StaticImageData } from "next/image";
import Image from "next/image";

interface PersonaCardProps {
  image: StaticImageData;
  pName: string;
  desc: string;
  onClick: () => void;
  body: string;
}

const PersonaCard = ({
  image,
  pName,
  desc,
  onClick,
  body,
}: PersonaCardProps) => {
  return (
    <article
      className="
        group
        flex
        min-h-105
        w-full
        max-w-sm
        flex-col
        items-center
        rounded-2xl
        border
        border-[#403d52]
        bg-[#26233a]
        p-6
        text-center
        shadow-sm
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-[#6e6a86]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]
      "
    >
      {/* Persona Image */}
      <div
        className="
          relative
          mb-5
          h-24
          w-24
          shrink-0
          rounded-full
          p-1
          ring-1
          ring-[#403d52]
          transition-all
          duration-300
          group-hover:ring-[#9ccfd8]
        "
      >
        <div className="h-full w-full overflow-hidden rounded-full bg-[#1f1d2e]">
          <Image
            src={image}
            alt={`${pName} profile`}
            width={96}
            height={96}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        </div>
      </div>

      {/* Persona Name */}
      <h2 className="text-2xl font-bold tracking-tight text-[#e0def4]">
        {pName}
      </h2>

      {/* Persona Role */}
      <p className="mt-1.5 text-sm font-medium text-[#c4a7e7]">{desc}</p>

      {/* Description */}
      <p
        className="
          mt-4
          pb-2
          max-w-72.5
          text-sm
          leading-6
          text-[#908caa]
        "
      >
        {body}
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={onClick}
        className="
          mt-auto
          w-full
          rounded-xl
          bg-[#31748f]
          px-5
          py-3
          text-sm
          font-medium
          text-[#e0def4]
          transition-all
          duration-200
          hover:bg-[#3d86a7]
          hover:shadow-[0_6px_20px_rgba(49,116,143,0.25)]
          focus:outline-none
          focus:ring-2
          focus:ring-[#9ccfd8]
          focus:ring-offset-2
          focus:ring-offset-[#26233a]
          active:scale-[0.98]
        "
      >
        Start Chat
      </button>
    </article>
  );
};

export default PersonaCard;
