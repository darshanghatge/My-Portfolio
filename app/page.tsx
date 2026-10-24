"use client";

import React, { useState } from "react";
<<<<<<< HEAD
import Image from "next/image";
=======
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
import { SectionIndicator } from "@/components/navigation/section-indicator";
import { ScreenshotHeading } from "@/components/hero/ScreenshotHeading";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Globe,
  Sparkles,
  Send,
  Mail,
  ChevronDown,
  Terminal,
  ExternalLink,
  Layers,
  Database,
  ShieldCheck,
  CheckCircle2,
  FileText,
<<<<<<< HEAD
  Loader2,
  AlertCircle,
=======
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
} from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

export default function Home() {
<<<<<<< HEAD
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "activation_needed" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setStatusMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === true || data.success === "true") {
        setSubmitStatus("success");
        setStatusMessage(
          "Thank you for reaching out! Your message has been sent to darshanghatge@gmail.com. I will get back to you shortly."
        );
        setFormData({ name: "", email: "", message: "" });
      } else if (
        typeof data.message === "string" &&
        data.message.toLowerCase().includes("activation")
      ) {
        setSubmitStatus("activation_needed");
        setStatusMessage(
          "FormSubmit dispatched an 'Activate Form' confirmation email to darshanghatge@gmail.com. Please click the link in your inbox to enable instant message forwarding!"
        );
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
        setStatusMessage(data.message || "Unable to send message right now. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Transmission error:", err);
      // Direct client fallback to FormSubmit in case server route encounters issue
      try {
        const directRes = await fetch("https://formsubmit.co/ajax/darshanghatge@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: `New Portfolio Message from ${formData.name}`,
            _replyto: formData.email,
            _captcha: "false",
          }),
        });
        const directData = await directRes.json();
        if (directData.success === true || directData.success === "true") {
          setSubmitStatus("success");
          setStatusMessage(
            "Thank you for reaching out! Your message has been sent to darshanghatge@gmail.com. I will get back to you shortly."
          );
          setFormData({ name: "", email: "", message: "" });
        } else if (
          typeof directData.message === "string" &&
          directData.message.toLowerCase().includes("activation")
        ) {
          setSubmitStatus("activation_needed");
          setStatusMessage(
            "FormSubmit dispatched an 'Activate Form' confirmation email to darshanghatge@gmail.com. Please click the link in your inbox to enable instant message forwarding!"
          );
          setFormData({ name: "", email: "", message: "" });
        } else {
          setSubmitStatus("error");
          setStatusMessage("Could not send message. Please contact darshanghatge@gmail.com directly.");
        }
      } catch {
        setSubmitStatus("error");
        setStatusMessage("Network error. Please contact darshanghatge@gmail.com directly.");
      }
    } finally {
      setIsSubmitting(false);
    }
=======
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 4000);
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
  };

  const scrollTo = (id: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("orb-section-change", { detail: id }));
    }
    const el = document.querySelector(`[data-orb="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-zinc-100">
      {/* Top Floating Glass Navigation Header */}
      <header className="sticky top-0 z-40 w-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between backdrop-blur-md bg-black/30 border-b border-white/5">
<<<<<<< HEAD
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-3 shrink-0 group text-left cursor-pointer focus:outline-none"
          aria-label="Return to front page"
          title="Return to front page"
        >
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.35)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] group-hover:border-cyan-400 transition-all duration-300 bg-[#070b1f]">
            <Image
              src="/logo.png"
              alt="Darshan Ghatge Logo"
              width={36}
              height={36}
              unoptimized
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="font-semibold tracking-tight text-sm md:text-base hidden sm:inline text-white group-hover:text-cyan-300 transition-colors">
            Darshan Ghatge
          </span>
        </button>

        {/* Technical Ruler Index in the Upper Middle */}
        <div className="flex-1 flex justify-center items-center px-1 sm:px-4 lg:px-6 max-w-xl">
          <SectionIndicator />
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={() => scrollTo("contact")}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer"
          >
            Let&apos;s Connect
          </button>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section
        data-orb="hero"
        id="hero"
        className="min-h-[calc(100vh-64px)] flex flex-col justify-center px-4 sm:px-8 md:px-14 lg:px-20 py-6 sm:py-8 md:py-10 relative overflow-hidden"
      >
        <div className="max-w-2xl relative z-10 flex flex-col items-start w-full">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] sm:text-xs text-zinc-300 mb-3 sm:mb-4 backdrop-blur-md max-w-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>Creative Technologist &amp; Full-Stack Engineer</span>
          </div>

          {/* Animated Screenshot Snipping Selection Frame */}
          <ScreenshotHeading />

          {/* Introduction Card with Transparent Glass Screen */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-cyan-500/30 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-3.5 sm:mb-4 max-w-xl relative overflow-hidden group w-full">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
              A Full-Stack Developer passionate about building modern, responsive web applications with intuitive UI/UX, robust backend systems, and scalable solutions that turn ideas into reality.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full">
            <button
              onClick={() => scrollTo("projects")}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs sm:text-sm flex items-center gap-2 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs sm:text-sm flex items-center gap-2 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              title="Open Darshan Ghatage's Resume (PDF)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>
            <a
              href="mailto:darshanghatge@gmail.com"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs sm:text-sm flex items-center gap-2 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              title="Email darshanghatge@gmail.com directly"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pt-4 mt-4 border-t border-white/10 w-full max-w-xl lg:max-w-2xl">
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-cyan-400">3.5+</div>
              <div className="text-[10px] sm:text-xs text-zinc-300 font-medium mt-0.5 leading-tight">Years Coding</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-indigo-400">15+</div>
              <div className="text-[10px] sm:text-xs text-zinc-300 font-medium mt-0.5 leading-tight">Technologies &amp; Tools</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-purple-400">9+</div>
              <div className="text-[10px] sm:text-xs text-zinc-300 font-medium mt-0.5 leading-tight">Projects &amp; Research</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-emerald-400">4</div>
              <div className="text-[10px] sm:text-xs text-zinc-300 font-medium mt-0.5 leading-tight">Certifications &amp; Awards</div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden 2xl:flex flex-col items-center gap-1 text-zinc-500 animate-bounce">
          <span className="text-[9px] font-mono tracking-widest uppercase">Scroll Down</span>
          <ChevronDown className="w-3 h-3" />
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section
        data-orb="about"
        id="about"
        className="min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20 lg:py-28 relative overflow-hidden"
      >
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Spatial Spacer for the orb on desktop left */}
          <div className="hidden lg:block w-[36%] min-h-[220px]" aria-hidden="true" />

          {/* Content container on right */}
          <div className="w-full lg:w-[64%] flex flex-col gap-3 sm:gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>02 // PHILOSOPHY &amp; BACKGROUND</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold tracking-tight leading-tight">
              I turn ideas into
              {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                fast, &amp; reliable web apps.
              </span>
            </h2>

            <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm md:text-base max-w-2xl">
              I’m a React and Next.js developer who builds fast, role-aware web applications and wires them to solid backend infrastructure. From multi-tenant ERP platforms to placement dashboards, every interface is engineered for clean component architecture, secure authentication, and production-ready deployment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mt-1 sm:mt-2">
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 group">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                    Modern Frontend Engineering
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-200 leading-relaxed">
                  Next.js 14 (App Router), React 18, TypeScript, Redux Toolkit, TanStack React Query, and React Hook Form with Zod, styled using Tailwind CSS.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-purple-500/40 transition-all duration-300 group">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors">
                    Full-Stack Architecture
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-200 leading-relaxed">
                  Spring Boot and Node.js services with REST, GraphQL (Apollo), and Socket.IO, built on multi-tenant design with RBAC and permission-driven access.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-indigo-500/40 transition-all duration-300 group">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors">
                    Real-time Data Systems
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-200 leading-relaxed">
                  PostgreSQL, MongoDB, and MySQL with indexing and query optimization (~35% faster queries), plus real-time notifications over WebSockets
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-300 group">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                    Cloud & Reliable Delivery
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-200 leading-relaxed">
                  B.E. in Computer Science (2026) · Published researcher, INCOFT-2025 · Currently building a multi-tenant Education ERP at Seratek System.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROJECTS */}
      <section
        data-orb="projects"
        id="projects"
        className="min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 py-16 sm:py-24 relative"
      >
        <div className="max-w-6xl w-full mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-3">
              <Code2 className="w-3.5 h-3.5" />
              <span>03 // FEATURED WORK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Things I’ve built,
              and what I learned building them
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg">
              A mix of professional work, personal builds, and research. Each one taught me something different.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
            {/* Project Card 1 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 group flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(6,182,212,0.15)]">
              <div>
                {/* Project Image Preview */}
                <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/40">
                  <Image
                    src="/projects/educational-erp.png"
                    alt="Educational ERP Platform Dashboard"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/60 via-transparent to-transparent pointer-events-none z-10" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    Educational ERP Platform (Live Project)
                  </h3>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href="https://webdeskdev2.akronsystems.com/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Live Demo"
                      title="Open Live ERP Platform"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed mb-4">
                  A multi-tenant education management platform with admissions, academics, examinations, fees, HR, and role-based access.
                </p>
              </div>

              <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-md border border-cyan-400/20 w-fit">
                Next.js · React · TypeScript · Node.js · MongoDB
              </span>
            </div>

            {/* Project Card 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-purple-500/40 transition-all duration-300 group flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)]">
              <div>
                {/* Project Image Preview */}
                <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/40">
                  <Image
                    src="/projects/placement-management.png"
                    alt="Placement & Alumni Management System Dashboard"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/60 via-transparent to-transparent pointer-events-none z-10" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    Placement &amp; Alumni Management System
                  </h3>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href="https://github.com/darshanghatge/Placement-Alumni-Management-System"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="GitHub Repository"
                      title="View GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed mb-4">
                  Showcase reusable components, role-based dashboards, JWT authentication, and deployment.
                </p>
              </div>

              <span className="text-xs font-mono text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded-md border border-purple-400/20 w-fit">
                React · Spring Boot · PostgreSQL · AWS
              </span>
            </div>

            {/* Project Card 3 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-blue-500/40 transition-all duration-300 group flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)]">
              <div>
                {/* Project Image Preview */}
                <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/40">
                  <Image
                    src="/projects/ecommerce-medicines.png"
                    alt="E-Commerce Platform Storefront"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/60 via-transparent to-transparent pointer-events-none z-10" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    E-Commerce Platform
                  </h3>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href="https://github.com/darshanghatge/CBK-Medicines-DP-main-"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="GitHub Repository"
                      title="View GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed mb-4">
                  Highlight product catalog, cart management, protected routes, REST APIs, and deployment.
                </p>
              </div>

              <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-md border border-blue-400/20 w-fit">
                MERN Stack · JWT · AWS EC2 · S3 · Nginx
              </span>
            </div>

            {/* Project Card 4 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)]">
              <div>
                {/* Project Image Preview */}
                <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden mb-4 border border-white/10 bg-black/40">
                  <Image
                    src="/projects/underwater-yolo.jpg"
                    alt="Underwater Object Detection using YOLO11"
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050816]/60 via-transparent to-transparent pointer-events-none z-10" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Underwater Object Detection
                  </h3>
                  <div className="flex gap-2 shrink-0">
                    <a
                      href="https://github.com/darshanghatge/-Underwater-Object-Detection-using-YOLO11-Architecture-"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="GitHub Repository"
                      title="View GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed mb-4">
                  Give this project a separate research-style case study with the problem, model approach, sample predictions, evaluation metrics, and your INCOFT-2025 publication.
                </p>
              </div>

              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md border border-emerald-400/20 w-fit">
                Python · YOLOv11 · Computer Vision
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SKILLS */}
      <section
        data-orb="skills"
        id="skills"
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24 py-16 sm:py-24 relative text-center"
      >
        <div className="max-w-4xl w-full mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>04 // TECHNICAL ARSENAL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Mostly frontend, comfortable across the stack
          </h2>
          <p className="text-zinc-300 max-w-xl mx-auto text-base sm:text-lg mb-12">
            I’m strongest in React and Next.js, and comfortable going deeper into the backend when a project needs it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {/* Frontend & 3D */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300">
              <div className="text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase mb-3">
                01. 3D &amp; Frontend
              </div>
              <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Next.js 14                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  React TypeScript                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Redux Toolkit                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  TanStack Query                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  React Hook Form Zod Tailwind CSS
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Bootstrap
                </li>
              </ul>
            </div>

            {/* Backend & Cloud */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-indigo-400/40 transition-all duration-300">
              <div className="text-indigo-400 text-xs font-mono font-semibold tracking-wider uppercase mb-3">
                02.  Backend & APIs
              </div>
              <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Node.js
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Express
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Spring Boot
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  GraphQL &amp; REST
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Socket.IO
                </li>
              </ul>
            </div>

            {/* Architecture */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300">
              <div className="text-purple-400 text-xs font-mono font-semibold tracking-wider uppercase mb-3">
                03. Databases
              </div>
              <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  PostgreSQL
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  MongoDB
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  MySQL
                </li>

              </ul>
            </div>

            {/* DevOps & Tools */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-emerald-400/40 transition-all duration-300">
              <div className="text-emerald-400 text-xs font-mono font-semibold tracking-wider uppercase mb-3">
                04. Cloud & DevOps
              </div>
              <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  AWS (EC2, S3, IAM)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Docker
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Nginx
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  GitHub  Actions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Azure Pipelines
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Linux Git
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: EXPERIENCE */}
      <section
        data-orb="experience"
        id="experience"
        className="min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 py-16 sm:py-24 relative"
      >
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Spatial Spacer for the orb on desktop left */}
          <div className="hidden lg:block w-1/3 min-h-[300px]" aria-hidden="true" />

          {/* Timeline on right */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono w-fit">
              <Globe className="w-3.5 h-3.5" />
              <span>05 // CAREER TIMELINE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
              Where I’ve worked,
              and what I got done
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg mb-4">
              Track record of designing, delivering, and scaling production systems.
            </p>

            <div className="space-y-6">
              {/* Timeline Item 1 */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative pl-8 border-l-2 border-l-cyan-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-lg font-bold text-white">
                    Full Stack Web Developer Intern
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                    Aug 2026 - Present
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-300 mb-3">
                  Seratek System Pvt Ltd
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                  I’m building a multi-tenant education ERP, working on both the frontend and the backend.
                </p>
                <ul className="space-y-2 text-sm text-zinc-400 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                    <span>Built the Next.js and TypeScript frontend, where each role (admin, staff, student, candidate) sees only the menus and pages it should</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                    <span>Set up secure logins with Google OAuth, OTP, and cookie-based sessions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                    <span>Integrated PayU online payments for fees, applications, and exams, including refunds</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2" />
                    <span>Added real-time notifications, PDF/Excel exports, and automated testing and deployment</span>
                  </li>
                </ul>
              </div>

              {/* Timeline Item 2 */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative pl-8 border-l-2 border-l-indigo-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-lg font-bold text-white">
                    Full Stack Java Developer Intern (React Focus)
                  </h3>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">
                    Jan 2026 - Jun 2026
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-300 mb-3">
                  ClickCrawl Media Pvt Ltd
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                  I built the frontend for a placement and alumni management platform.
                </p>
                <ul className="space-y-2 text-sm text-zinc-400 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />
                    <span>Created reusable React components and dashboards for different user roles</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />
                    <span>Connected login and role-based access to the UI</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />
                    <span>Deployed the app to AWS and automated releases, cutting deployment time by 60%</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-2" />
                    <span>Redesigned the database schema, making queries about 35% faster</span>
                  </li>
                </ul>
              </div>

              {/* Timeline Item 3 */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative pl-8 border-l-2 border-l-purple-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-lg font-bold text-white">
                    Web Design &amp; Development Intern
                  </h3>
                  <span className="text-xs font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
                    Aug 2022 - Feb 2023
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-300 mb-3">
                  SV Mind Logic
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                  This was my first real project: an online medicine store, built from the database up.
                </p>
                <ul className="space-y-2 text-sm text-zinc-400 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-2" />
                    <span>Designed the database for products, inventory, and orders</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-2" />
                    <span>Built responsive pages that work across browsers and load faster</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
=======
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-mono font-bold text-white text-sm shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            DG
          </div>
          <span className="font-semibold tracking-tight text-sm md:text-base hidden sm:inline">
            Darshan Ghatge <span className="text-cyan-400"></span>
          </span>
        </div>

        {/* Technical Ruler Index in the Upper Middle */}
        <div className="flex-1 flex justify-center items-center px-2 lg:px-6">
          <SectionIndicator />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => scrollTo("contact")}
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            Let&apos;s Connect
          </button>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section
        data-orb="hero"
        id="hero"
        className="min-h-[calc(100vh-64px)] flex flex-col justify-center px-6 md:px-14 lg:px-20 py-4 sm:py-6 relative overflow-hidden"
      >
        <div className="max-w-2xl relative z-10 flex flex-col items-start">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300 mb-3 sm:mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>Creative Technologist &amp; Full-Stack Engineer</span>
          </div>

          {/* Animated Screenshot Snipping Selection Frame */}
          <ScreenshotHeading />

          {/* Introduction Card with Transparent Glass Screen */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-cyan-500/30 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.3)] mb-3.5 sm:mb-4 max-w-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
              A Full-Stack Developer passionate about building modern, responsive web applications with intuitive UI/UX, robust backend systems, and scalable solutions that turn ideas into reality.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollTo("projects")}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs sm:text-sm flex items-center gap-2 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Explore Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs sm:text-sm flex items-center gap-2 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
              title="Open Darshan Ghatage's Resume (PDF)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>
            <button
              onClick={() => scrollTo("contact")}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs sm:text-sm flex items-center gap-2 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-3 sm:gap-5 md:gap-6 pt-3.5 mt-3.5 sm:pt-4 sm:mt-4 border-t border-white/10 max-w-xl lg:max-w-2xl">
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-cyan-400">3.5+</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 leading-tight">Years Coding</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-indigo-400">15+</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 leading-tight">Technologies &amp; Tools</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-purple-400">9+</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 leading-tight">Projects &amp; Research</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-extrabold text-emerald-400">4</div>
              <div className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 leading-tight">Certifications &amp; Awards</div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 hidden 2xl:flex flex-col items-center gap-1 text-zinc-500 animate-bounce">
          <span className="text-[9px] font-mono tracking-widest uppercase">Scroll Down</span>
          <ChevronDown className="w-3 h-3" />
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section
        data-orb="about"
        id="about"
        className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-20 py-8 sm:py-12 lg:py-14 relative overflow-hidden"
      >
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Spatial Spacer for the orb on desktop left */}
          <div className="hidden lg:block w-[36%] min-h-[220px]" aria-hidden="true" />

          {/* Content container on right */}
          <div className="w-full lg:w-[64%] flex flex-col gap-3 sm:gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>02 // PHILOSOPHY &amp; BACKGROUND</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-extrabold tracking-tight leading-tight">
              Designing at the intersection of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                Performance &amp; Aesthetics
              </span>
            </h2>

            <p className="text-zinc-300 leading-relaxed text-xs sm:text-sm md:text-base max-w-2xl">
              I specialize in engineering fluid, tactile web applications that combine
              rich 3D spatial computing with high-throughput backend infrastructure.
              Every interaction is engineered for zero-jank frame rates, mathematical
              motion damping, and accessible modern semantics.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 mt-1 sm:mt-2">
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 group">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                    GPU-Accelerated 3D
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  Three.js, GLSL custom shaders, and WebGL optimization for buttery 60/120 FPS
                  across both desktop and mobile devices.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-purple-500/40 transition-all duration-300 group">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors">
                    Resilient Architecture
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  Next.js App Router, React Server Components, TypeScript type-safety, and
                  scalable microservices.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-indigo-500/40 transition-all duration-300 group">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Database className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors">
                    Real-time Data Systems
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  WebSockets, distributed edge state, PostgreSQL, and low-latency database
                  query optimization.
                </p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-300 group">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                    Inclusive &amp; Accessible
                  </h3>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
                  Graceful WebGL fallbacks, reduced motion compliance, screen reader friendliness,
                  and sub-second Time to Interactive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PROJECTS */}
      <section
        data-orb="projects"
        id="projects"
        className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 py-28 relative"
      >
        <div className="max-w-6xl w-full mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono mb-3">
              <Code2 className="w-3.5 h-3.5" />
              <span>03 // FEATURED WORK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Highlighted Creations
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg">
              Selected productions exploring spatial depth, real-time telemetry, and
              high-performance web engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {/* Project Card 1 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-cyan-500/40 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-md border border-cyan-400/20">
                    WebGL / Three.js / Next.js
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  Aether Spatial Engine
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  Next-generation 3D canvas system featuring transmission optics, multi-pass
                  Fresnel highlights, and zero-rerender reactive scroll physics.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 text-xs text-zinc-400 font-mono">
                <span>#ReactThreeFiber</span>
                <span>#ShaderMaterial</span>
                <span>#TypeScript</span>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-purple-500/40 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-purple-400 bg-purple-400/10 px-2.5 py-1 rounded-md border border-purple-400/20">
                    Distributed Cloud / Edge
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  Pulse Telemetry Dashboard
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  Real-time monitoring platform handling 25,000+ metric streams/sec with
                  sub-50ms glass charts, automated alerting, and anomaly prediction.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 text-xs text-zinc-400 font-mono">
                <span>#NextJS</span>
                <span>#WebSockets</span>
                <span>#Go</span>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-blue-500/40 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-md border border-blue-400/20">
                    Full-Stack AI Platform
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  Nexus AI Studio
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  Collaborative multi-modal agent workbench with canvas-based visual prompting,
                  memory graph visualization, and streaming execution.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 text-xs text-zinc-400 font-mono">
                <span>#TypeScript</span>
                <span>#VectorSearch</span>
                <span>#Tailwind</span>
              </div>
            </div>

            {/* Project Card 4 */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md border border-emerald-400/20">
                    Open Source Library
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                    <a
                      href="#"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  Vortex Kinetic UI
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                  Spring-physics animation utilities and accessible keyboard navigation hooks
                  designed for fluid micro-interactions.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 text-xs text-zinc-400 font-mono">
                <span>#FramerMotion</span>
                <span>#Accessibility</span>
                <span>#npm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SKILLS */}
      <section
        data-orb="skills"
        id="skills"
        className="min-h-screen flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-28 relative text-center"
      >
        <div className="max-w-4xl w-full mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>04 // TECHNICAL ARSENAL</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Core Competencies &amp; Stack
          </h2>
          <p className="text-zinc-300 max-w-xl mx-auto text-base sm:text-lg mb-12">
            The spatial orb expands behind this section as a planetary backdrop.
            Here is my technology stack across frontend, 3D, backend, and DevOps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
            {/* Frontend & 3D */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-300">
              <div className="text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase mb-3">
                01. 3D &amp; Frontend
              </div>
              <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Three.js / WebGL
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  React Three Fiber
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Next.js 15/16 App
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  TypeScript &amp; React 19
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Tailwind CSS v4
                </li>
              </ul>
            </div>

            {/* Backend & Cloud */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-indigo-400/40 transition-all duration-300">
              <div className="text-indigo-400 text-xs font-mono font-semibold tracking-wider uppercase mb-3">
                02. Cloud &amp; APIs
              </div>
              <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Node.js &amp; Bun
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  PostgreSQL / Prisma
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Redis Caching
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  GraphQL &amp; REST
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Serverless Functions
                </li>
              </ul>
            </div>

            {/* Architecture */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-purple-400/40 transition-all duration-300">
              <div className="text-purple-400 text-xs font-mono font-semibold tracking-wider uppercase mb-3">
                03. Architecture
              </div>
              <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Micro-frontends
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  State Machines
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Event-Driven I/O
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  SSR &amp; Edge Runtime
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Web Workers &amp; WASM
                </li>
              </ul>
            </div>

            {/* DevOps & Tools */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-emerald-400/40 transition-all duration-300">
              <div className="text-emerald-400 text-xs font-mono font-semibold tracking-wider uppercase mb-3">
                04. DevOps &amp; Quality
              </div>
              <ul className="space-y-2 text-sm text-zinc-300 font-mono">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Docker &amp; CI/CD
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  AWS &amp; Cloudflare
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Playwright &amp; Vitest
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Lighthouse 100/100
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Git / Trunk Flow
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: EXPERIENCE */}
      <section
        data-orb="experience"
        id="experience"
        className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 py-28 relative"
      >
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Spatial Spacer for the orb on desktop left */}
          <div className="hidden lg:block w-1/3 min-h-[300px]" aria-hidden="true" />

          {/* Timeline on right */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono w-fit">
              <Globe className="w-3.5 h-3.5" />
              <span>05 // CAREER TIMELINE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
              Experience &amp; Leadership
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg mb-4">
              Track record of designing, delivering, and scaling production systems.
            </p>

            <div className="space-y-6">
              {/* Timeline Item 1 */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative pl-8 border-l-2 border-l-cyan-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-lg font-bold text-white">
                    Lead Creative Developer &amp; Systems Architect
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                    2023 — Present
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-300 mb-3">
                  Spatial Labs Inc.
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Spearheaded the development of 3D web platforms for Fortune 500 brands.
                  Engineered custom WebGL shaders, reduced bundle footprint by 44%, and
                  achieved steady 60fps across low-power mobile devices.
                </p>
              </div>

              {/* Timeline Item 2 */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative pl-8 border-l-2 border-l-indigo-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-lg font-bold text-white">
                    Senior Full-Stack Engineer
                  </h3>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">
                    2021 — 2023
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-300 mb-3">
                  Hyperion Cloud Systems
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Architected high-scale analytics applications and WebSocket pipelines.
                  Migrated monolith workloads to Next.js App Router and edge deployments,
                  improving page response latency by 68%.
                </p>
              </div>

              {/* Timeline Item 3 */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md relative pl-8 border-l-2 border-l-purple-400">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-lg font-bold text-white">
                    Software Engineer — Interactive Graphics
                  </h3>
                  <span className="text-xs font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
                    2019 — 2021
                  </span>
                </div>
                <div className="text-sm font-medium text-zinc-300 mb-3">
                  Nova Studio
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Engineered rich interactive client portals, marketing experiences, and
                  component libraries with TypeScript, WebGL, and micro-interactions.
                </p>
              </div>
            </div>
          </div>
        </div>
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
      </section>

      {/* SECTION 6: CONTACT */}
      <section
        data-orb="contact"
        id="contact"
<<<<<<< HEAD
        className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 lg:px-24 py-16 sm:py-24 relative text-center"
=======
        className="min-h-screen flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-28 relative text-center"
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
      >
        <div className="max-w-xl w-full mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
            <Mail className="w-3.5 h-3.5" />
            <span>06 // INITIATE CONVERSATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Let&apos;s Build Something Remarkable
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg mb-8 leading-relaxed">
<<<<<<< HEAD
            Whether you have an upcoming spatial project or
=======
            Whether you have an upcoming spatial project, architectural challenge, or
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
            high-impact role, I&apos;d love to hear from you.
          </p>

          {/* Interactive Contact Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-2xl text-left shadow-2xl shadow-cyan-950/20">
<<<<<<< HEAD
            {submitStatus === "success" ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Message Dispatched!</h3>
                <p className="text-sm text-zinc-300 max-w-sm leading-relaxed">
                  {statusMessage}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : submitStatus === "activation_needed" ? (
              <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center text-amber-400">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Activation Required</h3>
                <p className="text-sm text-zinc-300 max-w-md leading-relaxed">
                  {statusMessage}
                </p>
                <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  Destination: <span className="font-mono font-semibold">darshanghatge@gmail.com</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitStatus("idle")}
                  className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-cyan-300 transition-colors cursor-pointer"
                >
                  Back to Form
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                {submitStatus === "error" && (
                  <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                    <div>
                      <p className="font-semibold">Transmission Failed</p>
                      <p className="text-red-300/90 mt-0.5">{statusMessage}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-100 font-semibold mb-2">
                    Name
=======
            {formSubmitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-cyan-400 animate-bounce">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Message Dispatched!</h3>
                <p className="text-sm text-zinc-400 max-w-xs">
                  Thank you for reaching out. I will respond to your inquiry within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                    Your Name
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
                  </label>
                  <input
                    type="text"
                    required
<<<<<<< HEAD
                    disabled={isSubmitting}
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-zinc-300 font-medium text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all disabled:opacity-50"
=======
                    placeholder="Alex Mercer"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
                  />
                </div>

                <div>
<<<<<<< HEAD
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-100 font-semibold mb-2">
=======
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
<<<<<<< HEAD
                    disabled={isSubmitting}
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-zinc-300 font-medium text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all disabled:opacity-50"
=======
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
                  />
                </div>

                <div>
<<<<<<< HEAD
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-100 font-semibold mb-2">
=======
                  <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
<<<<<<< HEAD
                    disabled={isSubmitting}
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/20 text-white placeholder-zinc-300 font-medium text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all resize-none disabled:opacity-50"
=======
                    placeholder="Tell me about your project, timeline, or idea..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
                  />
                </div>

                <button
                  type="submit"
<<<<<<< HEAD
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
=======
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-medium text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Transmit Message</span>
                  <Send className="w-4 h-4" />
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
                </button>
              </form>
            )}

            {/* Social link shortcuts */}
<<<<<<< HEAD
            <div className="flex items-center justify-center gap-6 pt-6 mt-6 border-t border-white/15 text-zinc-200 text-xs">
              <a
                href="https://github.com/darshanghatge"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors text-zinc-200"
              >
                <GithubIcon className="w-4 h-4 text-zinc-300" />
                <span className="text-zinc-200 hover:text-white">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/darshan1909/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors text-zinc-200"
              >
                <LinkedinIcon className="w-4 h-4 text-zinc-300" />
                <span className="text-zinc-200 hover:text-white">LinkedIn</span>
              </a>
              <a
                href="mailto:darshanghatge@gmail.com"
                className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors text-zinc-200"
                title="Direct email: darshanghatge@gmail.com"
              >
                <Mail className="w-4 h-4 text-zinc-300" />
                <span className="text-zinc-200 hover:text-white font-mono">darshanghatge@gmail.com</span>
=======
            <div className="flex items-center justify-center gap-6 pt-6 mt-6 border-t border-white/10 text-zinc-400 text-xs">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                <LinkedinIcon className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:contact@darshanp.dev"
                className="hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
>>>>>>> 793be5ff4c114adbd7f0d36875f7fd7aab48e540
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="w-full py-8 px-6 border-t border-white/5 text-center text-xs text-zinc-500 backdrop-blur-sm">
        <p>© 2026 Darshan P. Built with Next.js, Three.js, React Three Fiber &amp; Tailwind CSS.</p>
        <p className="mt-1 text-[11px] text-zinc-600 font-mono">
          Scroll-Reactive Orb Spatial Architecture • 60+ FPS
        </p>
      </footer>
    </div>
  );
}
