"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const opportunities = [
  {
    icon: "💼",
    type: "PRIVATE JOBS",
    title: "Private Jobs",
    href: "/opportunities/private",
    description:
      "Discover private-sector roles that match your education, skills, interests, and career goals.",
    features: [
      "Current job opportunities",
      "Skill and requirement matching",
      "Experience requirements",
      "Application information",
    ],
  },
  {
    icon: "🏛️",
    type: "GOVERNMENT JOBS",
    title: "Government Jobs",
    href: "/opportunities/government",
    description:
      "Explore government recruitment opportunities, eligibility requirements, exams, and preparation paths.",
    features: [
      "Recruitment opportunities",
      "Eligibility information",
      "Important dates",
      "Exam and preparation details",
    ],
  },
  {
    icon: "🎓",
    type: "INTERNSHIPS",
    title: "Internships",
    href: "/opportunities/internships",
    description:
      "Find internships that align with your education, current skills, interests, and career direction.",
    features: [
      "Student-friendly opportunities",
      "Remote and on-site options",
      "Eligibility requirements",
      "Skill matching",
    ],
  },
];

export default function OpportunitiesPage() {
  const [darkMode, setDarkMode] = useState(true);

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

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#07111f] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* =========================
          FIXED SIDEBAR
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

            <p
              className={`text-[11px] ${
                darkMode
                  ? "text-slate-500"
                  : "text-slate-500"
              }`}
            >
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
            {[
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
                icon: "◫",
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
            ].map((item) => {
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
          MAIN CONTENT
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
            <p
              className={`text-sm ${
                darkMode
                  ? "text-slate-500"
                  : "text-slate-500"
              }`}
            >
              Explore opportunities
            </p>
          </div>

          <div className="flex items-center gap-3">

            {/* Notification */}
            <button
              aria-label="Notifications"
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                darkMode
                  ? "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <motion.span
                key={darkMode ? "moon" : "sun"}
                initial={{
                  opacity: 0,
                  rotate: -90,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  rotate: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 0.25,
                }}
              >
                {darkMode ? "🌙" : "☀️"}
              </motion.span>
            </motion.button>

            {/* Student */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                  Student
                </p>

                <p
                  className={`text-xs ${
                    darkMode
                      ? "text-slate-500"
                      : "text-slate-500"
                  }`}
                >
                  B.Tech • AI
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 font-bold text-cyan-400">
                S
              </div>
            </div>
          </div>
        </header>

        {/* =========================
            PAGE CONTENT
        ========================== */}
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">

          {/* Back */}
          <motion.a
            href="/dashboard"
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className={`inline-flex items-center gap-2 text-sm font-semibold transition ${
              darkMode
                ? "text-slate-400 hover:text-white"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            ← Back to Dashboard
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
            className="mt-8 max-w-4xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Explore opportunities
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              One agent.
              <br />
              <span className="text-cyan-400">
                Multiple opportunities.
              </span>
            </h1>

            <p
              className={`mt-6 max-w-3xl text-base leading-8 sm:text-lg ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-600"
              }`}
            >
              Agent Nexora helps you explore different paths based on your
              profile, skills, interests, experience, and career goals.
            </p>
          </motion.section>

          {/* Opportunity Cards */}
          <section className="mt-12 grid gap-5 lg:grid-cols-3">
            {opportunities.map((opportunity, index) => (
              <motion.a
                key={opportunity.title}
                href={opportunity.href}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.15 + index * 0.12,
                  duration: 0.6,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.015,
                }}
                className={`group relative overflow-hidden rounded-3xl border p-7 transition-all duration-300 ${
                  darkMode
                    ? "border-slate-800 bg-slate-900/50 hover:border-cyan-400/40 hover:bg-slate-900"
                    : "border-slate-200 bg-white hover:border-cyan-400/50 hover:shadow-xl"
                }`}
              >
                {/* Glow */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-cyan-400/5 blur-3xl transition group-hover:bg-cyan-400/10" />

                <div className="relative">

                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${
                        darkMode
                          ? "bg-[#07111f]"
                          : "bg-slate-50"
                      }`}
                    >
                      {opportunity.icon}
                    </div>

                    <span className="text-lg text-slate-500 transition group-hover:text-cyan-400">
                      →
                    </span>
                  </div>

                  <p className="mt-7 text-[10px] font-bold tracking-[0.2em] text-cyan-400">
                    {opportunity.type}
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    {opportunity.title}
                  </h2>

                  <p
                    className={`mt-4 text-sm leading-7 ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-600"
                    }`}
                  >
                    {opportunity.description}
                  </p>

                  <div
                    className={`mt-7 border-t pt-6 ${
                      darkMode
                        ? "border-slate-800"
                        : "border-slate-200"
                    }`}
                  >
                    <p
                      className={`mb-3 text-xs font-semibold ${
                        darkMode
                          ? "text-slate-500"
                          : "text-slate-500"
                      }`}
                    >
                      Nexora can help you with
                    </p>

                    <div className="space-y-3">
                      {opportunity.features.map(
                        (feature) => (
                          <div
                            key={feature}
                            className="flex items-center gap-3"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-xs text-cyan-400">
                              ✓
                            </span>

                            <span
                              className={`text-sm ${
                                darkMode
                                  ? "text-slate-300"
                                  : "text-slate-700"
                              }`}
                            >
                              {feature}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="mt-7 flex items-center justify-between">
                    <span className="text-sm font-bold text-cyan-400">
                      Explore with Nexora
                    </span>

                    <span className="text-cyan-400 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>

                </div>
              </motion.a>
            ))}
          </section>

          {/* AI Matching Section */}
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
            className={`mt-12 overflow-hidden rounded-3xl border p-8 lg:p-10 ${
              darkMode
                ? "border-slate-800 bg-slate-900/50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Intelligent matching
                </p>

                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  Let Nexora find opportunities that fit you.
                </h2>

                <p
                  className={`mt-4 max-w-2xl text-sm leading-7 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                >
                  Your education, skills, interests, experience, and career
                  goals can be used to understand which opportunities are
                  relevant to your profile.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    "Your Profile",
                    "Your Skills",
                    "Your Goals",
                    "Opportunity Requirements",
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