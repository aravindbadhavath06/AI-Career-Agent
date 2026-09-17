"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, AnalysisResult, GovernmentOpportunity, Internship, Job, ProfileData, RoadmapWeek, SkillGap } from "@/lib/api";

type OpportunityCard = {
  type: string;
  icon: string;
  title: string;
  company: string;
  location: string;
  match?: number;
  href: string;
};

export default function ResultsPage() {
  const [darkMode, setDarkMode] = useState(true);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapWeek[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityCard[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("nexora-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Get the user's real profile first.
       * Analysis depends on the profile.
       */
      const profileData = await api.getProfile();

      setProfile(profileData);

      /*
       * Fetch all remaining backend data.
       */
      const [
        analysisData,
        skillGapData,
        roadmapData,
        privateJobs,
        governmentJobs,
        internships,
      ] = await Promise.all([
        api.analyzeProfile(profileData),
        api.getSkillGap(),
        api.getRoadmap(),
        api.getPrivateJobs(),
        api.getGovernmentJobs(),
        api.getInternships(),
      ]);

      setAnalysis(analysisData);
      setSkillGaps(skillGapData.skills || []);
      setRoadmap(roadmapData.roadmap || []);

      /*
       * Convert the three backend opportunity types
       * into one display format.
       *
       * No fake records are created here.
       */
      const privateOpportunityCards: OpportunityCard[] = privateJobs.map(
        (job: Job) => ({
          type: "Private Jobs",
          icon: "💼",
          title: job.title,
          company: job.company,
          location: job.location,
          match: job.match,
          href: "/opportunities/private",
        })
      );

      const governmentOpportunityCards: OpportunityCard[] =
        governmentJobs.map((job: GovernmentOpportunity) => ({
          type: "Government Jobs",
          icon: "🏛️",
          title: job.post,
          company: job.organization,
          location: job.location,
          match: job.match,
          href: "/opportunities/government",
        }));

      const internshipOpportunityCards: OpportunityCard[] =
        internships.map((internship: Internship) => ({
          type: "Internships",
          icon: "🎓",
          title: internship.role,
          company: internship.company,
          location: internship.location,
          match: internship.match,
          href: "/opportunities/internships",
        }));

      /*
       * Take available backend opportunities.
       * We do not create fallback/mock opportunities.
       */
      const allOpportunities = [
        ...privateOpportunityCards,
        ...governmentOpportunityCards,
        ...internshipOpportunityCards,
      ];

      /*
       * If backend provides match values, show higher-match
       * opportunities first. Otherwise preserve backend order.
       */
      const sortedOpportunities = [...allOpportunities].sort((a, b) => {
        if (a.match === undefined && b.match === undefined) return 0;
        if (a.match === undefined) return 1;
        if (b.match === undefined) return -1;
        return b.match - a.match;
      });

      setOpportunities(sortedOpportunities.slice(0, 3));
    } catch (err) {
      console.error("Failed to load Nexora results:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load your Nexora results.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    const newMode = !darkMode;

    setDarkMode(newMode);

    localStorage.setItem(
      "nexora-theme",
      newMode ? "dark" : "light"
    );
  };

  /*
   * Analysis score comes directly from the backend.
   * No hardcoded 88% or other fake percentage.
   */
  const analysisScore =
    typeof analysis?.score === "number"
      ? Math.max(0, Math.min(100, analysis.score))
      : null;

  /*
   * Calculate the SVG circumference dynamically.
   */
  const radius = 68;
  const circumference = 2 * Math.PI * radius;

  const scoreOffset =
    analysisScore !== null
      ? circumference - (analysisScore / 100) * circumference
      : circumference;

  /*
   * Use backend strengths.
   *
   * The AnalysisResult API currently gives skill names but
   * does not provide individual strength percentages.
   *
   * Therefore we do NOT invent percentages.
   */
  const strengths = analysis?.strengths || [];

  /*
   * Missing skills can come directly from analysis.
   * Skill-gap API provides richer status information, so use it
   * when available.
   */
  const displayedSkillGaps = skillGaps.filter(
    (skill) =>
      skill.status === "missing" ||
      skill.status === "partial"
  );

  /*
   * Career title:
   *
   * The current AnalysisResult type does not contain a
   * dedicated career field. Therefore we do not invent
   * "Data Scientist" or another career title.
   */
  const suggestedDirection =
    analysis?.suggestions?.[0] ||
    analysis?.keywords?.[0] ||
    "Review your AI analysis for your recommended career direction.";

  return (
    <main
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-[#050b14] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className={`absolute -right-40 top-20 h-[450px] w-[450px] rounded-full blur-3xl ${
            darkMode
              ? "bg-cyan-500/10"
              : "bg-cyan-400/10"
          }`}
        />
      </div>

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
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
            active
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

      {/* =====================================================
          MAIN
      ====================================================== */}
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
              AI Career Analysis
            </p>

            <h1 className="text-lg font-bold">
              Your Nexora Results
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
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-white/10 bg-white/5 hover:bg-white/10"
                  : "border-slate-200 bg-white hover:bg-slate-100"
              }`}
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-[#06101d]">
              {profile?.name
                ? profile.name.charAt(0).toUpperCase()
                : "U"}
            </div>
          </div>
        </header>

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          {/* Back */}
          <Link
            href="/dashboard"
            className={`mb-7 inline-flex items-center gap-2 text-sm ${
              darkMode
                ? "text-slate-400 hover:text-cyan-400"
                : "text-slate-500 hover:text-cyan-600"
            }`}
          >
            ← Back to Dashboard
          </Link>

          {/* Error */}
          {error && (
            <div
              className={`mb-6 rounded-2xl border p-5 ${
                darkMode
                  ? "border-red-400/20 bg-red-400/5 text-red-300"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <p className="font-semibold">
                Unable to load results
              </p>

              <p className="mt-1 text-sm opacity-80">
                {error}
              </p>

              <button
                onClick={loadResults}
                className="mt-4 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-[#06101d]"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <LoadingState darkMode={darkMode} />
          ) : (
            <>
              {/* =================================================
                  HERO
              ================================================== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                  <div>
                    <p className="mb-2 text-sm font-medium text-cyan-400">
                      ✦ Analysis Complete
                    </p>

                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                      Here&apos;s what Nexora found.
                    </h2>

                    <p
                      className={`mt-3 max-w-2xl ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Your results are based on the profile and
                      analysis returned by the Nexora backend.
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                      darkMode
                        ? "border-white/10 bg-white/5 hover:bg-white/10"
                        : "border-slate-200 bg-white hover:bg-slate-100"
                    }`}
                  >
                    Edit Profile
                  </Link>
                </div>
              </motion.div>

              {/* =================================================
                  ANALYSIS SCORE
              ================================================== */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`mb-8 grid gap-6 rounded-3xl border p-6 md:grid-cols-[1fr_220px] md:p-8 ${
                  darkMode
                    ? "border-white/10 bg-white/[0.035]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      darkMode
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "bg-cyan-50 text-cyan-700"
                    }`}
                  >
                    AI Analysis
                  </span>

                  <h3 className="mt-4 text-3xl font-black">
                    {profile?.career_goal ||
                      "Career Analysis"}
                  </h3>

                  <p
                    className={`mt-3 max-w-2xl leading-7 ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    {suggestedDirection}
                  </p>

                  {/* Backend skills */}
                  {analysis?.skills &&
                    analysis.skills.length > 0 && (
                      <div className="mt-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                          Identified Skills
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {analysis.skills.map(
                            (skill) => (
                              <span
                                key={skill}
                                className={`rounded-lg border px-3 py-2 text-xs ${
                                  darkMode
                                    ? "border-white/10 bg-white/5 text-slate-300"
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

                  {/* Suggestions */}
                  {analysis?.suggestions &&
                    analysis.suggestions.length > 0 && (
                      <div className="mt-6">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                          Nexora Suggestions
                        </p>

                        <div className="space-y-2">
                          {analysis.suggestions
                            .slice(0, 3)
                            .map(
                              (
                                suggestion,
                                index
                              ) => (
                                <div
                                  key={`${suggestion}-${index}`}
                                  className={`rounded-xl border p-3 text-sm ${
                                    darkMode
                                      ? "border-white/5 bg-white/[0.02] text-slate-300"
                                      : "border-slate-100 bg-slate-50 text-slate-600"
                                  }`}
                                >
                                  {suggestion}
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Match / analysis score */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center">
                    <svg
                      className="-rotate-90"
                      width="160"
                      height="160"
                      viewBox="0 0 160 160"
                    >
                      <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className={
                          darkMode
                            ? "text-white/10"
                            : "text-slate-200"
                        }
                      />

                      {analysisScore !== null && (
                        <motion.circle
                          cx="80"
                          cy="80"
                          r={radius}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={{
                            strokeDashoffset:
                              circumference,
                          }}
                          animate={{
                            strokeDashoffset:
                              scoreOffset,
                          }}
                          transition={{
                            duration: 1.4,
                            delay: 0.4,
                          }}
                          className="text-cyan-400"
                        />
                      )}
                    </svg>

                    <div className="absolute text-center">
                      <p className="text-4xl font-black">
                        {analysisScore !== null
                          ? `${analysisScore}%`
                          : "—"}
                      </p>

                      <p
                        className={`text-xs ${
                          darkMode
                            ? "text-slate-500"
                            : "text-slate-400"
                        }`}
                      >
                        Analysis Score
                      </p>
                    </div>
                  </div>

                  {analysisScore !== null && (
                    <p className="mt-2 text-sm font-semibold text-cyan-400">
                      Based on your profile
                    </p>
                  )}
                </div>
              </motion.div>

              {/* =================================================
                  STRENGTHS + SKILL GAPS
              ================================================== */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Strengths */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{ delay: 0.2 }}
                  className={`rounded-3xl border p-6 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.035]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-cyan-400">
                        PROFILE STRENGTHS
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        Skills you already have
                      </h3>
                    </div>

                    <span className="text-2xl">
                      ✓
                    </span>
                  </div>

                  <div className="mt-7 space-y-4">
                    {strengths.length > 0 ? (
                      strengths.map(
                        (skill) => (
                          <div
                            key={skill}
                            className={`flex items-center gap-3 rounded-2xl border p-4 ${
                              darkMode
                                ? "border-white/5 bg-white/[0.02]"
                                : "border-slate-100 bg-slate-50"
                            }`}
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                              ✓
                            </span>

                            <span className="text-sm font-semibold">
                              {skill}
                            </span>
                          </div>
                        )
                      )
                    ) : (
                      <EmptyState
                        message="No strengths were returned by the AI analysis."
                        darkMode={darkMode}
                      />
                    )}
                  </div>
                </motion.div>

                {/* Skill gaps */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{ delay: 0.3 }}
                  className={`rounded-3xl border p-6 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.035]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-cyan-400">
                        SKILL GAP
                      </p>

                      <h3 className="mt-1 text-xl font-bold">
                        Skills to develop
                      </h3>
                    </div>

                    <Link
                      href="/skill-gap"
                      className="text-sm font-semibold text-cyan-400 hover:underline"
                    >
                      View all →
                    </Link>
                  </div>

                  <div className="mt-6 space-y-3">
                    {displayedSkillGaps.length >
                    0 ? (
                      displayedSkillGaps
                        .slice(0, 5)
                        .map((skill) => {
                          const isPartial =
                            skill.status ===
                            "partial";

                          return (
                            <div
                              key={skill.name}
                              className={`flex items-center justify-between rounded-2xl border p-4 ${
                                darkMode
                                  ? "border-white/5 bg-white/[0.02]"
                                  : "border-slate-100 bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm ${
                                    isPartial
                                      ? "bg-amber-400/10 text-amber-400"
                                      : "bg-red-400/10 text-red-400"
                                  }`}
                                >
                                  {isPartial
                                    ? "!"
                                    : "×"}
                                </span>

                                <div>
                                  <span className="text-sm font-semibold">
                                    {skill.name}
                                  </span>

                                  {skill.category && (
                                    <p
                                      className={`mt-0.5 text-xs ${
                                        darkMode
                                          ? "text-slate-600"
                                          : "text-slate-400"
                                      }`}
                                    >
                                      {skill.category}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <span
                                className={`text-xs ${
                                  isPartial
                                    ? "text-amber-400"
                                    : "text-red-400"
                                }`}
                              >
                                {isPartial
                                  ? "Needs Improvement"
                                  : "Missing"}
                              </span>
                            </div>
                          );
                        })
                    ) : (
                      <EmptyState
                        message="No skill gaps were returned by the backend."
                        darkMode={darkMode}
                      />
                    )}
                  </div>
                </motion.div>
              </div>

              {/* =================================================
                  OPPORTUNITIES
              ================================================== */}
              <motion.section
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-medium text-cyan-400">
                      OPPORTUNITIES
                    </p>

                    <h3 className="mt-1 text-2xl font-bold">
                      Available opportunities
                    </h3>
                  </div>

                  <Link
                    href="/opportunities"
                    className="text-sm font-semibold text-cyan-400 hover:underline"
                  >
                    Explore all →
                  </Link>
                </div>

                {opportunities.length > 0 ? (
                  <div className="grid gap-5 md:grid-cols-3">
                    {opportunities.map(
                      (item, index) => (
                        <Link
                          href={item.href}
                          key={`${item.type}-${item.title}-${index}`}
                          className={`group rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${
                            darkMode
                              ? "border-white/10 bg-white/[0.035] hover:border-cyan-400/20"
                              : "border-slate-200 bg-white hover:border-cyan-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-2xl">
                              {item.icon}
                            </span>

                            {item.match !==
                              undefined && (
                              <span className="rounded-lg bg-cyan-400/10 px-2.5 py-1 text-xs font-bold text-cyan-400">
                                {item.match}%
                              </span>
                            )}
                          </div>

                          <p
                            className={`mt-5 text-xs ${
                              darkMode
                                ? "text-slate-500"
                                : "text-slate-400"
                            }`}
                          >
                            {item.type}
                          </p>

                          <h4 className="mt-1 text-lg font-bold">
                            {item.title}
                          </h4>

                          <p
                            className={`mt-2 text-sm ${
                              darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            {item.company}
                          </p>

                          <div
                            className={`mt-4 border-t pt-4 text-xs ${
                              darkMode
                                ? "border-white/5 text-slate-500"
                                : "border-slate-100 text-slate-400"
                            }`}
                          >
                            {item.location}
                          </div>
                        </Link>
                      )
                    )}
                  </div>
                ) : (
                  <div
                    className={`rounded-2xl border p-8 text-center ${
                      darkMode
                        ? "border-white/10 bg-white/[0.035]"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p className="text-lg font-semibold">
                      No opportunities available
                    </p>

                    <p
                      className={`mt-2 text-sm ${
                        darkMode
                          ? "text-slate-500"
                          : "text-slate-400"
                      }`}
                    >
                      The backend did not return any
                      opportunities yet.
                    </p>
                  </div>
                )}
              </motion.section>

              {/* =================================================
                  ROADMAP
              ================================================== */}
              <motion.section
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
                    ? "border-white/10 bg-white/[0.035]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-xs font-medium text-cyan-400">
                      PERSONALIZED ROADMAP
                    </p>

                    <h3 className="mt-1 text-2xl font-bold">
                      Your learning roadmap
                    </h3>

                    <p
                      className={`mt-2 text-sm ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Your roadmap is loaded directly from
                      the Nexora backend.
                    </p>
                  </div>

                  <Link
                    href="/roadmap"
                    className="text-sm font-semibold text-cyan-400 hover:underline"
                  >
                    Open roadmap →
                  </Link>
                </div>

                {roadmap.length > 0 ? (
                  <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {roadmap
                      .slice(0, 4)
                      .map(
                        (item, index) => {
                          const completedTasks =
                            item.tasks.filter(
                              (task) =>
                                task.completed
                            ).length;

                          const totalTasks =
                            item.tasks.length;

                          return (
                            <div
                              key={item.id}
                              className={`relative rounded-2xl border p-5 ${
                                darkMode
                                  ? "border-white/5 bg-white/[0.02]"
                                  : "border-slate-100 bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-cyan-400">
                                  Week {item.week}
                                </span>

                                {index === 0 &&
                                  completedTasks <
                                    totalTasks && (
                                    <span className="rounded-full bg-cyan-400 px-2 py-1 text-[9px] font-bold text-[#06101d]">
                                      START
                                    </span>
                                  )}
                              </div>

                              <h4 className="mt-4 font-bold">
                                {item.title}
                              </h4>

                              {item.description && (
                                <p
                                  className={`mt-2 text-xs leading-5 ${
                                    darkMode
                                      ? "text-slate-500"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {item.description}
                                </p>
                              )}

                              <div className="mt-5">
                                <div className="mb-2 flex justify-between text-[10px]">
                                  <span
                                    className={
                                      darkMode
                                        ? "text-slate-600"
                                        : "text-slate-400"
                                    }
                                  >
                                    TASKS
                                  </span>

                                  <span className="text-cyan-400">
                                    {completedTasks}/
                                    {totalTasks}
                                  </span>
                                </div>

                                <div
                                  className={`h-1.5 overflow-hidden rounded-full ${
                                    darkMode
                                      ? "bg-white/10"
                                      : "bg-slate-200"
                                  }`}
                                >
                                  <div
                                    className="h-full rounded-full bg-cyan-400"
                                    style={{
                                      width:
                                        totalTasks >
                                        0
                                          ? `${
                                              (completedTasks /
                                                totalTasks) *
                                              100
                                            }%`
                                          : "0%",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                  </div>
                ) : (
                  <EmptyState
                    message="No roadmap data was returned by the backend."
                    darkMode={darkMode}
                  />
                )}
              </motion.section>

              {/* =================================================
                  RESOURCES + ASK NEXORA
              ================================================== */}
              <motion.section
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{ delay: 0.6 }}
                className="mt-8 grid gap-6 md:grid-cols-2"
              >
                <div
                  className={`rounded-3xl border p-6 ${
                    darkMode
                      ? "border-white/10 bg-white/[0.035]"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="text-2xl">
                    📚
                  </span>

                  <h3 className="mt-4 text-xl font-bold">
                    Learning resources
                  </h3>

                  <p
                    className={`mt-2 text-sm leading-6 ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Explore courses, tutorials, documentation
                    and other resources connected to your
                    skill development.
                  </p>

                  <Link
                    href="/resources"
                    className="mt-5 inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#06101d] transition hover:bg-cyan-300"
                  >
                    Explore Resources →
                  </Link>
                </div>

                <div
                  className={`rounded-3xl border p-6 ${
                    darkMode
                      ? "border-cyan-400/15 bg-cyan-400/[0.04]"
                      : "border-cyan-200 bg-cyan-50"
                  }`}
                >
                  <span className="text-2xl">
                    ✧
                  </span>

                  <h3 className="mt-4 text-xl font-bold">
                    Need help deciding?
                  </h3>

                  <p
                    className={`mt-2 text-sm leading-6 ${
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-500"
                    }`}
                  >
                    Ask Nexora about your career path, skills,
                    opportunities or learning plan.
                  </p>

                  <Link
                    href="/ask-nexora"
                    className={`mt-5 inline-flex rounded-xl border px-5 py-3 text-sm font-bold transition ${
                      darkMode
                        ? "border-white/10 bg-white/5 hover:bg-white/10"
                        : "border-slate-200 bg-white hover:bg-slate-100"
                    }`}
                  >
                    Ask Nexora →
                  </Link>
                </div>
              </motion.section>

              {/* =================================================
                  BOTTOM CTA
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
                transition={{ delay: 0.7 }}
                className={`mt-8 rounded-3xl border p-8 text-center ${
                  darkMode
                    ? "border-cyan-400/15 bg-cyan-400/[0.035]"
                    : "border-cyan-200 bg-cyan-50"
                }`}
              >
                <p className="text-2xl font-black">
                  Your next move starts here.
                </p>

                <p
                  className={`mx-auto mt-2 max-w-xl text-sm ${
                    darkMode
                      ? "text-slate-400"
                      : "text-slate-500"
                  }`}
                >
                  Explore opportunities, close your skill gaps
                  and follow your personalized roadmap.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/opportunities"
                    className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-[#06101d] transition hover:bg-cyan-300"
                  >
                    Explore Opportunities
                  </Link>

                  <Link
                    href="/roadmap"
                    className={`rounded-xl border px-6 py-3 text-sm font-bold ${
                      darkMode
                        ? "border-white/10 bg-white/5 hover:bg-white/10"
                        : "border-slate-200 bg-white hover:bg-slate-100"
                    }`}
                  >
                    View Roadmap
                  </Link>
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
   SIDEBAR ITEM
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
   LOADING STATE
============================================================ */

function LoadingState({
  darkMode,
}: {
  darkMode: boolean;
}) {
  return (
    <div className="space-y-8">
      <div>
        <div
          className={`h-4 w-32 animate-pulse rounded ${
            darkMode
              ? "bg-white/10"
              : "bg-slate-200"
          }`}
        />

        <div
          className={`mt-4 h-10 w-80 max-w-full animate-pulse rounded ${
            darkMode
              ? "bg-white/10"
              : "bg-slate-200"
          }`}
        />

        <div
          className={`mt-4 h-4 w-full max-w-2xl animate-pulse rounded ${
            darkMode
              ? "bg-white/10"
              : "bg-slate-200"
          }`}
        />
      </div>

      <div
        className={`h-64 animate-pulse rounded-3xl ${
          darkMode
            ? "bg-white/[0.035]"
            : "bg-white"
        }`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className={`h-72 animate-pulse rounded-3xl ${
            darkMode
              ? "bg-white/[0.035]"
              : "bg-white"
          }`}
        />

        <div
          className={`h-72 animate-pulse rounded-3xl ${
            darkMode
              ? "bg-white/[0.035]"
              : "bg-white"
          }`}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className={`h-48 animate-pulse rounded-2xl ${
              darkMode
                ? "bg-white/[0.035]"
                : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
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