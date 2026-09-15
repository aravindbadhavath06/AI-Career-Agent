"use client";

import { motion } from "framer-motion";

const strengths = [
  "Python",
  "SQL",
  "Problem Solving",
  "Analytical Thinking",
];

const skillGaps = [
  "Statistics",
  "Machine Learning",
  "Data Visualization",
];

const roadmap = [
  {
    number: "01",
    title: "Learn Statistics",
    description:
      "Build a strong foundation in probability, statistics, and data analysis.",
    duration: "2–3 weeks",
  },
  {
    number: "02",
    title: "Master Data Visualization",
    description:
      "Learn tools and techniques to communicate insights through data.",
    duration: "2–3 weeks",
  },
  {
    number: "03",
    title: "Learn Machine Learning",
    description:
      "Understand machine learning algorithms and practical model building.",
    duration: "4–6 weeks",
  },
  {
    number: "04",
    title: "Build Real Projects",
    description:
      "Create portfolio projects that demonstrate your data science skills.",
    duration: "3–4 weeks",
  },
];

const jobs = [
  {
    title: "Junior Data Scientist",
    company: "Technology Company",
    type: "Full-time",
  },
  {
    title: "Data Analyst",
    company: "Analytics Company",
    type: "Full-time",
  },
  {
    title: "Machine Learning Intern",
    company: "AI Startup",
    type: "Internship",
  },
];

const projects = [
  "Customer Churn Prediction",
  "Sales Data Analysis Dashboard",
  "Movie Recommendation System",
];

const resources = [
  "Python for Data Science",
  "Statistics Fundamentals",
  "Machine Learning with Python",
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-slate-800/80"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <a href="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 8 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-[#07111f]"
            >
              AI
            </motion.div>

            <span className="text-xl font-bold">
              Career Agent
            </span>
          </a>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:block">
              Career Analysis
            </span>

            <motion.a
              href="/profile"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold transition hover:border-cyan-400/50"
            >
              Edit Profile
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-12 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
            AI Career Analysis
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Your career direction is becoming clear.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
            Based on your profile, here is a personalized career analysis,
            skill-gap assessment, and learning roadmap.
          </p>
        </motion.div>
      </section>

      {/* Main Dashboard */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-8">
        {/* Career Match */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-slate-900/70 p-6 sm:p-8"
        >
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2 text-sm text-cyan-300">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Best Career Match
              </div>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Data Scientist
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-slate-400">
                Your current skills, interests, and career goals show a strong
                alignment with a Data Scientist career path.
              </p>
            </div>

            {/* Score */}
            <div className="flex shrink-0 items-center gap-5">
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Match Score
                </p>

                <p className="mt-1 text-4xl font-black text-cyan-400">
                  88%
                </p>
              </div>

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-slate-800">
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 226, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                  className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-cyan-400 border-r-cyan-400"
                />

                <span className="text-lg font-black text-cyan-300">
                  88
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strengths + Skill Gaps */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                ✓
              </div>

              <div>
                <h2 className="font-bold">Your Strengths</h2>
                <p className="text-sm text-slate-500">
                  Skills supporting your career match
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {strengths.map((strength, index) => (
                <motion.span
                  key={strength}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300"
                >
                  ✓ {strength}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Skill Gaps */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                !
              </div>

              <div>
                <h2 className="font-bold">Skill Gaps</h2>
                <p className="text-sm text-slate-500">
                  Skills recommended for your target career
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {skillGaps.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-300"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Roadmap */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              Personalized Roadmap
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Your path to becoming a Data Scientist
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            {roadmap.map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.12,
                  duration: 0.5,
                }}
                whileHover={{ x: 6 }}
                className="group flex gap-4 rounded-2xl border border-slate-800 bg-[#07111f] p-5 transition hover:border-cyan-400/30"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 font-black text-[#07111f]">
                  {item.number}
                </div>

                <div className="flex-1">
                  <div className="flex flex-col justify-between gap-1 sm:flex-row">
                    <h3 className="font-bold">{item.title}</h3>

                    <span className="text-xs text-cyan-400">
                      {item.duration}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Jobs / Projects / Resources */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <h2 className="text-xl font-bold">Job Opportunities</h2>

            <p className="mt-2 text-sm text-slate-500">
              Roles worth exploring
            </p>

            <div className="mt-6 space-y-4">
              {jobs.map((job) => (
                <motion.div
                  key={job.title}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border border-slate-800 bg-[#07111f] p-4"
                >
                  <h3 className="text-sm font-bold">{job.title}</h3>

                  <p className="mt-1 text-xs text-slate-400">
                    {job.company}
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                    {job.type}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <h2 className="text-xl font-bold">Recommended Projects</h2>

            <p className="mt-2 text-sm text-slate-500">
              Build these for your portfolio
            </p>

            <div className="mt-6 space-y-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#07111f] p-4"
                >
                  <span className="text-sm font-bold text-cyan-400">
                    0{index + 1}
                  </span>

                  <span className="text-sm text-slate-300">
                    {project}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <h2 className="text-xl font-bold">Learning Resources</h2>

            <p className="mt-2 text-sm text-slate-500">
              Start learning these topics
            </p>

            <div className="mt-6 space-y-3">
              {resources.map((resource, index) => (
                <motion.div
                  key={resource}
                  whileHover={{ x: 5 }}
                  className="rounded-2xl border border-slate-800 bg-[#07111f] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400">→</span>

                    <span className="text-sm text-slate-300">
                      {resource}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 text-center sm:p-8"
        >
          <h2 className="text-2xl font-black">
            Ready to start your roadmap?
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
            Focus on the skill gaps, complete the roadmap projects, and keep
            building your career profile.
          </p>

          <motion.a
            href="/profile"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 inline-block rounded-full bg-cyan-400 px-7 py-3 font-bold text-[#07111f] transition hover:bg-cyan-300"
          >
            Update My Profile →
          </motion.a>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>© 2026 AI Career Agent</p>
          <p>AI-powered career guidance for students</p>
        </div>
      </footer>
    </main>
  );
}