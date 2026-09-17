"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

type ProgressWeek = {
  id: string;
  week: number;
  title: string;
  completed: number;
  total: number;
  percentage: number;
};

type ProgressData = {
  overall_percentage: number;
  weeks: ProgressWeek[];
};

function SparkleIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.7 9.3L21 12L13.7 14.7L12 22L10.3 14.7L3 12L10.3 9.3L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ProgressRing({
  percentage,
  size = 120,
  darkMode,
}: {
  percentage: number;
  size?: number;
  darkMode: boolean;
}) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  const safePercentage = Math.min(
    100,
    Math.max(0, percentage)
  );

  const offset =
    circumference -
    (safePercentage / 100) * circumference;

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        className="-rotate-90"
      >
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className={
            darkMode
              ? "text-slate-800"
              : "text-slate-200"
          }
        />

        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          className="text-cyan-400"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`text-2xl font-bold ${
            darkMode
              ? "text-white"
              : "text-slate-900"
          }`}
        >
          {Math.round(safePercentage)}%
        </span>

        <span
          className={`text-[10px] ${
            darkMode
              ? "text-slate-500"
              : "text-slate-500"
          }`}
        >
          Complete
        </span>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const [darkMode, setDarkMode] = useState(true);

  const [progress, setProgress] =
    useState<ProgressData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =================================================
     LOAD THEME + REAL BACKEND PROGRESS
  ================================================== */

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("nexora-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }

    const loadProgress = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.getProgress();

        setProgress({
          overall_percentage:
            Number(data.overall_percentage) || 0,

          weeks: Array.isArray(data.weeks)
            ? data.weeks
            : [],
        });
      } catch (err) {
        console.error(
          "Failed to load progress:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your progress."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  /* =================================================
     THEME
  ================================================== */

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    localStorage.setItem(
      "nexora-theme",
      nextMode ? "dark" : "light"
    );
  };

  /* =================================================
     DERIVED VALUES FROM BACKEND
  ================================================== */

  const overallPercentage =
    progress?.overall_percentage ?? 0;

  const weeks = progress?.weeks ?? [];

  const totalTasks = weeks.reduce(
    (sum, week) => sum + week.total,
    0
  );

  const completedTasks = weeks.reduce(
    (sum, week) => sum + week.completed,
    0
  );

  const remainingTasks =
    Math.max(0, totalTasks - completedTasks);

  const currentWeek = weeks.find(
    (week) => week.percentage < 100
  );

  /* =================================================
     STYLES
  ================================================== */

  const cardClass = darkMode
    ? "border-white/10 bg-white/[0.03]"
    : "border-slate-200 bg-white";

  const mainText = darkMode
    ? "text-white"
    : "text-slate-900";

  const mutedText = darkMode
    ? "text-slate-400"
    : "text-slate-500";

  const secondaryBg = darkMode
    ? "bg-white/[0.03]"
    : "bg-slate-50";

  /* =================================================
     LOADING
  ================================================== */

  if (loading) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center ${
          darkMode
            ? "bg-[#050b14] text-white"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-cyan-400 font-black text-slate-950">
            NX
          </div>

          <p
            className={`text-sm ${mutedText}`}
          >
            Loading your progress...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#050b14] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen w-64 border-r lg:block ${
          darkMode
            ? "border-white/10 bg-[#07101d]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex h-full flex-col p-5">

          {/* Logo */}
          <Link
            href="/dashboard"
            className="mb-8 flex items-center gap-3"
          >
            <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.08,
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-slate-950"
            >
              NX
            </motion.div>

            <div>
              <div
                className={`font-bold ${mainText}`}
              >
                Agent Nexora
              </div>

              <div
                className={`text-[10px] ${mutedText}`}
              >
                Navigate Your Next.
              </div>
            </div>
          </Link>

          {/* Workspace */}
          <div
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-widest ${mutedText}`}
          >
            Workspace
          </div>

          <nav className="space-y-1">

            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>⌂</span>
              Dashboard
            </Link>

            <Link
              href="/opportunities"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>◈</span>
              Opportunities
            </Link>

            <Link
              href="/profile"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>◎</span>
              Profile
            </Link>

            <Link
              href="/skill-gap"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>△</span>
              Skill Gap
            </Link>

            <Link
              href="/roadmap"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>◇</span>
              Roadmap
            </Link>

            {/* ACTIVE */}
            <div className="flex items-center gap-3 rounded-xl bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
              <span>◷</span>

              <span>Progress</span>

              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </div>

            <Link
              href="/resources"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>▣</span>
              Resources
            </Link>

            <Link
              href="/resume"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>▱</span>
              Resume Analyzer
            </Link>

            <Link
              href="/ask-nexora"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>✦</span>
              Ask Nexora
            </Link>

            <Link
              href="/voice"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>◌</span>
              Voice Assistant
            </Link>

          </nav>

          {/* Bottom */}
          <div className="mt-auto space-y-1">

            <Link
              href="/settings"
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>⚙</span>
              Settings
            </Link>

            <Link
              href="/login"
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>↪</span>
              Sign out
            </Link>

          </div>
        </div>
      </aside>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="lg:pl-64">

        {/* HEADER */}
        <header
          className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-5 backdrop-blur-xl md:px-8 ${
            darkMode
              ? "border-white/10 bg-[#050b14]/90"
              : "border-slate-200 bg-white/90"
          }`}
        >
          <div>
            <div
              className={`text-xs ${mutedText}`}
            >
              Workspace
            </div>

            <h1
              className={`text-lg font-semibold ${mainText}`}
            >
              Progress
            </h1>
          </div>

          <div className="flex items-center gap-3">

            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              {darkMode ? "☀" : "☾"}
            </button>

            {/* Notification */}
            <button
              aria-label="Notifications"
              className={`hidden h-10 w-10 items-center justify-center rounded-xl border md:flex ${
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              🔔
            </button>

            {/* User */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
              M
            </div>

          </div>
        </header>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="mx-auto max-w-7xl p-5 md:p-8">

          {/* HERO */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-7"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              Learning Progress
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

              <div>
                <h2
                  className={`text-3xl font-bold md:text-4xl ${mainText}`}
                >
                  Track your progress.
                </h2>

                <p
                  className={`mt-2 max-w-2xl text-sm leading-6 ${mutedText}`}
                >
                  See how far you have progressed through
                  your personalized learning roadmap.
                </p>
              </div>

              <Link
                href="/roadmap"
                className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Open Roadmap
                <span>→</span>
              </Link>

            </div>
          </motion.div>

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}

          {/* ================================================= */}
          {/* TOP STATS */}
          {/* ================================================= */}

          <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            {/* Overall */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`rounded-2xl border p-5 ${cardClass}`}
            >
              <div
                className={`text-xs ${mutedText}`}
              >
                Overall Progress
              </div>

              <div
                className={`mt-2 text-3xl font-bold ${mainText}`}
              >
                {Math.round(overallPercentage)}%
              </div>

              <div
                className={`mt-1 text-xs ${mutedText}`}
              >
                Across your roadmap
              </div>
            </motion.div>

            {/* Completed */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.05,
              }}
              className={`rounded-2xl border p-5 ${cardClass}`}
            >
              <div
                className={`text-xs ${mutedText}`}
              >
                Completed Tasks
              </div>

              <div className="mt-2 text-3xl font-bold text-emerald-400">
                {completedTasks}
              </div>

              <div
                className={`mt-1 text-xs ${mutedText}`}
              >
                Tasks finished
              </div>
            </motion.div>

            {/* Remaining */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
              }}
              className={`rounded-2xl border p-5 ${cardClass}`}
            >
              <div
                className={`text-xs ${mutedText}`}
              >
                Remaining Tasks
              </div>

              <div className="mt-2 text-3xl font-bold text-amber-300">
                {remainingTasks}
              </div>

              <div
                className={`mt-1 text-xs ${mutedText}`}
              >
                Keep moving forward
              </div>
            </motion.div>

            {/* Weeks */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.15,
              }}
              className={`rounded-2xl border p-5 ${cardClass}`}
            >
              <div
                className={`text-xs ${mutedText}`}
              >
                Roadmap
              </div>

              <div
                className={`mt-2 text-3xl font-bold ${mainText}`}
              >
                {weeks.length}
              </div>

              <div
                className={`mt-1 text-xs ${mutedText}`}
              >
                Learning weeks
              </div>
            </motion.div>

          </section>

          {/* ================================================= */}
          {/* OVERALL + WEEKLY PROGRESS */}
          {/* ================================================= */}

          <section className="mb-6 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">

            {/* Ring */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className={`flex flex-col items-center justify-center rounded-2xl border p-7 ${cardClass}`}
            >

              <ProgressRing
                percentage={overallPercentage}
                darkMode={darkMode}
              />

              <h3
                className={`mt-5 text-lg font-semibold ${mainText}`}
              >
                Roadmap Progress
              </h3>

              <p
                className={`mt-2 text-center text-xs leading-5 ${mutedText}`}
              >
                Complete tasks in your roadmap to increase
                your overall progress.
              </p>

            </motion.div>

            {/* Weekly Progress */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`rounded-2xl border p-6 ${cardClass}`}
            >

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h3
                    className={`text-lg font-semibold ${mainText}`}
                  >
                    Weekly Progress
                  </h3>

                  <p
                    className={`mt-1 text-xs ${mutedText}`}
                  >
                    Track each stage of your roadmap.
                  </p>
                </div>

                <Link
                  href="/roadmap"
                  className="text-xs text-cyan-300 hover:text-cyan-200"
                >
                  View roadmap →
                </Link>

              </div>

              {weeks.length === 0 ? (
                <div
                  className={`rounded-xl border p-5 text-center ${
                    darkMode
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-sm ${mutedText}`}
                  >
                    No roadmap progress is available yet.
                  </p>

                  <Link
                    href="/roadmap"
                    className="mt-3 inline-block text-xs text-cyan-300"
                  >
                    Open Roadmap →
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">

                  {weeks.map((week, index) => {

                    const percentage = Math.min(
                      100,
                      Math.max(
                        0,
                        Number(week.percentage) || 0
                      )
                    );

                    return (
                      <motion.div
                        key={`${week.id}-${index}`}
                        initial={{
                          opacity: 0,
                          x: 10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: index * 0.08,
                        }}
                      >

                        <div className="mb-2 flex items-center justify-between gap-4">

                          <div className="flex min-w-0 items-center gap-3">

                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                                percentage === 100
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : "bg-cyan-400/10 text-cyan-300"
                              }`}
                            >
                              W{week.week}
                            </div>

                            <div className="min-w-0">

                              <div
                                className={`truncate text-sm font-medium ${mainText}`}
                              >
                                {week.title}
                              </div>

                              <div
                                className={`text-[10px] ${mutedText}`}
                              >
                                {week.completed} /{" "}
                                {week.total} tasks completed
                              </div>

                            </div>

                          </div>

                          <span className="shrink-0 text-sm font-semibold text-cyan-300">
                            {Math.round(percentage)}%
                          </span>

                        </div>

                        <div
                          className={`h-2 overflow-hidden rounded-full ${
                            darkMode
                              ? "bg-white/10"
                              : "bg-slate-200"
                          }`}
                        >
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${percentage}%`,
                            }}
                            transition={{
                              duration: 0.8,
                              delay: index * 0.1,
                            }}
                            className="h-full rounded-full bg-cyan-400"
                          />
                        </div>

                      </motion.div>
                    );
                  })}

                </div>
              )}

            </motion.div>

          </section>

          {/* ================================================= */}
          {/* LOWER GRID */}
          {/* ================================================= */}

          <section className="grid gap-6 lg:grid-cols-2">

            {/* Current Focus */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`rounded-2xl border p-6 ${cardClass}`}
            >

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <SparkleIcon size={18} />
                </div>

                <div>
                  <h3
                    className={`text-lg font-semibold ${mainText}`}
                  >
                    Current Focus
                  </h3>

                  <p
                    className={`text-xs ${mutedText}`}
                  >
                    What you should work on next.
                  </p>
                </div>

              </div>

              <div
                className={`rounded-xl border p-4 ${secondaryBg} ${
                  darkMode
                    ? "border-white/10"
                    : "border-slate-200"
                }`}
              >

                {currentWeek ? (
                  <>
                    <div className="text-xs text-cyan-300">
                      Week {currentWeek.week}
                    </div>

                    <div
                      className={`mt-2 text-base font-semibold ${mainText}`}
                    >
                      {currentWeek.title}
                    </div>

                    <p
                      className={`mt-2 text-xs leading-5 ${mutedText}`}
                    >
                      {currentWeek.completed} of{" "}
                      {currentWeek.total} tasks completed.
                      Continue with this roadmap stage.
                    </p>

                    <div className="mt-4">
                      <div
                        className={`h-2 overflow-hidden rounded-full ${
                          darkMode
                            ? "bg-white/10"
                            : "bg-slate-200"
                        }`}
                      >
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                Number(
                                  currentWeek.percentage
                                ) || 0
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-emerald-300">
                      Roadmap Complete
                    </div>

                    <div
                      className={`mt-2 text-base font-semibold ${mainText}`}
                    >
                      All available roadmap stages are complete.
                    </div>

                    <p
                      className={`mt-2 text-xs leading-5 ${mutedText}`}
                    >
                      Continue using Nexora to explore
                      opportunities and prepare for your next
                      career step.
                    </p>
                  </>
                )}

              </div>

              <Link
                href="/roadmap"
                className="mt-4 flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-xs text-cyan-300 transition hover:bg-cyan-400/10"
              >
                Continue learning
                <span>→</span>
              </Link>

            </motion.div>

            {/* Progress Summary */}
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.08,
              }}
              className={`rounded-2xl border p-6 ${cardClass}`}
            >

              <div className="mb-5">

                <h3
                  className={`text-lg font-semibold ${mainText}`}
                >
                  Progress Summary
                </h3>

                <p
                  className={`mt-1 text-xs ${mutedText}`}
                >
                  Your current roadmap completion.
                </p>

              </div>

              <div className="space-y-4">

                <div
                  className={`flex items-center justify-between rounded-xl border p-4 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div>
                    <div
                      className={`text-sm font-semibold ${mainText}`}
                    >
                      Completed
                    </div>

                    <div
                      className={`mt-1 text-[10px] ${mutedText}`}
                    >
                      Tasks finished
                    </div>
                  </div>

                  <div className="text-xl font-bold text-emerald-400">
                    {completedTasks}
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between rounded-xl border p-4 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div>
                    <div
                      className={`text-sm font-semibold ${mainText}`}
                    >
                      Remaining
                    </div>

                    <div
                      className={`mt-1 text-[10px] ${mutedText}`}
                    >
                      Tasks still to complete
                    </div>
                  </div>

                  <div className="text-xl font-bold text-amber-300">
                    {remainingTasks}
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between rounded-xl border p-4 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div>
                    <div
                      className={`text-sm font-semibold ${mainText}`}
                    >
                      Roadmap Stages
                    </div>

                    <div
                      className={`mt-1 text-[10px] ${mutedText}`}
                    >
                      Stages received from backend
                    </div>
                  </div>

                  <div
                    className={`text-xl font-bold ${mainText}`}
                  >
                    {weeks.length}
                  </div>
                </div>

              </div>

            </motion.div>

          </section>

          {/* ================================================= */}
          {/* NEXORA INSIGHT */}
          {/* ================================================= */}

          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5"
          >

            <div className="flex flex-col gap-4 md:flex-row md:items-center">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <SparkleIcon size={20} />
              </div>

              <div className="flex-1">

                <div className="text-sm font-semibold text-cyan-300">
                  Nexora Insight
                </div>

                <p
                  className={`mt-1 text-xs leading-5 ${mutedText}`}
                >
                  {overallPercentage <= 0
                    ? "Your roadmap has not been started yet. Open the roadmap and begin your first task."
                    : overallPercentage < 50
                      ? "You have started your roadmap. Continue completing the current stage to build momentum."
                      : overallPercentage < 100
                        ? "You are progressing through your roadmap. Keep completing the remaining tasks."
                        : "Your roadmap progress is complete. You can now focus on opportunities and career preparation."}
                </p>

              </div>

              <Link
                href="/ask-nexora"
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/20"
              >
                Ask Nexora →
              </Link>

            </div>

          </motion.section>

          {/* FOOTER */}
          <footer
            className={`py-8 text-center text-xs ${mutedText}`}
          >
            Agent Nexora • Navigate Your Next.
          </footer>

        </div>
      </main>
    </div>
  );
}