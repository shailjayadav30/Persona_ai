// import prisma from "./prisma";
// import { PersonaKey } from "@/app/generated/prisma/enums";

// export async function loadHistory(userId: string, persona: PersonaKey) {
//   const message = await prisma.message.findMany({
//     take: 20,
//     orderBy: {
//       createdAt: "desc",
//     },
//     where: {
//       userId: userId,
//       persona: persona,
//     },
//   });

//   const hsitory = message.reverse();
//   return hsitory;
// }
