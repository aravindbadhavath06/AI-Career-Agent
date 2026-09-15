"use client";

import { FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [experience, setExperience] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Calculate profile completion
  useEffect(() => {
    const fields = [
      education,
      skills,
      interests,
      experience,
      careerGoal,
    ];

    const completed = fields.filter((field) => field.trim() !== "").length;

    setProgress(completed * 20);
  }, [education, skills, interests, experience, careerGoal]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const profile = {
      education,
      skills: skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      interests: interests
        .split(",")
        .map((interest) => interest.trim())
        .filter(Boolean),
      experience,
      career_goal: careerGoal,
    };

    console.log("Profile submitted:", profile);

    // Temporary analyzing animation.
    // Later this will be replaced with the real backend API call.
    setIsAnalyzing(true);
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* AI Analyzing Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#07111f]/95 backdrop-blur-md"
          >
            <div className="w-full max-w-md px-6 text-center">
              {/* Animated AI Circle */}
              <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/20 border-t-cyan-400"
                />

                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400/10"
                >
                  <span className="text-2xl font-black text-cyan-400">
                    AI
                  </span>
                </motion.div>
              </div>

              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-black"
              >
                Analyzing your career profile
              </motion.h2>

              <p className="mt-3 text-sm text-slate-400">
                Our AI is understanding your skills and finding suitable
                career paths.
              </p>

              {/* Loading Progress */}
              <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 4,
                    ease: "easeInOut",
                  }}
                  className="h-full rounded-full bg-cyan-400"
                />
              </div>

              {/* Analysis Steps */}
              <div className="mt-8 space-y-3 text-left">
                {[
                  "Understanding your profile",
                  "Analyzing your skills",
                  "Finding career matches",
                  "Preparing your roadmap",
                ].map((step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.7,
                    }}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: index * 0.7,
                        type: "spring",
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400"
                    >
                      ✓
                    </motion.div>

                    {step}
                  </motion.div>
                ))}
              </div>

              <p className="mt-8 text-xs text-slate-600">
                AI Career Agent
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8"
      >
        <a href="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: 8,
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-[#07111f]"
          >
            AI
          </motion.div>

          <span className="text-xl font-bold">Career Agent</span>
        </a>

        <motion.a
          href="/"
          whileHover={{ x: -4 }}
          className="text-sm font-medium text-slate-400 transition hover:text-white"
        >
          ← Back to Home
        </motion.a>
      </motion.nav>

      {/* Page Header */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl px-6 pb-10 pt-14 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300"
        >
          <motion.span
            animate={{
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="h-2 w-2 rounded-full bg-cyan-400"
          />

          Step 01 · Build your profile
        </motion.div>

        <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
          Tell us about
          <motion.span
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-block text-cyan-400"
          >
            {" "}
            yourself.
          </motion.span>
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
          Share your education, skills, interests, experience, and career
          goal. The AI Career Agent will use this information to understand
          your profile and recommend suitable career paths.
        </p>

        {/* Progress */}
        <div className="mt-8 max-w-md">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-slate-500">Profile completion</span>
            <span className="font-semibold text-cyan-400">
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full bg-cyan-400"
            />
          </div>
        </div>
      </motion.section>

      {/* Profile Form */}
      <section className="mx-auto max-w-4xl px-6 pb-24 lg:px-8">
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.7,
          }}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl sm:p-8 lg:p-10"
        >
          <div className="space-y-8">
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label
                htmlFor="education"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                Education
              </label>

              <input
                id="education"
                type="text"
                value={education}
                onChange={(event) => setEducation(event.target.value)}
                placeholder="Example: B.Tech Computer Science"
                required
                className="w-full rounded-2xl border border-slate-700 bg-[#07111f] px-5 py-4 text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              />

              <p className="mt-2 text-xs text-slate-500">
                Mention your degree, branch, or current education.
              </p>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label
                htmlFor="skills"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                Skills
              </label>

              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="Example: Python, SQL, Java, React"
                required
                className="w-full rounded-2xl border border-slate-700 bg-[#07111f] px-5 py-4 text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              />

              <p className="mt-2 text-xs text-slate-500">
                Separate multiple skills with commas.
              </p>
            </motion.div>

            {/* Interests */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label
                htmlFor="interests"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                Interests
              </label>

              <input
                id="interests"
                type="text"
                value={interests}
                onChange={(event) => setInterests(event.target.value)}
                placeholder="Example: AI, Data Science, Web Development"
                required
                className="w-full rounded-2xl border border-slate-700 bg-[#07111f] px-5 py-4 text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              />

              <p className="mt-2 text-xs text-slate-500">
                Tell us what areas of technology or work interest you.
              </p>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label
                htmlFor="experience"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                Experience
              </label>

              <textarea
                id="experience"
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                placeholder="Example: Built two college projects using Python and completed a 2-month internship..."
                required
                rows={5}
                className="w-full resize-none rounded-2xl border border-slate-700 bg-[#07111f] px-5 py-4 text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              />

              <p className="mt-2 text-xs text-slate-500">
                Include projects, internships, work experience, or relevant
                practical experience.
              </p>
            </motion.div>

            {/* Career Goal */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <label
                htmlFor="careerGoal"
                className="mb-3 block text-sm font-semibold text-slate-200"
              >
                Career Goal
              </label>

              <input
                id="careerGoal"
                type="text"
                value={careerGoal}
                onChange={(event) => setCareerGoal(event.target.value)}
                placeholder="Example: I want to become a Data Scientist"
                required
                className="w-full rounded-2xl border border-slate-700 bg-[#07111f] px-5 py-4 text-white outline-none transition duration-300 placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/10"
              />

              <p className="mt-2 text-xs text-slate-500">
                Enter your target career or the career you want to explore.
              </p>
            </motion.div>
          </div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-10 border-t border-slate-800 pt-8"
          >
            <motion.button
              type="submit"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 35px rgba(34,211,238,0.25)",
              }}
              whileTap={{
                scale: 0.97,
              }}
              disabled={isAnalyzing}
              className="w-full rounded-2xl bg-cyan-400 px-6 py-4 text-base font-black text-[#07111f] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-64"
            >
              Analyze My Career 🚀
            </motion.button>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Your profile will be analyzed to identify career matches, skill
              gaps, and a personalized learning roadmap.
            </p>
          </motion.div>
        </motion.form>
      </section>
    </main>
  );
}