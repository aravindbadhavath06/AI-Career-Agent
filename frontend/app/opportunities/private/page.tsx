"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { api, Job } from "@/lib/api";

export default function PrivateJobsPage() {
  const [darkMode, setDarkMode] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");
  const [jobType, setJobType] = useState("All types");

  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     THEME
  ========================================================= */

  useEffect(() => {
    const savedTheme = localStorage.getItem("nexora-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "nexora-theme",
      newMode ? "dark" : "light"
    );
  };

  /* =========================================================
     LOAD REAL PRIVATE JOBS
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.getPrivateJobs();

        if (mounted) {
          setJobs(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load private job opportunities."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadJobs();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     FILTER OPTIONS
  ========================================================= */

  const locationOptions = useMemo(() => {
    const values = jobs
      .map((job) => job.location)
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [jobs]);

  const typeOptions = useMemo(() => {
    const values = jobs
      .map((job) => job.type)
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [jobs]);

  /* =========================================================
     FILTER JOBS
  ========================================================= */

  const filteredJobs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !searchText ||
        job.title
          ?.toLowerCase()
          .includes(searchText) ||
        job.company
          ?.toLowerCase()
          .includes(searchText) ||
        job.location
          ?.toLowerCase()
          .includes(searchText) ||
        job.experience
          ?.toLowerCase()
          .includes(searchText) ||
        job.skills?.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesLocation =
        location === "All locations" ||
        job.location === location;

      const matchesType =
        jobType === "All types" ||
        job.type === jobType;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType
      );
    });
  }, [jobs, search, location, jobType]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const navItems = [
    {
      icon: "⌂",
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: "◈",
      label: "Opportunities",
      href: "/opportunities",
    },
    {
      icon: "◎",
      label: "Profile",
      href: "/profile",
    },
    {
      icon: "△",
      label: "Skill Gap",
      href: "/skill-gap",
    },
    {
      icon: "◇",
      label: "Roadmap",
      href: "/roadmap",
    },
    {
      icon: "◷",
      label: "Progress",
      href: "/progress",
    },
    {
      icon: "▣",
      label: "Resources",
      href: "/resources",
    },
    {
      icon: "▤",
      label: "Resume Analyzer",
      href: "/resume",
    },
    {
      icon: "◉",
      label: "Ask Nexora",
      href: "/ask-nexora",
    },
    {
      icon: "◌",
      label: "Voice Assistant",
      href: "/voice",
    },
  ];

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#07111f] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 hidden w-64 border-r lg:flex lg:flex-col ${
          darkMode
            ? "border-slate-800 bg-[#081321]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Logo */}

        <div
          className={`flex h-20 shrink-0 items-center gap-3 border-b px-6 ${
            darkMode
              ? "border-slate-800"
              : "border-slate-200"
          }`}
        >
          <motion.div
            whileHover={{
              rotate: 8,
              scale: 1.08,
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-[#07111f]"
          >
            NX
          </motion.div>

          <div>
            <p className="font-bold tracking-tight">
              Agent Nexora
            </p>

            <p className="text-[11px] text-slate-500">
              Navigate Your Next.
            </p>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p
            className={`mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] ${
              darkMode
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            Workspace
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const active =
                item.label === "Opportunities";

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-cyan-400/10 text-cyan-400"
                      : darkMode
                        ? "text-slate-400 hover:bg-white/5 hover:text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-base ${
                      active
                        ? "bg-cyan-400 text-[#07111f]"
                        : darkMode
                          ? "bg-slate-800 text-slate-400"
                          : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {item.label}
                </motion.a>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}

        <div
          className={`shrink-0 border-t p-4 ${
            darkMode
              ? "border-slate-800"
              : "border-slate-200"
          }`}
        >
          <a
            href="/settings"
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
              darkMode
                ? "text-slate-400 hover:bg-white/5 hover:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-slate-100"
              }`}
            >
              ⚙
            </span>

            Settings
          </a>

          <a
            href="/login"
            className={`mt-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
              darkMode
                ? "text-slate-400 hover:bg-white/5 hover:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-slate-100"
              }`}
            >
              ↪
            </span>

            Sign out
          </a>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="min-w-0 lg:ml-64">

        {/* Header */}

        <header
          className={`flex h-20 items-center justify-between border-b px-5 backdrop-blur lg:px-8 ${
            darkMode
              ? "border-slate-800 bg-[#07111f]/95"
              : "border-slate-200 bg-white/95"
          }`}
        >
          <div>
            <p className="text-sm text-slate-500">
              Private job opportunities
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              aria-label="Notifications"
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              🔔

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400" />
            </button>

            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              {darkMode ? "🌙" : "☀️"}
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                  Student
                </p>

                <p className="text-xs text-slate-500">
                  Agent Nexora
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 font-bold text-cyan-400">
                S
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-12">

          {/* Back */}

          <motion.a
            href="/opportunities"
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className={`inline-flex items-center gap-2 text-sm font-semibold ${
              darkMode
                ? "text-slate-400 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            ← Back to Opportunities
          </motion.a>

          {/* Hero */}

          <motion.section
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
            className="mt-8"
          >
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

              <div className="max-w-4xl">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Private opportunities
                </p>

                <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  Find your next
                  <br />
                  <span className="text-cyan-400">
                    career opportunity.
                  </span>
                </h1>

                <p
                  className={`mt-6 max-w-3xl text-base leading-8 sm:text-lg ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  Explore private-sector jobs and discover
                  opportunities that align with your skills,
                  experience, and career goals.
                </p>

              </div>

              <motion.div
                animate={{
                  y: [0, -7, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border text-5xl ${
                  darkMode
                    ? "border-cyan-400/20 bg-cyan-400/5"
                    : "border-cyan-200 bg-cyan-50"
                }`}
              >
                💼
              </motion.div>

            </div>
          </motion.section>

          {/* Search */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
            }}
            className={`mt-8 rounded-3xl border p-5 ${
              darkMode
                ? "border-slate-800 bg-slate-900/50"
                : "border-slate-200 bg-white"
            }`}
          >

            <div className="grid gap-4 lg:grid-cols-[1fr_230px_190px]">

              {/* Search */}

              <div className="relative">

                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  ⌕
                </span>

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search jobs, companies, or skills..."
                  className={`h-12 w-full rounded-xl border pl-11 pr-4 text-sm outline-none transition ${
                    darkMode
                      ? "border-slate-700 bg-[#07111f] text-white placeholder:text-slate-600 focus:border-cyan-400"
                      : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-cyan-400"
                  }`}
                />

              </div>

              {/* Location */}

              <select
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className={`h-12 rounded-xl border px-4 text-sm outline-none ${
                  darkMode
                    ? "border-slate-700 bg-[#07111f] text-white"
                    : "border-slate-200 bg-slate-50 text-slate-900"
                }`}
              >

                <option>
                  All locations
                </option>

                {locationOptions.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

              {/* Type */}

              <select
                value={jobType}
                onChange={(e) =>
                  setJobType(e.target.value)
                }
                className={`h-12 rounded-xl border px-4 text-sm outline-none ${
                  darkMode
                    ? "border-slate-700 bg-[#07111f] text-white"
                    : "border-slate-200 bg-slate-50 text-slate-900"
                }`}
              >

                <option>
                  All types
                </option>

                {typeOptions.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

            </div>
          </motion.section>

          {/* Results */}

          <div className="mt-10 flex items-end justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                Matching opportunities
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {loading
                  ? "Loading..."
                  : `${filteredJobs.length} opportunities`}
              </h2>

            </div>

            <p
              className={`hidden text-sm sm:block ${
                darkMode
                  ? "text-slate-500"
                  : "text-slate-500"
              }`}
            >
              Real backend data
            </p>

          </div>

          {/* =====================================================
              ERROR
          ====================================================== */}

          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
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

              <p className="text-sm font-bold text-red-400">
                Unable to load private jobs
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

          {/* =====================================================
              LOADING
          ====================================================== */}

          {loading && (
            <div className="mt-6 space-y-5">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`animate-pulse rounded-3xl border p-6 ${
                    darkMode
                      ? "border-slate-800 bg-slate-900/50"
                      : "border-slate-200 bg-white"
                  }`}
                >

                  <div className="flex gap-4">

                    <div
                      className={`h-12 w-12 rounded-xl ${
                        darkMode
                          ? "bg-slate-800"
                          : "bg-slate-100"
                      }`}
                    />

                    <div className="flex-1">

                      <div
                        className={`h-5 w-2/5 rounded ${
                          darkMode
                            ? "bg-slate-800"
                            : "bg-slate-100"
                        }`}
                      />

                      <div
                        className={`mt-3 h-4 w-1/4 rounded ${
                          darkMode
                            ? "bg-slate-800"
                            : "bg-slate-100"
                        }`}
                      />

                      <div
                        className={`mt-6 h-4 w-full rounded ${
                          darkMode
                            ? "bg-slate-800"
                            : "bg-slate-100"
                        }`}
                      />

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* =====================================================
              JOB CARDS
          ====================================================== */}

          {!loading &&
            !error && (
              <div className="mt-6 space-y-5">

                {filteredJobs.map(
                  (job, index) => (
                    <motion.article
                      key={String(job.id)}
                      initial={{
                        opacity: 0,
                        y: 25,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.5,
                      }}
                      whileHover={{
                        y: -3,
                      }}
                      className={`rounded-3xl border p-6 ${
                        darkMode
                          ? "border-slate-800 bg-slate-900/50 hover:border-cyan-400/30"
                          : "border-slate-200 bg-white hover:border-cyan-300 hover:shadow-lg"
                      }`}
                    >

                      <div className="flex flex-col gap-7 lg:flex-row lg:justify-between">

                        {/* Main */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                            <div>

                              <div className="flex items-center gap-3">

                                <div
                                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${
                                    darkMode
                                      ? "bg-[#07111f]"
                                      : "bg-slate-50"
                                  }`}
                                >
                                  💼
                                </div>

                                <div>

                                  <h3 className="text-xl font-black">
                                    {job.title}
                                  </h3>

                                  <p
                                    className={`mt-1 text-sm ${
                                      darkMode
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                    }`}
                                  >
                                    {job.company}
                                  </p>

                                </div>

                              </div>

                            </div>

                            {/* Match */}

                            {typeof job.match ===
                              "number" && (
                              <div
                                className={`flex w-fit items-center gap-2 rounded-full px-3 py-1.5 ${
                                  darkMode
                                    ? "bg-cyan-400/10"
                                    : "bg-cyan-50"
                                }`}
                              >

                                <span className="text-xs text-slate-500">
                                  Profile match
                                </span>

                                <span className="text-sm font-black text-cyan-400">
                                  {job.match}%
                                </span>

                              </div>
                            )}

                          </div>

                          {/* Meta */}

                          <div className="mt-5 flex flex-wrap gap-2">

                            {job.location && (
                              <span
                                className={`rounded-full px-3 py-1.5 text-xs ${
                                  darkMode
                                    ? "bg-slate-800 text-slate-300"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                📍 {job.location}
                              </span>
                            )}

                            {job.type && (
                              <span
                                className={`rounded-full px-3 py-1.5 text-xs ${
                                  darkMode
                                    ? "bg-slate-800 text-slate-300"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                💼 {job.type}
                              </span>
                            )}

                            {job.experience && (
                              <span
                                className={`rounded-full px-3 py-1.5 text-xs ${
                                  darkMode
                                    ? "bg-slate-800 text-slate-300"
                                    : "bg-slate-100 text-slate-700"
                                }`}
                              >
                                ◉ {job.experience}
                              </span>
                            )}

                          </div>

                          {/* Description */}

                          {job.description && (
                            <p
                              className={`mt-5 max-w-4xl text-sm leading-7 ${
                                darkMode
                                  ? "text-slate-400"
                                  : "text-slate-600"
                              }`}
                            >
                              {job.description}
                            </p>
                          )}

                          {/* Skills */}

                          {job.skills &&
                            job.skills.length >
                              0 && (
                              <div className="mt-5">

                                <p className="mb-3 text-xs font-semibold text-slate-500">
                                  Required skills
                                </p>

                                <div className="flex flex-wrap gap-2">

                                  {job.skills.map(
                                    (skill) => (
                                      <span
                                        key={skill}
                                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                          darkMode
                                            ? "bg-cyan-400/10 text-cyan-300"
                                            : "bg-cyan-50 text-cyan-700"
                                        }`}
                                      >
                                        {skill}
                                      </span>
                                    )
                                  )}

                                </div>

                              </div>
                            )}

                        </div>

                        {/* Actions */}

                        <div className="flex shrink-0 flex-col gap-3 lg:w-40">

                          {job.apply_url ? (
                            <motion.a
                              href={job.apply_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{
                                scale: 1.03,
                              }}
                              whileTap={{
                                scale: 0.97,
                              }}
                              className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-[#07111f] hover:bg-cyan-300"
                            >
                              Apply / View →
                            </motion.a>
                          ) : (
                            <div
                              className={`rounded-xl border px-5 py-3 text-center text-xs ${
                                darkMode
                                  ? "border-slate-700 text-slate-500"
                                  : "border-slate-200 text-slate-400"
                              }`}
                            >
                              Application link unavailable
                            </div>
                          )}

                        </div>

                      </div>

                    </motion.article>
                  )
                )}

                {/* No results */}

                {filteredJobs.length ===
                  0 && (
                  <div
                    className={`rounded-3xl border p-12 text-center ${
                      darkMode
                        ? "border-slate-800 bg-slate-900/50"
                        : "border-slate-200 bg-white"
                    }`}
                  >

                    <div className="text-4xl">
                      ⌕
                    </div>

                    <h3 className="mt-4 text-xl font-bold">
                      No opportunities found
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Try changing your search or
                      location/type filters.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setLocation("All locations");
                        setJobType("All types");
                      }}
                      className="mt-5 rounded-xl bg-cyan-400 px-5 py-2.5 text-xs font-bold text-[#07111f]"
                    >
                      Clear Filters
                    </button>

                  </div>
                )}

              </div>
            )}

          {/* =====================================================
              PREPARATION
          ====================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
            }}
            className={`mt-10 rounded-3xl border p-8 lg:p-10 ${
              darkMode
                ? "border-slate-800 bg-slate-900/50"
                : "border-slate-200 bg-white"
            }`}
          >

            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Nexora career preparation
                </p>

                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  Prepare for the role, not just the application.
                </h2>

                <p
                  className={`mt-4 max-w-2xl text-sm leading-7 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  Nexora can analyze your profile, identify
                  skill gaps, and create a personalized roadmap
                  around your career goals.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">

                  {[
                    "Profile",
                    "Skills",
                    "Experience",
                    "Skill Gap",
                    "Roadmap",
                  ].map((item) => (
                    <span
                      key={item}
                      className={`rounded-full px-3 py-1.5 text-xs ${
                        darkMode
                          ? "bg-slate-800 text-slate-300"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {item}
                    </span>
                  ))}

                </div>

              </div>

              <motion.div
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-28 w-28 items-center justify-center rounded-3xl border border-cyan-400/30 bg-cyan-400/10 text-5xl"
              >
                ✦
              </motion.div>

            </div>

          </motion.section>

          {/* =====================================================
              PROFILE CTA
          ====================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className="mt-8 rounded-3xl bg-cyan-400 p-8 lg:p-10"
          >

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>

                <h2 className="text-2xl font-black text-[#07111f]">
                  Want more personalized matches?
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#07111f]/70">
                  Update your profile so Nexora can understand
                  your education, skills, interests, experience,
                  and career goals.
                </p>

              </div>

              <motion.a
                href="/profile"
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                className="shrink-0 rounded-xl bg-[#07111f] px-6 py-3 text-center text-sm font-bold text-white"
              >
                Update Profile →
              </motion.a>

            </div>

          </motion.section>

          {/* Footer */}

          <footer
            className={`mt-12 border-t pt-6 pb-8 ${
              darkMode
                ? "border-slate-800"
                : "border-slate-200"
            }`}
          >

            <div
              className={`flex flex-col justify-between gap-2 text-xs sm:flex-row ${
                darkMode
                  ? "text-slate-600"
                  : "text-slate-500"
              }`}
            >

              <p>
                © 2026 Agent Nexora
              </p>

              <p>
                Navigate Your Next.
              </p>

            </div>

          </footer>

        </div>
      </div>
    </main>
  );
}