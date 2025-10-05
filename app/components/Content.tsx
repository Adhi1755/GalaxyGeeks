"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Globe, Shield, Heart, Rss, FileText, BarChart3, ArrowRight, Recycle, Package, Beaker, PartyPopper, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import TiltedCard from './Tiltedcard';
import FlipCard from './Filpcard';
import Galaxy from './Galaxy';
import Link from "next/link";
import Image from "next/image";



const MarsRecyclerLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const challengeRef = useRef<HTMLElement>(null);
  const wasteRef = useRef<HTMLElement>(null);
  const interactiveRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  
  const scenarios = [
    {
      id: "residence",
      title: "Residence Renovations",
      subtitle: "Reuse habitat frames & packaging",
      desc: "After inflating the habitat, the cube frames and foam packaging can be repurposed into tools, insulation panels, storage modules, or lightweight structural elements.",
      image: "assets/Revolution.png",
      icon: Package,
    },
    {
      id: "celebration",
      title: "Cosmic Celebrations",
      subtitle: "Repurpose fabrics & packages",
      desc: "Transform fabrics, wipes, pouches and packaging into decorations, storage containers, party items, or comfort pieces for crew morale and events.",
      image: "assets/Celebration.png",
      icon: PartyPopper,
    },
    {
      id: "discoveries",
      title: "Daring Discoveries",
      subtitle: "Reuse lab byproducts & components",
      desc: "Leftover carbon, filters, and lab hardware can be reworked into repair parts, filtration components, or composite feedstock for fabrication systems.",
      image: "assets/Innovation.png",
      icon: Beaker,
    },
  ];

  const materials = [
    { key: "aluminum", label: "Aluminum frames and struts", img: "assets/Allu.png" },
    { key: "composites", label: "Polymer composites (carbon fiber, resin)", img: "assets/Allu.png" },
    { key: "fabrics", label: "Fabrics (cotton, nylon, polyester)", img: "assets/Allu.png" },
    { key: "foam", label: "Foam packaging and bubble wrap", img: "assets/Allu.png" },
    { key: "eva", label: "EVA waste & resealable bags", img: "assets/Allu.png" },
    { key: "gloves", label: "Nitrile gloves", img: "assets/Allu.png" },
    { key: "pouches", label: "Food & drink pouches", img: "assets/Allu.png" },
    { key: "lab", label: "Lab equipment materials", img: "assets/Allu.png" },
  ];
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Configure ScrollTrigger defaults for smoother performance
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
    });

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Hero section animations - Sequential and elegant
      if (heroRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        });

        tl.fromTo(heroRef.current.querySelector('.hero-badge'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        )
        .fromTo(heroRef.current.querySelector('h1'),
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.3'
        )
        .fromTo(heroRef.current.querySelector('.hero-description'),
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(heroRef.current.querySelector('button'),
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.2)' },
          '-=0.3'
        );
      }

      // Overview section - Professional fade and slide
      if (introRef.current) {
        gsap.fromTo(introRef.current.querySelector('h2'),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: introRef.current,
              start: 'top 80%',
              end: 'top 30%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        const overviewTexts = introRef.current.querySelectorAll('.overview-text');
        if (overviewTexts.length > 0) {
          gsap.fromTo(overviewTexts,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: introRef.current,
                start: 'top 75%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }

        const problemCards = introRef.current.querySelectorAll('.problem-card');
        if (problemCards.length > 0) {
          gsap.fromTo(problemCards,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: introRef.current,
                start: 'top 70%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      }

      // Challenge section - Smooth card reveals
      if (challengeRef.current) {
        gsap.fromTo(challengeRef.current.querySelector('h2'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: challengeRef.current,
              start: 'top 80%',
              end: 'top 30%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        const scenarioCards = challengeRef.current.querySelectorAll('.scenario-card');
        if (scenarioCards.length > 0) {
          gsap.fromTo(scenarioCards,
            { opacity: 0, y: 60, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              stagger: 0.2,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: challengeRef.current,
                start: 'top 70%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      }

      // Waste streams section - Elegant stagger
      if (wasteRef.current) {
        gsap.fromTo(wasteRef.current.querySelector('h2'),
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: wasteRef.current,
              start: 'top 80%',
              end: 'top 30%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        const materialCards = wasteRef.current.querySelectorAll('.material-card');
        if (materialCards.length > 0) {
          gsap.fromTo(materialCards,
            { opacity: 0, y: 50, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              stagger: {
                amount: 0.6,
                from: 'start',
                ease: 'power1.inOut'
              },
              ease: 'power2.out',
              scrollTrigger: {
                trigger: wasteRef.current,
                start: 'top 70%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      }

      // Interactive features section - Clean progressive reveal
      if (interactiveRef.current) {
        gsap.fromTo(interactiveRef.current.querySelector('h2'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: interactiveRef.current,
              start: 'top 80%',
              end: 'top 30%',
              toggleActions: 'play none none reverse'
            }
          }
        );

        const featureSteps = interactiveRef.current.querySelectorAll('.feature-step');
        if (featureSteps.length > 0) {
          gsap.fromTo(featureSteps,
            { opacity: 0, x: -40 },
            {
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: interactiveRef.current,
                start: 'top 75%',
                end: 'top 20%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      }

      // Footer animation - Subtle and professional
      if (footerRef.current) {
        const footerCols = footerRef.current.querySelectorAll('.footer-col');
        if (footerCols.length > 0) {
          gsap.fromTo(footerCols,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: footerRef.current,
                start: 'top 85%',
                end: 'top 40%',
                toggleActions: 'play none none reverse'
              }
            }
          );
        }
      }

      // Refresh ScrollTrigger after setup
      ScrollTrigger.refresh();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle 2s ease-in-out infinite, wiggle 4s ease-in-out infinite;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
        }
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(0.8);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
        }
        @keyframes wiggle {
          0%, 100% { 
            transform: translate(0, 0) rotate(0deg);
          }
          25% { 
            transform: translate(2px, -2px) rotate(5deg);
          }
          50% { 
            transform: translate(-2px, 2px) rotate(-5deg);
          }
          75% { 
            transform: translate(2px, 2px) rotate(3deg);
          }
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Website Name */}
          <div className="text-lg sm:text-xl font-bold text-[#FF6B35]">GalaxyGeeks</div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4 sm:gap-6">
            <a href="#home" className="text-xs sm:text-sm hover:text-[#FF6B35] transition-colors">
              Home
            </a>
            <a href="#overview" className="text-xs sm:text-sm hover:text-[#FF6B35] transition-colors">
              Overview
            </a>
            <a href="#challenges" className="text-xs sm:text-sm hover:text-[#FF6B35] transition-colors">
              Challenges
            </a>
            <a href="#waste-streams" className="text-xs sm:text-sm hover:text-[#FF6B35] transition-colors">
              Materials
            </a>
            <a
              href="#interactive-features"
              className="px-3 sm:px-5 py-2 text-xs sm:text-sm bg-[#FF6B35] text-white rounded-lg hover:bg-[#E55A2B] transition-all"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-slate-800">
            <div className="px-4 py-6 space-y-4">
              <a
                href="#home"
                className="block text-sm hover:text-[#FF6B35] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#overview"
                className="block text-sm hover:text-[#FF6B35] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Overview
              </a>
              <a
                href="#challenges"
                className="block text-sm hover:text-[#FF6B35] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Challenges
              </a>
              <a
                href="#waste-streams"
                className="block text-sm hover:text-[#FF6B35] transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Materials
              </a>
              <a
                href="#interactive-features"
                className="block px-5 py-3 text-sm bg-[#FF6B35] text-white rounded-lg hover:bg-[#E55A2B] transition-all text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-10 md:pt-30">
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

        <div className="relative z-10 text-center max-w-6xl">
          <div className="hero-badge inline-flex items-center gap-1 px-3 sm:px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700 backdrop-blur-sm mb-5">
            <span className="text-xs sm:text-sm text-slate-400">Waste Recycle in Mars ♻️</span>
          </div>

          <h1 className="text-3xl md:text-6xl font-bold mb-4 px-4">
            Transforming Trash Into <span className="text-[#FF6B35]">Treasure</span> for Sustainable Living On <span className="text-[#FF6B35]">Mars</span>
          </h1>

          <p className="hero-description text-base sm:text-lg md:text-xl text-slate-400 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            <span className="text-[#FF6B35] font-semibold">Rethink</span>, <span className="text-[#FF6B35] font-semibold">Reuse</span>, <span className="text-[#FF6B35] font-semibold">Revolutionize</span>
          </p>

          <Link
      href="/challenges"
      className="group px-6 sm:px-8 py-3 sm:py-4 relative z-50 bg-[#FF6B35] text-white rounded-full font-medium hover:bg-[#E55A2B] transition-all inline-flex items-center gap-2 text-sm sm:text-base"
    >
      Start Recycling
      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
    </Link>
        </div>

        <div className="relative z-10 mt-12 sm:mt-16 md:mt-20 w-full max-w-8xl mx-auto">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.25),rgba(251,191,36,0.12),transparent)] blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/2 h-3/2 bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.3),rgba(220,38,38,0.15),transparent)] blur-2xl animate-pulse" />
          </div>

        <div className="bg-gradient-to-b from-[#7f1d1d] to-black rounded-t-[1000px] sm:rounded-t-[1500px] md:rounded-t-full relative overflow-visible">
  <div className="h-50 sm:h-48 md:h-200 flex items-center justify-center relative">
    {/* Mars Image as Planet (outer classes/sizes unchanged) */}
    <div
      className="w-full h-full aspect-square rounded-t-full overflow-hidden relative planet-roll"
      aria-hidden
      style={{
        /* keep same visual box-shadow and sizing on the outer wrapper */
        boxShadow: "inset -20px -12px 60px rgba(0,0,0,0.6), 0 40px 80px rgba(0,0,0,0.7)",
      }}
    >
      {/* >>> GPU-friendly moving texture: translate3d on this inner element (no background-position animation) */}
      <div
        className="planet-texture absolute top-0 left-0 h-full"
        style={{
          width: '300%', /* long strip to slide — gives smooth looping */
          backgroundImage: "url('/assets/RS3_Mars.webp')",
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%', /* keep vertical fit; tune if needed */
          backgroundPosition: 'center',
          willChange: 'transform',
          transform: 'translate3d(0,0,0)',
        }}
      />
        <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-transparent via-white/5 to-white/10 mix-blend-screen" /> <div className="absolute inset-0 rounded-t-full" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,20) 100%)", }} />
      {/* lighting + overlays (unchanged behavior — still cover the planet) */}
      <div className="absolute inset-0 rounded-t-full bg-gradient-to-t from-transparent via-white/5 to-white/10 mix-blend-screen pointer-events-none" />
      <div
        className="absolute inset-0 rounded-t-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 50% 120%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.95) 100%)",
        }}
      />
    </div>
  </div>

  <style jsx>{`
    /* planet-roll kept — no background-position animation here */
    .planet-roll {
      position: relative;
      overflow: hidden;
    }

    /* animate transform on the wide inner texture for GPU compositing */
    .planet-texture {
      animation: spinTranslate 28s linear infinite;
      will-change: transform;
      transform-origin: 0 50%;
      /* hardware accel hint */
      backface-visibility: hidden;
      transform: translate3d(0,0,0);
    }

    @keyframes spinTranslate {
      from { transform: translate3d(0,0,0); }
      to   { transform: translate3d(-66.6666%,0,0); } /* -2/3 of 300% width -> loops visually */
    }

    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .planet-texture { animation: none !important; }
    }
  `}</style>
</div>

        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" ref={introRef} className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          <div className="md:col-span-7 lg:col-span-8 space-y-4">
            <div className="overview-text">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FF6B35] mb-4">
                Overview
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed">
                During a three-year Mars mission, an eight-person crew could generate
                over <span className="text-[#FF6B35] font-semibold">12,600 kg of inorganic waste</span> —
                including packaging, textiles, structural materials, and lab equipment.
                Returning this waste to Earth or sending extra supplies is neither
                affordable nor practical. This creates an urgent need for sustainable
                recycling systems that transform "trash" into valuable resources,
                ensuring safety, efficiency, and sustainability for future missions.
              </p>
            </div>

            <div className="problem-card bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-2xl font-bold text-[#FF6B35] mb-4">
                Problem Statement
              </h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                Astronauts on Mars will need to manage daily inorganic waste streams
                such as fabrics, food packaging, foam, EVA suits, and metals. Unlike
                the ISS, which can send trash back to Earth, Martian crews must
                recycle or repurpose everything locally. Your challenge is to design
                sustainable systems that maximize resource recovery, minimize water
                and energy inputs, and avoid harmful outputs — laying the foundation
                for a circular economy on Mars.
              </p>
              <ul className="list-disc pl-5 text-slate-400 space-y-2">
                <li>Develop a sustainable system to manage, reuse, and recycle waste.</li>
                <li>Maximize resource recovery while minimizing water and energy use.</li>
                <li>Avoid harmful byproducts such as toxic emissions and microplastics.</li>
                <li>Support long-term human presence through in situ resource utilization.</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-5 lg:col-span-4">
  <div className="w-full h-[605px] bg-slate-800/40 border border-slate-700 rounded-2xl flex items-center justify-center text-slate-500 overflow-hidden">
    <Image
      src="/assets/RS3_Mars.webp"   
      alt="Mars Habitat"
      width={500}                  
      height={1500}                   
      className="object-cover w-full h-full"
    />
  </div>
</div>


          <div className="problem-card col-span-full bg-slate-900/30 p-6 rounded-2xl border border-slate-800 mt-2">
            <h3 className="text-2xl font-bold text-[#FF6B35] mb-4">Mission Setting</h3>
            <p className="text-slate-400 leading-relaxed">
              The mission base is located at{" "}
              <span className="text-[#FF6B35] font-semibold">Jezero Crater</span>, a
              landmark for future Mars exploration. Here, every discarded item —
              from packaging to experimental devices — must become a resource.
              Innovative recycling systems will enable astronauts to live, work, and
              even celebrate while minimizing waste and creating useful products for
              survival.
            </p>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section id="challenges" ref={challengeRef} className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="md:w-3/4 lg:w-2/3 mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FF6B35] mb-4">
              The Challenge: Three Scenarios
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed">
              A Mars mission demands creative reuse and recycling. Solve three
              scenarios by turning mission waste into useful products and systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start mt-10">
            {scenarios.map((s) => (
              <div key={s.id} className="scenario-card flex flex-col items-center">
                <FlipCard
                  image={s.image}
                  title={s.title}
                  subtitle={s.subtitle}
                  description={s.desc}
                  rotate="y"
                  className="h-[22rem] w-[20rem]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waste Streams Section */}
      <section ref={wasteRef} id="waste-streams" className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="md:w-3/4 lg:w-2/3 mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#FF6B35] mb-4">
              Waste Streams & Materials
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed">
              Explore how each material can be recycled or repurposed — every item is a puzzle to solve for long-term sustainability on Mars.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {materials.map((m) => (
              <div key={m.key} className="material-card flex flex-col items-center">
                <TiltedCard
                  imageSrc={m.img}
                  altText={m.label}
                  captionText={m.label}
                  containerHeight="300px"
                  containerWidth="300px"
                  imageHeight="300px"
                  imageWidth="300px"
                />
                <div className="mt-4 w-[280px] text-center">
                  <p className="mt-3 text-sm text-slate-300">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section id="interactive-features" ref={interactiveRef} className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="md:w-3/4 lg:w-2/3 mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#FF6B35] mb-4">
              Interactive Features
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed">
              Step through the flow — from simulation to solutions. Hover any step to
              highlight it.
            </p>
          </div>

          <div className="space-y-8">
            {[
              "Choose one of the challenges (Residence Renovations, Cosmic Celebrations, or Daring Discoveries) to begin.",
              "Browse or drag-and-drop mission waste items (aluminum frames, fabrics, pouches, lab materials, etc.) into the dashboard workspace.",
              "Place the items into appropriate recycling or repurposing modules (e.g., structural reuse, fabric repurpose, lab material conversion)",
              "Run the recycling process and watch how raw waste is converted into usable products (tools, containers, decorations, filters, etc.)",
              "Monitor dashboards/charts for water, energy, and manpower savings achieved through recycling actions.",
              "Save/export your recycling plan, or clear the workspace to start designing a new solution.",
            ].map((feature, i) => (
              <div key={i} className="feature-step flex items-center gap-6 group">
                <div
                  className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#FF6B35] bg-black transform transition-transform duration-200 group-hover:scale-110"
                >
                  <span className="font-semibold text-[#FF6B35] text-base sm:text-xl md:text-3xl">
                    {i + 1}
                  </span>
                </div>
                <p className="text-base sm:text-xl md:text-2xl text-slate-300 ">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer ref={footerRef} className="border-t border-slate-900 bg-black py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
            <div className="footer-col">
              <div className="flex items-center gap-3 mb-4">
                
                <span className="text-lg sm:text-xl font-bold text-[#FF6B35]">
                  GalaxyGeeks
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Building sustainable futures on the Red Planet.
              </p>
            </div>

            <div className="footer-col">
              <h4 className="font-semibold mb-4 text-xs sm:text-sm text-[#FF6B35] tracking-wide">
                SCENARIOS
              </h4>
              <div className="space-y-3">
                {["Residence Renovations", "Cosmic Celebrations", "Daring Discoveries"].map(
                  (item, i) => (
                    <a
                      key={i}
                      href="#challenges"
                      className="block text-sm text-slate-400 hover:text-[#FF6B35] transition-colors"
                    >
                      {item}
                    </a>
                  )
                )}
              </div>
            </div>

            <div className="footer-col">
              <h4 className="font-semibold mb-4 text-xs sm:text-sm text-[#FF6B35] tracking-wide">
                RESOURCES
              </h4>
              <div className="space-y-3">
                {[
                  { text: "Materials Guide", href: "#waste-streams" },
                  { text: "Interactive Tools", href: "#interactive-features" },
                  { text: "Educational Content", href: "#overview" }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="block text-sm text-slate-400 hover:text-[#FF6B35] transition-colors"
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-col">
              <h4 className="font-semibold mb-4 text-xs sm:text-sm text-[#FF6B35] tracking-wide">
                ABOUT
              </h4>
              <div className="space-y-3">
                {[
                  { text: "Mission", href: "#overview" },
                  { text: "Contact", href: "#home" },
                  { text: "Credits", href: "#home" }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="block text-sm text-slate-400 hover:text-[#FF6B35] transition-colors"
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-slate-800 text-center text-xs sm:text-sm text-slate-500">
            <p className="mb-2">
                NASA Space App Challenge 2025
            </p>
            <p>
              ©  <span className="text-[#FF6B35] font-semibold">GalaxyGeeks</span>. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default MarsRecyclerLanding;