"use client";
const URL = process.env.NEXT_PUBLIC_BACKEND_URL;

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SelectPersona from "./components/SelectPersona";

export default function Home() {
  const [reply, setReply] = useState("");
  const [ques, setQues] = useState("");

  return (
    <div className=" p-10">
      <SelectPersona/>
    </div>
  );
}
