"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api } from "@/lib/api";

const stages = [
  {
    title: "Analyzing your profile",
    description:
      "Understanding your education, skills, interests and experience.",
    icon: "◉",
  },
  {
    title: "Matching opportunities",
    description:
      "Finding career opportunities that align with your profile.",
    icon: "⌕",
  },
  {
    title: "Analyzing requirements",
    description:
      "Comparing opportunity requirements with your current profile.",
    icon: "◇",
  },
  {
    title: "Identifying skill gaps",
    description:
      "Finding the skills you need to strengthen for your target career.",
    icon: "△",
  },
  {
    title: "Building your roadmap",
    description:
      "Creating a personalized learning and career roadmap.",
    icon: "✦",
  },
];

function SidebarItem({
  href,
  icon,
  label,
  active = false,
  darkMode,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
  darkMode: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
        active
          ? "bg-cyan-400/10 text-cyan-300"
          : darkMode
            ? "text-slate-400 hover:bg-white/5 hover:text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          active
            ? "bg-cyan-400/10"
            : darkMode
              ? "bg-white/[0.03]"
              : "bg-slate-100"
        }`}
      >
        {icon}
      </span>

      <span>{label}</span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
      )}
    </Link>
  );
}

export default function AnalysisPage() {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("nexora-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        setLoading(true);
        setError("");

        const profile = await api.getProfile();

        await api.analyzeProfile(profile);

        setCurrentStage(stages.length);
        setProgress(100);
        setCompleted(true);
      } catch (err) {
        console.error("Career analysis failed:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to complete your career analysis."
        );
      } finally {
        setLoading(false);
      }
    };

    void runAnalysis();
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    localStorage.setItem(
      "nexora-theme",
      nextMode ? "dark" : "light"
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-[#050b14] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen w-64 border-r lg:block ${
          darkMode
            ? "border-white/10 bg-[#07101d]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex h-full flex-col p-5">

          {/* EXACT AGENT NEXORA BRANDING */}
          <Link
            href="/dashboard"
            className="mb-8 flex items-center gap-4"
          >
            <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[20px] bg-cyan-400 font-black text-[23px] text-slate-950">
              NX
            </div>

            <div>
              <div
                className={`text-[22px] font-bold leading-tight ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Agent Nexora
              </div>

              <div
                className={`mt-1 text-[14px] ${darkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                Navigate Your Next.
              </div>
            </div>
          </Link>

          <div
            className={`mb-3 px-3 text-[10px] uppercase tracking-widest ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            Workspace
          </div>

          <nav className="space-y-1">

            <SidebarItem
              href="/dashboard"
              icon="⌂"
              label="Dashboard"
              darkMode={darkMode}
            />

            <SidebarItem
              href="/opportunities"
              icon="◈"
              label="Opportunities"
              darkMode={darkMode}
            />

            <SidebarItem
              href="/profile"
              icon="◎"
              label="Profile"
              darkMode={darkMode}
            />

            <SidebarItem
              href="/skill-gap"
              icon="◌"
              label="Skill Gap"
              darkMode={darkMode}
            />

            <SidebarItem
              href="/roadmap"
              icon="◇"
              label="Roadmap"
              darkMode={darkMode}
            />

            <SidebarItem
              href="/progress"
              icon="◒"
              label="Progress"
              darkMode={darkMode}
            />

            <SidebarItem
              href="/resources"
              icon="▤"
              label="Resources"
              darkMode={darkMode}
            />

            <SidebarItem
              href="/resume"
              icon="▱"
              label="Resume Analyzer"
              darkMode={darkMode}
            />

            <SidebarItem
              href="/ask-nexora"
              icon="✦"
              label="Ask Nexora"
              darkMode={darkMode}
            />

            <SidebarItem
              href="/voice"
              icon="🎙️"
              label="Voice Assistant"
              darkMode={darkMode}
            />

          </nav>

          <div className="mt-auto space-y-1">

            <Link
              href="/settings"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03]">
                ⚙
              </span>

              Settings
            </Link>

            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03]">
                ↪
              </span>

              Sign out
            </button>

          </div>
        </div>
      </aside>

      {/* ===================================================== */}
      {/* MAIN */}
      {/* ===================================================== */}

      <main className="lg:pl-64">

        {/* TOPBAR */}
        <nav
          className={`sticky top-0 z-30 border-b backdrop-blur-xl ${
            darkMode
              ? "border-white/10 bg-[#07101d]/90"
              : "border-slate-200 bg-white/90"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-5 md:px-8">

            <div>
              <div
                className={`text-xs ${
                  darkMode ? "text-slate-500" : "text-slate-400"
                }`}
              >
                Workspace
              </div>

              <h1 className="text-lg font-semibold">
                AI Analysis
              </h1>
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={toggleTheme}
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                  darkMode
                    ? "border-white/10 bg-white/5 hover:bg-white/10"
                    : "border-slate-200 bg-white hover:bg-slate-100"
                }`}
              >
                {darkMode ? "☀" : "☾"}
              </button>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
                NX
              </div>

            </div>
          </div>
        </nav>

        {/* ===================================================== */}
        {/* CONTENT */}
        {/* ===================================================== */}

        <section className="relative z-10 mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl flex-col justify-center px-6 py-16">

          {/* AI BADGE */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex justify-center"
          >
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                error
                  ? darkMode
                    ? "border-red-400/20 bg-red-400/5 text-red-300"
                    : "border-red-200 bg-red-50 text-red-700"
                  : darkMode
                    ? "border-cyan-400/20 bg-cyan-400/5 text-cyan-300"
                    : "border-cyan-200 bg-cyan-50 text-cyan-700"
              }`}
            >
              {!error && (
                <motion.span
                  animate={
                    loading
                      ? { scale: [1, 1.4, 1] }
                      : { scale: 1 }
                  }
                  transition={{
                    duration: 1.2,
                    repeat: loading ? Infinity : 0,
                  }}
                  className="h-2 w-2 rounded-full bg-cyan-400"
                />
              )}

              {error
                ? "Analysis failed"
                : completed
                  ? "Nexora AI analysis complete"
                  : "Nexora AI is working"}
            </div>
          </motion.div>

          {/* HEADING */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center"
          >
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Building your

              <span className="block text-cyan-400">
                career intelligence
              </span>
            </h1>

            <p
              className={`mx-auto mt-5 max-w-2xl text-base leading-7 sm:text-lg ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Agent Nexora is analyzing your profile and matching
              your skills with relevant career opportunities.
            </p>
          </motion.div>

          {/* ANALYSIS CARD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className={`mx-auto mt-12 w-full max-w-3xl rounded-3xl border p-6 shadow-2xl sm:p-8 ${
              darkMode
                ? "border-white/10 bg-white/[0.035] shadow-black/30"
                : "border-slate-200 bg-white shadow-slate-200/60"
            }`}
          >

            {/* PROGRESS HEADER */}
            <div className="mb-7 flex items-center justify-between">

              <div>

                <p
                  className={`text-sm font-medium ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Analysis progress
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {progress}%
                </p>

              </div>

              <div className="relative flex h-16 w-16 items-center justify-center">

                <svg
                  className="h-16 w-16 -rotate-90"
                  viewBox="0 0 64 64"
                >
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    className={
                      darkMode
                        ? "text-white/10"
                        : "text-slate-200"
                    }
                  />

                  <motion.circle
                    cx="32"
                    cy="32"
                    r="27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="text-cyan-400"
                    strokeDasharray={170}
                    animate={{
                      strokeDashoffset:
                        170 - (170 * progress) / 100,
                    }}
                  />
                </svg>

                <span className="absolute text-xs font-bold">
                  AI
                </span>

              </div>

            </div>

            {/* PROGRESS BAR */}
            <div
              className={`mb-9 h-2 overflow-hidden rounded-full ${
                darkMode
                  ? "bg-white/10"
                  : "bg-slate-100"
              }`}
            >
              <motion.div
                className="h-full rounded-full bg-cyan-400"
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.6,
                }}
              />
            </div>

            {/* ERROR */}
            {error && (
              <div
                className={`mb-6 rounded-2xl border p-4 ${
                  darkMode
                    ? "border-red-400/20 bg-red-400/5"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    darkMode
                      ? "text-red-300"
                      : "text-red-700"
                  }`}
                >
                  {error}
                </p>

                <button
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-3 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-[#06101d] hover:bg-cyan-300"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* STAGES */}
            <div className="space-y-3">

              {stages.map((stage, index) => {

                const isCompleted =
                  completed ||
                  index < currentStage;

                const isCurrent =
                  !completed &&
                  !error &&
                  index === currentStage;

                return (
                  <motion.div
                    key={stage.title}
                    initial={{
                      opacity: 0,
                      x: -15,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        0.4 + index * 0.08,
                    }}
                    className={`flex items-center gap-4 rounded-2xl border p-4 ${
                      isCurrent
                        ? darkMode
                          ? "border-cyan-400/30 bg-cyan-400/[0.07]"
                          : "border-cyan-200 bg-cyan-50"
                        : darkMode
                          ? "border-white/5 bg-white/[0.02]"
                          : "border-slate-100 bg-slate-50"
                    }`}
                  >

                    {/* ICON */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                        isCompleted
                          ? "bg-cyan-400 text-[#06101d]"
                          : isCurrent
                            ? darkMode
                              ? "bg-cyan-400/15 text-cyan-300"
                              : "bg-cyan-100 text-cyan-700"
                            : darkMode
                              ? "bg-white/5 text-slate-500"
                              : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {isCompleted
                        ? "✓"
                        : stage.icon}
                    </div>

                    {/* TEXT */}
                    <div className="min-w-0 flex-1">

                      <p
                        className={`font-semibold ${
                          isCurrent
                            ? "text-cyan-400"
                            : ""
                        }`}
                      >
                        {stage.title}
                      </p>

                      <p
                        className={`mt-1 text-xs leading-5 ${
                          darkMode
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        {stage.description}
                      </p>

                    </div>

                    {/* STATUS */}
                    <div className="shrink-0">

                      {isCompleted ? (
                        <span className="text-xs font-medium text-cyan-400">
                          Complete
                        </span>
                      ) : isCurrent ? (
                        <motion.span
                          animate={{
                            opacity: [
                              0.4,
                              1,
                              0.4,
                            ],
                          }}
                          transition={{
                            duration: 1.2,
                            repeat: Infinity,
                          }}
                          className="text-xs font-medium text-cyan-400"
                        >
                          Working...
                        </motion.span>
                      ) : (
                        <span
                          className={`text-xs ${
                            darkMode
                              ? "text-slate-600"
                              : "text-slate-400"
                          }`}
                        >
                          Waiting
                        </span>
                      )}

                    </div>

                  </motion.div>
                );
              })}

            </div>

            {/* BOTTOM MESSAGE */}
            <div
              className={`mt-7 rounded-2xl border p-4 text-center ${
                darkMode
                  ? "border-white/5 bg-white/[0.02]"
                  : "border-slate-100 bg-slate-50"
              }`}
            >

              <AnimatePresence mode="wait">

                {error ? (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-400"
                  >
                    ⚠ Unable to complete the career analysis.
                  </motion.p>
                ) : !completed ? (
                  <motion.p
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    ✦ Nexora is analyzing your profile...
                  </motion.p>
                ) : (
                  <motion.p
                    key="complete"
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="text-sm font-medium text-cyan-400"
                  >
                    ✓ Your career analysis is ready.
                  </motion.p>
                )}

              </AnimatePresence>

            </div>
          </motion.div>

          {/* RESULT BUTTON */}
          <AnimatePresence>
            {completed && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-8 flex justify-center"
              >
                <Link
                  href="/results"
                  className="group flex items-center gap-3 rounded-xl bg-cyan-400 px-7 py-3.5 font-bold text-[#06101d] shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  View My Results

                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <p
            className={`mt-10 text-center text-xs ${
              darkMode
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            Agent Nexora • Navigate Your Next.
          </p>

        </section>
      </main>
    </div>
  );
}