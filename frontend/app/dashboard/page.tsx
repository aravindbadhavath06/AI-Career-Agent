"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  api,
  ProfileData,
  SkillGap,
  RoadmapWeek,
} from "@/lib/api";

type SidebarItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
};

function SidebarItem({
  href,
  label,
  icon,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
        active
          ? "bg-cyan-400/10 text-cyan-300"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
          active
            ? "bg-cyan-400 text-slate-950"
            : "bg-white/[0.05] text-slate-400 group-hover:bg-white/10 group-hover:text-white"
        }`}
      >
        {icon}
      </span>

      <span className="truncate">{label}</span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
      )}
    </Link>
  );
}

/* =========================================================
   ICONS
========================================================= */

function ArrowIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M13 6L19 12L13 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon({ size = 20 }: { size?: number }) {
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

function TargetIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="12"
        r="1.5"
        fill="currentColor"
      />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3 12H21"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 9L12 4L21 9L12 14L3 9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M6 11.2V16C8.8 18.4 15.2 18.4 18 16V11.2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8 7H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8 11H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8 15H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RoadmapIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 5H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M5 12H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M5 19H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle
        cx="19"
        cy="12"
        r="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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

function ChartIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 19V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 19V5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19 19V8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 3H14L19 8V21H6V3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M14 3V8H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 13H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9 17H14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicrophoneIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="2.5"
        width="8"
        height="12"
        rx="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M5.5 11.5V12C5.5 15.59 8.41 18.5 12 18.5C15.59 18.5 18.5 15.59 18.5 12V11.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M12 18.5V21.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M9 21.5H15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(true);

  const [profile, setProfile] =
    useState<ProfileData | null>(null);

  const [skills, setSkills] =
    useState<SkillGap[]>([]);

  const [roadmap, setRoadmap] =
    useState<RoadmapWeek[]>([]);

  const [progress, setProgress] =
    useState<number | null>(null);

  const [privateCount, setPrivateCount] =
    useState<number | null>(null);

  const [governmentCount, setGovernmentCount] =
    useState<number | null>(null);

  const [internshipCount, setInternshipCount] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /* =========================================================
     THEME
  ========================================================= */

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("nexora-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    localStorage.setItem(
      "nexora-theme",
      nextMode ? "dark" : "light"
    );
  };

  /* =========================================================
     LOAD REAL BACKEND DATA
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const [
          profileResult,
          skillGapResult,
          roadmapResult,
          progressResult,
          privateJobsResult,
          governmentJobsResult,
          internshipResult,
        ] = await Promise.all([
          api.getProfile(),
          api.getSkillGap(),
          api.getRoadmap(),
          api.getProgress(),
          api.getPrivateJobs(),
          api.getGovernmentJobs(),
          api.getInternships(),
        ]);

        if (!mounted) return;

        setProfile(profileResult);

        setSkills(
          skillGapResult?.skills || []
        );

        setRoadmap(
          roadmapResult?.roadmap || []
        );

        setProgress(
          typeof progressResult?.overall_percentage ===
            "number"
            ? progressResult.overall_percentage
            : null
        );

        setPrivateCount(
          Array.isArray(privateJobsResult)
            ? privateJobsResult.length
            : 0
        );

        setGovernmentCount(
          Array.isArray(governmentJobsResult)
            ? governmentJobsResult.length
            : 0
        );

        setInternshipCount(
          Array.isArray(internshipResult)
            ? internshipResult.length
            : 0
        );
      } catch (err) {
        if (!mounted) return;

        console.error(
          "Dashboard API error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard data."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     UI HELPERS
  ========================================================= */

  const cardClass = darkMode
    ? "border-white/10 bg-white/[0.03]"
    : "border-slate-200 bg-white";

  const mainText = darkMode
    ? "text-white"
    : "text-slate-900";

  const mutedText = darkMode
    ? "text-slate-400"
    : "text-slate-500";

  const firstName =
    profile?.name?.split(" ")[0] || "there";

  const targetCareer =
    profile?.career_goal || "Not set";

  const experience =
    profile?.experience || "Not set";

  const profileSkills =
    profile?.skills || [];

  /*
   * Only display actual missing/partial skills
   * returned by the backend.
   */
  const focusSkills = skills
    .filter(
      (skill) =>
        skill.status === "missing" ||
        skill.status === "partial"
    )
    .slice(0, 4);

  /*
   * Sort actual skill-gap data by score.
   * No fake percentages are created.
   */
  const dashboardSkills = [...skills]
    .filter(
      (skill) =>
        typeof skill.score === "number"
    )
    .sort(
      (a, b) =>
        (a.score ?? 0) -
        (b.score ?? 0)
    )
    .slice(0, 4);

  const getRoadmapStatus = (
    week: RoadmapWeek,
    index: number
  ) => {
    const totalTasks =
      week.tasks?.length || 0;

    const completedTasks =
      week.tasks?.filter(
        (task) => task.completed
      ).length || 0;

    if (
      totalTasks > 0 &&
      completedTasks === totalTasks
    ) {
      return "Complete";
    }

    if (completedTasks > 0) {
      return "In Progress";
    }

    if (index === 0) {
      return "Current";
    }

    return "Upcoming";
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#050b14] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen w-64 border-r lg:block ${
          darkMode
            ? "border-white/10 bg-[#07101d]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex h-full flex-col p-5">

          {/* =================================================
              SAME NEXORA LOGO + TAGLINE
          ================================================= */}

          <Link
            href="/dashboard"
            className="mb-8 flex items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-xl font-black text-slate-950">
              NX
            </div>

            <div>
              <div
                className={`text-lg font-bold ${mainText}`}
              >
                Agent Nexora
              </div>

              <div
                className={`text-xs ${mutedText}`}
              >
                Navigate Your Next.
              </div>
            </div>
          </Link>

          {/* WORKSPACE */}

          <div
            className={`mb-4 px-3 text-[11px] font-medium uppercase tracking-[0.18em] ${mutedText}`}
          >
            Workspace
          </div>

          {/* NAVIGATION */}

          <nav className="space-y-1">

            <SidebarItem
              href="/dashboard"
              label="Dashboard"
              active
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M4 10L12 4L20 10V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V10Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 21V14H15V21"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              }
            />

            <SidebarItem
              href="/opportunities"
              label="Opportunities"
              icon={<BriefcaseIcon />}
            />

            <SidebarItem
              href="/profile"
              label="Profile"
              icon={<UserIcon />}
            />

            <SidebarItem
              href="/skill-gap"
              label="Skill Gap"
              icon={<TargetIcon />}
            />

            <SidebarItem
              href="/roadmap"
              label="Roadmap"
              icon={<RoadmapIcon />}
            />

            <SidebarItem
              href="/progress"
              label="Progress"
              icon={<ChartIcon />}
            />

            <SidebarItem
              href="/resources"
              label="Resources"
              icon={<BookIcon />}
            />

            <SidebarItem
              href="/resume"
              label="Resume Analyzer"
              icon={<FileIcon />}
            />

            <SidebarItem
              href="/ask-nexora"
              label="Ask Nexora"
              icon={<SparkleIcon size={19} />}
            />

            <SidebarItem
              href="/voice"
              label="Voice Assistant"
              icon={<MicrophoneIcon />}
            />

          </nav>

          {/* BOTTOM */}

          <div className="mt-auto border-t border-white/10 pt-4">

            <Link
              href="/settings"
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                ⚙
              </span>

              Settings
            </Link>

            <Link
              href="/login"
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                ↪
              </span>

              Sign out
            </Link>

          </div>

        </div>
      </aside>

      {/* =====================================================
          MOBILE TOP BAR
      ===================================================== */}

      <div
        className={`sticky top-0 z-40 flex h-16 items-center justify-between border-b px-4 lg:hidden ${
          darkMode
            ? "border-white/10 bg-[#07101d]"
            : "border-slate-200 bg-white"
        }`}
      >

        <Link
          href="/dashboard"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-sm font-black text-slate-950">
            NX
          </div>

          <span
            className={`font-semibold ${mainText}`}
          >
            Agent Nexora
          </span>
        </Link>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={toggleTheme}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
              darkMode
                ? "border-white/10 bg-white/5"
                : "border-slate-200 bg-white"
            }`}
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950"
          >
            {profile?.name?.charAt(0)?.toUpperCase() ||
              "U"}
          </Link>

        </div>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="lg:pl-64">

        {/* TOP HEADER */}

        <header
          className={`hidden h-16 items-center justify-between border-b px-8 lg:flex ${
            darkMode
              ? "border-white/10 bg-[#050b14]"
              : "border-slate-200 bg-white"
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
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                darkMode
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              ♢
            </button>

            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950 transition hover:scale-105"
            >
              {profile?.name?.charAt(0)?.toUpperCase() ||
                "U"}
            </Link>

          </div>
        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="mx-auto max-w-7xl p-5 md:p-8">

          {/* ERROR */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
              <div className="font-semibold">
                Unable to load some dashboard data.
              </div>

              <div className="mt-1 text-xs text-red-300/70">
                {error}
              </div>
            </div>
          )}

          {/* =================================================
              HERO
          ================================================= */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${cardClass}`}
          >

            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300">

                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />

                AI Career Intelligence

              </div>

              <h2
                className={`max-w-3xl text-3xl font-bold leading-tight md:text-5xl ${mainText}`}
              >
                Turn your skills into your next career move.
              </h2>

              <p
                className={`mt-4 max-w-2xl text-sm leading-6 md:text-base ${mutedText}`}
              >
                Nexora analyzes your profile, matches
                opportunities, identifies skill gaps and builds
                a personalized roadmap for your career.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                <Link
                  href="/opportunities"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Explore Opportunities
                  <ArrowIcon />
                </Link>

                <Link
                  href="/analysis"
                  className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Run AI Analysis
                </Link>

              </div>

            </div>

          </motion.section>

          {/* =================================================
              OPPORTUNITY CARDS
          ================================================= */}

          <section className="mt-6">

            <div className="mb-4 flex items-end justify-between">

              <div>
                <h2
                  className={`text-xl font-semibold ${mainText}`}
                >
                  What opportunity are you looking for?
                </h2>

                <p
                  className={`mt-1 text-xs ${mutedText}`}
                >
                  Choose a path and let Nexora personalize your search.
                </p>
              </div>

              <Link
                href="/opportunities"
                className="hidden text-xs text-cyan-300 hover:text-cyan-200 sm:block"
              >
                View all →
              </Link>

            </div>

            <div className="grid gap-4 md:grid-cols-3">

              {/* PRIVATE JOBS */}

              <motion.div
                whileHover={{
                  y: -4,
                }}
                className={`group rounded-2xl border p-5 transition ${cardClass}`}
              >

                <div className="mb-5 flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <BriefcaseIcon />
                  </div>

                  <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] text-emerald-300">
                    {loading
                      ? "Loading..."
                      : privateCount !== null
                        ? `${privateCount} available`
                        : "Unavailable"}
                  </span>

                </div>

                <h3
                  className={`text-lg font-semibold ${mainText}`}
                >
                  Private Jobs
                </h3>

                <p
                  className={`mt-2 text-xs leading-5 ${mutedText}`}
                >
                  Discover company roles matched to your
                  skills and career goals.
                </p>

                <Link
                  href="/opportunities/private"
                  className="mt-5 flex items-center justify-between rounded-xl bg-cyan-400/10 px-4 py-3 text-xs font-medium text-cyan-300 transition group-hover:bg-cyan-400/20"
                >
                  Explore private jobs
                  <ArrowIcon />
                </Link>

              </motion.div>

              {/* GOVERNMENT JOBS */}

              <motion.div
                whileHover={{
                  y: -4,
                }}
                className={`group rounded-2xl border p-5 transition ${cardClass}`}
              >

                <div className="mb-5 flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
                    <GraduationIcon />
                  </div>

                  <span className="rounded-full bg-violet-400/10 px-2.5 py-1 text-[10px] text-violet-300">
                    {loading
                      ? "Loading..."
                      : governmentCount !== null
                        ? `${governmentCount} available`
                        : "Unavailable"}
                  </span>

                </div>

                <h3
                  className={`text-lg font-semibold ${mainText}`}
                >
                  Government Jobs
                </h3>

                <p
                  className={`mt-2 text-xs leading-5 ${mutedText}`}
                >
                  Explore recruitment opportunities and
                  eligibility information.
                </p>

                <Link
                  href="/opportunities/government"
                  className="mt-5 flex items-center justify-between rounded-xl bg-violet-400/10 px-4 py-3 text-xs font-medium text-violet-300 transition group-hover:bg-violet-400/20"
                >
                  Explore government jobs
                  <ArrowIcon />
                </Link>

              </motion.div>

              {/* INTERNSHIPS */}

              <motion.div
                whileHover={{
                  y: -4,
                }}
                className={`group rounded-2xl border p-5 transition ${cardClass}`}
              >

                <div className="mb-5 flex items-center justify-between">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                    <BookIcon />
                  </div>

                  <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] text-amber-300">
                    {loading
                      ? "Loading..."
                      : internshipCount !== null
                        ? `${internshipCount} available`
                        : "Unavailable"}
                  </span>

                </div>

                <h3
                  className={`text-lg font-semibold ${mainText}`}
                >
                  Internships
                </h3>

                <p
                  className={`mt-2 text-xs leading-5 ${mutedText}`}
                >
                  Find internships that align with your
                  current skills and experience.
                </p>

                <Link
                  href="/opportunities/internships"
                  className="mt-5 flex items-center justify-between rounded-xl bg-amber-400/10 px-4 py-3 text-xs font-medium text-amber-300 transition group-hover:bg-amber-400/20"
                >
                  Explore internships
                  <ArrowIcon />
                </Link>

              </motion.div>

            </div>
          </section>

          {/* =================================================
              OVERVIEW
          ================================================= */}

          <section className="mt-6 grid gap-6 lg:grid-cols-3">

            {/* PROFILE */}

            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`lg:col-span-2 rounded-2xl border p-6 ${cardClass}`}
            >

              <div className="flex items-center justify-between">

                <div>
                  <h2
                    className={`text-lg font-semibold ${mainText}`}
                  >
                    Your Career Snapshot
                  </h2>

                  <p
                    className={`mt-1 text-xs ${mutedText}`}
                  >
                    Based on your current profile.
                  </p>
                </div>

                <Link
                  href="/profile"
                  className="text-xs text-cyan-300 hover:text-cyan-200"
                >
                  Edit profile →
                </Link>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {/* TARGET CAREER */}

                <div
                  className={`rounded-xl border p-4 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div
                    className={`text-xs ${mutedText}`}
                  >
                    Target Career
                  </div>

                  <div
                    className={`mt-2 text-lg font-semibold ${mainText}`}
                  >
                    {loading
                      ? "Loading..."
                      : targetCareer}
                  </div>

                  <div className="mt-2 text-xs text-cyan-300">
                    From your profile
                  </div>
                </div>

                {/* EXPERIENCE */}

                <div
                  className={`rounded-xl border p-4 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div
                    className={`text-xs ${mutedText}`}
                  >
                    Experience
                  </div>

                  <div
                    className={`mt-2 text-lg font-semibold ${mainText}`}
                  >
                    {loading
                      ? "Loading..."
                      : experience}
                  </div>

                  <div className="mt-2 text-xs text-emerald-300">
                    Profile information
                  </div>
                </div>

              </div>

              {/* SKILLS */}

              <div className="mt-5">

                <div
                  className={`mb-3 text-xs ${mutedText}`}
                >
                  Key Skills
                </div>

                <div className="flex flex-wrap gap-2">

                  {loading ? (
                    <span
                      className={`text-xs ${mutedText}`}
                    >
                      Loading skills...
                    </span>
                  ) : profileSkills.length > 0 ? (
                    profileSkills
                      .slice(0, 8)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300"
                        >
                          {skill}
                        </span>
                      ))
                  ) : (
                    <span
                      className={`text-xs ${mutedText}`}
                    >
                      No skills added yet.
                    </span>
                  )}

                </div>

              </div>

            </motion.div>

            {/* PROGRESS */}

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

              <div
                className={`text-xs ${mutedText}`}
              >
                Career Progress
              </div>

              <div className="mt-5 flex items-center justify-center">

                <div className="relative flex h-32 w-32 items-center justify-center">

                  <svg
                    className="-rotate-90"
                    width="128"
                    height="128"
                    viewBox="0 0 120 120"
                  >

                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="9"
                      className={
                        darkMode
                          ? "text-white/10"
                          : "text-slate-200"
                      }
                    />

                    <motion.circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray="301.6"
                      animate={{
                        strokeDashoffset:
                          progress !== null
                            ? 301.6 -
                              (301.6 *
                                progress) /
                                100
                            : 301.6,
                      }}
                      transition={{
                        duration: 0.8,
                      }}
                      className="text-cyan-400"
                    />

                  </svg>

                  <div className="absolute text-2xl font-bold text-cyan-300">
                    {progress !== null
                      ? `${Math.round(progress)}%`
                      : "--"}
                  </div>

                </div>

              </div>

              <h3
                className={`mt-5 text-base font-semibold ${mainText}`}
              >
                {progress !== null
                  ? "Roadmap progress"
                  : "Progress unavailable"}
              </h3>

              <p
                className={`mt-2 text-xs leading-5 ${mutedText}`}
              >
                {progress !== null
                  ? "Your progress is calculated from your roadmap tasks."
                  : "Complete your profile and roadmap tasks to track progress."}
              </p>

              <Link
                href="/progress"
                className="mt-5 flex items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-xs text-cyan-300 transition hover:bg-cyan-400/10"
              >
                View progress
                <ArrowIcon />
              </Link>

            </motion.div>

          </section>

          {/* =================================================
              SKILL GAP + ROADMAP
          ================================================= */}

          <section className="mt-6 grid gap-6 lg:grid-cols-2">

            {/* SKILL GAP */}

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

              <div className="flex items-center justify-between">

                <div>
                  <h2
                    className={`text-lg font-semibold ${mainText}`}
                  >
                    Skill Gap
                  </h2>

                  <p
                    className={`mt-1 text-xs ${mutedText}`}
                  >
                    Skills to strengthen for your target career.
                  </p>
                </div>

                <Link
                  href="/skill-gap"
                  className="text-xs text-cyan-300"
                >
                  View all →
                </Link>

              </div>

              <div className="mt-6 space-y-4">

                {loading ? (
                  <div
                    className={`text-xs ${mutedText}`}
                  >
                    Loading skill gap...
                  </div>
                ) : dashboardSkills.length > 0 ? (
                  dashboardSkills.map(
                    (item) => (
                      <div key={item.name}>

                        <div className="mb-2 flex items-center justify-between">

                          <span
                            className={`text-xs ${mainText}`}
                          >
                            {item.name}
                          </span>

                          <span className="text-xs text-cyan-300">
                            {item.score}%
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
                            className="h-full rounded-full bg-cyan-400"
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${Math.min(
                                Math.max(
                                  item.score ?? 0,
                                  0
                                ),
                                100
                              )}%`,
                            }}
                            transition={{
                              duration: 0.7,
                            }}
                          />

                        </div>

                      </div>
                    )
                  )
                ) : (
                  <div
                    className={`rounded-xl border p-4 text-xs ${mutedText} ${
                      darkMode
                        ? "border-white/10 bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    No skill-gap data is available yet.
                  </div>
                )}

              </div>

            </motion.div>

            {/* ROADMAP */}

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

              <div className="flex items-center justify-between">

                <div>
                  <h2
                    className={`text-lg font-semibold ${mainText}`}
                  >
                    Your Roadmap
                  </h2>

                  <p
                    className={`mt-1 text-xs ${mutedText}`}
                  >
                    Your personalized learning roadmap.
                  </p>
                </div>

                <Link
                  href="/roadmap"
                  className="text-xs text-cyan-300"
                >
                  Open →
                </Link>

              </div>

              <div className="mt-6 space-y-3">

                {loading ? (
                  <div
                    className={`text-xs ${mutedText}`}
                  >
                    Loading roadmap...
                  </div>
                ) : roadmap.length > 0 ? (
                  roadmap
                    .slice(0, 4)
                    .map((item, index) => {

                      const status =
                        getRoadmapStatus(
                          item,
                          index
                        );

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 rounded-xl border p-3 ${
                            darkMode
                              ? "border-white/10 bg-white/[0.02]"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >

                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                              status === "Current" ||
                              status === "In Progress"
                                ? "bg-cyan-400 text-slate-950"
                                : status ===
                                    "Complete"
                                  ? "bg-emerald-400 text-slate-950"
                                  : darkMode
                                    ? "bg-white/5 text-slate-400"
                                    : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {String(
                              item.week
                            ).padStart(2, "0")}
                          </div>

                          <div className="min-w-0 flex-1">

                            <div
                              className={`truncate text-xs font-medium ${mainText}`}
                            >
                              {item.title}
                            </div>

                            <div
                              className={`mt-1 truncate text-[10px] ${mutedText}`}
                            >
                              {item.description ||
                                `Week ${item.week}`}
                            </div>

                          </div>

                          <span
                            className={`shrink-0 text-[10px] ${
                              status === "Current" ||
                              status === "In Progress"
                                ? "text-cyan-300"
                                : status ===
                                    "Complete"
                                  ? "text-emerald-300"
                                  : mutedText
                            }`}
                          >
                            {status}
                          </span>

                        </div>
                      );
                    })
                ) : (
                  <div
                    className={`rounded-xl border p-4 text-xs ${mutedText} ${
                      darkMode
                        ? "border-white/10 bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    No roadmap has been generated yet.
                  </div>
                )}

              </div>

            </motion.div>

          </section>

          {/* =================================================
              FOCUS AREAS
          ================================================= */}

          <section className="mt-6">

            <div className="mb-4">

              <h2
                className={`text-lg font-semibold ${mainText}`}
              >
                Focus Areas
              </h2>

              <p
                className={`mt-1 text-xs ${mutedText}`}
              >
                Skills that Nexora identifies as needing attention.
              </p>

            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

              {loading ? (
                <div
                  className={`text-xs ${mutedText}`}
                >
                  Loading focus areas...
                </div>
              ) : focusSkills.length > 0 ? (
                focusSkills.map(
                  (skill) => (
                    <div
                      key={skill.name}
                      className={`rounded-xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.02]"
                          : "border-slate-200 bg-white"
                      }`}
                    >

                      <div
                        className={`text-sm font-medium ${mainText}`}
                      >
                        {skill.name}
                      </div>

                      <div className="mt-2 flex items-center justify-between">

                        <span className="text-[10px] text-amber-300">
                          {skill.status ===
                          "missing"
                            ? "Missing"
                            : "Needs improvement"}
                        </span>

                        {typeof skill.score ===
                          "number" && (
                          <span className="text-[10px] text-cyan-300">
                            {skill.score}%
                          </span>
                        )}

                      </div>

                    </div>
                  )
                )
              ) : (
                <div
                  className={`rounded-xl border p-4 text-xs ${mutedText} sm:col-span-2 lg:col-span-4 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  No focus areas are available from the backend yet.
                </div>
              )}

            </div>

          </section>

          {/* =================================================
              ASK NEXORA
          ================================================= */}

          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 overflow-hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6"
          >

            <div className="flex flex-col gap-5 md:flex-row md:items-center">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <SparkleIcon size={22} />
              </div>

              <div className="flex-1">

                <h2 className="text-lg font-semibold text-cyan-300">
                  Ask Nexora
                </h2>

                <p
                  className={`mt-1 text-xs leading-5 ${mutedText}`}
                >
                  Need career advice? Ask Nexora about skills,
                  projects, interviews, opportunities or your
                  personalized roadmap.
                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                <Link
                  href="/ask-nexora"
                  className="rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Ask Nexora →
                </Link>

                <Link
                  href="/voice"
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <MicrophoneIcon />
                  Voice
                </Link>

              </div>

            </div>

          </motion.section>

          {/* =================================================
              FOOTER
          ================================================= */}

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