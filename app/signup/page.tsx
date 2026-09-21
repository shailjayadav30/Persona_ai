"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Signup {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const [input, setInput] = useState<Signup>({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const signup = async () => {
    if (!input.name || !input.email || !input.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const result = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      const data = await result.json();

      if (!result.ok) {
        alert(data.message || data.error || "Signup failed");
        return;
      }

      console.log("Signup successful:", data);

      // Signup creates the account.
      // User should sign in afterward to create a session.
      router.push("/signin");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#191724] px-4 py-10 text-[#e0def4] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#403d52] bg-[#26233a] p-6 shadow-xl sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#403d52] bg-[#1f1d2e]">
              <span className="text-2xl text-[#c4a7e7]">✦</span>
            </div>

            <h1 className="text-3xl font-bold text-[#e0def4]">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#908caa]">
              Start your journey and bring your ideas to life.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-[#c4a7e7]"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your name"
                value={input.name}
                onChange={onChangeInput}
                className="w-full rounded-lg border border-[#403d52] bg-[#1f1d2e] px-4 py-3 text-sm text-[#e0def4] outline-none transition placeholder:text-[#6e6a86] focus:border-[#c4a7e7] focus:ring-2 focus:ring-[#c4a7e7]/20"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#c4a7e7]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={input.email}
                onChange={onChangeInput}
                className="w-full rounded-lg border border-[#403d52] bg-[#1f1d2e] px-4 py-3 text-sm text-[#e0def4] outline-none transition placeholder:text-[#6e6a86] focus:border-[#c4a7e7] focus:ring-2 focus:ring-[#c4a7e7]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#c4a7e7]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={input.password}
                onChange={onChangeInput}
                className="w-full rounded-lg border border-[#403d52] bg-[#1f1d2e] px-4 py-3 text-sm text-[#e0def4] outline-none transition placeholder:text-[#6e6a86] focus:border-[#c4a7e7] focus:ring-2 focus:ring-[#c4a7e7]/20"
              />
            </div>

            {/* Signup button */}
            <button
              type="button"
              onClick={signup}
              disabled={loading}
              className="w-full rounded-lg bg-[#31748f] px-4 py-3 text-sm font-semibold text-[#e0def4] transition-colors hover:bg-[#3a86a6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-[#908caa]">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signin")}
              className="font-medium text-[#c4a7e7] transition-colors hover:text-[#e0def4]"
            >
              Sign in
            </button>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-[#6e6a86]">
          Your space to create, explore, and grow.
        </p>
      </div>
    </main>
  );
}
