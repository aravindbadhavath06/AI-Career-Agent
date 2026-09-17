"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!agree) {
      setError(
        "Please agree to the Terms of Service and Privacy Policy."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.signup({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      /*
       * Support either access_token or token because
       * your API contract allows both.
       */

      const token =
        response.access_token || response.token;

      if (token) {
        localStorage.setItem(
          "nexora-access-token",
          token
        );
      }

      /*
       * After successful registration, send the user
       * into the authenticated Nexora application.
       */

      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      {/* Background glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none fixed left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"
      />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{ rotate: 8, scale: 1.08 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-[#07111f]"
          >
            NX
          </motion.div>

          <span className="text-xl font-bold tracking-tight">
            Agent Nexora
          </span>
        </Link>

        <Link
          href="/"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Home
        </Link>
      </motion.nav>

      {/* Signup area */}
      <section className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-6 py-12">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md"
        >

          {/* Header */}
          <div className="mb-8 text-center">

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-xl font-black text-[#07111f]"
            >
              NX
            </motion.div>

            <h1 className="text-4xl font-black tracking-tight">
              Create your account
            </h1>

            <p className="mt-3 text-slate-400">
              Start navigating your next move with Nexora.
            </p>

          </div>

          {/* Signup Card */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              delay: 0.25,
              duration: 0.6,
            }}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl sm:p-8"
          >

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                  disabled={loading}
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-700 bg-[#07111f] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-700 bg-[#07111f] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-700 bg-[#07111f] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  minLength={6}
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-slate-700 bg-[#07111f] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm leading-5 text-red-300"
                >
                  {error}
                </div>
              )}

              {/* Terms */}
              <div className="flex items-start gap-3">

                <input
                  id="terms"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) =>
                    setAgree(e.target.checked)
                  }
                  disabled={loading}
                  className="mt-1 h-4 w-4 rounded border-slate-700 bg-[#07111f] accent-cyan-400"
                />

                <label
                  htmlFor="terms"
                  className="text-sm leading-5 text-slate-400"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-medium text-cyan-400 transition hover:text-cyan-300"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-medium text-cyan-400 transition hover:text-cyan-300"
                  >
                    Privacy Policy
                  </button>
                  .
                </label>

              </div>

              {/* Create Account */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={
                  !loading
                    ? {
                        scale: 1.02,
                        boxShadow:
                          "0 0 30px rgba(34,211,238,0.2)",
                      }
                    : undefined
                }
                whileTap={
                  !loading
                    ? {
                        scale: 0.98,
                      }
                    : undefined
                }
                className="w-full rounded-xl bg-cyan-400 px-5 py-3.5 font-bold text-[#07111f] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account →"}
              </motion.button>

            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs text-slate-600">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>

            {/* Google */}
            <button
              type="button"
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-700 bg-transparent px-5 py-3.5 text-sm font-semibold text-slate-500"
            >
              Continue with Google
            </button>

            <p className="mt-2 text-center text-[11px] text-slate-600">
              Google authentication is not available in
              the current backend API.
            </p>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-400">

              Already have an account?{" "}

              <Link
                href="/login"
                className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Sign in
              </Link>

            </p>

          </motion.div>

          {/* Bottom text */}
          <p className="mt-6 text-center text-xs leading-5 text-slate-600">
            Create your profile, discover opportunities,
            and let Nexora help you navigate your next step.
          </p>

        </motion.div>

      </section>

    </main>
  );
}