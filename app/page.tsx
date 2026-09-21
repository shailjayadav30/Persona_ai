"use client";
import { useSession } from "next-auth/react";
import SelectPersona from "../components/SelectPersona";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  console.log("Session", session?.user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Checking authentication...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }
  return (
    <div className="p-4 sm:p-10">
      <SelectPersona />
    </div>
  );
}
