"use client";
import axios from "axios";
import { useState } from "react";
export default function SignUp() {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  function onValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function register(e: React.FormEvent) {
    e.preventDefault();
    console.log("in register");
    try {
      const response = await axios.post("/api/auth/signup", input);
      console.log("register", response.data);
    } catch (error) {
      console.log("errro", error);
    }
  }
  return (
    <div className="bg-surface-container flex items-center flex-col justify-center  p-6  rounded-[12px] ">
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-primary text-2xl font-semibold pb-1 ">AI Mentor</h1>
        <h3 className="text-xl font-bold">Create your account</h3>
        <p className="text-sm pb-4">
          Unlock the full power of premium intelligence.
        </p>
        <div className="flex justify-between items-center w-full">
          <div>
            <button>Github</button>
          </div>
          <div>
            <button>Google</button>
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center ">
        <div className="w-20 h-[0.1px] bg-outline"></div>
        <h1 className="text-on-surface">Or continue with</h1>
        <div className="w-20 h-[0.1px] bg-outline"></div>
      </div>
      <form onSubmit={register} className="flex flex-col">
        <div>
          <label htmlFor="name" className="text-on-surface">
            Full Name
          </label>
          <input
            value={input.name}
            onChange={onValueChange}
            type="text"
            placeholder="Enter your name"
            name="name"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-on-surface">
            Full Name
          </label>

          <input
            value={input.email}
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={onValueChange}
          />
        </div>
        <div>
          <label htmlFor="password" className="text-on-surface">
            Full Name
          </label>

          <input
            value={input.password}
            onChange={onValueChange}
            type="password"
            name="password"
            placeholder="Enter your password"
          />
        </div>
        <div>
          <button type="submit">Create Account</button>
        </div>
      </form>
    </div>
  );
}
