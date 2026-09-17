"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { api, type ChatMessage, type ProfileData } from "@/lib/api";

type SpeechRecognitionEventLike = Event & {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type SpeechRecognitionErrorEventLike = Event & {
  error: string;
};

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "⌂" },
  { name: "Opportunities", href: "/opportunities", icon: "◈" },
  { name: "Profile", href: "/profile", icon: "◎" },
  { name: "Skill Gap", href: "/skill-gap", icon: "◌" },
  { name: "Roadmap", href: "/roadmap", icon: "↗" },
  { name: "Progress", href: "/progress", icon: "◒" },
  { name: "Resources", href: "/resources", icon: "▣" },
  { name: "Resume Analyzer", href: "/resume", icon: "▤" },
  { name: "Ask Nexora", href: "/ask-nexora", icon: "✦" },
  { name: "Voice Assistant", href: "/voice", icon: "◉" },
];

export default function VoiceAssistantPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState("");

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  /* Theme */
  useEffect(() => {
    const savedTheme = localStorage.getItem("nexora-theme");

    if (savedTheme === "light") {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("nexora-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* Load real profile information */
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const data = await api.getProfile();

        if (mounted) {
          setProfile(data);
        }
      } catch {
        // Voice functionality does not depend on profile loading.
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  /* Browser speech recognition */
  useEffect(() => {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new Recognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = async (event) => {
      const transcript =
        event.results[0]?.[0]?.transcript?.trim() || "";

      if (!transcript) {
        setListening(false);
        return;
      }

      setListening(false);
      setVoiceError("");
      setConversationStarted(true);

      const history = messagesRef.current;

      const userMessage: ChatMessage = {
        role: "user",
        text: transcript,
      };

      setMessages((previous) => [...previous, userMessage]);
      setProcessing(true);

      try {
        const result = await api.askNexora(transcript, history);

        const reply =
          result.response?.trim() || result.message?.trim() || "";

        if (!reply) {
          throw new Error("Nexora returned an empty response.");
        }

        const assistantMessage: ChatMessage = {
          role: "assistant",
          text: reply,
        };

        setMessages((previous) => [...previous, assistantMessage]);

        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();

          const utterance = new SpeechSynthesisUtterance(reply);
          utterance.lang = "en-US";

          window.speechSynthesis.speak(utterance);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to connect to Nexora.";

        setVoiceError(message);
      } finally {
        setProcessing(false);
      }
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setVoiceError(
          "Microphone permission was denied. Please allow microphone access in your browser."
        );
      } else if (event.error === "no-speech") {
        setVoiceError("No speech was detected. Please try again.");
      } else {
        setVoiceError(`Voice recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      recognitionRef.current = null;
    };
  }, []);

  const startVoice = () => {
    if (!voiceSupported) {
      setVoiceError(
        "Voice recognition is not supported in this browser. Please use a browser with Web Speech API support."
      );
      return;
    }

    if (listening || processing) {
      return;
    }

    setVoiceError("");

    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch {
      setVoiceError(
        "Voice recognition could not be started. Please try again."
      );
    }
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const clearConversation = () => {
    setMessages([]);
    setConversationStarted(false);
    setVoiceError("");

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const profileInitial =
    profile?.name?.trim()?.charAt(0)?.toUpperCase() || "N";

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-[#07111f] text-white"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden w-64 border-r lg:flex lg:flex-col ${
          darkMode
            ? "border-slate-800 bg-[#07101d]"
            : "border-slate-200 bg-white"
        }`}
      >
        {/* Branding */}
        <div className="flex items-center gap-3 px-6 py-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400 font-black text-[#07111f]">
            NX
          </div>

          <div>
            <div
              className={`text-base font-bold ${
                darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              Agent Nexora
            </div>

            <div
              className={`text-xs ${
                darkMode ? "text-slate-500" : "text-slate-500"
              }`}
            >
              Navigate Your Next.
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {navigation.map((item) => {
            const active = item.href === "/voice";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-cyan-400 text-[#07111f]"
                    : darkMode
                      ? "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span className="flex w-5 justify-center text-base">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div
          className={`space-y-1 border-t p-3 ${
            darkMode ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              darkMode
                ? "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <span className="flex w-5 justify-center">⚙</span>
            Settings
          </Link>

          <Link
            href="/login"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              darkMode
                ? "text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                : "text-slate-600 hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <span className="flex w-5 justify-center">↪</span>
            Sign out
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className={`sticky top-0 z-30 flex items-center justify-between border-b px-4 py-4 lg:hidden ${
          darkMode
            ? "border-slate-800 bg-[#07101d]"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 font-black text-[#07111f]">
            NX
          </div>

          <div>
            <div className="text-sm font-bold">Agent Nexora</div>
            <div className="text-[10px] text-slate-500">
              Navigate Your Next.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            className={`rounded-lg px-3 py-2 text-sm ${
              darkMode
                ? "bg-slate-800 text-slate-200"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {darkMode ? "☀" : "☾"}
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-400 font-bold text-[#07111f]">
            {profileInitial}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="lg:ml-64">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {/* Top Bar */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <p
                className={`text-sm font-semibold ${
                  darkMode ? "text-cyan-400" : "text-cyan-600"
                }`}
              >
                VOICE ASSISTANT
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Talk to Nexora
              </h1>

              <p
                className={`mt-2 max-w-2xl text-sm leading-6 ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                Speak naturally about your career journey and receive
                responses from the Nexora AI assistant.
              </p>
            </div>

            <div className="hidden items-center gap-3 sm:flex">
              <button
                type="button"
                onClick={() => setDarkMode((value) => !value)}
                className={`rounded-xl border px-4 py-2 text-sm transition ${
                  darkMode
                    ? "border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/40"
                    : "border-slate-200 bg-white text-slate-700 hover:border-cyan-400"
                }`}
              >
                {darkMode ? "☀ Light" : "☾ Dark"}
              </button>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                  darkMode
                    ? "bg-cyan-400 text-[#07111f]"
                    : "bg-cyan-500 text-white"
                }`}
              >
                {profileInitial}
              </div>
            </div>
          </div>

          {/* Voice Area */}
          <section
            className={`rounded-3xl border p-6 sm:p-8 ${
              darkMode
                ? "border-slate-800 bg-slate-900/60"
                : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              {/* Voice Circle */}
              <motion.div
                animate={
                  listening
                    ? {
                        scale: [1, 1.08, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(34,211,238,0.25)",
                          "0 0 0 22px rgba(34,211,238,0)",
                          "0 0 0 0 rgba(34,211,238,0)",
                        ],
                      }
                    : {
                        scale: 1,
                      }
                }
                transition={{
                  duration: 1.5,
                  repeat: listening ? Infinity : 0,
                }}
                className="mt-4 flex h-40 w-40 items-center justify-center rounded-full bg-cyan-400 text-5xl font-black text-[#07111f]"
              >
                {processing ? "..." : listening ? "🎙" : "NX"}
              </motion.div>

              <h2 className="mt-8 text-2xl font-bold">
                {processing
                  ? "Nexora is thinking..."
                  : listening
                    ? "Listening..."
                    : conversationStarted
                      ? "Ready for your next question"
                      : "Start a voice conversation"}
              </h2>

              <p
                className={`mt-3 max-w-xl text-sm leading-6 ${
                  darkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {processing
                  ? "Your message has been sent to the Nexora AI assistant."
                  : listening
                    ? "Speak clearly. Your voice will be converted to text and sent to Nexora."
                    : "Click the microphone button and ask Nexora about your career, skills, opportunities, roadmap, or learning path."}
              </p>

              {/* Main Button */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {!listening ? (
                  <motion.button
                    type="button"
                    onClick={startVoice}
                    disabled={processing || !voiceSupported}
                    whileHover={!processing ? { scale: 1.04 } : undefined}
                    whileTap={!processing ? { scale: 0.96 } : undefined}
                    className={`rounded-full px-7 py-3.5 font-bold transition ${
                      processing || !voiceSupported
                        ? "cursor-not-allowed bg-slate-500/30 text-slate-500"
                        : "bg-cyan-400 text-[#07111f] hover:bg-cyan-300"
                    }`}
                  >
                    🎙 Start Speaking
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={stopVoice}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="rounded-full bg-red-400 px-7 py-3.5 font-bold text-[#07111f] hover:bg-red-300"
                  >
                    ■ Stop Listening
                  </motion.button>
                )}

                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearConversation}
                    disabled={listening || processing}
                    className={`rounded-full border px-7 py-3.5 font-semibold transition ${
                      darkMode
                        ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                        : "border-slate-300 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    Clear Conversation
                  </button>
                )}
              </div>

              {/* Support */}
              {!voiceSupported && (
                <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
                  Voice recognition is not supported by this browser.
                </div>
              )}

              {/* Error */}
              {voiceError && (
                <div
                  className={`mt-6 max-w-xl rounded-xl border px-4 py-3 text-sm ${
                    darkMode
                      ? "border-red-400/30 bg-red-400/10 text-red-300"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  {voiceError}
                </div>
              )}
            </div>
          </section>

          {/* Conversation */}
          {messages.length > 0 && (
            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p
                    className={`text-xs font-bold uppercase tracking-[0.18em] ${
                      darkMode ? "text-cyan-400" : "text-cyan-600"
                    }`}
                  >
                    Conversation
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Your Nexora session
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={`${message.role}-${index}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3xl rounded-2xl px-5 py-4 ${
                        message.role === "user"
                          ? "bg-cyan-400 text-[#07111f]"
                          : darkMode
                            ? "border border-slate-800 bg-slate-900 text-slate-200"
                            : "border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      <div className="mb-1 text-xs font-bold opacity-60">
                        {message.role === "user" ? "You" : "Nexora"}
                      </div>

                      <p className="whitespace-pre-wrap text-sm leading-6">
                        {message.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* How Voice Works */}
          <section className="mt-10">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Speak",
                  description:
                    "Use your microphone to ask Nexora a career-related question.",
                },
                {
                  number: "02",
                  title: "AI Response",
                  description:
                    "Your recognized message is sent to the real Nexora chat backend.",
                },
                {
                  number: "03",
                  title: "Listen",
                  description:
                    "Nexora's response is displayed and can be spoken by your browser.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className={`rounded-2xl border p-6 ${
                    darkMode
                      ? "border-slate-800 bg-slate-900/40"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <span className="text-sm font-bold text-cyan-400">
                    {item.number}
                  </span>

                  <h3 className="mt-5 text-lg font-bold">{item.title}</h3>

                  <p
                    className={`mt-2 text-sm leading-6 ${
                      darkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Backend Status */}
          <section
            className={`mt-8 rounded-2xl border p-5 ${
              darkMode
                ? "border-cyan-400/20 bg-cyan-400/5"
                : "border-cyan-200 bg-cyan-50"
            }`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-lg text-[#07111f]">
                ✓
              </div>

              <div>
                <p className="font-bold">Voice flow configured</p>

                <p
                  className={`mt-1 text-sm ${
                    darkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Speech recognition runs in the browser and recognized
                  messages are sent through the existing Nexora{" "}
                  <code className="rounded bg-slate-800/60 px-1.5 py-0.5 text-cyan-300">
                    /api/chat
                  </code>{" "}
                  API. The backend response is used for the voice reply.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}