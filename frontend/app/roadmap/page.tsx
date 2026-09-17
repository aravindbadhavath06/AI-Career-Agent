"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, RoadmapWeek } from "@/lib/api";

export default function RoadmapPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>([]);
  const [expandedWeek, setExpandedWeek] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updatingTask, setUpdatingTask] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  /* ============================================================
     THEME
  ============================================================ */

  useEffect(() => {
    const savedTheme = localStorage.getItem("nexora-theme");

    setDarkMode(savedTheme !== "light");
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "nexora-theme",
      newMode ? "dark" : "light"
    );
  };

  /* ============================================================
     LOAD REAL ROADMAP
  ============================================================ */

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getRoadmap();

      const backendRoadmap = response.roadmap || [];

      setRoadmap(backendRoadmap);

      /*
       * Open the first backend week automatically.
       * No hardcoded week number.
       */
      if (backendRoadmap.length > 0) {
        setExpandedWeek(String(backendRoadmap[0].id));
      }
    } catch (err) {
      console.error("Failed to load roadmap:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load your roadmap."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
     UPDATE TASK THROUGH BACKEND
  ============================================================ */

  const toggleTask = async (
    taskId: string,
    completed: boolean
  ) => {
    if (updatingTask === taskId) return;

    try {
      setUpdatingTask(taskId);
      setError("");

      /*
       * REAL BACKEND UPDATE
       *
       * PATCH /api/roadmap/tasks/{taskId}
       */
      const updatedTask = await api.updateRoadmapTask(
        taskId,
        !completed
      );

      /*
       * Update the UI with the actual backend response.
       */
      setRoadmap((currentRoadmap) =>
        currentRoadmap.map((week) => ({
          ...week,
          tasks: week.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  completed: updatedTask.completed,
                }
              : task
          ),
        }))
      );
    } catch (err) {
      console.error(
        "Failed to update roadmap task:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update the task."
      );
    } finally {
      setUpdatingTask(null);
    }
  };

  /* ============================================================
     PROGRESS
  ============================================================ */

  const totalTasks = roadmap.reduce(
    (total, week) =>
      total + week.tasks.length,
    0
  );

  const completedTasks = roadmap.reduce(
    (total, week) =>
      total +
      week.tasks.filter(
        (task) => task.completed
      ).length,
    0
  );

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  const currentWeek =
    roadmap.find((week) =>
      week.tasks.some(
        (task) => !task.completed
      )
    ) || roadmap[0];

  /* ============================================================
     COLORS
  ============================================================ */

  const cardClass = darkMode
    ? "border-white/10 bg-white/[0.035]"
    : "border-slate-200 bg-white";

  const mutedText = darkMode
    ? "text-slate-400"
    : "text-slate-500";

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-[#050b14] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute right-0 top-20 h-[500px] w-[500px] rounded-full blur-3xl ${
            darkMode
              ? "bg-cyan-500/10"
              : "bg-cyan-400/10"
          }`}
        />
      </div>

      {/* ========================================================
          SIDEBAR
      ========================================================= */}

      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen w-64 border-r lg:block ${
          darkMode
            ? "border-white/10 bg-[#07101d]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-inherit px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-[#06101d] shadow-lg shadow-cyan-500/20">
            NX
          </div>

          <div>
            <p className="font-bold">
              Agent Nexora
            </p>

            <p
              className={`text-[9px] uppercase tracking-[0.22em] ${
                darkMode
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              Navigate Your Next
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 px-4 py-6">
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
            href="/results"
            icon="✦"
            label="AI Results"
            darkMode={darkMode}
          />

          <SidebarItem
            href="/skill-gap"
            icon="△"
            label="Skill Gap"
            darkMode={darkMode}
          />

          <SidebarItem
            href="/roadmap"
            icon="→"
            label="Roadmap"
            active
            darkMode={darkMode}
          />

          <SidebarItem
            href="/progress"
            icon="↗"
            label="Progress"
            darkMode={darkMode}
          />

          <SidebarItem
            href="/resources"
            icon="📚"
            label="Resources"
            darkMode={darkMode}
          />

          <SidebarItem
            href="/resume"
            icon="▤"
            label="Resume Analyzer"
            darkMode={darkMode}
          />

          <SidebarItem
            href="/ask-nexora"
            icon="✧"
            label="Ask Nexora"
            darkMode={darkMode}
          />

          <SidebarItem
            href="/voice-assistant"
            icon="◉"
            label="Voice Assistant"
            darkMode={darkMode}
          />
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-5 left-0 w-full px-4">
          <SidebarItem
            href="/settings"
            icon="⚙"
            label="Settings"
            darkMode={darkMode}
          />

          <button
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
              darkMode
                ? "text-slate-500 hover:bg-white/5 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* ========================================================
          MAIN
      ========================================================= */}

      <div className="relative z-10 lg:pl-64">

        {/* Header */}
        <header
          className={`sticky top-0 z-20 flex h-20 items-center justify-between border-b px-6 backdrop-blur-xl lg:px-10 ${
            darkMode
              ? "border-white/10 bg-[#050b14]/80"
              : "border-slate-200 bg-white/80"
          }`}
        >
          <div>
            <p
              className={`text-xs ${
                darkMode
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              Career Intelligence
            </p>

            <h1 className="text-lg font-bold">
              Personalized Roadmap
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              ♢
            </button>

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

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-[#06101d]">
              U
            </div>
          </div>
        </header>

        {/* ======================================================
            CONTENT
        ======================================================= */}

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

          {/* Back */}
          <Link
            href="/resources"
            className={`mb-7 inline-flex items-center gap-2 text-sm ${
              darkMode
                ? "text-slate-400 hover:text-cyan-400"
                : "text-slate-500 hover:text-cyan-600"
            }`}
          >
            ← Back to Resources
          </Link>

          {/* ====================================================
              HERO
          ===================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <p className="mb-2 text-sm font-medium text-cyan-400">
              ✦ AI-Generated Career Plan
            </p>

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Your personalized learning path.
                </h2>

                <p
                  className={`mt-3 max-w-2xl leading-7 ${mutedText}`}
                >
                  Follow the roadmap generated for your profile
                  and career goals. Your progress is synchronized
                  with the Nexora backend.
                </p>
              </div>

              {currentWeek && (
                <div
                  className={`rounded-2xl border px-5 py-4 ${cardClass}`}
                >
                  <p
                    className={`text-xs ${
                      darkMode
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    CURRENT FOCUS
                  </p>

                  <p className="mt-1 max-w-[220px] font-bold">
                    {currentWeek.title}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ====================================================
              ERROR
          ===================================================== */}

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
              className={`mt-6 rounded-2xl border p-5 ${
                darkMode
                  ? "border-red-400/20 bg-red-400/5"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      darkMode
                        ? "text-red-300"
                        : "text-red-700"
                    }`}
                  >
                    Roadmap error
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode
                        ? "text-red-300/70"
                        : "text-red-600"
                    }`}
                  >
                    {error}
                  </p>
                </div>

                <button
                  onClick={loadRoadmap}
                  className="rounded-lg bg-cyan-400 px-4 py-2 text-xs font-bold text-[#06101d]"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          )}

          {/* ====================================================
              LOADING
          ===================================================== */}

          {loading ? (
            <LoadingState darkMode={darkMode} />
          ) : roadmap.length === 0 ? (
            /* ==================================================
               EMPTY
            =================================================== */

            <div
              className={`mt-8 rounded-3xl border p-10 text-center ${cardClass}`}
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-300">
                ◇
              </div>

              <h3 className="mt-5 text-xl font-bold">
                No roadmap available
              </h3>

              <p
                className={`mx-auto mt-2 max-w-md text-sm ${mutedText}`}
              >
                The Nexora backend has not returned a roadmap
                for your profile yet.
              </p>

              <Link
                href="/profile"
                className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#06101d]"
              >
                Review Profile
              </Link>
            </div>
          ) : (
            <>
              {/* ==================================================
                  PROGRESS OVERVIEW
              =================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.1,
                }}
                className={`mt-8 rounded-3xl border p-6 lg:p-8 ${cardClass}`}
              >
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      ROADMAP PROGRESS
                    </p>

                    <h3 className="mt-1 text-2xl font-bold">
                      Keep moving forward.
                    </h3>

                    <p className={`mt-2 text-sm ${mutedText}`}>
                      {completedTasks} of {totalTasks} tasks completed.
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-4xl font-black text-cyan-400">
                      {progress}%
                    </p>

                    <p
                      className={`text-xs ${
                        darkMode
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      Overall completion
                    </p>
                  </div>
                </div>

                {/* Overall progress */}
                <div
                  className={`mt-6 h-3 overflow-hidden rounded-full ${
                    darkMode
                      ? "bg-white/10"
                      : "bg-slate-100"
                  }`}
                >
                  <motion.div
                    initial={{
                      width: 0,
                    }}
                    animate={{
                      width: `${progress}%`,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="h-full rounded-full bg-cyan-400"
                  />
                </div>

                {/* Stats */}
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <MiniStat
                    value={String(roadmap.length)}
                    label="Roadmap weeks"
                    darkMode={darkMode}
                  />

                  <MiniStat
                    value={String(totalTasks)}
                    label="Total tasks"
                    darkMode={darkMode}
                  />

                  <MiniStat
                    value={String(completedTasks)}
                    label="Completed tasks"
                    darkMode={darkMode}
                  />
                </div>
              </motion.div>

              {/* ==================================================
                  CURRENT FOCUS
              =================================================== */}

              {currentWeek && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.2,
                  }}
                  className={`mt-6 rounded-3xl border p-6 lg:p-8 ${
                    darkMode
                      ? "border-cyan-400/15 bg-cyan-400/[0.035]"
                      : "border-cyan-200 bg-cyan-50"
                  }`}
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-xl font-black text-[#06101d]">
                      NX
                    </div>

                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                        CURRENT FOCUS
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        {currentWeek.title}
                      </h3>

                      {currentWeek.description && (
                        <p
                          className={`mt-1 text-sm ${mutedText}`}
                        >
                          {currentWeek.description}
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-[#06101d]">
                      Week {currentWeek.week}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* ==================================================
                  ROADMAP TIMELINE
              =================================================== */}

              <section className="mt-10">
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    YOUR JOURNEY
                  </p>

                  <h3 className="mt-1 text-2xl font-bold">
                    Learning roadmap
                  </h3>
                </div>

                <div className="relative">

                  {/* Timeline */}
                  <div
                    className={`absolute bottom-0 left-5 top-0 w-px md:left-7 ${
                      darkMode
                        ? "bg-white/10"
                        : "bg-slate-200"
                    }`}
                  />

                  <div className="space-y-6">
                    {roadmap.map(
                      (week, weekIndex) => {
                        const completedCount =
                          week.tasks.filter(
                            (task) =>
                              task.completed
                          ).length;

                        const totalWeekTasks =
                          week.tasks.length;

                        const weekProgress =
                          totalWeekTasks === 0
                            ? 0
                            : Math.round(
                                (completedCount /
                                  totalWeekTasks) *
                                  100
                              );

                        const weekCompleted =
                          totalWeekTasks > 0 &&
                          completedCount ===
                            totalWeekTasks;

                        const isCurrent =
                          week.id ===
                          currentWeek?.id;

                        const isExpanded =
                          expandedWeek ===
                          String(week.id);

                        return (
                          <motion.div
                            key={week.id}
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
                                0.15 +
                                weekIndex *
                                  0.08,
                            }}
                            className="relative pl-14 md:pl-16"
                          >
                            {/* Timeline node */}
                            <div
                              className={`absolute left-0 top-5 flex h-10 w-10 items-center justify-center rounded-full border-4 text-[10px] font-bold md:h-14 md:w-14 ${
                                weekCompleted
                                  ? "border-cyan-400 bg-cyan-400 text-[#06101d]"
                                  : isCurrent
                                    ? darkMode
                                      ? "border-cyan-400 bg-[#07101d] text-cyan-400"
                                      : "border-cyan-400 bg-white text-cyan-500"
                                    : darkMode
                                      ? "border-white/10 bg-[#07101d] text-slate-500"
                                      : "border-slate-200 bg-white text-slate-400"
                              }`}
                            >
                              {weekCompleted
                                ? "✓"
                                : week.week}
                            </div>

                            {/* Week Card */}
                            <div
                              className={`overflow-hidden rounded-3xl border ${
                                isCurrent
                                  ? darkMode
                                    ? "border-cyan-400/20 bg-cyan-400/[0.035]"
                                    : "border-cyan-200 bg-white"
                                  : darkMode
                                    ? "border-white/10 bg-white/[0.035]"
                                    : "border-slate-200 bg-white"
                              }`}
                            >
                              {/* Week header */}
                              <button
                                onClick={() =>
                                  setExpandedWeek(
                                    isExpanded
                                      ? ""
                                      : String(
                                          week.id
                                        )
                                  )
                                }
                                className="w-full p-5 text-left lg:p-6"
                              >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                                        Week{" "}
                                        {
                                          week.week
                                        }
                                      </span>

                                      {isCurrent &&
                                        !weekCompleted && (
                                          <span className="rounded-full bg-cyan-400 px-2.5 py-1 text-[9px] font-black text-[#06101d]">
                                            CURRENT
                                          </span>
                                        )}

                                      {weekCompleted && (
                                        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[9px] font-bold text-cyan-400">
                                          COMPLETED
                                        </span>
                                      )}
                                    </div>

                                    <h4 className="mt-2 text-xl font-bold">
                                      {
                                        week.title
                                      }
                                    </h4>

                                    {week.description && (
                                      <p
                                        className={`mt-1 text-sm ${mutedText}`}
                                      >
                                        {
                                          week.description
                                        }
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-5">
                                    <div className="text-right">
                                      <p className="text-lg font-bold">
                                        {
                                          weekProgress
                                        }%
                                      </p>

                                      <p
                                        className={`text-[10px] uppercase ${
                                          darkMode
                                            ? "text-slate-500"
                                            : "text-slate-400"
                                        }`}
                                      >
                                        Complete
                                      </p>
                                    </div>

                                    <span
                                      className={`text-xl transition-transform ${
                                        isExpanded
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                    >
                                      ↓
                                    </span>
                                  </div>
                                </div>

                                {/* Week progress */}
                                <div
                                  className={`mt-5 h-2 overflow-hidden rounded-full ${
                                    darkMode
                                      ? "bg-white/10"
                                      : "bg-slate-100"
                                  }`}
                                >
                                  <motion.div
                                    animate={{
                                      width: `${weekProgress}%`,
                                    }}
                                    className="h-full rounded-full bg-cyan-400"
                                  />
                                </div>
                              </button>

                              {/* Expanded */}
                              {isExpanded && (
                                <motion.div
                                  initial={{
                                    opacity: 0,
                                    height: 0,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    height: "auto",
                                  }}
                                  className={`border-t px-5 pb-6 pt-5 lg:px-6 ${
                                    darkMode
                                      ? "border-white/5"
                                      : "border-slate-100"
                                  }`}
                                >
                                  {/* Tasks */}
                                  <div>
                                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-cyan-400">
                                      TASKS
                                    </p>

                                    {week.tasks.length >
                                    0 ? (
                                      <div className="space-y-3">
                                        {week.tasks.map(
                                          (
                                            task
                                          ) => (
                                            <TaskItem
                                              key={
                                                task.id
                                              }
                                              task={
                                                task
                                              }
                                              updating={
                                                updatingTask ===
                                                task.id
                                              }
                                              onToggle={() =>
                                                toggleTask(
                                                  task.id,
                                                  task.completed
                                                )
                                              }
                                              darkMode={
                                                darkMode
                                              }
                                            />
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <EmptyState
                                        message="No tasks were returned for this week."
                                        darkMode={
                                          darkMode
                                        }
                                      />
                                    )}
                                  </div>

                                  <Link
                                    href="/resources"
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:underline"
                                  >
                                    Find learning resources →
                                  </Link>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      }
                    )}
                  </div>
                </div>
              </section>

              {/* ==================================================
                  BOTTOM ACTIONS
              =================================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                }}
                className={`mt-10 rounded-3xl border p-6 lg:p-8 ${cardClass}`}
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                  <div>
                    <p className="text-xl font-bold">
                      Keep building your career.
                    </p>

                    <p
                      className={`mt-1 text-sm ${mutedText}`}
                    >
                      Use your roadmap, resources and progress
                      together to stay on track.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/resources"
                      className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-[#06101d] transition hover:bg-cyan-300"
                    >
                      Explore Resources
                    </Link>

                    <Link
                      href="/progress"
                      className={`rounded-xl border px-5 py-3 text-center text-sm font-bold ${
                        darkMode
                          ? "border-white/10 bg-white/5 hover:bg-white/10"
                          : "border-slate-200 bg-white hover:bg-slate-100"
                      }`}
                    >
                      View Progress
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Footer */}
          <footer
            className={`py-10 text-center text-xs ${
              darkMode
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            Agent Nexora • Navigate Your Next
          </footer>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   SIDEBAR
============================================================ */

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
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-cyan-400 text-[#06101d]"
          : darkMode
            ? "text-slate-400 hover:bg-white/5 hover:text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span className="w-5 text-center">
        {icon}
      </span>

      {label}
    </Link>
  );
}

/* ============================================================
   TASK ITEM
============================================================ */

function TaskItem({
  task,
  onToggle,
  updating,
  darkMode,
}: {
  task: {
    id: string;
    title: string;
    description?: string;
    duration?: string;
    completed: boolean;
  };
  onToggle: () => void;
  updating: boolean;
  darkMode: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border p-4 ${
        task.completed
          ? darkMode
            ? "border-cyan-400/10 bg-cyan-400/[0.025]"
            : "border-cyan-100 bg-cyan-50"
          : darkMode
            ? "border-white/5 bg-white/[0.02]"
            : "border-slate-100 bg-slate-50"
      }`}
    >
      <button
        onClick={onToggle}
        disabled={updating}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition ${
          task.completed
            ? "border-cyan-400 bg-cyan-400 text-[#06101d]"
            : darkMode
              ? "border-white/20 text-transparent hover:border-cyan-400"
              : "border-slate-300 text-transparent hover:border-cyan-400"
        } ${
          updating
            ? "cursor-wait opacity-50"
            : ""
        }`}
        aria-label={
          task.completed
            ? "Mark task incomplete"
            : "Mark task complete"
        }
      >
        {updating ? "…" : "✓"}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={`font-semibold ${
            task.completed
              ? "line-through opacity-60"
              : ""
          }`}
        >
          {task.title}
        </p>

        {task.description && (
          <p
            className={`mt-1 text-xs leading-5 ${
              darkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      {task.duration && (
        <span
          className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] ${
            darkMode
              ? "bg-white/5 text-slate-500"
              : "bg-slate-100 text-slate-400"
          }`}
        >
          {task.duration}
        </span>
      )}
    </div>
  );
}

/* ============================================================
   MINI STAT
============================================================ */

function MiniStat({
  value,
  label,
  darkMode,
}: {
  value: string;
  label: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        darkMode
          ? "border-white/5 bg-white/[0.02]"
          : "border-slate-100 bg-slate-50"
      }`}
    >
      <p className="font-bold">
        {value}
      </p>

      <p
        className={`mt-1 text-xs ${
          darkMode
            ? "text-slate-500"
            : "text-slate-400"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

/* ============================================================
   LOADING
============================================================ */

function LoadingState({
  darkMode,
}: {
  darkMode: boolean;
}) {
  return (
    <div className="mt-8 space-y-6">
      <div
        className={`h-52 animate-pulse rounded-3xl ${
          darkMode
            ? "bg-white/[0.035]"
            : "bg-white"
        }`}
      />

      <div
        className={`h-36 animate-pulse rounded-3xl ${
          darkMode
            ? "bg-white/[0.035]"
            : "bg-white"
        }`}
      />

      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`h-32 animate-pulse rounded-3xl ${
            darkMode
              ? "bg-white/[0.035]"
              : "bg-white"
          }`}
        />
      ))}
    </div>
  );
}

/* ============================================================
   EMPTY
============================================================ */

function EmptyState({
  message,
  darkMode,
}: {
  message: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 text-center text-sm ${
        darkMode
          ? "border-white/5 bg-white/[0.02] text-slate-500"
          : "border-slate-100 bg-slate-50 text-slate-400"
      }`}
    >
      {message}
    </div>
  );
}