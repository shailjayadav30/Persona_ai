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

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function onChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const login = async () => {
    if (!input.email || !input.password) {
      alert("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email: input.email,
        password: input.password,
        redirect: false,
      });

      if (result?.error) {
        alert("Invalid email or password");
        return;
      }

      console.log("Logged in successfully", result);

      // Refresh session data before navigating
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#191724] px-4 py-10 text-[#e0def4]">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#403d52] bg-[#26233a] p-6 shadow-xl sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#403d52] bg-[#1f1d2e]">
              <span className="text-2xl text-[#c4a7e7]">✦</span>
            </div>

            <h1 className="text-3xl font-bold text-[#e0def4]">Welcome back</h1>

            <p className="mt-2 text-sm leading-6 text-[#908caa]">
              Sign in to continue your journey.
            </p>
          </div>

          {/* Login form */}
          <div className="space-y-5">
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
                autoComplete="email"
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
                placeholder="Enter your password"
                value={input.password}
                onChange={onChangeInput}
                autoComplete="current-password"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    login();
                  }
                }}
                className="w-full rounded-lg border border-[#403d52] bg-[#1f1d2e] px-4 py-3 text-sm text-[#e0def4] outline-none transition placeholder:text-[#6e6a86] focus:border-[#c4a7e7] focus:ring-2 focus:ring-[#c4a7e7]/20"
              />
            </div>

            {/* Login button */}
            <button
              type="button"
              onClick={login}
              disabled={loading}
              className="w-full rounded-lg bg-[#31748f] px-4 py-3 text-sm font-semibold text-[#e0def4] transition-colors hover:bg-[#3a86a6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {/* Signup link */}
          <p className="mt-6 text-center text-sm text-[#908caa]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="font-medium text-[#c4a7e7] transition-colors hover:text-[#e0def4]"
            >
              Create account
            </button>
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-[#6e6a86]">
          Your ideas deserve a space to grow.
        </p>
      </div>
    </main>
  );
}
