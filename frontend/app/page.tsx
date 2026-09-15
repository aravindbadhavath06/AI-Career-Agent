"use client";

import { motion } from "framer-motion";

const features = [
  {
    number: "01",
    title: "Profile Analysis",
    description:
      "Understand your education, skills, interests, experience, and career goals.",
  },
  {
    number: "02",
    title: "Career Matching",
    description:
      "Discover career paths that match your current profile and strengths.",
  },
  {
    number: "03",
    title: "Skill Gap Analysis",
    description:
      "Identify the skills you need to develop for your target career.",
  },
  {
    number: "04",
    title: "Personal Roadmap",
    description:
      "Get a practical learning roadmap with projects, resources, and opportunities.",
  },
];

const steps = [
  "Build your profile",
  "AI analyzes your skills",
  "Find your best career match",
  "Get your personalized roadmap",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 8, scale: 1.08 }}
            transition={{ duration: 0.2 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 font-black text-[#07111f]"
          >
            AI
          </motion.div>

          <span className="text-xl font-bold tracking-tight">
            Career Agent
          </span>
        </div>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a
            href="#features"
            className="transition duration-300 hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition duration-300 hover:text-white"
          >
            How It Works
          </a>

          <a
            href="#about"
            className="transition duration-300 hover:text-white"
          >
            About
          </a>
        </div>

        <motion.a
          href="/profile"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#07111f] transition duration-300 hover:bg-cyan-300"
        >
          Get Started
        </motion.a>
      </motion.nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background Glow */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:px-8 lg:pb-32 lg:pt-28">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300"
            >
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="h-2 w-2 rounded-full bg-cyan-400"
              />

              AI-powered career guidance
            </motion.div>

            {/* Heading */}
            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Turn your skills into your
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.4,
                  duration: 0.7,
                }}
                className="inline-block text-cyan-400"
              >
                {" "}
                career path.
              </motion.span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.7,
              }}
              className="mt-7 max-w-xl text-lg leading-8 text-slate-400"
            >
              AI Career Agent analyzes your profile, matches you with suitable
              careers, identifies your skill gaps, and creates a personalized
              roadmap to help you move forward.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.7,
                duration: 0.7,
              }}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <motion.a
                href="/profile"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(34,211,238,0.25)",
                }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-cyan-400 px-7 py-3.5 text-center font-bold text-[#07111f] transition duration-300 hover:bg-cyan-300"
              >
                Analyze My Career →
              </motion.a>

              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-slate-700 px-7 py-3.5 text-center font-semibold text-white transition duration-300 hover:border-slate-500 hover:bg-white/5"
              >
                See How It Works
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.3,
            }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur"
            >
              {/* Career Match */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Your career match
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Data Scientist
                  </h2>
                </div>

                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 1,
                    duration: 0.7,
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-cyan-400 text-xl font-black text-cyan-300"
                >
                  88%
                </motion.div>
              </div>

              <div className="space-y-3">
                {/* Profile Strength */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                  className="rounded-2xl border border-slate-800 bg-[#07111f] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Profile strength
                    </span>

                    <span className="text-sm text-cyan-300">
                      Strong
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "82%" }}
                      transition={{
                        delay: 1.3,
                        duration: 1.2,
                      }}
                      className="h-full rounded-full bg-cyan-400"
                    />
                  </div>
                </motion.div>

                {/* Skill Gaps */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 }}
                  className="rounded-2xl border border-slate-800 bg-[#07111f] p-4"
                >
                  <p className="mb-3 text-sm font-semibold">
                    Skill gaps
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <motion.span
                      whileHover={{ scale: 1.08 }}
                      className="rounded-full bg-red-400/10 px-3 py-1 text-xs text-red-300"
                    >
                      Statistics
                    </motion.span>

                    <motion.span
                      whileHover={{ scale: 1.08 }}
                      className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300"
                    >
                      Data Visualization
                    </motion.span>

                    <motion.span
                      whileHover={{ scale: 1.08 }}
                      className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-300"
                    >
                      Advanced ML
                    </motion.span>
                  </div>
                </motion.div>

                {/* Roadmap */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                  className="rounded-2xl border border-slate-800 bg-[#07111f] p-4"
                >
                  <p className="mb-3 text-sm font-semibold">
                    Personalized roadmap
                  </p>

                  <div className="space-y-3 text-sm text-slate-300">
                    {[
                      "Learn Statistics",
                      "Master Data Visualization",
                      "Build ML Projects",
                    ].map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 1.7 + index * 0.2,
                        }}
                        className="flex gap-3"
                      >
                        <span className="text-cyan-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        {item}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y border-slate-800/80 bg-[#091522]"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              What the agent does
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              From profile to career roadmap.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              The agent connects your current abilities with the skills,
              careers, projects, and resources that can move you forward.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                className="group rounded-3xl border border-slate-800 bg-[#07111f] p-6 transition duration-300 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-950/20"
              >
                <motion.span
                  whileHover={{ x: 5 }}
                  className="inline-block text-sm font-bold text-cyan-400"
                >
                  {feature.number}
                </motion.span>

                <h3 className="mt-8 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
      >
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Four steps.
              <br />
              One clear direction.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              No random career suggestions. Your recommendations are based on
              the information you provide about yourself.
            </p>
          </motion.div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                whileHover={{ x: 8 }}
                className="flex items-center gap-5 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 transition duration-300 hover:border-cyan-400/40"
              >
                <motion.div
                  whileHover={{
                    rotate: 8,
                    scale: 1.1,
                  }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400 font-black text-[#07111f]"
                >
                  {String(index + 1).padStart(2, "0")}
                </motion.div>

                <span className="font-semibold text-slate-200">
                  {step}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="px-6 pb-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-cyan-400/20 bg-cyan-400 p-8 sm:p-12 lg:p-16"
        >
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black tracking-tight text-[#07111f] sm:text-4xl">
                Ready to find your next career move?
              </h2>

              <p className="mt-3 text-[#07111f]/70">
                Build your profile and let the AI Career Agent analyze where
                your skills can take you.
              </p>
            </div>

            <motion.a
              href="/profile"
              whileHover={{
                scale: 1.05,
                x: 3,
              }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 rounded-full bg-[#07111f] px-7 py-3.5 font-bold text-white transition duration-300 hover:bg-slate-900"
            >
              Start Analysis →
            </motion.a>
          </div>
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