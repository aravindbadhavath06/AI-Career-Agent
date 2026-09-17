"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, Resource } from "@/lib/api";

type ResourceType =
  | "Courses"
  | "Tutorials"
  | "Documentation"
  | "Practice"
  | "Projects";

const categories: ResourceType[] = [
  "Courses",
  "Tutorials",
  "Documentation",
  "Practice",
  "Projects",
];

export default function ResourcesPage() {
  const [darkMode, setDarkMode] = useState(true);

  const [resources, setResources] = useState<Resource[]>([]);

  const [search, setSearch] = useState("");

  const [activeCategory, setActiveCategory] =
    useState<"All" | ResourceType>("All");

  const [activeSkill, setActiveSkill] =
    useState("All");

  const [saved, setSaved] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =================================================
     LOAD THEME + RESOURCES
  ================================================== */

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("nexora-theme");

    setDarkMode(savedTheme !== "light");

    const storedSaved =
      localStorage.getItem("nexora-resources");

    if (storedSaved) {
      try {
        const parsed = JSON.parse(storedSaved);

        if (Array.isArray(parsed)) {
          setSaved(
            parsed.map((item) => String(item))
          );
        }
      } catch {
        setSaved([]);
      }
    }

    const loadResources = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.getResources();

        setResources(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Failed to load resources:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load learning resources."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  /* =================================================
     THEME
  ================================================== */

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "nexora-theme",
      newMode ? "dark" : "light"
    );
  };

  /* =================================================
     SAVE RESOURCE
     Local UI preference only.
     Resource data remains backend data.
  ================================================== */

  const toggleSave = (id: string | number) => {
    const resourceId = String(id);

    const updated = saved.includes(resourceId)
      ? saved.filter(
          (item) => item !== resourceId
        )
      : [...saved, resourceId];

    setSaved(updated);

    localStorage.setItem(
      "nexora-resources",
      JSON.stringify(updated)
    );
  };

  /* =================================================
     FILTER RESOURCES
  ================================================== */

  const filteredResources = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        !searchText ||
        resource.title
          .toLowerCase()
          .includes(searchText) ||
        resource.platform
          .toLowerCase()
          .includes(searchText) ||
        resource.skill
          .toLowerCase()
          .includes(searchText) ||
        resource.description
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        activeCategory === "All" ||
        resource.type === activeCategory;

      const matchesSkill =
        activeSkill === "All" ||
        resource.skill === activeSkill;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSkill
      );
    });
  }, [
    resources,
    search,
    activeCategory,
    activeSkill,
  ]);

  /* =================================================
     DYNAMIC SKILLS
  ================================================== */

  const skills = useMemo(() => {
    const uniqueSkills = Array.from(
      new Set(
        resources
          .map((resource) => resource.skill)
          .filter(Boolean)
      )
    );

    return ["All", ...uniqueSkills];
  }, [resources]);

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
            Loading learning resources...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-[#050b14] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* =================================================
          BACKGROUND
      ================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-3xl ${
            darkMode
              ? "bg-cyan-500/10"
              : "bg-cyan-400/10"
          }`}
        />
      </div>

      {/* =================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen w-64 border-r lg:block ${
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
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-[#06101d] shadow-lg shadow-cyan-500/20"
            >
              NX
            </motion.div>

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

          <div
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-widest ${
              darkMode
                ? "text-slate-600"
                : "text-slate-400"
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
              icon="△"
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
              icon="◷"
              label="Progress"
              darkMode={darkMode}
            />

            {/* ACTIVE */}
            <div className="flex items-center gap-3 rounded-xl bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-300">
              <span className="w-5 text-center">
                ▣
              </span>

              Resources

              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </div>

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
              icon="◌"
              label="Voice Assistant"
              darkMode={darkMode}
            />

          </nav>

          <div className="mt-auto space-y-1">

            <SidebarItem
              href="/settings"
              icon="⚙"
              label="Settings"
              darkMode={darkMode}
            />

            <SidebarItem
              href="/login"
              icon="↪"
              label="Sign out"
              darkMode={darkMode}
            />

          </div>
        </div>
      </aside>

      {/* =================================================
          MAIN
      ================================================== */}

      <div className="relative z-10 lg:pl-64">

        {/* HEADER */}
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
              Learning Resources
            </h1>
          </div>

          <div className="flex items-center gap-3">

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              🔔
            </button>

            {/* Theme */}
            <button
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

            {/* User */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-[#06101d]">
              M
            </div>

          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================== */}

        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">

          {/* BACK */}
          <Link
            href="/skill-gap"
            className={`mb-7 inline-flex items-center gap-2 text-sm ${
              darkMode
                ? "text-slate-400 hover:text-cyan-400"
                : "text-slate-500 hover:text-cyan-600"
            }`}
          >
            ← Back to Skill Gap
          </Link>

          {/* HERO */}
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
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

              <div>
                <p className="mb-2 text-sm font-medium text-cyan-400">
                  ✦ AI-Curated Learning
                </p>

                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Learn what moves you forward.
                </h2>

                <p
                  className={`mt-3 max-w-2xl leading-7 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Explore learning resources available through
                  your Nexora career workspace.
                </p>
              </div>

              <div
                className={`rounded-2xl border px-5 py-4 ${
                  darkMode
                    ? "border-cyan-400/15 bg-cyan-400/[0.04]"
                    : "border-cyan-200 bg-cyan-50"
                }`}
              >
                <p className="text-xs text-slate-500">
                  SAVED RESOURCES
                </p>

                <p className="mt-1 text-2xl font-black text-cyan-400">
                  {saved.length}
                </p>
              </div>

            </div>
          </motion.div>

          {/* =================================================
              BACKEND RESOURCE INFORMATION
          ================================================== */}

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
            className={`mb-8 rounded-3xl border p-6 lg:p-8 ${
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
                  Nexora Learning Resources
                </p>

                <h3 className="mt-1 text-xl font-bold">
                  Resources for your career journey.
                </h3>

                <p
                  className={`mt-2 text-sm leading-6 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Resources shown below are loaded from the
                  Nexora backend and can be filtered by skill,
                  resource type, and search.
                </p>

              </div>

              <Link
                href="/roadmap"
                className="shrink-0 rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-[#06101d] transition hover:bg-cyan-300"
              >
                Open Roadmap →
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

          {/* =================================================
              SEARCH
          ================================================== */}

          <div
            className={`rounded-2xl border p-4 ${
              darkMode
                ? "border-white/10 bg-white/[0.035]"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                ⌕
              </span>

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search courses, tutorials, skills..."
                className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition ${
                  darkMode
                    ? "border-white/10 bg-white/5 text-white placeholder:text-slate-600 focus:border-cyan-400/40"
                    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-cyan-300"
                }`}
              />

            </div>
          </div>

          {/* =================================================
              CATEGORY FILTERS
          ================================================== */}

          <div className="mt-6">

            <p
              className={`mb-3 text-xs font-semibold uppercase tracking-wider ${
                darkMode
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              Resource Type
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2">

              <FilterButton
                active={activeCategory === "All"}
                onClick={() =>
                  setActiveCategory("All")
                }
                darkMode={darkMode}
              >
                All
              </FilterButton>

              {categories.map((category) => (
                <FilterButton
                  key={category}
                  active={
                    activeCategory === category
                  }
                  onClick={() =>
                    setActiveCategory(category)
                  }
                  darkMode={darkMode}
                >
                  {category}
                </FilterButton>
              ))}

            </div>
          </div>

          {/* =================================================
              SKILL FILTERS
          ================================================== */}

          <div className="mt-4">

            <p
              className={`mb-3 text-xs font-semibold uppercase tracking-wider ${
                darkMode
                  ? "text-slate-500"
                  : "text-slate-400"
              }`}
            >
              Skill
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2">

              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() =>
                    setActiveSkill(skill)
                  }
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition ${
                    activeSkill === skill
                      ? "border-cyan-400 bg-cyan-400 text-[#06101d]"
                      : darkMode
                        ? "border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400/30 hover:text-white"
                        : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300 hover:text-slate-900"
                  }`}
                >
                  {skill}
                </button>
              ))}

            </div>
          </div>

          {/* =================================================
              RESULT COUNT
          ================================================== */}

          <div className="mb-5 mt-8 flex items-center justify-between">

            <div>
              <h3 className="text-xl font-bold">
                Available resources
              </h3>

              <p
                className={`mt-1 text-sm ${
                  darkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                {filteredResources.length} resources found
              </p>
            </div>

            <span className="hidden text-sm text-cyan-400 sm:block">
              From Nexora backend
            </span>

          </div>

          {/* =================================================
              RESOURCE CARDS
          ================================================== */}

          {filteredResources.length > 0 ? (

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredResources.map(
                (resource, index) => {

                  const resourceId =
                    String(resource.id);

                  const isSaved =
                    saved.includes(resourceId);

                  return (
                    <motion.article
                      key={resourceId}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: Math.min(
                          index * 0.05,
                          0.3
                        ),
                      }}
                      className={`group flex flex-col rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.035] hover:border-cyan-400/20"
                          : "border-slate-200 bg-white hover:border-cyan-200"
                      }`}
                    >

                      {/* TOP */}
                      <div className="flex items-start justify-between gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-lg">
                          {getResourceIcon(
                            resource.type
                          )}
                        </div>

                        <button
                          onClick={() =>
                            toggleSave(
                              resource.id
                            )
                          }
                          className={`rounded-lg border px-3 py-2 text-xs transition ${
                            isSaved
                              ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-400"
                              : darkMode
                                ? "border-white/10 bg-white/5 text-slate-500 hover:text-white"
                                : "border-slate-200 bg-slate-50 text-slate-400 hover:text-slate-700"
                          }`}
                        >
                          {isSaved
                            ? "✓ Saved"
                            : "♡ Save"}
                        </button>

                      </div>

                      {/* TYPE */}
                      <div className="mt-5 flex flex-wrap gap-2">

                        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          {resource.type}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            darkMode
                              ? "bg-white/5 text-slate-400"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {resource.skill}
                        </span>

                      </div>

                      {/* CONTENT */}
                      <h4 className="mt-4 text-lg font-bold leading-6">
                        {resource.title}
                      </h4>

                      <p
                        className={`mt-1 text-xs font-medium ${
                          darkMode
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        {resource.platform}
                      </p>

                      <p
                        className={`mt-4 text-sm leading-6 ${
                          darkMode
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        {resource.description}
                      </p>

                      {/* META */}
                      <div
                        className={`mt-5 grid grid-cols-3 gap-2 border-y py-4 ${
                          darkMode
                            ? "border-white/5"
                            : "border-slate-100"
                        }`}
                      >

                        <div>
                          <p className="text-[10px] uppercase text-slate-500">
                            Level
                          </p>

                          <p className="mt-1 text-xs font-semibold">
                            {resource.level ||
                              "Not specified"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase text-slate-500">
                            Duration
                          </p>

                          <p className="mt-1 text-xs font-semibold">
                            {resource.duration ||
                              "Self-paced"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase text-slate-500">
                            Access
                          </p>

                          <p className="mt-1 text-xs font-semibold text-cyan-400">
                            {resource.access ||
                              "Not specified"}
                          </p>
                        </div>

                      </div>

                      {/* BUTTON */}
                      {resource.url ? (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 w-full rounded-xl bg-cyan-400 px-4 py-3 text-center text-sm font-bold text-[#06101d] transition hover:bg-cyan-300"
                        >
                          View Resource →
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="mt-5 w-full cursor-not-allowed rounded-xl bg-slate-500/20 px-4 py-3 text-sm font-bold text-slate-500"
                        >
                          Resource Link Unavailable
                        </button>
                      )}

                    </motion.article>
                  );
                }
              )}

            </div>

          ) : (

            <div
              className={`rounded-3xl border p-12 text-center ${
                darkMode
                  ? "border-white/10 bg-white/[0.035]"
                  : "border-slate-200 bg-white"
              }`}
            >

              <div className="text-4xl">
                ⌕
              </div>

              <h3 className="mt-4 text-xl font-bold">
                No resources found
              </h3>

              <p
                className={`mt-2 text-sm ${
                  darkMode
                    ? "text-slate-500"
                    : "text-slate-400"
                }`}
              >
                Try changing your search or filters.
              </p>

              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                  setActiveSkill("All");
                }}
                className="mt-5 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#06101d]"
              >
                Clear Filters
              </button>

            </div>

          )}

          {/* =================================================
              ROADMAP LINK
          ================================================== */}

          <motion.section
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            className={`mt-10 rounded-3xl border p-6 lg:p-8 ${
              darkMode
                ? "border-white/10 bg-white/[0.035]"
                : "border-slate-200 bg-white"
            }`}
          >

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Personalized Learning
                </p>

                <h3 className="mt-1 text-2xl font-bold">
                  Continue with your roadmap.
                </h3>

                <p
                  className={`mt-2 max-w-2xl text-sm leading-6 ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Use the resources available here alongside
                  your Nexora learning roadmap.
                </p>
              </div>

              <Link
                href="/roadmap"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-[#06101d] transition hover:bg-cyan-300"
              >
                Open Full Roadmap →
              </Link>

            </div>

          </motion.section>

          {/* FOOTER */}
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

/* =================================================
   SIDEBAR ITEM
================================================= */

function SidebarItem({
  href,
  icon,
  label,
  darkMode,
}: {
  href: string;
  icon: string;
  label: string;
  darkMode: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        darkMode
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

/* =================================================
   FILTER BUTTON
================================================= */

function FilterButton({
  children,
  active,
  onClick,
  darkMode,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  darkMode: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition ${
        active
          ? "border-cyan-400 bg-cyan-400 text-[#06101d]"
          : darkMode
            ? "border-white/10 bg-white/5 text-slate-400 hover:border-cyan-400/30 hover:text-white"
            : "border-slate-200 bg-white text-slate-500 hover:border-cyan-300 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

/* =================================================
   RESOURCE ICON
================================================= */

function getResourceIcon(type: string) {
  switch (type) {
    case "Courses":
      return "🎓";

    case "Tutorials":
      return "▶";

    case "Documentation":
      return "▤";

    case "Practice":
      return "⌘";

    case "Projects":
      return "⚡";

    default:
      return "✦";
  }
}