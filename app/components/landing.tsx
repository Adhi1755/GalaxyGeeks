"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MarsChallengeLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLSectionElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const planetWrapRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const cometRef = useRef<HTMLDivElement | null>(null);
  const starsRef = useRef<Array<HTMLDivElement | null>>([]);
  const navRef = useRef<HTMLElement | null>(null);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      // Navbar scroll animation
      if (navRef.current) {
        gsap.to(navRef.current, {
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
        });
      }

      // Title & subtitle entrance
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(subtitleRef.current, {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.6,
      });

      // Planet subtle loop
      if (!prefersReduced && planetWrapRef.current) {
        gsap.to(planetWrapRef.current, {
          rotation: 3,
          scale: 1.01,
          duration: 8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Glow pulse
      if (!prefersReduced && glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.95,
          scale: 1.05,
          duration: 5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // Stars twinkle
      starsRef.current.forEach((s, i) => {
        if (!s) return;
        const dur = 3 + Math.random() * 4;
        const delay = Math.random() * 2;
        gsap.to(s, {
          opacity: 0.2 + Math.random() * 0.8,
          scale: 0.8 + Math.random() * 0.4,
          duration: dur,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: delay,
        });
      });

      // Comet sweep
      if (!prefersReduced && cometRef.current) {
        gsap.set(cometRef.current, { x: "-15%", y: "-10%", opacity: 0 });
        gsap.to(cometRef.current, {
          x: "115%",
          y: "40%",
          opacity: 1,
          duration: 2.5,
          ease: "power2.out",
          repeat: -1,
          repeatDelay: 8,
        });
      }

      // Scroll-driven planet blur & fade
      if (heroRef.current && planetWrapRef.current && glowRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            const blurPx = p * 12;
            const brightness = 1 - p * 0.4;
            const opacity = Math.max(0, 1 - p * 0.6);
            planetWrapRef.current!.style.filter = `blur(${blurPx}px) brightness(${brightness})`;
            planetWrapRef.current!.style.opacity = String(opacity);
            glowRef.current!.style.opacity = String(Math.max(0, 0.9 - p * 0.7));
          },
        });
      }

      // Section scroll animations
      sectionsRef.current.forEach((section, index) => {
        if (!section) return;
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            scrub: 1,
          },
          y: 60,
          opacity: 0,
          duration: 1,
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Generate random stars
  const generateStars = () => {
    const stars = [];
    for (let i = 0; i < 80; i++) {
      const size = Math.random() * 2.5 + 0.5;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const opacity = Math.random() * 0.8 + 0.2;
      
      stars.push(
        <div
          key={i}
          ref={(el) => (starsRef.current[i] = el)}
          className="absolute rounded-full bg-white"
          style={{
            width: size,
            height: size,
            left: `${left}%`,
            top: `${top}%`,
            opacity: opacity,
            boxShadow: `0 0 ${size * 2}px ${size / 2}px rgba(255, 255, 255, ${opacity * 0.5})`,
          }}
          aria-hidden
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* NAVBAR */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl md:text-2xl font-bold tracking-tight">
            Mars<span className="text-amber-500">Recycle</span>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
            <li>
              <a href="#challenge" className="hover:text-amber-500 transition-colors">
                Challenge
              </a>
            </li>
            <li>
              <a href="#problem" className="hover:text-amber-500 transition-colors">
                Problem
              </a>
            </li>
            <li>
              <a href="#solution" className="hover:text-amber-500 transition-colors">
                Solution
              </a>
            </li>
            <li>
              <button className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-400 transition-all">
                Start Now
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-800">
            <ul className="flex flex-col gap-4 p-6 text-base">
              <li>
                <a href="#challenge" className="block hover:text-amber-500 transition-colors" onClick={() => setMenuOpen(false)}>
                  Challenge
                </a>
              </li>
              <li>
                <a href="#problem" className="block hover:text-amber-500 transition-colors" onClick={() => setMenuOpen(false)}>
                  Problem
                </a>
              </li>
              <li>
                <a href="#solution" className="block hover:text-amber-500 transition-colors" onClick={() => setMenuOpen(false)}>
                  Solution
                </a>
              </li>
              <li>
                <button className="w-full px-6 py-3 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-400 transition-all">
                  Start Now
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden">
        {/* Glowing Stars Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {generateStars()}
        </div>

        {/* Comet */}
        <div
          ref={cometRef}
          className="absolute z-10 w-3 h-3 rounded-full bg-white pointer-events-none"
          style={{
            left: "-10%",
            top: "8%",
            boxShadow: "0 0 20px 8px rgba(255,255,255,0.9), -40px 0 40px 10px rgba(255,255,255,0.3)",
          }}
          aria-hidden
        />

        {/* Title / Subtitle */}
        <div className="relative z-20 flex-1 flex flex-col items-center justify-start px-4 pt-30">
          <div className="max-w-6xl mx-auto text-center">
            <h1
              ref={titleRef}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
              style={{ lineHeight: 1.1 }}
            >
              Reimagine Recycling:
              <br />
              <span className="text-red-800">The Mars Settlement Challenge</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto"
            >
              Transforming Martian Trash Into Treasure: Build Sustainable Solutions for Living Beyond Earth.
            </p>
          </div>
        </div>

        {/* Planet: bottom-centered */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 z-10 pointer-events-none w-[140%] max-w-[1400px] flex justify-center">
          {/* Glow behind planet */}
          <div
            ref={glowRef}
            className="absolute left-1/2 -translate-x-1/2 translate-y-1/2 bottom-0 rounded-full pointer-events-none"
            style={{
              width: "180%",
              height: "180%",
              maxWidth: "2100px",
              background:
                "radial-gradient(circle, rgba(255,154,111,0.95) 0%, rgba(255,122,74,0.6) 25%, rgba(74,19,12,0.2) 50%, transparent 75%)",
              filter: "blur(100px)",
              opacity: 0.85,
              mixBlendMode: "screen",
            }}
            aria-hidden
          />
          

          {/* Planet wrapper */}
          <div
            className="relative w-full flex justify-center"
            style={{ willChange: "transform, opacity, filter" }}
          >
            <div className="w-full max-w-[1200px] overflow-hidden h-[300px] md:h-[450px] lg:h-[550px]">
              <div
                className="mx-auto rounded-full overflow-hidden relative"
                style={{ width: "100%", aspectRatio: "1" }}
              >
                <img
                  src="assets/mars.webp"
                  alt="Mars planet"
                  className="w-full h-full object-cover"
                  style={{ transform: "scale(1.1)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Radial vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none z-30 h-48"
          style={{
            background:
              "radial-gradient(ellipse at bottom center, rgba(255,176,138,0.15) 0%, rgba(255,122,74,0.08) 30%, transparent 70%)",
          }}
          aria-hidden
        />
      </section>

      {/* CONTENT SECTIONS */}
      <main className="relative z-40 bg-black">
        <section
  id="challenge"
  ref={(el) => { sectionsRef.current[0] = el; }}
  className="px-8 py-24 relative bg-gradient-to-b from-black/0 via-black/80 to-black"
>
  <div className="max-w-4xl mx-auto">
    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-amber-500">
      The Challenge
    </h2>
    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
      Every kilogram of material brought to Mars is precious—and becomes potential waste. Instead of sending waste back to Earth, astronauts must recycle, reuse, and invent new ways to turn trash into resources for living, experimenting, and celebrating far from home. This project invites you to create practical recycling systems for a real Mars mission, keeping the habitat both clean and sustainable.
    </p>
  </div>
</section>
        <section
          id="problem"
          ref={(el) => { sectionsRef.current[1] = el; }}
          className="px-8 py-24"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-amber-500">
              The Problem
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <p className="text-lg md:text-xl text-gray-300">
                  Astronauts generate 12,600 kg of inorganic trash during a mission.
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <p className="text-lg md:text-xl text-gray-300">
                  No way to send waste home — everything must be reused or recycled on Mars.
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <p className="text-lg md:text-xl text-gray-300">
                  Challenge: Design systems to handle packaging, textiles, metals, foam, and lab waste.
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="w-3 h-3 rounded-full bg-amber-500 mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                <p className="text-lg md:text-xl text-gray-300">
                  Three scenarios: habitat setup, celebrating crew events, and scientific experiments.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="solution"
          ref={(el) => { sectionsRef.current[2] = el; }}
          className="px-8 py-24"
        >
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Ready to build your own Martian recycling solution?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="px-10 py-4 bg-amber-500 text-black font-bold rounded-full hover:bg-amber-400 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/50">
                Get Started — Design Now
              </button>
              <button className="px-10 py-4 border-2 border-amber-500 text-amber-500 font-bold rounded-full hover:bg-amber-500/10 transition-all duration-200 hover:-translate-y-1">
                Learn More
              </button>
            </div>
            <p className="text-gray-400 text-lg">
              Learn → Visualize → Simulate → See Impact
            </p>
          </div>
        </section>

        <footer className="border-t border-gray-800 px-8 py-16">
          <div className="max-w-4xl mx-auto text-center text-gray-300">
            <p className="mb-4 text-lg">
              Help shape the future of sustainable space exploration. Your ideas could inspire technology for Mars — and for Earth.
            </p>
            <p className="text-sm text-gray-500">
              Built for NASA Space Apps Challenge 2025
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}