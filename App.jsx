import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { 
  Calendar, Clock, MapPin, Music, Volume2, VolumeX,
  Copy, Check, Navigation, ChevronRight, ChevronLeft,
  Sparkles, Play, Pause, Image as ImageIcon, X, RefreshCw, 
  ChevronDown, ArrowUp, Heart
} from "lucide-react";

/* =========================================================================
   WEDDING CONFIGURATION (ADARSH & KAVANA)
   ========================================================================= */
const CONFIG = {
  groom: {
    name: "Adarsh",
    title: "The Groom",
  },
  bride: {
    name: "Kavana",
    title: "The Bride",
  },
  luxuryPortrait: "assets/couple_kannada_wedding_luxury.jpg",
  ganeshaMedallion: "assets/ganesha_gold_medallion.png",
  // 5 REAL PHOTOS OF ADARSH & KAVANA
  realPhotos: [
    {
      id: "photo-smile",
      src: "assets/couple_smile.jpg",
      title: "Adarsh & Kavana",
      subtitle: "Hand in hand, stepping joyously into holy matrimony",
      tag: "Together in Love",
      aspect: "landscape"
    },
    {
      id: "photo-flower",
      src: "assets/couple_flower.jpg",
      title: "Sacred Blossom",
      subtitle: "Adarsh placing a fragrant plumeria blossom in Kavana's hair",
      tag: "Cherished Moment",
      aspect: "portrait"
    },
    {
      id: "photo-swing",
      src: "assets/couple_swing.jpg",
      title: "Gentle Moments",
      subtitle: "Sharing smiles and laughter on the traditional veranda swing",
      tag: "Sweet Moments",
      aspect: "portrait"
    },
    {
      id: "photo-twirl",
      src: "assets/couple_twirl.jpg",
      title: "Dance of Hearts",
      subtitle: "A joyous spin amidst the serene courtyard",
      tag: "Pure Joy",
      aspect: "portrait"
    },
    {
      id: "photo-courtyard",
      src: "assets/couple_courtyard.jpg",
      title: "Eternal Harmony",
      subtitle: "Stepping together hand in hand through life's beautiful path",
      tag: "Forever & Always",
      aspect: "landscape"
    }
  ],
  musicUrl: "assets/aaj_ibaadat.m4a",
  venueQr: "assets/venue_maps_qr.png",
  venue: {
    name: "Sri Shubamasthu Kalyana Mantapa",
    address: "Mysore Road, Arasikere, Karnataka - 573103",
    mapUrl: "https://maps.app.goo.gl/EfbKXEJ4hQZxHuLQA",
  },
  events: {
    reception: {
      title: "Wedding Reception",
      day: "Thursday",
      dateFormatted: "Thursday, 3rd December 2026",
      time: "7:30 PM onwards",
      startIso: "2026-12-03T19:30:00+05:30",
      endIso: "2026-12-03T23:00:00+05:30",
      dressCode: "Festive South Indian Silk & Ethnic Wear"
    },
    muhurtham: {
      title: "Dhanassu Lagna Muhurtham",
      day: "Friday",
      dateFormatted: "Friday, 4th December 2026",
      time: "8:15 AM to 9:15 AM",
      startIso: "2026-12-04T08:15:00+05:30",
      endIso: "2026-12-04T09:15:00+05:30",
      lagna: "Dhanassu Lagna",
      dressCode: "Traditional Karnataka Pattu Dhoti & Mysore Silk Sarees"
    }
  }
};

/* =========================================================================
   SYNTHESIZED SOUND EFFECTS VIA WEB AUDIO API (Zero external network lag)
   ========================================================================= */
function playSoundEffect(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "waxCrack") {
      // Crack noise
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2400;
      filter.Q.value = 3;
      noise.connect(filter);
      filter.connect(ctx.destination);
      noise.start();

      // Deep snap pop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);

    } else if (type === "templeBell") {
      // Rich metallic South Indian temple bell chime
      const frequencies = [587.33, 1174.66, 1762.0, 2349.3];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const initialVol = 0.25 / (idx + 1);
        gain.gain.setValueAtTime(initialVol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2.6);
      });
    }
  } catch (e) {
    // Graceful fallback
  }
}

/* =========================================================================
   DECORATIVE ORNAMENTS & SVG GRAPHICS
   ========================================================================= */

// Swaying Temple Bell Component
function TempleBell({ className = "", isLeft = true }) {
  return (
    <div className={`flex flex-col items-center select-none pointer-events-none ${isLeft ? "animate-bell-left" : "animate-bell-right"} ${className}`}>
      <div className="w-1.5 h-14 sm:h-20 bg-gradient-to-b from-amber-300 via-amber-500 to-amber-700 rounded-full shadow-sm flex flex-col justify-around items-center">
        <span className="w-2.5 h-2.5 rounded-full border border-amber-300 bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full border border-amber-300 bg-amber-400" />
      </div>
      <div className="relative -mt-1 w-10 sm:w-14 h-12 sm:h-16">
        <svg viewBox="0 0 60 70" className="w-full h-full drop-shadow-lg">
          <defs>
            <linearGradient id="bellGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF3B8" />
              <stop offset="40%" stopColor="#E5B542" />
              <stop offset="70%" stopColor="#C99726" />
              <stop offset="100%" stopColor="#7A500D" />
            </linearGradient>
          </defs>
          <path
            d="M 30 5 C 22 5 18 18 18 32 C 18 45 12 52 8 56 L 52 56 C 48 52 42 45 42 32 C 42 18 38 5 30 5 Z"
            fill="url(#bellGoldGrad)"
            stroke="#FFEAA7"
            strokeWidth="1"
          />
          <path d="M 12 56 L 48 56 L 50 60 L 10 60 Z" fill="#996D13" />
          <circle cx="30" cy="64" r="5" fill="#FFEAA7" />
        </svg>
      </div>
    </div>
  );
}

// Traditional South Indian Mango Leaf & Festive Torana Banner
function TempleToran() {
  return (
    <div className="w-full overflow-hidden flex justify-between items-start pointer-events-none opacity-90">
      <div className="flex w-full justify-around items-start -mt-1">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-sm" />
            <div
              className="w-4 sm:w-6 h-8 sm:h-11 bg-gradient-to-b from-[#1E5631] via-[#2D733E] to-[#12381F] shadow-sm -mt-0.5"
              style={{
                clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                transform: `rotate(${i % 2 === 0 ? "2deg" : "-2deg"})`
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Canvas-Based Realistic Falling Rose & Jasmine Petals
function PetalsCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const petals = [];
    const petalCount = window.innerWidth < 640 ? 22 : 36;
    const colors = [
      { r: 212, g: 30, b: 45, a: 0.85 },   // Deep crimson red
      { r: 247, g: 140, b: 160, a: 0.80 }, // Rose pink
      { r: 255, g: 250, b: 240, a: 0.90 }, // Fragrant Mysore Jasmine White
      { r: 255, g: 215, b: 0, a: 0.75 }    // Marigold yellow
    ];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.random() * 1.2 - 0.6,
        speedY: Math.random() * 1.1 + 0.7,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.5,
        swing: Math.random() * 0.02
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * p.swing);
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = canvas.width + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size / 2, -p.size / 2, p.size, 0, 0, p.size);
        ctx.bezierCurveTo(-p.size, 0, -p.size / 2, -p.size / 2, 0, 0);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.a})`;
        ctx.fill();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="petals-canvas" />;
}

// Calendar Generator Utility
function generateGoogleCalendarUrl(event, venue) {
  const pad = (n) => String(n).padStart(2, "0");
  const formatUtcIso = (isoStr) => {
    const d = new Date(isoStr);
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  };

  const startUtc = formatUtcIso(event.startIso);
  const endUtc = formatUtcIso(event.endIso);

  const title = encodeURIComponent(`${event.title} - Adarsh & Kavana Wedding`);
  const details = encodeURIComponent(
    `You are cordially invited to celebrate the wedding ceremony of Adarsh and Kavana.\n\nEvent: ${event.title}\nTime: ${event.time}\nDress Code: ${event.dressCode}\nVenue: ${venue.name}, ${venue.address}\n\nMap: ${venue.mapUrl}`
  );
  const location = encodeURIComponent(`${venue.name}, ${venue.address}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;
}

// Apple Calendar (.ics) Download Utility
function downloadIcsFile(event, venue) {
  const pad = (n) => String(n).padStart(2, "0");
  const formatUtcIso = (isoStr) => {
    const d = new Date(isoStr);
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  };

  const startUtc = formatUtcIso(event.startIso);
  const endUtc = formatUtcIso(event.endIso);
  const stampUtc = formatUtcIso(new Date().toISOString());

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Adarsh & Kavana Wedding//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-${Date.now()}@adarshkavana.wedding`,
    `DTSTAMP:${stampUtc}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    `SUMMARY:${event.title} - Adarsh & Kavana Wedding`,
    `DESCRIPTION:${event.title} of Adarsh and Kavana at ${venue.name}, ${venue.address}.`,
    `LOCATION:${venue.name}, ${venue.address}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}_Adarsh_Kavana.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Gold Temple Filigree Corner Ornaments
function GoldCorner({ className = "" }) {
  return (
    <svg className={`w-8 h-8 sm:w-12 sm:h-12 select-none pointer-events-none drop-shadow-md ${className}`} viewBox="0 0 80 80" fill="none">
      <path d="M4 76 V22 C4 12.06 12.06 4 22 4 H76" stroke="url(#cornerGoldGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 76 V26 C12 18.27 18.27 12 26 12 H76" stroke="url(#cornerGoldGrad)" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M4 22 Q22 22 22 4" stroke="url(#cornerGoldGrad)" strokeWidth="1.5" fill="none" />
      <circle cx="28" cy="28" r="4.5" fill="url(#cornerGoldGrad)" />
      <circle cx="48" cy="12" r="3" fill="url(#cornerGoldGrad)" />
      <circle cx="12" cy="48" r="3" fill="url(#cornerGoldGrad)" />
      <defs>
        <linearGradient id="cornerGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF3B8" />
          <stop offset="35%" stopColor="#E5B542" />
          <stop offset="75%" stopColor="#C99726" />
          <stop offset="100%" stopColor="#7A500D" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* =========================================================================
   OPENING SCENE: THE LUXURY INTERACTIVE ENVELOPE WITH 3D WAX SEAL
   ========================================================================= */
function InteractiveEnvelope({ onOpenComplete, onStartMusic }) {
  const [envelopeState, setEnvelopeState] = useState("closed"); // 'closed' | 'cracking' | 'opening' | 'rising' | 'done'

  const handleEnvelopeClick = () => {
    if (envelopeState !== "closed") return;

    // Trigger sound effects
    playSoundEffect("waxCrack");
    playSoundEffect("templeBell");

    // Start background wedding music ("Aaj Ibaadat")
    if (onStartMusic) onStartMusic();

    // Stage 1: Wax seal cracks and breaks
    setEnvelopeState("cracking");

    // Stage 2: Flap opens with 3D rotation
    setTimeout(() => {
      setEnvelopeState("opening");
    }, 400);

    // Stage 3: Invitation card emerges and glides out
    setTimeout(() => {
      setEnvelopeState("rising");
    }, 1100);

    // Stage 4: Card expands into full-screen cinematic invitation
    setTimeout(() => {
      setEnvelopeState("done");
      if (onOpenComplete) onOpenComplete();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#240609] via-[#380B0F] to-[#1A0305] overflow-hidden select-none">
      
      {/* Background Ambient Ceremonial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,160,52,0.22)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="text-center mb-4 sm:mb-6 z-20 space-y-1 px-3 max-w-full">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />
          <span className="text-amber-400 text-xs sm:text-base">🪔</span>
          <h2 className="font-temple-title text-xl sm:text-3xl gold-shimmer font-bold tracking-wider drop-shadow-lg">
            Adarsh & Kavana
          </h2>
          <span className="text-amber-400 text-xs sm:text-base">🪔</span>
          <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
        </div>
        <p className="font-serif-luxury text-[10px] sm:text-xs text-amber-300/80 tracking-widest uppercase font-semibold">
          Wedding Celebration
        </p>
      </div>

      {/* 3D ENVELOPE STAGE */}
      <div 
        onClick={handleEnvelopeClick}
        className="envelope-stage cursor-pointer relative w-full max-w-[335px] sm:max-w-lg md:max-w-xl aspect-[1.48/1] flex items-center justify-center group mx-auto"
      >
        <div className={`envelope-wrapper relative w-full h-full ${envelopeState === "rising" ? "scale-102" : "animate-breath"}`}>
          
          {/* 1. ENVELOPE BACK SHEET (Deep royal maroon handmade paper with gold borders) */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4A0E13] via-[#3B090E] to-[#2B0609] border-[3px] border-[#D4A034]/70 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_25px_rgba(212,160,52,0.3)] overflow-hidden">
            {/* Silk Texture Grain */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#E5B542_1px,transparent_1px)] [background-size:10px_10px]" />
            
            {/* Inner Double Gold Border */}
            <div className="absolute inset-2 sm:inset-3 rounded-xl border border-dashed border-amber-400/40 pointer-events-none" />

            {/* Corner Filigrees on Back */}
            <div className="absolute top-1 left-1"><GoldCorner /></div>
            <div className="absolute top-1 right-1"><GoldCorner className="rotate-90" /></div>
            <div className="absolute bottom-1 left-1"><GoldCorner className="-rotate-90" /></div>
            <div className="absolute bottom-1 right-1"><GoldCorner className="rotate-180" /></div>

            {/* INNER LINING: Ornate Mysore Royal Gold Silk Lining */}
            <div className="absolute inset-3 sm:inset-4 rounded-xl bg-gradient-to-b from-[#F7E7B4] via-[#FDFBF7] to-[#EBD9A0] border border-amber-400/70 p-4 flex flex-col items-center justify-center overflow-hidden shadow-inner">
              <div className="opacity-30 text-amber-900 text-6xl">🪔</div>
              <p className="text-[10px] text-amber-800/60 font-serif-luxury uppercase tracking-widest font-bold mt-2">
                Mysore Silk Heritage
              </p>
            </div>
          </div>

          {/* 2. THE WEDDING INVITATION CARD (Starts inside, emerges on click) */}
          <div 
            className={`envelope-card absolute inset-x-4 sm:inset-x-6 top-3 sm:top-4 bottom-3 sm:bottom-4 rounded-xl bg-gradient-to-b from-[#FFFDF7] via-[#FAF5E8] to-[#F3E8CE] border-2 border-[#D4A034] shadow-2xl p-4 sm:p-6 text-center flex flex-col justify-between z-10 ${
              envelopeState === "rising" || envelopeState === "done" ? "emerged" : ""
            }`}
          >
            <div className="space-y-1">
              <span className="text-[10px] sm:text-xs font-bold text-[#8C1820] uppercase tracking-widest">
                Wedding Invitation
              </span>
              <p className="font-temple-title text-xl sm:text-2xl text-[#5C161A] font-bold">
                Adarsh & Kavana
              </p>
              <p className="text-[11px] text-[#72491A] font-serif-luxury font-semibold uppercase tracking-wider">
                Together With Their Families
              </p>
            </div>

            <div className="py-2 border-y border-amber-400/30 my-auto">
              <p className="font-serif-luxury text-xs sm:text-sm text-[#5C161A] font-bold">
                December 3 & 4, 2026
              </p>
              <p className="text-[10px] sm:text-xs text-[#72491A]">
                Sri Shubamasthu Kalyana Mantapa, Arasikere
              </p>
            </div>

            <div className="text-[10px] text-[#8C1820] uppercase tracking-widest font-bold">
              Tap to Open Full Invitation
            </div>
          </div>

          {/* 3. ENVELOPE FRONT POCKET (Folded triangles in front of card) */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl">
            {/* Left triangle flap */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1/2 bg-gradient-to-r from-[#4A0E13] to-[#5C161A] border-l-2 border-b-2 border-amber-500/60 shadow-lg"
              style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
            />
            {/* Right triangle flap */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#4A0E13] to-[#5C161A] border-r-2 border-b-2 border-amber-500/60 shadow-lg"
              style={{ clipPath: "polygon(100% 0, 0 50%, 100% 100%)" }}
            />
            {/* Bottom triangle flap */}
            <div 
              className="absolute left-0 right-0 bottom-0 h-1/2 bg-gradient-to-t from-[#30070A] via-[#430C11] to-[#5A1217] border-b-2 border-amber-500/70 shadow-2xl flex items-end justify-center pb-3"
              style={{ clipPath: "polygon(0 100%, 50% 0%, 100% 100%)" }}
            >
              {/* Gold Temple Border along pocket bottom */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-[11px] sm:text-xs text-amber-300 font-serif-luxury font-black tracking-[0.3em] uppercase drop-shadow">
                  A & K
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              </div>
            </div>
          </div>

          {/* 4. ENVELOPE TOP FLAP (Folds down over pocket, flips up on click) */}
          <div 
            className={`envelope-flap absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#5C161A] via-[#4A0E13] to-[#3D0B0E] border-t-2 border-amber-500/70 shadow-2xl flex items-center justify-center z-30 ${
              envelopeState === "opening" || envelopeState === "rising" || envelopeState === "done" ? "opened" : ""
            }`}
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
          >
            {/* Flap Gold Filigree Border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 50" preserveAspectRatio="none">
              <path d="M4 2 L50 46 L96 2" stroke="url(#flapGoldGrad)" strokeWidth="1.2" strokeDasharray="2 2" fill="none" />
              <path d="M8 2 L50 41 L92 2" stroke="url(#flapGoldGrad)" strokeWidth="0.6" fill="none" />
              <circle cx="50" cy="36" r="2" fill="#FFEAA7" />
              <defs>
                <linearGradient id="flapGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFF3B8" />
                  <stop offset="50%" stopColor="#E5B542" />
                  <stop offset="100%" stopColor="#FFF3B8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* 5. ROYAL WAX SEAL (Embossed gold rim with couple monogram A & K) */}
          <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40">
            <div 
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#FFEAA7] via-[#E5B542] to-[#7A500D] p-1.5 shadow-[0_14px_30px_rgba(0,0,0,0.9),0_0_25px_rgba(229,181,66,0.5)] border-2 border-amber-300 flex items-center justify-center ${
                envelopeState === "cracking" ? "animate-wax-crack" : "animate-pulse-glow"
              }`}
            >
              {/* Outer Scalloped Dashed Ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-amber-900/50 pointer-events-none" />

              {/* Inner Deep Red Lac Seal */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8C1820] via-[#5C161A] to-[#33080B] border-2 border-amber-400/90 flex flex-col items-center justify-center shadow-[inset_0_3px_8px_rgba(0,0,0,0.9)] text-amber-200">
                <span className="text-[11px] text-amber-300 drop-shadow">🪔</span>
                <span className="font-serif-luxury text-base sm:text-lg font-black tracking-widest text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  A & K
                </span>
              </div>
            </div>
          </div>

          {/* 6. OUTER GOLD TEMPLE CORNER FILIGREES */}
          <div className="absolute inset-0 pointer-events-none z-35 rounded-2xl overflow-hidden border border-amber-400/50">
            <div className="absolute top-1.5 left-1.5"><GoldCorner /></div>
            <div className="absolute top-1.5 right-1.5"><GoldCorner className="rotate-90" /></div>
            <div className="absolute bottom-1.5 left-1.5"><GoldCorner className="-rotate-90" /></div>
            <div className="absolute bottom-1.5 right-1.5"><GoldCorner className="rotate-180" /></div>
          </div>

        </div>
      </div>

      {/* Bottom Invitation Prompt */}
      <div className="text-center mt-6 sm:mt-8 z-20 px-4 w-full max-w-sm mx-auto">
        <button
          onClick={handleEnvelopeClick}
          className="w-full px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-[#381216] font-bold text-sm sm:text-base tracking-widest uppercase shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto animate-pulse-glow"
        >
          <Sparkles size={16} fill="#381216" />
          <span>Tap to Open</span>
          <Sparkles size={16} fill="#381216" />
        </button>
      </div>

    </div>
  );
}

/* =========================================================================
   SCENE 1: AUSPICIOUS OPENING (ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ & TEMPLE PUSHKARANI)
   ========================================================================= */
function SectionGanesha({ onScrollNext }) {
  return (
    <section 
      id="sec-ganesha" 
      className="relative min-h-[700px] sm:min-h-[820px] flex flex-col justify-center items-center px-4 sm:px-8 py-14 sm:py-20 z-20 text-center select-none"
    >
      {/* Background Painting with Soft Warm Overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="assets/watercolor_scene1_hampi.jpg"
          alt="Hampi Temple Kalyani Scenery"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-[1.1] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#240608]/90 via-[#240608]/70 to-[#240608]/95" />
      </div>

      {/* Top Auspicious Invocations */}
      <div className="w-full max-w-3xl mx-auto space-y-3 pt-6">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full royal-glass text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-lg">
          <Sparkles size={14} className="text-amber-300 animate-pulse" />
          <span>ದೈವಿಕ ಆರಂಭ</span>
          <Sparkles size={14} className="text-amber-300 animate-pulse" />
        </div>

        <h1 className="font-temple-title text-3xl sm:text-5xl lg:text-6xl gold-shimmer font-bold tracking-wide drop-shadow-md">
          || ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ||
        </h1>
        <p className="font-serif-luxury text-lg sm:text-2xl text-amber-100 font-semibold drop-shadow-sm">
          || ಶ್ರೀ ಲಕ್ಷ್ಮೀ ವೆಂಕಟೇಶ್ವರ ಪ್ರಸನ್ನ ||
        </p>
      </div>

      {/* Center Sacred Ganesha Medallion & Elders' Blessing Card */}
      <div className="my-auto max-w-lg mx-auto flex flex-col items-center space-y-6 py-6">
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full p-2 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-2xl border-2 border-amber-300 animate-pulse-glow">
          <img
            src={CONFIG.ganeshaMedallion}
            alt="Lord Sri Ganesha Gold Medallion"
            className="w-full h-full object-contain filter drop-shadow-2xl"
          />
        </div>

        <div className="max-w-xl mx-auto p-6 sm:p-7 rounded-3xl royal-glass border border-amber-400/40 shadow-xl space-y-3">
          <h2 className="font-serif-luxury text-xl sm:text-2xl text-amber-100 font-bold uppercase tracking-wider">
            With Love & Blessings<br />of Elders
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 tracking-wider font-medium leading-relaxed">
            We seek the divine grace of Lord Ganesha as our beloved children step into sacred matrimony.
          </p>
        </div>
      </div>

      {/* Scroll Down Prompt */}
      <div className="pt-4 flex flex-col items-center gap-2">
        <button
          onClick={onScrollNext}
          className="px-6 py-2.5 rounded-full royal-glass hover:bg-white/10 text-amber-200 text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>Meet Adarsh & Kavana</span>
          <ChevronDown size={16} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}

/* =========================================================================
   SCENE 2: THE COUPLE (PHOTOGRAPHIC REAL PORTRAIT IN KANNADA ATTIRE)
   ========================================================================= */
function SectionCouple({ onScrollPhotos, onOpenLightbox }) {
  return (
    <section 
      id="sec-couple" 
      className="relative min-h-[700px] sm:min-h-[820px] flex flex-col justify-center items-center px-4 sm:px-8 py-14 sm:py-20 z-20 text-center select-none"
    >
      {/* Background Painting */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="assets/watercolor_scene2_mandapam.jpg"
          alt="Hoysala Kalyana Mandapam Scenery"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.1] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#240608]/95 via-[#240608]/80 to-[#240608]/95" />
      </div>

      {/* Top Banner */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <span className="inline-block px-5 py-1.5 rounded-full royal-glass text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-md">
          The Couple
        </span>
      </div>

      {/* Center 2-Column Responsive Layout */}
      <div className="w-full max-w-6xl mx-auto my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: Real Couple Luxury Kannada Wedding Attire Portrait */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-sm sm:max-w-md rounded-[2.5rem] overflow-hidden border-4 border-amber-400/60 shadow-2xl p-1.5 bg-gradient-to-b from-amber-400/50 via-[#4A0E13] to-[#2D080B] animate-breath">
            <div className="rounded-[2.2rem] overflow-hidden aspect-[3/4] relative bg-[#240B0E]">
              <img
                src={CONFIG.luxuryPortrait}
                alt="Adarsh and Kavana Luxury Wedding Portrait"
                className="w-full h-full object-cover object-top"
              />
              {/* Couple Name Overlay Badge */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full royal-parchment text-[#381216] font-serif-luxury font-bold text-xs sm:text-sm tracking-wider uppercase shadow-xl whitespace-nowrap border border-amber-500/50">
                Adarsh & Kavana
              </div>
            </div>
          </div>

          {/* Quick Jump to Real Candid Photos Section */}
          <button
            onClick={onScrollPhotos}
            className="mt-4 px-6 py-2.5 rounded-full royal-glass hover:bg-amber-400 hover:text-[#381216] text-amber-200 border border-amber-400/50 text-xs font-semibold tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 group"
          >
            <ImageIcon size={15} className="text-amber-300 group-hover:text-[#381216]" />
            <span>View Couple's Real Moments ↓</span>
          </button>
        </div>

        {/* RIGHT COLUMN: Royal Names & Vedic Blessing */}
        <div className="lg:col-span-7 flex flex-col gap-4 text-left">
          
          <div className="p-6 sm:p-9 rounded-[2.5rem] royal-glass border border-amber-400/40 shadow-2xl space-y-4">
            <p className="font-serif-luxury text-xs sm:text-sm text-amber-300 uppercase tracking-[0.25em] font-semibold">
              We Joyfully Announce The Union Of
            </p>

            {/* Groom Name */}
            <div className="space-y-0.5 border-l-4 border-amber-400 pl-4">
              <h2 className="font-temple-title text-4xl sm:text-6xl gold-shimmer font-bold tracking-wide leading-tight">
                {CONFIG.groom.name}
              </h2>
              <p className="text-xs text-amber-300 uppercase tracking-widest font-semibold pt-1">
                The Groom
              </p>
            </div>

            <div className="flex items-center gap-3 my-1">
              <span className="h-px flex-1 bg-gradient-to-r from-amber-400 to-transparent" />
              <span className="font-temple-title text-2xl sm:text-3xl text-amber-300 italic font-bold">
                and
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-amber-400 to-transparent" />
            </div>

            {/* Bride Name */}
            <div className="space-y-0.5 border-l-4 border-amber-400 pl-4">
              <h2 className="font-temple-title text-4xl sm:text-6xl gold-shimmer font-bold tracking-wide leading-tight">
                {CONFIG.bride.name}
              </h2>
              <p className="text-xs text-amber-300 uppercase tracking-widest font-semibold pt-1">
                The Bride
              </p>
            </div>

            {/* Sacred Mangalasutra Blessing */}
            <div className="pt-3 border-t border-amber-400/30">
              <p className="font-body-serif text-base sm:text-xl text-amber-100/90 italic leading-relaxed">
                "Mangalyam tantunanena mama jivana hetuna |<br className="hidden sm:inline" />
                Kanthe badhnami subhage twam jeeva saradah satam"
              </p>
              <p className="text-[11px] text-amber-300/80 uppercase tracking-widest mt-1.5 font-semibold">
                Bound by sacred vows into a lifetime of harmony, love and devotion
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

/* =========================================================================
   SCENE 3: ROYAL WEDDING INVITATION (MYSORE ROYAL CEREMONIAL FOLIO)
   ========================================================================= */
function SectionInvitation() {
  return (
    <section 
      id="sec-invitation" 
      className="relative min-h-[620px] sm:min-h-[720px] flex flex-col justify-center items-center px-4 sm:px-8 py-14 sm:py-20 z-20 text-center select-none"
    >
      {/* Background Painting */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="assets/watercolor_scene2_mandapam.jpg"
          alt="Royal Ceremonial Folio Scenery"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.1] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#240608]/95 via-[#240608]/85 to-[#240608]/95" />
      </div>

      {/* Ceremonial Folio Card */}
      <div className="my-auto max-w-2xl sm:max-w-3xl mx-auto p-6 sm:p-12 rounded-[3rem] royal-parchment border-2 border-amber-500/70 shadow-2xl text-center space-y-5 sm:space-y-6 relative overflow-hidden">
        
        {/* Sacred Diya Emblem */}
        <div className="w-14 h-14 mx-auto rounded-full bg-[#5C161A] text-amber-200 flex items-center justify-center text-2xl shadow-md border border-amber-400/50">
          🪔
        </div>

        {/* English Formal Invitation */}
        <div className="space-y-4 max-w-xl mx-auto py-2">
          <p className="font-serif-luxury text-sm sm:text-base text-[#5C161A] font-bold leading-relaxed">
            Together with our families, we request the honor of your gracious presence and heartfelt blessings on the auspicious occasion of the wedding ceremony of
          </p>
          <div className="py-3 border-y border-amber-500/40">
            <h2 className="font-temple-title text-3xl sm:text-5xl text-[#8C1820] font-black tracking-wide">
              ADARSH & KAVANA
            </h2>
          </div>
          <p className="font-serif-luxury text-sm sm:text-base text-[#5C161A] font-semibold">
            On Thursday, 3rd & Friday, 4th December 2026<br />
            At Sri Shubamasthu Kalyana Mantapa, Arasikere
          </p>
        </div>

        <p className="text-xs text-[#72491A] font-serif-luxury uppercase tracking-widest pt-4 border-t border-amber-400/30 font-bold">
          — Solicit Your Blessings: Family and Well-wishers —
        </p>
      </div>
    </section>
  );
}

/* =========================================================================
   SCENE 4: WEDDING CELEBRATIONS & TIMINGS (RECEPTION & MUHURTHAM)
   ========================================================================= */
function SectionCeremony({ onOpenQrModal }) {
  const [addressCopied, setAddressCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${CONFIG.venue.name}, ${CONFIG.venue.address}`);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2500);
  };

  return (
    <section 
      id="sec-ceremony" 
      className="relative min-h-[720px] sm:min-h-[840px] flex flex-col justify-center items-center px-4 sm:px-8 py-14 sm:py-20 z-20 text-center select-none"
    >
      {/* Background Painting */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="assets/watercolor_scene3_gopuram.jpg"
          alt="Virupaksha Gopuram Pathway Scenery"
          className="w-full h-full object-cover object-center filter brightness-[0.4] contrast-[1.1] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#240608]/95 via-[#240608]/85 to-[#240608]/95" />
      </div>

      {/* Top Banner */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <span className="inline-block px-5 py-1.5 rounded-full royal-glass text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-md">
          Celebration Details
        </span>
      </div>

      {/* Center 2-Card Layout (Reception & Muhurtham) */}
      <div className="w-full max-w-5xl mx-auto my-auto py-2 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
        
        {/* Reception Card */}
        <div className="p-6 sm:p-7 rounded-[2.5rem] royal-glass border border-amber-400/40 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                Wedding Reception
              </span>
              <span className="text-xs text-amber-200/80 font-serif-luxury font-semibold">
                Evening Celebration
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-serif-luxury text-xl sm:text-2xl text-amber-100 font-bold">
                {CONFIG.events.reception.dateFormatted}
              </h3>
              <p className="text-amber-300 font-bold text-sm sm:text-base flex items-center gap-2">
                <Clock size={16} />
                <span>{CONFIG.events.reception.time}</span>
              </p>
              <p className="text-xs text-amber-200/80 pt-1">
                An evening of grand welcome, dinner & celebratory music
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <a
              href={generateGoogleCalendarUrl(CONFIG.events.reception, CONFIG.venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-200 hover:text-[#381216] border border-amber-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Calendar size={14} />
              <span>Google Calendar</span>
            </a>
            <button
              onClick={() => downloadIcsFile(CONFIG.events.reception, CONFIG.venue)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white text-amber-100 hover:text-[#381216] text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>Apple Calendar (.ics)</span>
            </button>
          </div>
        </div>

        {/* Sacred Muhurtham Card */}
        <div className="p-6 sm:p-7 rounded-[2.5rem] royal-parchment shadow-2xl space-y-4 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#5C161A] text-amber-200 text-[10px] font-bold uppercase tracking-widest rounded-bl-2xl">
            Sacred Muhurtham
          </div>

          <div className="space-y-3">
            <div className="space-y-1 pt-1">
              <h3 className="font-serif-luxury text-2xl sm:text-3xl text-[#5C161A] font-bold">
                {CONFIG.events.muhurtham.dateFormatted}
              </h3>
              <p className="text-[#8C1820] font-bold text-base sm:text-lg flex items-center gap-2">
                <Clock size={18} />
                <span>{CONFIG.events.muhurtham.time}</span>
              </p>
              <p className="text-xs font-bold text-[#72491A] pt-0.5">
                Lagna: <span className="font-black text-[#5C161A]">{CONFIG.events.muhurtham.lagna}</span>
              </p>
              <p className="text-xs text-[#5C161A]/80 pt-1">
                Solemnized by Vedic mantras, Dhare Ereyuvudu & Saptapadi
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-2">
            <a
              href={generateGoogleCalendarUrl(CONFIG.events.muhurtham, CONFIG.venue)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#5C161A] hover:bg-[#741117] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
            >
              <Calendar size={14} className="text-amber-300" />
              <span>Add Muhurtham to Calendar</span>
            </a>
            <button
              onClick={() => downloadIcsFile(CONFIG.events.muhurtham, CONFIG.venue)}
              className="px-4 py-2.5 rounded-xl bg-white/80 hover:bg-white text-[#5C161A] border border-[#D4A034]/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>Apple Calendar (.ics)</span>
            </button>
          </div>
        </div>

        {/* Venue Information (Full Width) */}
        <div className="md:col-span-2 p-6 sm:p-7 rounded-[2.5rem] royal-glass border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-5 text-left">
          <div className="space-y-1">
            <span className="text-[11px] text-amber-300 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <MapPin size={14} />
              <span>Venue Location</span>
            </span>
            <h4 className="font-serif-luxury text-xl sm:text-2xl text-amber-100 font-bold">
              {CONFIG.venue.name}
            </h4>
            <p className="text-xs sm:text-sm text-amber-200/80">
              {CONFIG.venue.address}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={CONFIG.venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-[#381216] font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Navigation size={15} />
              <span>Open in Google Maps</span>
            </a>

            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-full royal-glass hover:bg-white/10 text-amber-200 border border-amber-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {addressCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              <span>{addressCopied ? "Copied" : "Copy Address"}</span>
            </button>

            <button
              onClick={onOpenQrModal}
              className="px-4 py-2.5 rounded-full royal-glass hover:bg-amber-400 hover:text-[#381216] text-amber-200 border border-amber-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>Scan QR</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

/* =========================================================================
   SCENE 5: COUPLE'S REAL PHOTOS (STRICTLY THE 2 USER-PROVIDED PHOTOS)
   ========================================================================= */
function SectionRealPhotos({ onOpenLightbox, onReplay, onScrollTop }) {
  const photos = CONFIG.realPhotos; // Strictly the 2 photos provided by the user

  return (
    <section 
      id="sec-photos" 
      className="relative min-h-[720px] sm:min-h-[860px] flex flex-col justify-center items-center px-4 sm:px-8 py-14 sm:py-20 z-20 text-center select-none"
    >
      {/* Background Painting */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="assets/watercolor_scene1_hampi.jpg"
          alt="Temple Serenity Scenery"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.1] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#240608]/95 via-[#240608]/85 to-[#240608]/98" />
      </div>

      {/* Top Banner */}
      <div className="w-full max-w-4xl mx-auto mb-8 space-y-2">
        <span className="inline-block px-5 py-1.5 rounded-full royal-glass text-amber-300 border border-amber-400/40 text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-md">
          Couple's Real Moments
        </span>
        <h2 className="font-temple-title text-3xl sm:text-5xl gold-shimmer font-bold tracking-wide">
          Adarsh & Kavana
        </h2>
        <p className="font-body-serif text-base sm:text-xl text-amber-100/90 italic">
          Genuine candid moments filled with love and warmth
        </p>
      </div>

      {/* Main Real Photos Showcase: ALL 5 COUPLE PHOTOS */}
      <div className="w-full max-w-6xl mx-auto my-auto py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {photos.map((photo, idx) => {
          const isFifth = idx === 4;
          return (
            <div 
              key={photo.id || idx}
              onClick={() => onOpenLightbox(idx)}
              className={`cursor-pointer group relative rounded-[2.5rem] overflow-hidden border-4 border-amber-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_25px_rgba(229,181,66,0.35)] bg-[#1A0305] flex flex-col justify-between transition-all duration-500 hover:scale-[1.02] hover:border-amber-400 ${
                isFifth ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-[#240B0E]">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                />
                {/* Tag Badge */}
                <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full royal-glass text-amber-300 text-xs font-bold tracking-wider uppercase border border-amber-400/40 shadow-lg">
                  {photo.tag}
                </div>

                {/* Click to Zoom indicator icon */}
                <div className="absolute top-4 right-4 p-2 rounded-full royal-glass text-amber-200 border border-amber-400/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Sparkles size={16} />
                </div>
              </div>

              {/* Caption Overlay */}
              <div className="p-5 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-[#1A0305] text-left border-t border-amber-400/30">
                <h3 className="font-temple-title text-xl sm:text-2xl text-amber-200 font-bold drop-shadow-md">
                  {photo.title}
                </h3>
                <p className="font-body-serif text-sm sm:text-base text-amber-100/90 italic drop-shadow-sm pt-1">
                  {photo.subtitle}
                </p>
                <p className="text-[10px] text-amber-400/80 uppercase tracking-widest font-semibold pt-2 flex items-center gap-1.5">
                  <span>Tap to view high-res photo</span>
                  <ChevronRight size={12} />
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heartfelt Blessings Closing Note */}
      <div className="w-full max-w-2xl mx-auto mt-10 p-6 rounded-3xl royal-glass border border-amber-400/40 text-center space-y-2">
        <p className="font-body-serif text-lg sm:text-xl text-amber-100 italic leading-relaxed">
          "Bound by love, blessed by elders, and celebrated by family."
        </p>
        <p className="font-serif-luxury text-xs sm:text-sm text-amber-300 font-semibold tracking-wider uppercase">
          We look forward to welcoming you with warmth and affection!
        </p>
      </div>

      {/* Action Buttons: Back to Top & Replay Envelope */}
      <div className="w-full max-w-md mx-auto pt-8 pb-4 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onScrollTop}
          className="px-6 py-3 rounded-full royal-glass hover:bg-white/10 text-amber-200 text-xs sm:text-sm font-semibold tracking-wider flex items-center gap-2 transition-all shadow-lg hover:scale-105"
        >
          <ArrowUp size={16} />
          <span>Back to Top</span>
        </button>

        <button
          onClick={onReplay}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-[#381216] font-bold text-xs sm:text-sm tracking-widest uppercase shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <RefreshCw size={15} />
          <span>Replay Envelope</span>
        </button>
      </div>

      {/* Footer Info */}
      <footer className="w-full pt-8 pb-4 text-center text-[11px] text-amber-200/60 font-serif-luxury tracking-widest uppercase border-t border-amber-400/20 mt-6">
        Adarsh & Kavana • Sri Shubamasthu Kalyana Mantapa, Arasikere • December 3 & 4, 2026
      </footer>

    </section>
  );
}

/* =========================================================================
   REAL COUPLE PHOTOS LIGHTBOX MODAL (STRICTLY THE 2 PHOTOS)
   ========================================================================= */
function RealPhotosModal({ isOpen, onClose, initialPhotoIdx = 0 }) {
  if (!isOpen) return null;

  const photos = CONFIG.realPhotos; // Strictly the 2 photos
  const [activeIdx, setActiveIdx] = useState(initialPhotoIdx);

  useEffect(() => {
    setActiveIdx(initialPhotoIdx);
  }, [initialPhotoIdx]);

  const currentPhoto = photos[activeIdx];

  const handleNext = () => {
    setActiveIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] bg-[#1C0407] border-2 border-amber-400/60 p-4 sm:p-8 shadow-2xl flex flex-col items-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 transition-colors z-20"
          title="Close Lightbox"
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pb-3 text-center w-full">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">
            Genuine Couple Moments • {activeIdx + 1} of {photos.length}
          </span>
          <h3 className="font-temple-title text-2xl sm:text-3xl text-amber-200 font-bold">
            Adarsh & Kavana
          </h3>
        </div>

        {/* Featured Photo Display with full aspect ratio */}
        <div className="relative w-full max-w-2xl my-auto rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl bg-black flex items-center justify-center group">
          <img
            key={currentPhoto.src}
            src={currentPhoto.src}
            alt={currentPhoto.title}
            className="w-full max-h-[60vh] object-contain object-center animate-fade-in"
          />

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full royal-glass hover:bg-amber-400 hover:text-[#381216] text-amber-200 border border-amber-400/50 flex items-center justify-center shadow-xl transition-all"
            title="Previous Photo"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full royal-glass hover:bg-amber-400 hover:text-[#381216] text-amber-200 border border-amber-400/50 flex items-center justify-center shadow-xl transition-all"
            title="Next Photo"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Photo Caption Details */}
        <div className="mt-4 text-center space-y-1 max-w-xl">
          <div className="inline-block px-3 py-0.5 rounded-full royal-glass text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
            {currentPhoto.tag}
          </div>
          <h4 className="font-serif-luxury text-lg sm:text-xl text-amber-200 font-bold">
            {currentPhoto.title}
          </h4>
          <p className="font-body-serif text-sm sm:text-base text-amber-100/90 italic">
            {currentPhoto.subtitle}
          </p>
        </div>

        {/* 2-Thumbnail Switcher */}
        <div className="mt-4 flex items-center justify-center gap-3">
          {photos.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                activeIdx === idx
                  ? "border-amber-400 scale-105 shadow-[0_0_15px_rgba(229,181,66,0.8)]"
                  : "border-amber-400/30 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={p.src} alt={p.title} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

/* =========================================================================
   VENUE GPS QR CODE MODAL
   ========================================================================= */
function QrModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm rounded-[2.5rem] royal-glass border-2 border-amber-400/60 p-6 shadow-2xl text-center space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="font-serif-luxury text-xl text-amber-100 font-bold">
          Scan for GPS Directions
        </h3>
        <p className="text-xs text-amber-200/80">
          Sri Shubamasthu Kalyana Mantapa, Arasikere
        </p>

        <div className="p-3 rounded-2xl bg-white shadow-xl mx-auto w-fit">
          <img
            src={CONFIG.venueQr}
            alt="Venue QR Code"
            className="w-44 h-44 object-contain"
          />
        </div>

        <a
          href={CONFIG.venue.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#381216] font-bold text-xs uppercase tracking-widest transition-all"
        >
          Open Google Maps
        </a>
      </div>
    </div>
  );
}

/* =========================================================================
   MAIN APP: LUXURY CINEMATIC SCROLLABLE WEDDING INVITATION WEBSITE
   ========================================================================= */
export default function App() {
  const getInitialParam = (param, defaultVal) => {
    try {
      const params = new URLSearchParams(window.location.search);
      const val = params.get(param);
      return val !== null ? val : defaultVal;
    } catch (e) {
      return defaultVal;
    }
  };

  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(() => getInitialParam("opened", "false") === "true");
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activeSection, setActiveSection] = useState("sec-ganesha");
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxInitialIdx, setLightboxInitialIdx] = useState(0);
  const [showQrModal, setShowQrModal] = useState(false);

  const audioRef = useRef(null);

  // Initialize Music ("Aaj Ibaadat")
  useEffect(() => {
    const audio = new Audio(CONFIG.musicUrl);
    audio.loop = true;
    audioRef.current = audio;

    // If already opened via URL parameter, try auto-play
    if (hasOpenedEnvelope) {
      audio.play().then(() => setIsPlayingMusic(true)).catch(() => {});
    }

    return () => {
      audio.pause();
    };
  }, []);

  const handleStartMusic = () => {
    if (audioRef.current && !isPlayingMusic) {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {});
    }
  };

  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(() => {});
    }
  };

  // Initial auto-scroll if hash or section param is present (polls until DOM element is mounted)
  useEffect(() => {
    if (!hasOpenedEnvelope) return;
    const targetId = window.location.hash.replace("#", "") || getInitialParam("section", "");
    if (targetId) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const el = document.getElementById(targetId);
        if (el) {
          clearInterval(interval);
          el.scrollIntoView({ behavior: "instant" });
        } else if (attempts > 25) {
          clearInterval(interval);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [hasOpenedEnvelope]);
  useEffect(() => {
    if (!hasOpenedEnvelope) return;

    const sections = ["sec-ganesha", "sec-couple", "sec-invitation", "sec-ceremony", "sec-photos"];
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: [0.3, 0.6]
    });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [hasOpenedEnvelope]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenLightbox = (idx) => {
    setLightboxInitialIdx(idx);
    setShowLightbox(true);
  };

  const navItems = [
    { id: "sec-ganesha", label: "Ganesha", icon: "🪔" },
    { id: "sec-couple", label: "Couple", icon: "💑" },
    { id: "sec-invitation", label: "Invitation", icon: "📜" },
    { id: "sec-ceremony", label: "Muhurtham", icon: "📅" },
    { id: "sec-photos", label: "Photos", icon: "📸" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#240608] text-[#FBF8F1] overflow-x-hidden select-none">
      
      {/* 1. INITIAL INTERACTIVE ENVELOPE (Opens on tap) */}
      {!hasOpenedEnvelope && (
        <InteractiveEnvelope
          onStartMusic={handleStartMusic}
          onOpenComplete={() => {
            setHasOpenedEnvelope(true);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        />
      )}

      {/* 2. PERSISTENT FALLING PETALS CANVAS */}
      <PetalsCanvas />

      {/* 3. SWAYING TEMPLE BELLS AT TOP */}
      <div className="fixed top-0 left-4 sm:left-10 z-30 pointer-events-none">
        <TempleBell isLeft={true} />
      </div>
      <div className="fixed top-0 right-4 sm:right-10 z-30 pointer-events-none">
        <TempleBell isLeft={false} />
      </div>

      {/* 4. HANGING MANGO LEAF & MARIGOLD TORAN */}
      <div className="fixed top-0 left-0 w-full z-20 pointer-events-none">
        <TempleToran />
      </div>

      {/* 5. FLOATING AUDIO CONTROLLER (TOP RIGHT) */}
      <div className="fixed top-4 right-4 sm:right-8 z-40 flex items-center gap-2">
        <button
          onClick={handleToggleMusic}
          className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full royal-glass hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-amber-200 border border-amber-300/60 shadow-2xl text-xs"
          title={isPlayingMusic ? "Pause Aaj Ibaadat" : "Play Aaj Ibaadat"}
        >
          {isPlayingMusic ? (
            <>
              <Volume2 size={16} className="text-amber-300 animate-pulse" />
              <span className="font-semibold tracking-wider uppercase hidden sm:inline">Aaj Ibaadat</span>
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-1 bg-amber-300 animate-[bounce_1s_infinite_100ms] h-full rounded-sm" />
                <span className="w-1 bg-amber-300 animate-[bounce_1s_infinite_300ms] h-2/3 rounded-sm" />
                <span className="w-1 bg-amber-300 animate-[bounce_1s_infinite_200ms] h-4/5 rounded-sm" />
              </div>
            </>
          ) : (
            <>
              <Music size={16} />
              <span className="font-semibold tracking-wider uppercase hidden sm:inline">Play Aaj Ibaadat</span>
            </>
          )}
        </button>
      </div>

      {/* 6. MAIN CONTINUOUS VERTICAL SCROLLABLE JOURNEY */}
      <main className="relative w-full z-10 flex flex-col">
        {/* Section 1: Auspicious Divine Opening */}
        <SectionGanesha onScrollNext={() => scrollToSection("sec-couple")} />

        {/* Section 2: The Couple & Vedic Blessing */}
        <SectionCouple 
          onScrollPhotos={() => scrollToSection("sec-photos")}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* Section 3: Royal Formal Invitation Folio */}
        <SectionInvitation />

        {/* Section 4: Celebrations & Timings (Reception & Muhurtham) */}
        <SectionCeremony onOpenQrModal={() => setShowQrModal(true)} />

        {/* Section 5: Couple's Real Moments (Strictly the 2 Photos) */}
        <SectionRealPhotos
          onOpenLightbox={handleOpenLightbox}
          onReplay={() => {
            setHasOpenedEnvelope(false);
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
          onScrollTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        />
      </main>

      {/* 7. FLOATING QUICK NAVIGATION DOCK (PINNED AT BOTTOM) */}
      {hasOpenedEnvelope && (
        <nav 
          aria-label="Invitation Quick Navigation"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-lg transition-all"
        >
          <div className="p-1.5 sm:p-2 rounded-full royal-glass border border-amber-400/50 shadow-2xl flex items-center justify-between gap-1 sm:gap-1.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex-1 py-1.5 sm:py-2 px-1 sm:px-2 rounded-full text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-amber-400 text-[#381216] font-bold shadow-md scale-102"
                      : "text-amber-200/80 hover:text-amber-100 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xs sm:text-sm">{item.icon}</span>
                  <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase truncate">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* 8. REAL PHOTOS LIGHTBOX MODAL (STRICTLY THE 2 PHOTOS) */}
      <RealPhotosModal
        isOpen={showLightbox}
        initialPhotoIdx={lightboxInitialIdx}
        onClose={() => setShowLightbox(false)}
      />

      {/* 9. VENUE GPS QR MODAL */}
      <QrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />

    </div>
  );
}

// Render into DOM
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
