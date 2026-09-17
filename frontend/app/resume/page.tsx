"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, AnalysisResult } from "@/lib/api";

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
      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
        active
          ? darkMode
            ? "bg-cyan-400/10 text-cyan-300"
            : "bg-cyan-50 text-cyan-700"
          : darkMode
            ? "text-slate-400 hover:bg-white/5 hover:text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${
          active
            ? darkMode
              ? "bg-cyan-400/10"
              : "bg-cyan-100"
            : darkMode
              ? "bg-white/[0.03]"
              : "bg-slate-100"
        }`}
      >
        {icon}
      </span>

      <span>{label}</span>

      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
      )}
    </Link>
  );
}

function ProgressBar({
  value,
  darkMode,
}: {
  value: number;
  darkMode: boolean;
}) {
  return (
    <div
      className={`h-2 overflow-hidden rounded-full ${
        darkMode ? "bg-white/10" : "bg-slate-200"
      }`}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.8 }}
        className="h-full rounded-full bg-cyan-400"
      />
    </div>
  );
}

export default function ResumePage() {
  const [darkMode, setDarkMode] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("nexora-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
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

  const handleFile = (selectedFile: File) => {
    setError("");
    setFile(selectedFile);
    setAnalyzed(false);
    setResult(null);
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const fileName = selectedFile.name.toLowerCase();

    const validExtension =
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx");

    if (!validExtension && !allowedTypes.includes(selectedFile.type)) {
      setError(
        "Please upload a PDF, DOC, or DOCX resume."
      );
      event.target.value = "";
      return;
    }

    handleFile(selectedFile);
  };

  const analyzeResume = async () => {
    if (!file || analyzing) return;

    try {
      setAnalyzing(true);
      setAnalyzed(false);
      setResult(null);
      setError("");

      /*
       * REAL BACKEND REQUEST
       *
       * This calls:
       * POST /api/resume/analyze
       *
       * The File is sent as multipart/form-data.
       */
      const analysisResult = await api.analyzeResume(file);

      setResult(analysisResult);
      setAnalyzed(true);
    } catch (err) {
      console.error(
        "Resume analysis failed:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Resume analysis failed. Please try again."
        );
      }

      setAnalyzed(false);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setAnalyzed(false);
    setAnalyzing(false);
    setResult(null);
    setError("");
  };

  const cardClass = darkMode
    ? "border-white/10 bg-white/[0.03]"
    : "border-slate-200 bg-white";

  const mainText = darkMode
    ? "text-white"
    : "text-slate-900";

  const mutedText = darkMode
    ? "text-slate-400"
    : "text-slate-500";

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
      ====================================================== */}

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-slate-950">
              NX
            </div>

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

          <div
            className={`mb-3 px-3 text-[10px] uppercase tracking-widest ${mutedText}`}
          >
            Workspace
          </div>

          {/* Navigation */}
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
              icon="◌"
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
              icon="◒"
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
              active
              darkMode={darkMode}
            />

            <SidebarItem
              href="/ask-nexora"
              icon="✦"
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
          <div className="mt-auto space-y-1">
            <SidebarItem
              href="/settings"
              icon="⚙"
              label="Settings"
              darkMode={darkMode}
            />

            <button
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  darkMode
                    ? "bg-white/[0.03]"
                    : "bg-slate-100"
                }`}
              >
                ↪
              </span>

              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="lg:pl-64">

        {/* Header */}
        <header
          className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-5 backdrop-blur-xl md:px-8 ${
            darkMode
              ? "border-white/10 bg-[#050b14]/80"
              : "border-slate-200 bg-white/80"
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
              Resume Analyzer
            </h1>
          </div>

          <div className="flex items-center gap-3">

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

            <button
              className={`hidden h-10 w-10 items-center justify-center rounded-xl border md:flex ${
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              ♢
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
              U
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-7xl p-5 md:p-8">

          {/* =================================================
              HERO
          ================================================== */}

          <motion.section
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
            <div
              className={`relative overflow-hidden rounded-3xl border p-6 md:p-8 ${cardClass}`}
            >
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative max-w-3xl">

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  AI Resume Intelligence
                </div>

                <h2
                  className={`text-3xl font-bold md:text-4xl ${mainText}`}
                >
                  Make your resume work harder.
                </h2>

                <p
                  className={`mt-3 text-sm leading-6 ${mutedText}`}
                >
                  Upload your resume and let Nexora analyze
                  your skills, keywords, strengths and
                  improvement areas.
                </p>
              </div>
            </div>
          </motion.section>

          {/* =================================================
              ERROR
          ================================================== */}

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
              className={`mb-6 rounded-2xl border p-5 ${
                darkMode
                  ? "border-red-400/20 bg-red-400/5"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex gap-3">
                <span className="text-red-400">
                  !
                </span>

                <div>
                  <p
                    className={`text-sm font-semibold ${
                      darkMode
                        ? "text-red-300"
                        : "text-red-700"
                    }`}
                  >
                    Resume analysis failed
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
              </div>
            </motion.div>
          )}

          {/* =================================================
              UPLOAD
          ================================================== */}

          {!analyzed && (
            <motion.section
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className={`rounded-2xl border p-6 md:p-8 ${cardClass}`}
            >
              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold ${mainText}`}
                >
                  Upload your resume
                </h3>

                <p
                  className={`mt-1 text-xs ${mutedText}`}
                >
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>

              {/* File drop area */}
              <label
                className={`flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${
                  darkMode
                    ? "border-white/10 bg-white/[0.02] hover:border-cyan-400/40 hover:bg-cyan-400/[0.03]"
                    : "border-slate-300 bg-slate-50 hover:border-cyan-400 hover:bg-cyan-50"
                }`}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={analyzing}
                />

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl text-cyan-300">
                  ↑
                </div>

                {file ? (
                  <>
                    <div
                      className={`max-w-[90%] truncate text-base font-semibold ${mainText}`}
                    >
                      {file.name}
                    </div>

                    <div
                      className={`mt-2 text-xs ${mutedText}`}
                    >
                      {(file.size / 1024 / 1024).toFixed(
                        2
                      )}{" "}
                      MB
                    </div>

                    {!analyzing && (
                      <div className="mt-4 text-xs text-cyan-300">
                        Click to choose another file
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div
                      className={`text-base font-semibold ${mainText}`}
                    >
                      Drop your resume here
                    </div>

                    <div
                      className={`mt-2 text-sm ${mutedText}`}
                    >
                      or click to browse from your computer
                    </div>
                  </>
                )}
              </label>

              {/* Analyze controls */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div
                  className={`text-xs ${mutedText}`}
                >
                  Nexora will analyze the uploaded resume
                  using the connected backend.
                </div>

                <button
                  onClick={analyzeResume}
                  disabled={!file || analyzing}
                  className={`rounded-xl px-6 py-3 text-sm font-semibold transition ${
                    file && !analyzing
                      ? "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                      : "cursor-not-allowed bg-slate-700 text-slate-400"
                  }`}
                >
                  {analyzing
                    ? "Analyzing Resume..."
                    : "Analyze Resume →"}
                </button>
              </div>

              {/* REAL loading state */}
              {analyzing && (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />

                    <span className="text-sm text-cyan-300">
                      Nexora is analyzing your resume...
                    </span>
                  </div>

                  <p
                    className={`mt-3 text-xs ${mutedText}`}
                  >
                    Waiting for the resume analysis response
                    from the backend.
                  </p>
                </motion.div>
              )}
            </motion.section>
          )}

          {/* =================================================
              RESULTS
          ================================================== */}

          {analyzed && result && (
            <>
              {/* =================================================
                  SCORE
              ================================================== */}

              <section className="grid gap-6 lg:grid-cols-3">

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className={`rounded-2xl border p-6 lg:col-span-1 ${cardClass}`}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3
                        className={`font-semibold ${mainText}`}
                      >
                        Resume Score
                      </h3>

                      <p
                        className={`mt-1 text-xs ${mutedText}`}
                      >
                        AI compatibility score
                      </p>
                    </div>

                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] text-cyan-300">
                      AI ANALYZED
                    </span>
                  </div>

                  <div className="flex justify-center py-4">
                    <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[10px] border-cyan-400/10">

                      <svg
                        className="absolute inset-0 h-full w-full -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="7"
                          className={
                            darkMode
                              ? "text-white/10"
                              : "text-slate-200"
                          }
                        />

                        {typeof result.score ===
                          "number" && (
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray="251"
                            initial={{
                              strokeDashoffset: 251,
                            }}
                            animate={{
                              strokeDashoffset:
                                251 -
                                (251 *
                                  Math.max(
                                    0,
                                    Math.min(
                                      100,
                                      result.score
                                    )
                                  )) /
                                  100,
                            }}
                            transition={{
                              duration: 1,
                            }}
                            className="text-cyan-400"
                          />
                        )}
                      </svg>

                      <div className="text-center">
                        <div
                          className={`text-4xl font-bold ${mainText}`}
                        >
                          {typeof result.score ===
                          "number"
                            ? result.score
                            : "—"}
                        </div>

                        <div
                          className={`text-xs ${mutedText}`}
                        >
                          out of 100
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm font-semibold text-cyan-300">
                      AI Resume Analysis
                    </div>

                    <p
                      className={`mt-2 text-xs leading-5 ${mutedText}`}
                    >
                      This score was returned by the Nexora
                      resume-analysis backend.
                    </p>
                  </div>
                </motion.div>

                {/* =================================================
                    DETECTED SKILLS
                ================================================== */}

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
                  className={`rounded-2xl border p-6 lg:col-span-2 ${cardClass}`}
                >
                  <div className="mb-6">
                    <h3
                      className={`text-lg font-semibold ${mainText}`}
                    >
                      Skills Detected
                    </h3>

                    <p
                      className={`mt-1 text-xs ${mutedText}`}
                    >
                      Skills Nexora identified from your
                      uploaded resume.
                    </p>
                  </div>

                  {result.skills &&
                  result.skills.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {result.skills.map(
                        (skill, index) => (
                          <motion.div
                            key={skill}
                            initial={{
                              opacity: 0,
                              scale: 0.9,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                            transition={{
                              delay: index * 0.05,
                            }}
                            className={`flex items-center gap-3 rounded-xl border p-4 ${
                              darkMode
                                ? "border-white/10 bg-white/[0.02]"
                                : "border-slate-200 bg-slate-50"
                            }`}
                          >
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-300">
                              ✓
                            </span>

                            <span
                              className={`text-sm ${mainText}`}
                            >
                              {skill}
                            </span>
                          </motion.div>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      message="No skills were detected by the backend."
                      darkMode={darkMode}
                    />
                  )}
                </motion.div>
              </section>

              {/* =================================================
                  STRENGTHS + MISSING SKILLS
              ================================================== */}

              <section className="mt-6 grid gap-6 lg:grid-cols-2">

                {/* Strengths */}
                <div
                  className={`rounded-2xl border p-6 ${cardClass}`}
                >
                  <div className="mb-5">
                    <h3
                      className={`text-lg font-semibold ${mainText}`}
                    >
                      Resume Strengths
                    </h3>

                    <p
                      className={`mt-1 text-xs ${mutedText}`}
                    >
                      Strengths returned by the AI analysis.
                    </p>
                  </div>

                  {result.strengths &&
                  result.strengths.length > 0 ? (
                    <div className="space-y-3">
                      {result.strengths.map(
                        (item) => (
                          <div
                            key={item}
                            className={`flex gap-3 rounded-xl border p-4 ${
                              darkMode
                                ? "border-white/10 bg-white/[0.02]"
                                : "border-slate-200 bg-slate-50"
                            }`}
                          >
                            <span className="text-emerald-300">
                              ✓
                            </span>

                            <span
                              className={`text-sm ${mainText}`}
                            >
                              {item}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      message="No strengths were returned by the backend."
                      darkMode={darkMode}
                    />
                  )}
                </div>

                {/* Missing Skills */}
                <div
                  className={`rounded-2xl border p-6 ${cardClass}`}
                >
                  <div className="mb-5">
                    <h3
                      className={`text-lg font-semibold ${mainText}`}
                    >
                      Missing Skills
                    </h3>

                    <p
                      className={`mt-1 text-xs ${mutedText}`}
                    >
                      Skills identified by Nexora as missing
                      from your resume.
                    </p>
                  </div>

                  {result.missingSkills &&
                  result.missingSkills.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {result.missingSkills.map(
                        (skill) => (
                          <div
                            key={skill}
                            className={`rounded-xl border p-4 ${
                              darkMode
                                ? "border-amber-400/10 bg-amber-400/[0.03]"
                                : "border-amber-200 bg-amber-50"
                            }`}
                          >
                            <div className="mb-2 text-amber-300">
                              !
                            </div>

                            <div
                              className={`text-sm ${mainText}`}
                            >
                              {skill}
                            </div>

                            <div
                              className={`mt-1 text-[10px] ${mutedText}`}
                            >
                              Identified by AI
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <EmptyState
                      message="No missing skills were returned by the backend."
                      darkMode={darkMode}
                    />
                  )}
                </div>
              </section>

              {/* =================================================
                  AI SUGGESTIONS
              ================================================== */}

              <section
                className={`mt-6 rounded-2xl border p-6 ${cardClass}`}
              >
                <div className="mb-6">
                  <h3
                    className={`text-lg font-semibold ${mainText}`}
                  >
                    AI Improvement Suggestions
                  </h3>

                  <p
                    className={`mt-1 text-xs ${mutedText}`}
                  >
                    Personalized recommendations returned by
                    Nexora.
                  </p>
                </div>

                {result.suggestions &&
                result.suggestions.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {result.suggestions.map(
                      (suggestion, index) => (
                        <motion.div
                          key={suggestion}
                          initial={{
                            opacity: 0,
                            y: 10,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: index * 0.08,
                          }}
                          className={`flex gap-4 rounded-xl border p-4 ${
                            darkMode
                              ? "border-white/10 bg-white/[0.02]"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-sm text-cyan-300">
                            {index + 1}
                          </div>

                          <p
                            className={`text-sm leading-6 ${mainText}`}
                          >
                            {suggestion}
                          </p>
                        </motion.div>
                      )
                    )}
                  </div>
                ) : (
                  <EmptyState
                    message="No improvement suggestions were returned."
                    darkMode={darkMode}
                  />
                )}
              </section>

              {/* =================================================
                  KEYWORDS
              ================================================== */}

              <section
                className={`mt-6 rounded-2xl border p-6 ${cardClass}`}
              >
                <h3
                  className={`text-lg font-semibold ${mainText}`}
                >
                  Resume Keywords
                </h3>

                <p
                  className={`mt-1 text-xs ${mutedText}`}
                >
                  Keywords detected by the resume analyzer.
                </p>

                {result.keywords &&
                result.keywords.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {result.keywords.map(
                      (keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-300"
                        >
                          {keyword}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <div className="mt-5">
                    <EmptyState
                      message="No keywords were returned by the backend."
                      darkMode={darkMode}
                    />
                  </div>
                )}
              </section>

              {/* =================================================
                  ACTIONS
              ================================================== */}

              <section
                className={`mt-6 rounded-2xl border p-6 ${cardClass}`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                  <div>
                    <h3
                      className={`text-lg font-semibold ${mainText}`}
                    >
                      Continue your career journey
                    </h3>

                    <p
                      className={`mt-1 text-xs ${mutedText}`}
                    >
                      Use your resume analysis to improve
                      your skills and career roadmap.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <Link
                      href="/skill-gap"
                      className={`rounded-xl border px-5 py-3 text-center text-sm font-medium transition ${
                        darkMode
                          ? "border-white/10 hover:bg-white/5"
                          : "border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      View Skill Gap
                    </Link>

                    <Link
                      href="/roadmap"
                      className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                      Open Roadmap →
                    </Link>

                    <button
                      onClick={resetAnalysis}
                      className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20"
                    >
                      Analyze Another Resume
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* =================================================
              INFO CARDS
          ================================================== */}

          {!analyzed && !analyzing && (
            <section className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: "⌁",
                  title: "Skills Analysis",
                  text: "Identify technical skills present in your resume.",
                },
                {
                  icon: "◎",
                  title: "Resume Insights",
                  text: "Understand the strengths and improvement areas detected by Nexora.",
                },
                {
                  icon: "✦",
                  title: "AI Suggestions",
                  text: "Get recommendations generated from your uploaded resume.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`rounded-2xl border p-5 ${cardClass}`}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    {item.icon}
                  </div>

                  <h3
                    className={`text-sm font-semibold ${mainText}`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`mt-2 text-xs leading-5 ${mutedText}`}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Footer */}
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
      className={`rounded-xl border p-6 text-center text-sm ${
        darkMode
          ? "border-white/5 bg-white/[0.02] text-slate-500"
          : "border-slate-100 bg-slate-50 text-slate-400"
      }`}
    >
      {message}
    </div>
  );
}