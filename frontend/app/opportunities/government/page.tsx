"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api, GovernmentOpportunity } from "@/lib/api";

export default function GovernmentJobsPage() {
  const [darkMode, setDarkMode] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All locations");

  const [opportunities, setOpportunities] = useState<
    GovernmentOpportunity[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     THEME
  ========================== */

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

  /* =========================
     LOAD GOVERNMENT JOBS
  ========================== */

  useEffect(() => {
    let mounted = true;

    const loadOpportunities = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.getGovernmentJobs();

        if (mounted) {
          setOpportunities(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load government opportunities."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadOpportunities();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================
     FILTERS
  ========================== */

  const filteredOpportunities = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return opportunities.filter((item) => {
      const matchesSearch =
        !searchText ||
        item.post?.toLowerCase().includes(searchText) ||
        item.organization?.toLowerCase().includes(searchText) ||
        item.eligibility?.toLowerCase().includes(searchText) ||
        item.location?.toLowerCase().includes(searchText);

      const matchesLocation =
        location === "All locations" ||
        item.location === location;

      return matchesSearch && matchesLocation;
    });
  }, [opportunities, search, location]);

  /* =========================
     LOCATION OPTIONS
  ========================== */

  const locationOptions = useMemo(() => {
    const locations = opportunities
      .map((item) => item.location)
      .filter(Boolean);

    return Array.from(new Set(locations));
  }, [opportunities]);

  /* =========================
     NAVIGATION
  ========================== */

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
      {/* =========================
          SIDEBAR
      ========================== */}

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

      {/* =========================
          MAIN
      ========================== */}

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
              Government opportunities
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification */}

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

            {/* Theme */}

            <motion.button
              onClick={toggleTheme}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
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

            {/* Student */}

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

        {/* =========================
            CONTENT
        ========================== */}

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
                  Government opportunities
                </p>

                <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                  Explore government
                  <br />
                  <span className="text-cyan-400">
                    career opportunities.
                  </span>
                </h1>

                <p
                  className={`mt-6 max-w-3xl text-base leading-8 sm:text-lg ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  Discover government recruitment opportunities,
                  understand eligibility and preparation requirements,
                  and identify opportunities that align with your
                  profile.
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
                🏛️
              </motion.div>
            </div>
          </motion.section>

          {/* =========================
              SEARCH
          ========================== */}

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
            <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
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
                  placeholder="Search posts, organizations, or eligibility..."
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
                <option>All locations</option>

                {locationOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </motion.section>

          {/* =========================
              RESULTS HEADER
          ========================== */}

          <div className="mt-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                Recruitment opportunities
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {loading
                  ? "Loading..."
                  : `${filteredOpportunities.length} opportunities`}
              </h2>
            </div>

            <p
              className={`hidden text-sm sm:block ${
                darkMode
                  ? "text-slate-500"
                  : "text-slate-500"
              }`}
            >
              Live backend data
            </p>
          </div>

          {/* =========================
              ERROR
          ========================== */}

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
              <p className="text-sm font-semibold text-red-400">
                Unable to load government opportunities
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

          {/* =========================
              LOADING
          ========================== */}

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

          {/* =========================
              OPPORTUNITY CARDS
          ========================== */}

          {!loading && !error && (
            <div className="mt-6 space-y-5">
              {filteredOpportunities.map(
                (item, index) => (
                  <motion.article
                    key={String(item.id)}
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
                                🏛️
                              </div>

                              <div>
                                <h3 className="text-xl font-black">
                                  {item.post}
                                </h3>

                                <p
                                  className={`mt-1 text-sm ${
                                    darkMode
                                      ? "text-slate-400"
                                      : "text-slate-600"
                                  }`}
                                >
                                  {item.organization}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Match */}

                          {typeof item.match ===
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
                                {item.match}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Meta */}

                        <div className="mt-5 flex flex-wrap gap-2">
                          {item.location && (
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs ${
                                darkMode
                                  ? "bg-slate-800 text-slate-300"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              📍 {item.location}
                            </span>
                          )}

                          {item.eligibility && (
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs ${
                                darkMode
                                  ? "bg-slate-800 text-slate-300"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              🎓 {item.eligibility}
                            </span>
                          )}

                          {item.exam && (
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs ${
                                darkMode
                                  ? "bg-slate-800 text-slate-300"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              📝 {item.exam}
                            </span>
                          )}

                          {item.status && (
                            <span
                              className={`rounded-full px-3 py-1.5 text-xs ${
                                darkMode
                                  ? "bg-cyan-400/10 text-cyan-300"
                                  : "bg-cyan-50 text-cyan-700"
                              }`}
                            >
                              {item.status}
                            </span>
                          )}
                        </div>

                        {/* Description */}

                        {item.description && (
                          <p
                            className={`mt-5 max-w-4xl text-sm leading-7 ${
                              darkMode
                                ? "text-slate-400"
                                : "text-slate-600"
                            }`}
                          >
                            {item.description}
                          </p>
                        )}

                        {/* Requirements */}

                        {item.requirements &&
                          item.requirements.length >
                            0 && (
                            <div className="mt-5">
                              <p className="mb-3 text-xs font-semibold text-slate-500">
                                Requirements
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {item.requirements.map(
                                  (requirement) => (
                                    <span
                                      key={
                                        requirement
                                      }
                                      className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                                        darkMode
                                          ? "bg-cyan-400/10 text-cyan-300"
                                          : "bg-cyan-50 text-cyan-700"
                                      }`}
                                    >
                                      {requirement}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Important Dates */}

                        {item.important_dates &&
                          Object.keys(
                            item.important_dates
                          ).length > 0 && (
                            <div className="mt-6">
                              <p className="mb-3 text-xs font-semibold text-slate-500">
                                Important dates
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {Object.entries(
                                  item.important_dates
                                ).map(
                                  ([key, value]) => (
                                    <span
                                      key={key}
                                      className={`rounded-xl px-3 py-2 text-xs ${
                                        darkMode
                                          ? "bg-slate-800 text-slate-300"
                                          : "bg-slate-100 text-slate-700"
                                      }`}
                                    >
                                      <span className="font-semibold">
                                        {key}:
                                      </span>{" "}
                                      {value}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Actions */}

                      <div className="flex shrink-0 flex-col gap-3 lg:w-40">
                        {item.official_url ? (
                          <motion.a
                            href={
                              item.official_url
                            }
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
                            Official Site →
                          </motion.a>
                        ) : (
                          <div
                            className={`rounded-xl border px-5 py-3 text-center text-sm ${
                              darkMode
                                ? "border-slate-800 text-slate-500"
                                : "border-slate-200 text-slate-400"
                            }`}
                          >
                            No link available
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                )
              )}

              {/* Empty */}

              {filteredOpportunities.length ===
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
                    location filter.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* =========================
              PREPARATION SECTION
          ========================== */}

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
                  Nexora preparation
                </p>

                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  Prepare for the opportunity, not
                  just the application.
                </h2>

                <p
                  className={`mt-4 max-w-2xl text-sm leading-7 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  Nexora can compare your profile with
                  an opportunity, identify preparation
                  areas, and create a personalized
                  learning roadmap.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Eligibility",
                    "Exam Pattern",
                    "Syllabus",
                    "Skill Gap",
                    "Preparation Plan",
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

          {/* =========================
              PROFILE CTA
          ========================== */}

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
                  Want a more personalized match?
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#07111f]/70">
                  Update your profile so Nexora can
                  understand your education, skills,
                  interests, and career goals.
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
              <p>© 2026 Agent Nexora</p>

              <p>Navigate Your Next.</p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}