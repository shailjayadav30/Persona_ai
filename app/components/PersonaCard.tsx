// "use client";
// import Image, { StaticImageData } from "next/image";
// import { PersonaId } from "../page";
// interface IPersona {
//   id: PersonaId;
//   name: string;
//   image: StaticImageData;
//   onClick: (id: PersonaId) => void;
//   desc: string;
//   selected?: boolean;
// }
// const PersonaCard = ({ id, name, image, onClick, desc, selected }: IPersona) => {
//   return (
//     <button
//       type="button"
//       onClick={() => onClick(id)}
//       className={`group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-150 sm:w-80 ${
//         selected
//           ? "border-primary bg-primary-container/10 shadow-[0_0_0_1px_var(--primary)]"
//           : "border-outline-variant bg-surface-container hover:border-outline hover:bg-surface-container-high"
//       }`}
//     >
//       <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-outline-variant">
//         <Image
//           src={image}
//           alt={name}
//           width={48}
//           height={48}
//           className="h-full w-full object-cover"
//         />
//       </div>

//       <div className="min-w-0">
//         <h2 className="text-label-md capitalize text-on-surface">
//           {name.toLowerCase()}
//         </h2>
//         <p className="mt-0.5 truncate text-body-sm text-on-surface-variant">
//           {desc}
//         </p>
//       </div>
//     </button>
//   );
// };

// export default PersonaCard;

import Image, { StaticImageData } from "next/image";
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
    <div className="flex bg-[#26233a] p-6 text gap-6 rounded-2xl border border-[#403d52] hover:-translate-y-2 duration-300 transition-all  flex-col items-center         hover:border-[#6e6a86]     hover:shadow-xl w-full max-w-sm ">
      <div className="h-24  w-24 border-2 border-[#403d52] rounded-full">
        <Image
          src={image}
          alt={pName}
          height={40}
          width={40}
          className="h-full w-full rounded-full object-cover"
        />
      </div>
      <h1 className=" text-[#e0def4] font-bold text-2xl ">{pName}</h1>
      <p className="text-[#c4a7e7]  text-sm  font-medium ">{desc}</p>
      <p className="max-w-80 text-sm leading-7  text-[#908caa] text-center">{body}</p>
      <button className="mt-auto bg-[#31748f] px-4 py-2 rounded-md text-[#e0def4] hover:bg-[#3a86a6] transition-colors text-sm " onClick={onClick}>
        Start chat
      </button>
    </div>
  );
};

export default PersonaCard;
