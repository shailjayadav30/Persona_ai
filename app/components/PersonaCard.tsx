"use client";
import Image, { StaticImageData } from "next/image";
import { PersonaId } from "../page";
interface IPersona {
  id: PersonaId;
  name: string;
  image: StaticImageData;
  onClick: (id: PersonaId) => void;
  desc:string
}
const PersonaCard = ({ id, name, image, onClick,desc }: IPersona) => {
  return (
    <div onClick={() => onClick(id)} className="bg-surface-container flex p-4 rounded-xl gap-4   w-88 border border-surface-bright items-center ">
     <div className="w-10 h-10 rounded-full overflow-hidden">

       <Image src={image} alt={name} width={60} height={60} className="rounded-full object-cover w-full h-full"/>
     </div>
  
     <div>
       <h1 className="text-sm">{name}</h1>
      <p className="text-xs">{desc}</p>
     </div>
    </div>
  );
};

export default PersonaCard;
