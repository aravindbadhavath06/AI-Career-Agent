"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, type ProfileData } from "@/lib/api";

type SettingToggleProps = {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <div>
        <h3 className="text-sm font-medium text-white">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-label={`Toggle ${title}`}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-cyan-400" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full transition ${
            checked
              ? "left-6 bg-slate-950"
              : "left-1 bg-slate-300"
          }`}
        />
      </button>
    </div>
  );
}

function SectionIcon({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
      {children}
    </div>
  );
}

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

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 9C18 5.7 15.8 3 12 3C8.2 3 6 5.7 6 9C6 15 3.8 17 3.8 17H20.2C20.2 17 18 15 18 9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M10 21H14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PaletteIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3C7 3 3 6.8 3 11.5C3 16.2 6.8 20 11.5 20H13C14.1 20 15 19.1 15 18C15 17.2 14.6 16.5 14 16C13.4 15.5 13 14.8 13 14C13 12.9 13.9 12 15 12H17.5C19.4 12 21 10.4 21 8.5C21 5.5 17 3 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="10" r="1" fill="currentColor" />
      <circle cx="10" cy="7" r="1" fill="currentColor" />
      <circle cx="14" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

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

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L19 6V11C19 16 16.1 19.4 12 21C7.9 19.4 5 16 5 11V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

export default function SettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [careerGoal, setCareerGoal] = useState("");
  const [location, setLocation] = useState("");

  const [darkMode, setDarkMode] = useState(true);

  const [jobAlerts, setJobAlerts] = useState(true);
  const [internshipAlerts, setInternshipAlerts] = useState(true);
  const [roadmapReminders, setRoadmapReminders] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  /* =====================================================
     LOAD PROFILE + SETTINGS
     ===================================================== */

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const profileData = await api.getProfile();

        setProfile(profileData);

        setName(profileData.name || "");
        setEmail(profileData.email || "");
        setCareerGoal(profileData.career_goal || "");
        setLocation(profileData.location || "");

        const savedTheme = localStorage.getItem("nexora-theme");

        if (savedTheme === "light") {
          setDarkMode(false);
        } else {
          setDarkMode(true);
        }

        const savedSettings = localStorage.getItem(
          "nexora-settings"
        );

        if (savedSettings) {
          try {
            const settings = JSON.parse(savedSettings);

            setJobAlerts(settings.jobAlerts ?? true);
            setInternshipAlerts(
              settings.internshipAlerts ?? true
            );
            setRoadmapReminders(
              settings.roadmapReminders ?? true
            );
            setAiRecommendations(
              settings.aiRecommendations ?? true
            );
          } catch {
            // Ignore invalid local settings.
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /* =====================================================
     THEME
     ===================================================== */

  const toggleTheme = () => {
    const nextMode = !darkMode;

    setDarkMode(nextMode);

    localStorage.setItem(
      "nexora-theme",
      nextMode ? "dark" : "light"
    );
  };

  /* =====================================================
     SAVE SETTINGS
     ===================================================== */

  const saveSettings = async () => {
    try {
      setSavingProfile(true);
      setSaved(false);
      setError("");

      /*
       * Profile-related settings are saved to the real
       * backend through /api/profile.
       */

      const updatedProfile: ProfileData = {
        ...(profile || {
          education: "",
          skills: [],
          interests: [],
          experience: "",
        }),

        name,
        email,
        career_goal: careerGoal,
        location,
      };

      const savedProfile = await api.saveProfile(
        updatedProfile
      );

      setProfile(savedProfile);

      /*
       * Notification and AI preference APIs are not present
       * in the current backend contract, so these remain
       * client-side preferences for now.
       */

      localStorage.setItem(
        "nexora-settings",
        JSON.stringify({
          jobAlerts,
          internshipAlerts,
          roadmapReminders,
          aiRecommendations,
        })
      );

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save settings."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /* =====================================================
     LOGOUT
     ===================================================== */

  const handleSignOut = () => {
    localStorage.removeItem("nexora-access-token");
    localStorage.removeItem("nexora-token");

    window.location.href = "/login";
  };

  const cardClass =
    "border-white/10 bg-white/[0.03]";

  /* =====================================================
     LOADING
     ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050b14] text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />

          <p className="mt-4 text-sm text-slate-400">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050b14] text-white">

      {/* ================================================= */}
      {/* SIDEBAR */}
      {/* ================================================= */}

      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 overflow-y-auto border-r border-white/10 bg-[#07101d] lg:block">
        <div className="flex min-h-full flex-col p-5">

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

          <div className="mb-3 px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </div>

          <nav className="space-y-0.5">

            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                ⌂
              </span>
              Dashboard
            </Link>

            <Link
              href="/opportunities"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                💼
              </span>
              Opportunities
            </Link>

            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                <UserIcon />
              </span>
              Profile
            </Link>

            <Link
              href="/skill-gap"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                ◎
              </span>
              Skill Gap
            </Link>

            <Link
              href="/roadmap"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                ◇
              </span>
              Roadmap
            </Link>

            <Link
              href="/progress"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                ◷
              </span>
              Progress
            </Link>

            <Link
              href="/resources"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                ▤
              </span>
              Resources
            </Link>

            <Link
              href="/resume"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                ▱
              </span>
              Resume Analyzer
            </Link>

            <Link
              href="/ask-nexora"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                ✦
              </span>
              Ask Nexora
            </Link>

            <Link
              href="/voice"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                🎙
              </span>
              Voice Assistant
            </Link>

          </nav>

          <div className="mt-auto shrink-0 border-t border-white/10 pt-4">

            <Link
              href="/settings"
              className="flex w-full items-center gap-3 rounded-xl bg-cyan-400/10 px-3 py-2 text-sm text-cyan-300"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-slate-950">
                ⚙
              </span>
              Settings
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.05]">
                ↪
              </span>
              Sign out
            </button>

          </div>
        </div>
      </aside>

      {/* ================================================= */}
      {/* MOBILE HEADER */}
      {/* ================================================= */}

      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/10 bg-[#07101d] px-4 lg:hidden">

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
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5"
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950"
          >
            {name?.charAt(0)?.toUpperCase() || "U"}
          </Link>

        </div>
      </header>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <main className="lg:pl-64">

        <header className="hidden h-16 items-center justify-between border-b border-white/10 bg-[#050b14] px-8 lg:flex">

          <div>
            <div className="text-xs text-slate-500">
              Workspace
            </div>

            <h1 className="text-lg font-semibold">
              Settings
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
            >
              <BellIcon />
            </button>

            <Link
              href="/profile"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950"
            >
              {name?.charAt(0)?.toUpperCase() || "U"}
            </Link>

          </div>
        </header>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <div className="mx-auto max-w-5xl p-5 md:p-8">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-2 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                ⚙
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  Settings
                </h2>

                <p className="text-sm text-slate-400">
                  Manage your Agent Nexora preferences.
                </p>
              </div>

            </div>
          </motion.div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* ================================================= */}
          {/* ACCOUNT */}
          {/* ================================================= */}

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`mt-8 rounded-2xl border p-6 ${cardClass}`}
          >

            <div className="flex items-center gap-3 border-b border-white/10 pb-5">

              <SectionIcon>
                <UserIcon />
              </SectionIcon>

              <div>
                <h3 className="font-semibold">
                  Account
                </h3>

                <p className="text-xs text-slate-400">
                  Manage your basic account information.
                </p>
              </div>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-white/10 bg-[#0b1421] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-white/10 bg-[#0b1421] px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                />
              </div>

            </div>

            <div className="mt-5 flex flex-wrap gap-3">

              <Link
                href="/profile"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white transition hover:bg-white/10"
              >
                Edit Profile
                <ArrowIcon />
              </Link>

            </div>

          </motion.section>

          {/* ================================================= */}
          {/* APPEARANCE */}
          {/* ================================================= */}

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`mt-6 rounded-2xl border p-6 ${cardClass}`}
          >

            <div className="flex items-center gap-3 border-b border-white/10 pb-5">

              <SectionIcon>
                <PaletteIcon />
              </SectionIcon>

              <div>
                <h3 className="font-semibold">
                  Appearance
                </h3>

                <p className="text-xs text-slate-400">
                  Customize how Nexora looks.
                </p>
              </div>

            </div>

            <div className="mt-5 flex items-center justify-between gap-5">

              <div>
                <h4 className="text-sm font-medium">
                  Theme
                </h4>

                <p className="mt-1 text-xs text-slate-400">
                  Currently using{" "}
                  {darkMode ? "Dark" : "Light"} mode.
                </p>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs text-cyan-300"
              >
                {darkMode
                  ? "Switch to Light"
                  : "Switch to Dark"}
              </button>

            </div>

          </motion.section>

          {/* ================================================= */}
          {/* CAREER PREFERENCES */}
          {/* ================================================= */}

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`mt-6 rounded-2xl border p-6 ${cardClass}`}
          >

            <div className="flex items-center gap-3 border-b border-white/10 pb-5">

              <SectionIcon>
                <BriefcaseIcon />
              </SectionIcon>

              <div>
                <h3 className="font-semibold">
                  Career Preferences
                </h3>

                <p className="text-xs text-slate-400">
                  Your career preferences are connected to
                  your profile.
                </p>
              </div>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Target Career
                </label>

                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) =>
                    setCareerGoal(e.target.value)
                  }
                  placeholder="Enter your career goal"
                  className="w-full rounded-xl border border-white/10 bg-[#0b1421] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs text-slate-400">
                  Preferred Location
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="e.g. Hyderabad"
                  className="w-full rounded-xl border border-white/10 bg-[#0b1421] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

            </div>

            <div className="mt-6">

              <label className="mb-3 block text-xs text-slate-400">
                Opportunity Types
              </label>

              <p className="text-xs text-slate-500">
                Opportunity availability is determined by
                Nexora's backend opportunity services.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                <Link
                  href="/opportunities/private"
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  Private Jobs →
                </Link>

                <Link
                  href="/opportunities/government"
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  Government Jobs →
                </Link>

                <Link
                  href="/opportunities/internships"
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  Internships →
                </Link>

              </div>

            </div>

          </motion.section>

          {/* ================================================= */}
          {/* NOTIFICATIONS */}
          {/* ================================================= */}

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mt-6 rounded-2xl border p-6 ${cardClass}`}
          >

            <div className="flex items-center gap-3 border-b border-white/10 pb-5">

              <SectionIcon>
                <BellIcon />
              </SectionIcon>

              <div>
                <h3 className="font-semibold">
                  Notifications
                </h3>

                <p className="text-xs text-slate-400">
                  Choose which updates you want to receive.
                </p>
              </div>

            </div>

            <div className="mt-2 divide-y divide-white/10">

              <SettingToggle
                title="Job Match Alerts"
                description="Get notified when Nexora finds relevant private jobs."
                checked={jobAlerts}
                onChange={() =>
                  setJobAlerts(!jobAlerts)
                }
              />

              <SettingToggle
                title="Internship Alerts"
                description="Receive updates about internship opportunities."
                checked={internshipAlerts}
                onChange={() =>
                  setInternshipAlerts(!internshipAlerts)
                }
              />

              <SettingToggle
                title="Roadmap Reminders"
                description="Receive reminders about your learning roadmap."
                checked={roadmapReminders}
                onChange={() =>
                  setRoadmapReminders(!roadmapReminders)
                }
              />

            </div>

          </motion.section>

          {/* ================================================= */}
          {/* AI PREFERENCES */}
          {/* ================================================= */}

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className={`mt-6 rounded-2xl border p-6 ${cardClass}`}
          >

            <div className="flex items-center gap-3 border-b border-white/10 pb-5">

              <SectionIcon>
                <SparkleIcon />
              </SectionIcon>

              <div>
                <h3 className="font-semibold">
                  AI Preferences
                </h3>

                <p className="text-xs text-slate-400">
                  Control how Nexora personalizes your experience.
                </p>
              </div>

            </div>

            <div className="mt-2">

              <SettingToggle
                title="Personalized AI Recommendations"
                description="Allow Nexora to use your profile and progress to personalize recommendations."
                checked={aiRecommendations}
                onChange={() =>
                  setAiRecommendations(!aiRecommendations)
                }
              />

            </div>

          </motion.section>

          {/* ================================================= */}
          {/* SECURITY */}
          {/* ================================================= */}

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`mt-6 rounded-2xl border p-6 ${cardClass}`}
          >

            <div className="flex items-center gap-3 border-b border-white/10 pb-5">

              <SectionIcon>
                <ShieldIcon />
              </SectionIcon>

              <div>
                <h3 className="font-semibold">
                  Security
                </h3>

                <p className="text-xs text-slate-400">
                  Manage your account security.
                </p>
              </div>

            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h4 className="text-sm font-medium">
                  Password
                </h4>

                <p className="mt-1 text-xs text-slate-400">
                  Password management is handled by the
                  authentication backend.
                </p>
              </div>

              <Link
                href="/profile"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white transition hover:bg-white/10"
              >
                Account Security
              </Link>

            </div>

          </motion.section>

          {/* ================================================= */}
          {/* ACCOUNT ACTIONS */}
          {/* ================================================= */}

          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/[0.03] p-6"
          >

            <h3 className="font-semibold text-red-300">
              Account Actions
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Sign out from your current Agent Nexora
              session.
            </p>

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-xs text-red-300 transition hover:bg-red-400/20"
            >
              Sign out
              <ArrowIcon />
            </button>

          </motion.section>

          {/* ================================================= */}
          {/* SAVE */}
          {/* ================================================= */}

          <div className="sticky bottom-4 z-20 mt-6 flex justify-end">

            <button
              type="button"
              onClick={saveSettings}
              disabled={savingProfile}
              className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingProfile
                ? "Saving..."
                : saved
                ? "✓ Settings Saved"
                : "Save Settings"}
            </button>

          </div>

          <footer className="py-10 text-center text-xs text-slate-500">
            Agent Nexora • Navigate Your Next.
          </footer>

        </div>
      </main>
    </div>
  );
}