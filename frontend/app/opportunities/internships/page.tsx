"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, Internship } from "@/lib/api";

/* =========================================================
   ICONS
========================================================= */

function BriefcaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle
        cx="11"
        cy="11"
        r="7"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.5 16.5L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21C12 21 19 14.8 19 9.5C19 5.9 15.9 3 12 3C8.1 3 5 5.9 5 9.5C5 14.8 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="9.5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 7V12L15 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BookmarkIcon({ saved }: { saved: boolean }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 4.5C6 3.7 6.7 3 7.5 3H16.5C17.3 3 18 3.7 18 4.5V21L12 17.5L6 21V4.5Z"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L13.7 9.3L21 12L13.7 14.7L12 22L10.3 14.7L3 12L10.3 9.3L12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
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

function HomeIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 10L12 4L20 10V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19V10Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M9 21V14H15V21"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
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

/* =========================================================
   PAGE
========================================================= */

export default function InternshipsPage() {
  const [darkMode, setDarkMode] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [mode, setMode] = useState("All Modes");
  const [duration, setDuration] = useState("All Durations");

  const [internships, setInternships] = useState<Internship[]>([]);

  const [saved, setSaved] = useState<Array<string | number>>([]);

  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     THEME
  ========================================================= */

  useEffect(() => {
    const theme = localStorage.getItem("nexora-theme");

    if (theme === "light") {
      setDarkMode(false);
    }

    const savedInternships = localStorage.getItem(
      "nexora-saved-internships"
    );

    if (savedInternships) {
      try {
        const parsed = JSON.parse(savedInternships);

        if (Array.isArray(parsed)) {
          setSaved(parsed);
        }
      } catch {
        setSaved([]);
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;

    setDarkMode(next);

    localStorage.setItem(
      "nexora-theme",
      next ? "dark" : "light"
    );
  };

  /* =========================================================
     LOAD REAL BACKEND INTERNSHIPS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadInternships = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.getInternships();

        if (mounted) {
          setInternships(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load internships."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInternships();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     SAVE INTERNSHIP
     
     This only stores which backend opportunity IDs the
     user bookmarked. It does NOT create fake opportunities.
  ========================================================= */

  const toggleSave = (id: string | number) => {
    const alreadySaved = saved.some(
      (savedId) => String(savedId) === String(id)
    );

    const updated = alreadySaved
      ? saved.filter(
          (savedId) => String(savedId) !== String(id)
        )
      : [...saved, id];

    setSaved(updated);

    localStorage.setItem(
      "nexora-saved-internships",
      JSON.stringify(updated)
    );
  };

  /* =========================================================
     DYNAMIC FILTER OPTIONS
  ========================================================= */

  const locationOptions = useMemo(() => {
    const values = internships
      .map((item) => item.location)
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [internships]);

  const modeOptions = useMemo(() => {
    const values = internships
      .map((item) => item.mode)
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [internships]);

  const durationOptions = useMemo(() => {
    const values = internships
      .map((item) => item.duration)
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [internships]);

  /* =========================================================
     FILTER INTERNSHIPS
  ========================================================= */

  const filteredInternships = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return internships.filter((internship) => {
      const matchesSearch =
        !searchText ||
        internship.role
          ?.toLowerCase()
          .includes(searchText) ||
        internship.company
          ?.toLowerCase()
          .includes(searchText) ||
        internship.location
          ?.toLowerCase()
          .includes(searchText) ||
        internship.skills?.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesLocation =
        location === "All Locations" ||
        internship.location === location;

      const matchesMode =
        mode === "All Modes" ||
        internship.mode === mode;

      const matchesDuration =
        duration === "All Durations" ||
        internship.duration === duration;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesMode &&
        matchesDuration
      );
    });
  }, [
    internships,
    search,
    location,
    mode,
    duration,
  ]);

  /* =========================================================
     STYLES
  ========================================================= */

  const cardClass = darkMode
    ? "border-white/10 bg-white/[0.03]"
    : "border-slate-200 bg-white";

  const inputClass = darkMode
    ? "border-white/10 bg-[#0b1421] text-white placeholder:text-slate-500"
    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-[#050b14] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 hidden h-screen w-64 overflow-y-auto border-r lg:block ${
          darkMode
            ? "border-white/10 bg-[#07101d]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex min-h-full flex-col p-5">

          {/* LOGO */}

          <Link
            href="/dashboard"
            className="mb-7 flex shrink-0 items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400 text-lg font-black text-slate-950">
              NX
            </div>

            <div>
              <div className="text-lg font-bold">
                Agent Nexora
              </div>

              <div className="text-xs text-slate-400">
                Navigate Your Next.
              </div>
            </div>
          </Link>

          <div className="mb-3 px-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </div>

          <nav className="space-y-0.5">

            <SidebarLink
              href="/dashboard"
              label="Dashboard"
              icon={<HomeIcon />}
            />

            <SidebarLink
              href="/opportunities"
              label="Opportunities"
              active
              icon={<BriefcaseIcon />}
            />

            <SidebarLink
              href="/profile"
              label="Profile"
              icon={<UserIcon />}
            />

            <SidebarLink
              href="/skill-gap"
              label="Skill Gap"
              icon={<span>◎</span>}
            />

            <SidebarLink
              href="/roadmap"
              label="Roadmap"
              icon={<span>◇</span>}
            />

            <SidebarLink
              href="/progress"
              label="Progress"
              icon={<span>◷</span>}
            />

            <SidebarLink
              href="/resources"
              label="Resources"
              icon={<span>▤</span>}
            />

            <SidebarLink
              href="/resume"
              label="Resume Analyzer"
              icon={<span>▱</span>}
            />

            <SidebarLink
              href="/ask-nexora"
              label="Ask Nexora"
              icon={<span>✦</span>}
            />

            <SidebarLink
              href="/voice"
              label="Voice Assistant"
              icon={<span>🎙</span>}
            />

          </nav>

          {/* BOTTOM */}

          <div
            className={`mt-auto shrink-0 border-t pt-4 ${
              darkMode
                ? "border-white/10"
                : "border-slate-200"
            }`}
          >

            <SidebarLink
              href="/settings"
              label="Settings"
              icon={<span>⚙</span>}
            />

            <Link
              href="/login"
              className={`mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                  : "text-slate-500 hover:bg-red-50 hover:text-red-500"
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

      {/* ================================================= */}
      {/* MOBILE HEADER */}
      {/* ================================================= */}

      <header
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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 text-xs font-black text-slate-950">
            NX
          </div>

          <span className="font-semibold">
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
                : "border-slate-200 bg-slate-50"
            }`}
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950"
          >
            M
          </Link>

        </div>

      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

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
            <div className="text-xs text-slate-500">
              Opportunities
            </div>

            <h1 className="text-lg font-semibold">
              Internships
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={toggleTheme}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950"
            >
              M
            </Link>

          </div>

        </header>

        {/* CONTENT */}

        <div className="mx-auto max-w-7xl p-5 md:p-8">

          {/* BACK */}

          <Link
            href="/opportunities"
            className={`mb-5 inline-flex items-center gap-2 text-xs transition ${
              darkMode
                ? "text-slate-400 hover:text-cyan-300"
                : "text-slate-500 hover:text-cyan-600"
            }`}
          >
            ← Back to Opportunities
          </Link>

          {/* HERO */}

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

            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div>

                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300">
                    <BriefcaseIcon />
                    Career Opportunities
                  </div>

                  <h2 className="text-3xl font-bold md:text-4xl">
                    Find your next internship.
                  </h2>

                  <p
                    className={`mt-3 max-w-2xl text-sm leading-6 ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-600"
                    }`}
                  >
                    Discover internships matched to your
                    skills, interests, education and career goals.
                  </p>

                </div>

                <div
                  className={`flex h-24 w-24 shrink-0 flex-col items-center justify-center rounded-2xl border ${
                    darkMode
                      ? "border-cyan-400/20 bg-cyan-400/10"
                      : "border-cyan-200 bg-cyan-50"
                  }`}
                >
                  <span className="text-2xl font-bold text-cyan-300">
                    {loading
                      ? "..."
                      : filteredInternships.length}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    internships
                  </span>
                </div>

              </div>

            </div>

          </motion.section>

          {/* =================================================
              SEARCH + FILTERS
          ================================================= */}

          <section
            className={`mt-6 rounded-2xl border p-4 ${cardClass}`}
          >

            <div className="flex flex-col gap-3 lg:flex-row">

              <div className="relative flex-1">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <SearchIcon />
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search internship, company or skill..."
                  className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none focus:border-cyan-400 ${inputClass}`}
                />

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowFilters(!showFilters)
                }
                className={`rounded-xl border px-5 py-3 text-sm lg:hidden ${
                  darkMode
                    ? "border-white/10 bg-white/5 text-slate-300"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {showFilters
                  ? "Hide Filters"
                  : "Filters"}
              </button>

            </div>

            <div
              className={`mt-4 grid gap-3 ${
                showFilters
                  ? "grid"
                  : "hidden lg:grid"
              } md:grid-cols-3`}
            >

              {/* LOCATION */}

              <select
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className={`rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-400 ${inputClass}`}
              >

                <option>All Locations</option>

                {locationOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

              </select>

              {/* MODE */}

              <select
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value)
                }
                className={`rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-400 ${inputClass}`}
              >

                <option>All Modes</option>

                {modeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

              </select>

              {/* DURATION */}

              <select
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value)
                }
                className={`rounded-xl border px-4 py-3 text-sm outline-none focus:border-cyan-400 ${inputClass}`}
              >

                <option>All Durations</option>

                {durationOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

              </select>

            </div>

          </section>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`mt-5 rounded-2xl border p-5 ${
                darkMode
                  ? "border-red-400/20 bg-red-400/5"
                  : "border-red-200 bg-red-50"
              }`}
            >

              <p className="text-sm font-semibold text-red-400">
                Unable to load internships
              </p>

              <p
                className={`mt-1 text-xs ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-600"
                }`}
              >
                {error}
              </p>

            </motion.div>
          )}

          {/* =================================================
              RESULT HEADER
          ================================================= */}

          <div className="mt-8 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Recommended Internships
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Opportunities returned by the Nexora backend.
              </p>

            </div>

            <div className="text-xs text-slate-500">
              {loading
                ? "Loading..."
                : `${filteredInternships.length} results`}
            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className={`animate-pulse rounded-2xl border p-5 ${cardClass}`}
                >

                  <div className="flex items-start gap-4">

                    <div
                      className={`h-12 w-12 rounded-xl ${
                        darkMode
                          ? "bg-slate-800"
                          : "bg-slate-100"
                      }`}
                    />

                    <div className="flex-1">

                      <div
                        className={`h-5 w-2/3 rounded ${
                          darkMode
                            ? "bg-slate-800"
                            : "bg-slate-100"
                        }`}
                      />

                      <div
                        className={`mt-3 h-4 w-1/3 rounded ${
                          darkMode
                            ? "bg-slate-800"
                            : "bg-slate-100"
                        }`}
                      />

                    </div>

                  </div>

                  <div
                    className={`mt-6 h-2 rounded ${
                      darkMode
                        ? "bg-slate-800"
                        : "bg-slate-100"
                    }`}
                  />

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div
                      className={`h-16 rounded-xl ${
                        darkMode
                          ? "bg-slate-800"
                          : "bg-slate-100"
                      }`}
                    />

                    <div
                      className={`h-16 rounded-xl ${
                        darkMode
                          ? "bg-slate-800"
                          : "bg-slate-100"
                      }`}
                    />

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* =================================================
              INTERNSHIPS
          ================================================= */}

          {!loading && !error && (
            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              {filteredInternships.map(
                (internship, index) => {

                  const isSaved = saved.some(
                    (savedId) =>
                      String(savedId) ===
                      String(internship.id)
                  );

                  return (
                    <motion.article
                      key={String(internship.id)}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      whileHover={{
                        y: -3,
                      }}
                      className={`rounded-2xl border p-5 transition ${cardClass}`}
                    >

                      {/* TOP */}

                      <div className="flex items-start justify-between gap-4">

                        <div className="flex min-w-0 items-start gap-4">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                            <BriefcaseIcon />
                          </div>

                          <div className="min-w-0">

                            <h3 className="text-lg font-semibold">
                              {internship.role}
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                              {internship.company}
                            </p>

                          </div>

                        </div>

                        {/* SAVE */}

                        <button
                          type="button"
                          onClick={() =>
                            toggleSave(
                              internship.id
                            )
                          }
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                            isSaved
                              ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
                              : darkMode
                                ? "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                                : "border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900"
                          }`}
                          title={
                            isSaved
                              ? "Remove saved internship"
                              : "Save internship"
                          }
                        >
                          <BookmarkIcon
                            saved={isSaved}
                          />
                        </button>

                      </div>

                      {/* MATCH */}

                      {typeof internship.match ===
                        "number" && (
                        <>
                          <div className="mt-5 flex items-center justify-between">

                            <span className="text-xs text-slate-500">
                              Nexora Match
                            </span>

                            <span className="text-sm font-bold text-cyan-300">
                              {internship.match}%
                            </span>

                          </div>

                          <div
                            className={`mt-2 h-2 overflow-hidden rounded-full ${
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
                                width: `${Math.max(
                                  0,
                                  Math.min(
                                    100,
                                    internship.match
                                  )
                                )}%`,
                              }}
                              transition={{
                                duration: 0.8,
                                delay:
                                  index * 0.05,
                              }}
                              className="h-full rounded-full bg-cyan-400"
                            />

                          </div>
                        </>
                      )}

                      {/* INFO */}

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div
                          className={`rounded-xl p-3 ${
                            darkMode
                              ? "bg-white/[0.03]"
                              : "bg-slate-50"
                          }`}
                        >

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <LocationIcon />
                            Location
                          </div>

                          <div className="mt-1 text-xs font-medium">
                            {internship.location ||
                              "Not specified"}
                          </div>

                        </div>

                        <div
                          className={`rounded-xl p-3 ${
                            darkMode
                              ? "bg-white/[0.03]"
                              : "bg-slate-50"
                          }`}
                        >

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <ClockIcon />
                            Duration
                          </div>

                          <div className="mt-1 text-xs font-medium">
                            {internship.duration ||
                              "Not specified"}
                          </div>

                        </div>

                      </div>

                      {/* MODE + STIPEND */}

                      <div className="mt-3 flex flex-wrap gap-2">

                        {internship.mode && (
                          <span
                            className={`rounded-full px-3 py-1.5 text-[11px] ${
                              darkMode
                                ? "bg-cyan-400/10 text-cyan-300"
                                : "bg-cyan-50 text-cyan-700"
                            }`}
                          >
                            {internship.mode}
                          </span>
                        )}

                        {internship.stipend && (
                          <span
                            className={`rounded-full px-3 py-1.5 text-[11px] ${
                              darkMode
                                ? "bg-emerald-400/10 text-emerald-300"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {internship.stipend}
                          </span>
                        )}

                      </div>

                      {/* DESCRIPTION */}

                      {internship.description && (
                        <p
                          className={`mt-4 text-xs leading-5 ${
                            darkMode
                              ? "text-slate-400"
                              : "text-slate-600"
                          }`}
                        >
                          {internship.description}
                        </p>
                      )}

                      {/* SKILLS */}

                      {internship.skills &&
                        internship.skills.length >
                          0 && (
                          <div className="mt-4">

                            <div className="mb-2 text-[11px] text-slate-500">
                              Required Skills
                            </div>

                            <div className="flex flex-wrap gap-2">

                              {internship.skills.map(
                                (skill) => (
                                  <span
                                    key={skill}
                                    className={`rounded-full border px-2.5 py-1 text-[10px] ${
                                      darkMode
                                        ? "border-white/10 bg-white/[0.03] text-slate-300"
                                        : "border-slate-200 bg-slate-50 text-slate-600"
                                    }`}
                                  >
                                    {skill}
                                  </span>
                                )
                              )}

                            </div>

                          </div>
                        )}

                      {/* ELIGIBILITY */}

                      {internship.eligibility && (
                        <div
                          className={`mt-4 rounded-xl border p-3 ${
                            darkMode
                              ? "border-white/10 bg-white/[0.02]"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >

                          <div className="text-[10px] uppercase tracking-wide text-slate-500">
                            Eligibility
                          </div>

                          <p
                            className={`mt-1 text-xs leading-5 ${
                              darkMode
                                ? "text-slate-300"
                                : "text-slate-600"
                            }`}
                          >
                            {internship.eligibility}
                          </p>

                        </div>
                      )}

                      {/* FOOTER */}

                      <div className="mt-5 flex items-center justify-between gap-3">

                        <span className="text-[10px] text-slate-500">
                          {internship.posted
                            ? `Posted ${internship.posted}`
                            : ""}
                        </span>

                        {internship.apply_url ? (
                          <a
                            href={
                              internship.apply_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-300"
                          >
                            View Internship
                            <ArrowIcon />
                          </a>
                        ) : (
                          <span
                            className={`rounded-xl border px-4 py-2.5 text-xs ${
                              darkMode
                                ? "border-white/10 text-slate-500"
                                : "border-slate-200 text-slate-400"
                            }`}
                          >
                            Application link unavailable
                          </span>
                        )}

                      </div>

                    </motion.article>
                  );
                }
              )}

            </div>
          )}

          {/* =================================================
              NO RESULTS
          ================================================= */}

          {!loading &&
            !error &&
            filteredInternships.length ===
              0 && (

              <div
                className={`mt-5 rounded-2xl border p-12 text-center ${cardClass}`}
              >

                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${
                    darkMode
                      ? "bg-white/5 text-slate-400"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <SearchIcon />
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No internships found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setLocation("All Locations");
                    setMode("All Modes");
                    setDuration("All Durations");
                  }}
                  className="mt-5 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-semibold text-slate-950"
                >
                  Clear Filters
                </button>

              </div>
            )}

          {/* =================================================
              AI MATCHING
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
            className={`mt-8 rounded-2xl border p-6 ${
              darkMode
                ? "border-cyan-400/20 bg-cyan-400/[0.04]"
                : "border-cyan-200 bg-cyan-50"
            }`}
          >

            <div className="flex flex-col gap-5 md:flex-row md:items-center">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                <SparkleIcon />
              </div>

              <div className="flex-1">

                <h3 className="text-lg font-semibold text-cyan-300">
                  Want more personalized matches?
                </h3>

                <p
                  className={`mt-1 text-xs leading-5 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  Update your profile and let Nexora analyze
                  your skills, interests and career goals for
                  better internship recommendations.
                </p>

              </div>

              <div className="flex flex-wrap gap-2">

                <Link
                  href="/profile"
                  className="rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-semibold text-slate-950"
                >
                  Update Profile
                </Link>

                <Link
                  href="/analysis"
                  className={`rounded-xl border px-4 py-2.5 text-xs ${
                    darkMode
                      ? "border-white/10 bg-white/5 text-white"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  Run AI Analysis
                </Link>

              </div>

            </div>

          </motion.section>

          {/* =================================================
              SAVED INTERNSHIPS
          ================================================= */}

          <section
            className={`mt-6 rounded-2xl border p-5 ${cardClass}`}
          >

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-base font-semibold">
                  Saved Internships
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Your bookmarked backend opportunities.
                </p>

              </div>

              <div className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300">
                {saved.length} saved
              </div>

            </div>

            {saved.length === 0 ? (
              <div
                className={`mt-5 rounded-xl border border-dashed p-6 text-center ${
                  darkMode
                    ? "border-white/10"
                    : "border-slate-200"
                }`}
              >

                <div className="text-sm text-slate-400">
                  No internships saved yet.
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  Click the bookmark icon on an internship to save it.
                </p>

              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-2">

                {internships
                  .filter((item) =>
                    saved.some(
                      (savedId) =>
                        String(savedId) ===
                        String(item.id)
                    )
                  )
                  .map((item) => (
                    <span
                      key={String(item.id)}
                      className="rounded-full bg-cyan-400/10 px-3 py-2 text-xs text-cyan-300"
                    >
                      {item.role}
                    </span>
                  ))}

              </div>
            )}

          </section>

          {/* FOOTER */}

          <footer className="py-10 text-center text-xs text-slate-500">
            Agent Nexora • Navigate Your Next.
          </footer>

        </div>
      </main>
    </div>
  );
}

/* =========================================================
   SIDEBAR LINK
========================================================= */

function SidebarLink({
  href,
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 transition ${
        active
          ? "bg-cyan-400/10 text-cyan-300"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          active
            ? "bg-cyan-400 text-slate-950"
            : "bg-white/[0.05]"
        }`}
      >
        {icon}
      </span>

      <span className="truncate text-sm">
        {label}
      </span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
      )}
    </Link>
  );
}