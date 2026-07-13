"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Login {
  email: string;
  password: string;
}
export default function Signin() {
  const [input, setInput] = useState<Login>({
    email: "",
    password: "",
  });
  const router = useRouter();

  function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const login = async () => {
    const result = await signIn("credentials", {
      email: input.email,
      password: input.password,
      redirect: false,
    });
    if (result?.error) {
      alert("Invalid email or password");
      return;
    }
    console.log("Logged in", result);
    router.push("/");
  };
  return (
    <div>
      <input
        type="text"
        name="email"
        placeholder="Enter your email"
        value={input.email}
        onChange={onChangeInput}
      />
      <input
        type="text"
        name="password"
        placeholder="Enter your password"
        value={input.password}
        onChange={onChangeInput}
      />
      <button onClick={login}>LOGIN butt</button>
    </div>
  );
}
