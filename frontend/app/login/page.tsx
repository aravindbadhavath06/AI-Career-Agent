"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await api.login(
        email.trim(),
        password
      );

      /*
       * Support common backend token names.
       * If your backend uses cookie authentication,
       * no token needs to be stored here.
       */
      const token =
        result?.access_token ||
        result?.token;

      if (token) {
        localStorage.setItem(
          "nexora-access-token",
          token
        );
      }

      /*
       * Store returned user information only when
       * the backend actually provides it.
       */
      if (result?.user) {
        localStorage.setItem(
          "nexora-user",
          JSON.stringify(result.user)
        );
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111f] text-white">

      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}

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

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <motion.nav
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8"
      >

        {/* SAME NEXORA LOGO + BRANDING */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{
              rotate: 8,
              scale: 1.08,
            }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-xl font-black text-[#07111f]"
          >
            NX
          </motion.div>

          <div>
            <div className="text-lg font-bold tracking-tight">
              Agent Nexora
            </div>

            <div className="text-xs text-slate-400">
              Navigate Your Next.
            </div>
          </div>
        </Link>

        <Link
          href="/"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to Home
        </Link>

      </motion.nav>

      {/* =====================================================
          LOGIN AREA
      ===================================================== */}

      <section className="relative z-10 flex min-h-[calc(100vh-100px)] items-center justify-center px-6 py-12">

        <motion.div
          initial={{
            opacity: 0,
            y: 35,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="w-full max-w-md"
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 text-center">

            <motion.div
              initial={{
                scale: 0.8,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400 text-xl font-black text-[#07111f]"
            >
              NX
            </motion.div>

            <h1 className="text-4xl font-black tracking-tight">
              Welcome back
            </h1>

            <p className="mt-3 text-slate-400">
              Sign in to continue your journey with Nexora.
            </p>

          </div>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

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

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </motion.div>
              )}

              {/* =================================================
                  EMAIL
              ================================================= */}

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

              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-200"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    disabled
                    className="text-xs font-medium text-slate-600"
                  >
                    Forgot password?
                  </button>

                </div>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-700 bg-[#07111f] px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>

              {/* =================================================
                  REMEMBER ME
              ================================================= */}

              <div className="flex items-center gap-3">

                <input
                  id="remember"
                  type="checkbox"
                  disabled={loading}
                  className="h-4 w-4 rounded border-slate-700 bg-[#07111f] accent-cyan-400"
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-slate-400"
                >
                  Remember me
                </label>

              </div>

              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <motion.button
                type="submit"
                disabled={
                  loading ||
                  !email.trim() ||
                  !password
                }
                whileHover={
                  !loading
                    ? {
                        scale: 1.02,
                        boxShadow:
                          "0 0 30px rgba(34,211,238,0.2)",
                      }
                    : {}
                }
                whileTap={
                  !loading
                    ? {
                        scale: 0.98,
                      }
                    : {}
                }
                className={`w-full rounded-xl px-5 py-3.5 font-bold text-[#07111f] transition ${
                  loading ||
                  !email.trim() ||
                  !password
                    ? "cursor-not-allowed bg-cyan-400/40"
                    : "bg-cyan-400 hover:bg-cyan-300"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />

                    Signing in...

                  </span>
                ) : (
                  "Sign In →"
                )}
              </motion.button>

            </form>

            {/* =================================================
                DIVIDER
            ================================================= */}

            <div className="my-7 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-800" />

              <span className="text-xs text-slate-600">
                OR
              </span>

              <div className="h-px flex-1 bg-slate-800" />

            </div>

            {/* =================================================
                GOOGLE
            ================================================= */}

            <button
              type="button"
              disabled
              title="Google authentication will be connected to the backend"
              className="w-full cursor-not-allowed rounded-xl border border-slate-700 bg-transparent px-5 py-3.5 text-sm font-semibold text-slate-600"
            >
              Continue with Google
            </button>

            {/* =================================================
                SIGNUP
            ================================================= */}

            <p className="mt-7 text-center text-sm text-slate-400">

              Don't have an account?{" "}

              <Link
                href="/signup"
                className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Create an account
              </Link>

            </p>

          </motion.div>

          {/* =================================================
              BOTTOM TEXT
          ================================================= */}

          <p className="mt-6 text-center text-xs leading-5 text-slate-600">
            Your career journey starts with understanding where
            you are and where you want to go.
          </p>

        </motion.div>

      </section>

    </main>
  );
}