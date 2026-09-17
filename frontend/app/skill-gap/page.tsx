"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, type SkillGap, type ProfileData } from "@/lib/api";

type SkillStatus = "have" | "partial" | "missing";

/* =====================================================
   ICONS
   ===================================================== */

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="8"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 20C5.8 16.7 8.3 14.5 12 14.5C15.7 14.5 18.2 16.7 19 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =====================================================
   SIDEBAR
   ===================================================== */

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
      <span className="w-5 text-center">{icon}</span>
      {label}
    </Link>
  );
}

/* =====================================================
   STAT CARD
   ===================================================== */

function StatCard({
  number,
  label,
  icon,
  type,
  darkMode,
}: {
  number: number;
  label: string;
  icon: string;
  type: "success" | "warning" | "danger";
  darkMode: boolean;
}) {
  const iconClass =
    type === "success"
      ? "bg-cyan-400/10 text-cyan-400"
      : type === "warning"
        ? "bg-amber-400/10 text-amber-400"
        : "bg-red-400/10 text-red-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 ${
        darkMode
          ? "border-white/10 bg-white/[0.035]"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold ${iconClass}`}
        >
          {icon}
        </div>

        <p className="text-3xl font-black">{number}</p>
      </div>

      <p
        className={`mt-4 text-sm ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {label}
      </p>
    </motion.div>
  );
}

/* =====================================================
   STATUS BADGE
   ===================================================== */

function StatusBadge({
  status,
}: {
  status: SkillStatus;
}) {
  if (status === "have") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-400">
        ✓ Have
      </span>
    );
  }

  if (status === "partial") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-400">
        ! Partial
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-400">
      × Missing
    </span>
  );
}

/* =====================================================
   PAGE
   ===================================================== */

export default function SkillGapPage() {
  const [darkMode, setDarkMode] = useState(true);

  const [skills, setSkills] = useState<SkillGap[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD REAL BACKEND DATA
     ===================================================== */

  useEffect(() => {
    async function loadSkillGap() {
      try {
        setLoading(true);
        setError("");

        const [skillGapResponse, profileResponse] =
          await Promise.all([
            api.getSkillGap(),
            api.getProfile(),
          ]);

        setSkills(skillGapResponse.skills || []);
        setProfile(profileResponse);

        const savedTheme =
          localStorage.getItem("nexora-theme");

        setDarkMode(savedTheme !== "light");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load skill gap analysis."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSkillGap();
  }, []);

  /* =====================================================
     THEME
     ===================================================== */

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "nexora-theme",
      newMode ? "dark" : "light"
    );
  };

  /* =====================================================
     DYNAMIC COUNTS
     ===================================================== */

  const haveSkills = useMemo(
    () =>
      skills.filter(
        (skill) => skill.status === "have"
      ).length,
    [skills]
  );

  const partialSkills = useMemo(
    () =>
      skills.filter(
        (skill) => skill.status === "partial"
      ).length,
    [skills]
  );

  const missingSkills = useMemo(
    () =>
      skills.filter(
        (skill) => skill.status === "missing"
      ).length,
    [skills]
  );

  /* =====================================================
     DYNAMIC READINESS
     ===================================================== */

  const readiness = useMemo(() => {
    if (skills.length === 0) return null;

    const scores = skills
      .map((skill) => skill.score)
      .filter(
        (score): score is number =>
          typeof score === "number" &&
          Number.isFinite(score)
      );

    if (scores.length === 0) return null;

    const average =
      scores.reduce((sum, score) => sum + score, 0) /
      scores.length;

    return Math.round(average);
  }, [skills]);

  /* =====================================================
     PRIORITY SKILLS
     ===================================================== */

  const prioritySkills = useMemo(() => {
    const missingOrPartial = skills.filter(
      (skill) =>
        skill.status === "missing" ||
        skill.status === "partial"
    );

    return [...missingOrPartial].sort(
      (a, b) => (a.score ?? 0) - (b.score ?? 0)
    );
  }, [skills]);

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050b14] text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-400">
            Loading your skill gap analysis...
          </p>
        </div>
      </main>
    );
  }

  /* =====================================================
     MAIN
     ===================================================== */

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-[#050b14] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Background Glow */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl ${
            darkMode
              ? "bg-cyan-500/10"
              : "bg-cyan-400/10"
          }`}
        />
      </div>

      {/* =====================================================
          SIDEBAR
          ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen w-64 border-r lg:block ${
          darkMode
            ? "border-white/10 bg-[#07101d]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Logo */}

        <Link
          href="/dashboard"
          className="flex h-20 items-center gap-3 border-b border-inherit px-6"
        >
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
              Navigate Your Next.
            </p>
          </div>
        </Link>

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
            active
            darkMode={darkMode}
          />

          <SidebarItem
            href="/roadmap"
            icon="→"
            label="Roadmap"
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
            icon="✧"
            label="Ask Nexora"
            darkMode={darkMode}
          />

          <SidebarItem
            href="/voice"
            icon="🎙"
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

          <Link
            href="/login"
            className={`mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
              darkMode
                ? "text-slate-500 hover:bg-red-500/10 hover:text-red-300"
                : "text-slate-500 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <span>↪</span>
            Sign out
          </Link>

        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
          ===================================================== */}

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
              Skill Gap Analysis
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              ♢
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                darkMode
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-[#06101d]"
            >
              {profile?.name?.charAt(0)?.toUpperCase() ||
                "U"}
            </Link>

          </div>
        </header>

        {/* =====================================================
            PAGE CONTENT
            ===================================================== */}

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

          {/* Back */}

          <Link
            href="/results"
            className={`mb-7 inline-flex items-center gap-2 text-sm ${
              darkMode
                ? "text-slate-400 hover:text-cyan-400"
                : "text-slate-500 hover:text-cyan-600"
            }`}
          >
            ← Back to Results
          </Link>

          {/* Error */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Hero */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8"
          >

            <p className="mb-2 text-sm font-medium text-cyan-400">
              ✦ AI Skill Analysis
            </p>

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

              <div>

                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Close the gap.
                </h2>

                <p
                  className={`mt-3 max-w-2xl leading-7 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Nexora compared your current skills with
                  the requirements associated with your career
                  profile.
                </p>

              </div>

              {/* Career */}

              <div
                className={`rounded-2xl border px-5 py-4 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.035]"
                    : "border-slate-200 bg-white"
                }`}
              >

                <p
                  className={`text-xs ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  TARGET CAREER
                </p>

                <p className="mt-1 font-bold">
                  {profile?.career_goal ||
                    "Career goal not specified"}
                </p>

              </div>

            </div>

          </motion.div>

          {/* =====================================================
              STATISTICS
              ===================================================== */}

          <div className="grid gap-4 sm:grid-cols-3">

            <StatCard
              number={haveSkills}
              label="Skills you have"
              icon="✓"
              type="success"
              darkMode={darkMode}
            />

            <StatCard
              number={partialSkills}
              label="Skills to strengthen"
              icon="!"
              type="warning"
              darkMode={darkMode}
            />

            <StatCard
              number={missingSkills}
              label="Skills to learn"
              icon="×"
              type="danger"
              darkMode={darkMode}
            />

          </div>

          {/* =====================================================
              OVERALL READINESS
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
            transition={{ delay: 0.15 }}
            className={`mt-6 rounded-3xl border p-6 lg:p-8 ${
              darkMode
                ? "border-white/10 bg-white/[0.035]"
                : "border-slate-200 bg-white"
            }`}
          >

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>

                <p className="text-xs font-medium text-cyan-400">
                  OVERALL READINESS
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  Your current skill profile
                </h3>

                <p
                  className={`mt-2 max-w-2xl text-sm leading-6 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  This readiness value is calculated from
                  the skill scores returned by the Nexora
                  backend.
                </p>

              </div>

              <div className="text-left md:text-right">

                <p className="text-4xl font-black text-cyan-400">
                  {readiness !== null
                    ? `${readiness}%`
                    : "—"}
                </p>

                <p
                  className={`text-xs ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  Current readiness
                </p>

              </div>

            </div>

            <div
              className={`mt-6 h-3 overflow-hidden rounded-full ${
                darkMode
                  ? "bg-white/10"
                  : "bg-slate-100"
              }`}
            >

              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${readiness ?? 0}%`,
                }}
                transition={{
                  duration: 1,
                  delay: 0.4,
                }}
                className="h-full rounded-full bg-cyan-400"
              />

            </div>

          </motion.div>

          {/* =====================================================
              SKILL COMPARISON
              ===================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{ delay: 0.25 }}
            className={`mt-6 overflow-hidden rounded-3xl border ${
              darkMode
                ? "border-white/10 bg-white/[0.035]"
                : "border-slate-200 bg-white"
            }`}
          >

            <div className="border-b border-inherit p-6">

              <p className="text-xs font-medium text-cyan-400">
                SKILL COMPARISON
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                Your skills vs career requirements
              </h3>

              <p
                className={`mt-2 text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Skill information below comes directly from
                the Nexora skill-gap service.
              </p>

            </div>

            {/* No skills */}

            {skills.length === 0 ? (
              <div className="p-10 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl text-cyan-400">
                  △
                </div>

                <h3 className="mt-4 text-lg font-bold">
                  No skill-gap data available
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                  The backend did not return any skill-gap
                  information for your current profile.
                </p>

                <Link
                  href="/profile"
                  className="mt-5 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950"
                >
                  Update Profile
                </Link>

              </div>
            ) : (
              <>
                {/* Desktop */}

                <div className="hidden overflow-x-auto md:block">

                  <table className="w-full text-left">

                    <thead
                      className={
                        darkMode
                          ? "bg-white/[0.025]"
                          : "bg-slate-50"
                      }
                    >

                      <tr>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Skill
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Category
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Your Level
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Requirement
                        </th>

                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Status
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {skills.map((skill) => (
                        <tr
                          key={skill.name}
                          className={`border-t ${
                            darkMode
                              ? "border-white/5"
                              : "border-slate-100"
                          }`}
                        >

                          <td className="px-6 py-5">
                            <p className="font-semibold">
                              {skill.name}
                            </p>
                          </td>

                          <td
                            className={`px-6 py-5 text-sm ${
                              darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            {skill.category || "—"}
                          </td>

                          <td className="px-6 py-5">

                            <div className="flex items-center gap-3">

                              <div
                                className={`h-2 w-24 overflow-hidden rounded-full ${
                                  darkMode
                                    ? "bg-white/10"
                                    : "bg-slate-100"
                                }`}
                              >

                                <div
                                  className={`h-full rounded-full ${
                                    skill.status === "have"
                                      ? "bg-cyan-400"
                                      : skill.status ===
                                          "partial"
                                        ? "bg-amber-400"
                                        : "bg-red-400"
                                  }`}
                                  style={{
                                    width: `${Math.max(
                                      0,
                                      Math.min(
                                        100,
                                        skill.score ?? 0
                                      )
                                    )}%`,
                                  }}
                                />

                              </div>

                              <span className="text-xs font-semibold">
                                {skill.level || "—"}
                              </span>

                            </div>

                          </td>

                          <td className="px-6 py-5">

                            <span
                              className={`rounded-lg px-3 py-1.5 text-xs ${
                                skill.requirement ===
                                "Required"
                                  ? darkMode
                                    ? "bg-cyan-400/10 text-cyan-300"
                                    : "bg-cyan-50 text-cyan-700"
                                  : darkMode
                                    ? "bg-white/5 text-slate-400"
                                    : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {skill.requirement || "—"}
                            </span>

                          </td>

                          <td className="px-6 py-5">

                            <StatusBadge
                              status={
                                skill.status as SkillStatus
                              }
                            />

                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

                {/* Mobile */}

                <div className="space-y-3 p-4 md:hidden">

                  {skills.map((skill) => (
                    <div
                      key={skill.name}
                      className={`rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/5 bg-white/[0.02]"
                          : "border-slate-100 bg-slate-50"
                      }`}
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="font-semibold">
                            {skill.name}
                          </p>

                          <p
                            className={`mt-1 text-xs ${
                              darkMode
                                ? "text-slate-500"
                                : "text-slate-400"
                            }`}
                          >
                            {skill.category || "—"}
                          </p>

                        </div>

                        <StatusBadge
                          status={
                            skill.status as SkillStatus
                          }
                        />

                      </div>

                      <div className="mt-4">

                        <div className="mb-2 flex justify-between text-xs">

                          <span
                            className={
                              darkMode
                                ? "text-slate-500"
                                : "text-slate-400"
                            }
                          >
                            Current level
                          </span>

                          <span className="font-semibold">
                            {skill.level || "—"}
                          </span>

                        </div>

                        <div
                          className={`h-2 rounded-full ${
                            darkMode
                              ? "bg-white/10"
                              : "bg-slate-200"
                          }`}
                        >

                          <div
                            className={`h-full rounded-full ${
                              skill.status === "have"
                                ? "bg-cyan-400"
                                : skill.status ===
                                    "partial"
                                  ? "bg-amber-400"
                                  : "bg-red-400"
                            }`}
                            style={{
                              width: `${Math.max(
                                0,
                                Math.min(
                                  100,
                                  skill.score ?? 0
                                )
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                      <div className="mt-4 flex items-center justify-between">

                        <span className="text-xs text-slate-500">
                          Requirement
                        </span>

                        <span className="text-xs font-semibold">
                          {skill.requirement || "—"}
                        </span>

                      </div>

                    </div>
                  ))}

                </div>
              </>
            )}

          </motion.section>

          {/* =====================================================
              PRIORITIES
              ===================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{ delay: 0.35 }}
            className="mt-8"
          >

            <div className="mb-5">

              <p className="text-xs font-medium text-cyan-400">
                AI PRIORITIES
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                Skills to prioritize
              </h3>

              <p
                className={`mt-2 text-sm ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                These are the skills returned by the backend
                that currently need the most attention.
              </p>

            </div>

            {prioritySkills.length === 0 ? (
              <div
                className={`rounded-2xl border p-6 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.035]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-sm text-slate-400">
                  No missing or partially developed skills
                  were returned by the backend.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">

                {prioritySkills.map((skill, index) => {

                  const priority =
                    skill.status === "missing"
                      ? "High Priority"
                      : "Improve";

                  const priorityColor =
                    skill.status === "missing"
                      ? "text-red-400"
                      : "text-amber-400";

                  return (
                    <motion.div
                      key={skill.name}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: 0.4 + index * 0.08,
                      }}
                      className={`rounded-2xl border p-5 transition hover:-translate-y-1 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035]"
                          : "border-slate-200 bg-white"
                      }`}
                    >

                      <div className="flex items-start gap-4">

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                            skill.status === "missing"
                              ? "bg-red-400/10 text-red-400"
                              : "bg-amber-400/10 text-amber-400"
                          }`}
                        >
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </div>

                        <div className="flex-1">

                          <div className="flex flex-wrap items-center justify-between gap-2">

                            <h4 className="font-bold">
                              {skill.name}
                            </h4>

                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${priorityColor}`}
                            >
                              {priority}
                            </span>

                          </div>

                          <p
                            className={`mt-2 text-sm leading-6 ${
                              darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            {skill.requirement
                              ? `${skill.requirement} skill requirement.`
                              : "This skill requires additional development based on your current profile."}
                          </p>

                          <div className="mt-3 flex items-center gap-3">

                            <div
                              className={`h-2 flex-1 rounded-full ${
                                darkMode
                                  ? "bg-white/10"
                                  : "bg-slate-100"
                              }`}
                            >

                              <div
                                className={`h-full rounded-full ${
                                  skill.status ===
                                  "missing"
                                    ? "bg-red-400"
                                    : "bg-amber-400"
                                }`}
                                style={{
                                  width: `${Math.max(
                                    0,
                                    Math.min(
                                      100,
                                      skill.score ?? 0
                                    )
                                  )}%`,
                                }}
                              />

                            </div>

                            <span className="text-xs font-semibold">
                              {skill.score ?? "—"}%
                            </span>

                          </div>

                        </div>

                      </div>

                    </motion.div>
                  );
                })}

              </div>
            )}

          </motion.section>

          {/* =====================================================
              NEXORA INSIGHT
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
            transition={{ delay: 0.5 }}
            className={`mt-8 rounded-3xl border p-6 lg:p-8 ${
              darkMode
                ? "border-cyan-400/15 bg-cyan-400/[0.035]"
                : "border-cyan-200 bg-cyan-50"
            }`}
          >

            <div className="flex flex-col gap-5 md:flex-row md:items-center">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-xl font-black text-[#06101d]">
                NX
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Nexora Insight
                </p>

                <p
                  className={`mt-2 text-sm leading-7 ${
                    darkMode
                      ? "text-slate-300"
                      : "text-slate-700"
                  }`}
                >
                  {prioritySkills.length > 0
                    ? `Focus first on ${prioritySkills
                        .slice(0, 2)
                        .map((skill) => skill.name)
                        .join(" and ")} based on the current skill-gap data.`
                    : "Your current backend skill-gap response does not identify any missing or partial skills."}
                </p>

              </div>

            </div>

          </motion.div>

          {/* =====================================================
              ACTIONS
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
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >

            <Link
              href="/resources"
              className="flex-1 rounded-xl bg-cyan-400 px-6 py-4 text-center text-sm font-bold text-[#06101d] transition hover:bg-cyan-300"
            >
              Start Learning →
            </Link>

            <Link
              href="/roadmap"
              className={`flex-1 rounded-xl border px-6 py-4 text-center text-sm font-bold transition ${
                darkMode
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              View My Roadmap →
            </Link>

            <Link
              href="/opportunities"
              className={`flex-1 rounded-xl border px-6 py-4 text-center text-sm font-bold transition ${
                darkMode
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              Explore Opportunities →
            </Link>

          </motion.div>

          {/* Footer */}

          <footer
            className={`py-10 text-center text-xs ${
              darkMode
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            Agent Nexora • Navigate Your Next.
          </footer>

        </section>
      </div>
    </main>
  );
}