"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { useRouter } from "next/navigation";

// ✅ Adjust the path to your Galaxy component as needed
// If Galaxy is in `app/components/Galaxy.tsx`, use: "@/app/components/Galaxy"
import Galaxy from "../components/Galaxy"

type Challenge = {
  id: "residence" | "celebration" | "discoveries";
  title: string;
  desc: string;
  image: string;
};

export default function ChallengesPage() {
  const router = useRouter();
  const titleRef = useRef<HTMLDivElement | null>(null);
  const cardsWrapRef = useRef<HTMLDivElement | null>(null);
  const [pressing, setPressing] = useState<string | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Title + subtitle entrance
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current.querySelectorAll(".title, .subtitle"),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Card stagger-in
    if (cardsWrapRef.current) {
      const cards = cardsWrapRef.current.querySelectorAll(".challenge-card");
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, rotateX: -6 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: cardsWrapRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const challenges: Challenge[] = [
    {
      id: "residence",
      title: "Residence Renovations",
      desc:
        "Reuse habitat frames & packaging into racks, insulation panels, storage modules, and benches.",
      image: "/assets/Revolution.png",
    },
    {
      id: "celebration",
      title: "Cosmic Celebrations",
      desc:
        "Repurpose fabrics and pouches into decorations, organizers, and comfort pieces for crew morale.",
      image: "/assets/Celebration.png",
    },
    {
      id: "discoveries",
      title: "Daring Discoveries",
      desc:
        "Transform lab byproducts and components into filters, repair parts, or composite feedstock.",
      image: "/assets/Innovation.png",
    },
  ];

  const handleSelect = (challengeId: string) => {
    setPressing(challengeId);
    // small press animation + route
    setTimeout(() => router.push("/Dashboard"), 1050);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0C] text-[#E7E8EA]">
      {/* --- BACKGROUND LAYERS --- */}
      {/* Galaxy: ensure it's actually visible (full size, behind content) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <Galaxy 
                  mouseRepulsion={true}
                  mouseInteraction={true}
                  density={5}
                  glowIntensity={0.1}
                  saturation={0.1}
                  twinkleIntensity={1}
                  rotationSpeed={0.05}
                  hueShift={150}
                />
              </div>

      {/* Soft top glow + subtle radial field (same vibe as landing) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-visible">
    {/* Top halo glow */}
    <div
      className="absolute top-0 left-1/2 -translate-x-1/2 w-[1800px] h-[1000px] blur-2xl mix-blend-screen"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(255,106,42,0.24), rgba(255,106,42,0.10), transparent 65%)",
      }}
    />
    {/* Light secondary halo */}
    {/* <div
      className="absolute -top-20 left-[30%] w-[800px] h-[300px] blur-2xl mix-blend-screen"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(255,106,42,0.16), transparent 70%)",
      }}
    /> */}
    {/* Faint ambient vignettes */}
    {/* <div className="absolute -top-20 -right-10 w-72 h-72 rounded-full blur-3xl bg-[#FF6B35]/20 mix-blend-screen" />
    <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full blur-3xl bg-[#FF6B35]/10 mix-blend-screen" /> */}
  </div>
      {/* --- CONTENT --- */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16 sm:py-20 md:py-24">
        {/* Title block */}
        <div ref={titleRef} className="text-center mb-10 sm:mb-14 md:mb-16">
          <div className="title inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-700 backdrop-blur-sm mb-4">
            <span className="text-xs sm:text-sm text-slate-300">Choose Your Challenge</span>
          </div>
          <h1 className="title text-3xl sm:text-4xl md:text-5xl font-bold">
            Pick a Mission Scenario
          </h1>
          <p className="subtitle mt-3 text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            A focused, single-screen hub that matches the dashboard style. Select one to jump right in.
          </p>
        </div>

        {/* Cards */}
        <div
          ref={cardsWrapRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {challenges.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`challenge-card group relative rounded-2xl bg-[#12141A] border border-[#222733] p-0 text-left overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] transition-transform will-change-transform ${
                pressing === c.id ? "scale-[0.98]" : "hover:scale-[1.01]"
              }`}
              aria-label={`Open ${c.title}`}
            >
              {/* Image (TOP) */}
              <div className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle top highlight */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent mix-blend-screen" />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-[#E7E8EA]">
                  {c.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                  {c.desc}
                </p>

                {/* CTA row */}
                <div className="mt-5 flex items-center gap-2 text-[#FF6B35] font-medium">
                  <span className="text-sm">Start</span>
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Bottom glow */}
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#FF6B35]/10 to-transparent" />
            </button>
          ))}
        </div>

        <p className="mt-8 text-center text-xs sm:text-sm text-slate-500">
          Tip: You can revisit this hub anytime from the dashboard.
        </p>
      </main>

      {/* Orange full-screen loader during press/route (optional but nice) */}
      {pressing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FF6B35]">
          <div className="w-14 h-14 rounded-full border-4 border-black border-t-transparent animate-spin" />
          <p className="mt-4 text-black font-medium">Loading scenario…</p>
        </div>
      )}
    </div>
  );
}
