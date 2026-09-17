"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { api, ProfileData } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(true);

  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [experience, setExperience] = useState("");
  const [careerGoal, setCareerGoal] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =================================================
     LOAD THEME + PROFILE FROM BACKEND
  ================================================== */

  useEffect(() => {
    const savedTheme = localStorage.getItem("nexora-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const profile = await api.getProfile();

        setEducation(profile.education || "");
        setSkills(profile.skills?.join(", ") || "");
        setInterests(profile.interests?.join(", ") || "");
        setExperience(profile.experience || "");
        setCareerGoal(profile.career_goal || "");
      } catch (err) {
        console.error("Failed to load profile:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* =================================================
     THEME
  ================================================== */

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    localStorage.setItem(
      "nexora-theme",
      nextMode ? "dark" : "light"
    );
  };

  /* =================================================
     SAVE PROFILE
  ================================================== */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    const parsedSkills = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const parsedInterests = interests
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);

    if (!education.trim()) {
      setError("Please enter your education.");
      return;
    }

    if (parsedSkills.length === 0) {
      setError("Please enter at least one skill.");
      return;
    }

    if (parsedInterests.length === 0) {
      setError("Please enter at least one interest.");
      return;
    }

    if (!experience.trim()) {
      setError("Please select your experience level.");
      return;
    }

    if (!careerGoal.trim()) {
      setError("Please enter your career goal.");
      return;
    }

    const profileData: ProfileData = {
      education: education.trim(),
      skills: parsedSkills,
      interests: parsedInterests,
      experience: experience.trim(),
      career_goal: careerGoal.trim(),
    };

    try {
      setSaving(true);

      await api.saveProfile(profileData);

      router.push("/analysis");
    } catch (err) {
      console.error("Failed to save profile:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

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

  const inputClass = darkMode
    ? "border-white/10 bg-white/[0.03] text-white placeholder:text-slate-600"
    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400";

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
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#050b14] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

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
            <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.08,
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-slate-950"
            >
              NX
            </motion.div>

            <div>
              <div className={`font-bold ${mainText}`}>
                Agent Nexora
              </div>

              <div className={`text-[10px] ${mutedText}`}>
                Navigate Your Next.
              </div>
            </div>
          </Link>

          <div
            className={`mb-3 px-3 text-[10px] font-bold uppercase tracking-widest ${mutedText}`}
          >
            Workspace
          </div>

          <nav className="space-y-1">

            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>⌂</span>
              Dashboard
            </Link>

            <Link
              href="/opportunities"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>◈</span>
              Opportunities
            </Link>

            {/* Active Profile */}
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-xl bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300"
            >
              <span>◎</span>
              Profile

              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
            </Link>

            <Link
              href="/skill-gap"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>△</span>
              Skill Gap
            </Link>

            <Link
              href="/roadmap"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>◇</span>
              Roadmap
            </Link>

            <Link
              href="/progress"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>◷</span>
              Progress
            </Link>

            <Link
              href="/resources"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>▣</span>
              Resources
            </Link>

            <Link
              href="/resume"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>▱</span>
              Resume Analyzer
            </Link>

            <Link
              href="/ask-nexora"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>✦</span>
              Ask Nexora
            </Link>

            <Link
              href="/voice"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              <span>◌</span>
              Voice Assistant
            </Link>

          </nav>

          {/* Bottom */}
          <div className="mt-auto">

            <Link
              href="/settings"
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              ⚙
              Settings
            </Link>

            <Link
              href="/login"
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm ${
                darkMode
                  ? "text-slate-400 hover:bg-white/5 hover:text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              ↪
              Sign out
            </Link>

          </div>
        </div>
      </aside>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="lg:pl-64">

        {/* HEADER */}
        <header
          className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b px-5 backdrop-blur-xl md:px-8 ${
            darkMode
              ? "border-white/10 bg-[#050b14]/90"
              : "border-slate-200 bg-white/90"
          }`}
        >
          <div>
            <div className={`text-xs ${mutedText}`}>
              Workspace
            </div>

            <h1 className={`text-lg font-semibold ${mainText}`}>
              Student Profile
            </h1>
          </div>

          <div className="flex items-center gap-3">

            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              {darkMode ? "☀" : "☾"}
            </button>

            {/* Notification */}
            <button
              aria-label="Notifications"
              className={`hidden h-10 w-10 items-center justify-center rounded-xl border md:flex ${
                darkMode
                  ? "border-white/10 bg-white/5"
                  : "border-slate-200 bg-white"
              }`}
            >
              🔔
            </button>

            {/* User */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
              {careerGoal
                ? careerGoal.charAt(0).toUpperCase()
                : "S"}
            </div>

          </div>
        </header>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="mx-auto max-w-5xl p-5 md:p-8">

          {/* TITLE */}
          <motion.div
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
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              AI Career Profile
            </div>

            <h2
              className={`text-3xl font-bold md:text-4xl ${mainText}`}
            >
              Tell Nexora about yourself.
            </h2>

            <p
              className={`mt-2 max-w-2xl text-sm leading-6 ${mutedText}`}
            >
              Your profile helps Nexora understand your skills,
              interests and career goals so it can personalize
              your opportunities and learning roadmap.
            </p>
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

          {/* FORM */}
          <motion.form
            onSubmit={handleSubmit}
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
            className={`rounded-3xl border p-5 md:p-8 ${cardClass}`}
          >

            {/* Education */}
            <div className="mb-6">

              <label
                className={`mb-2 block text-sm font-medium ${mainText}`}
              >
                Education
              </label>

              <input
                value={education}
                onChange={(event) =>
                  setEducation(event.target.value)
                }
                placeholder="e.g. B.Tech Computer Science"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-cyan-400/50 ${inputClass}`}
              />

            </div>

            {/* Skills */}
            <div className="mb-6">

              <label
                className={`mb-2 block text-sm font-medium ${mainText}`}
              >
                Skills
              </label>

              <input
                value={skills}
                onChange={(event) =>
                  setSkills(event.target.value)
                }
                placeholder="Python, SQL, Java..."
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-cyan-400/50 ${inputClass}`}
              />

              <p
                className={`mt-2 text-xs ${mutedText}`}
              >
                Separate multiple skills with commas.
              </p>

            </div>

            {/* Interests */}
            <div className="mb-6">

              <label
                className={`mb-2 block text-sm font-medium ${mainText}`}
              >
                Interests
              </label>

              <input
                value={interests}
                onChange={(event) =>
                  setInterests(event.target.value)
                }
                placeholder="Data Science, AI, Web Development..."
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-cyan-400/50 ${inputClass}`}
              />

              <p
                className={`mt-2 text-xs ${mutedText}`}
              >
                Tell Nexora what areas interest you.
              </p>

            </div>

            {/* Experience */}
            <div className="mb-6">

              <label
                className={`mb-2 block text-sm font-medium ${mainText}`}
              >
                Experience Level
              </label>

              <div className="grid gap-3 sm:grid-cols-3">

                {[
                  "Beginner",
                  "Intermediate",
                  "Advanced",
                ].map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setExperience(level)}
                    className={`rounded-xl border px-4 py-3 text-sm transition ${
                      experience === level
                        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                        : darkMode
                          ? "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/5"
                          : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    {level}
                  </button>
                ))}

              </div>
            </div>

            {/* Career Goal */}
            <div className="mb-8">

              <label
                className={`mb-2 block text-sm font-medium ${mainText}`}
              >
                Career Goal
              </label>

              <input
                value={careerGoal}
                onChange={(event) =>
                  setCareerGoal(event.target.value)
                }
                placeholder="e.g. Data Scientist"
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-cyan-400/50 ${inputClass}`}
              />

            </div>

            {/* SUMMARY */}
            <div
              className="mb-7 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5"
            >
              <div className="mb-3 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  ✦
                </div>

                <div>
                  <div className="text-sm font-semibold text-cyan-300">
                    Nexora will analyze
                  </div>

                  <div
                    className={`text-xs ${mutedText}`}
                  >
                    Your profile against your career goal.
                  </div>
                </div>

              </div>

              <div className="grid gap-3 text-xs sm:grid-cols-3">

                <div>
                  <span className={mutedText}>
                    Skills
                  </span>

                  <div
                    className={`mt-1 font-medium ${mainText}`}
                  >
                    {
                      skills
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                        .length
                    }{" "}
                    skills
                  </div>
                </div>

                <div>
                  <span className={mutedText}>
                    Experience
                  </span>

                  <div
                    className={`mt-1 font-medium ${mainText}`}
                  >
                    {experience || "Not specified"}
                  </div>
                </div>

                <div>
                  <span className={mutedText}>
                    Target
                  </span>

                  <div
                    className={`mt-1 font-medium ${mainText}`}
                  >
                    {careerGoal || "Not specified"}
                  </div>
                </div>

              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
                  Saving Profile...
                </>
              ) : (
                <>
                  Analyze My Career
                  <span>→</span>
                </>
              )}
            </button>

          </motion.form>

          {/* FOOTER */}
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