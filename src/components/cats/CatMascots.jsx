"use client";

import React, { useState } from "react";

function CatImage({ baseName, alt, className, fallback }) {
  const [step, setStep] = useState(0);

  if (step === 2) {
    return fallback;
  }

  const src = step === 0 ? `/images/${baseName}.png` : `/images/${baseName}.PNG`;

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} object-contain`}
      onError={() => setStep((prev) => prev + 1)}
    />
  );
}

export function SharkCat({ className = "w-28 h-28" }) {
  return (
    <CatImage
      baseName="shark-cat"
      alt="Shark Cat"
      className={className}
      fallback={
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <path d="M60 10 L74 32 L46 32 Z" fill="#89BFE0" />
          <ellipse cx="60" cy="66" rx="42" ry="40" fill="#9BCBE8" />
          <circle cx="60" cy="70" r="28" fill="#FFF7EE" />
          <path d="M38 48 L44 55 L50 47 L56 55 L62 47 L68 55 L74 47 L80 54" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="49" cy="68" r="3.5" fill="#51443F" />
          <circle cx="71" cy="68" r="3.5" fill="#51443F" />
          <ellipse cx="43" cy="74" rx="4.5" ry="2.5" fill="#F7B2C4" />
          <ellipse cx="77" cy="74" rx="4.5" ry="2.5" fill="#F7B2C4" />
          <path d="M55 74 Q60 79 65 74" stroke="#51443F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      }
    />
  );
}

export function StrawberryCat({ className = "w-28 h-28" }) {
  return (
    <CatImage
      baseName="strawberry-cat"
      alt="Strawberry Cat"
      className={className}
      fallback={
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <ellipse cx="60" cy="66" rx="40" ry="40" fill="#F6A6B8" />
          <path d="M40 30 Q60 42 80 30 Q72 20 60 24 Q48 20 40 30 Z" fill="#8EC693" />
          <circle cx="32" cy="54" r="2" fill="#FFE699" />
          <circle cx="88" cy="54" r="2" fill="#FFE699" />
          <circle cx="60" cy="68" r="28" fill="#FFF7EE" />
          <circle cx="49" cy="66" r="3.5" fill="#51443F" />
          <circle cx="71" cy="66" r="3.5" fill="#51443F" />
          <ellipse cx="43" cy="72" rx="4.5" ry="2.5" fill="#F7B2C4" />
          <ellipse cx="77" cy="72" rx="4.5" ry="2.5" fill="#F7B2C4" />
          <path d="M55 72 Q60 77 65 72" stroke="#51443F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      }
    />
  );
}

export function ShrimpCat({ className = "w-24 h-24" }) {
  return (
    <CatImage
      baseName="shrimp-cat"
      alt="Shrimp Cat"
      className={className}
      fallback={
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <path d="M78 22 L96 14 L92 32 Z" fill="#E87A5D" />
          <ellipse cx="60" cy="66" rx="40" ry="38" fill="#F7B882" />
          <circle cx="60" cy="68" r="27" fill="#FFF7EE" />
          <circle cx="49" cy="66" r="3.5" fill="#51443F" />
          <circle cx="71" cy="66" r="3.5" fill="#51443F" />
          <ellipse cx="43" cy="72" rx="4.5" ry="2.5" fill="#F7B2C4" />
          <ellipse cx="77" cy="72" rx="4.5" ry="2.5" fill="#F7B2C4" />
          <path d="M55 72 Q60 77 65 72" stroke="#51443F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      }
    />
  );
}

export function SleepingCat({ className = "w-32 h-32" }) {
  return (
    <CatImage
      baseName="sleeping-cat"
      alt="Sleeping Cat"
      className={className}
      fallback={
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <path d="M36 46 L42 26 L56 40 Z" fill="#F3DEC9" />
          <path d="M84 46 L78 26 L64 40 Z" fill="#F3DEC9" />
          <ellipse cx="60" cy="72" rx="42" ry="32" fill="#FFF7EE" stroke="#E8D5C4" strokeWidth="3" />
          <path d="M44 68 Q49 73 54 68" stroke="#51443F" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M66 68 Q71 73 76 68" stroke="#51443F" strokeWidth="2.5" strokeLinecap="round" />
          <ellipse cx="42" cy="74" rx="4" ry="2.5" fill="#F7B2C4" />
          <ellipse cx="78" cy="74" rx="4" ry="2.5" fill="#F7B2C4" />
          <text x="84" y="34" fill="#9E8A7E" fontSize="14" fontWeight="bold">zZ</text>
        </svg>
      }
    />
  );
}

export function HappyCat({ className = "w-20 h-20" }) {
  return (
    <CatImage
      baseName="happy-cat"
      alt="Happy Cat"
      className={className}
      fallback={
        <svg viewBox="0 0 120 120" className={className} fill="none">
          <path d="M34 48 L40 24 L56 38 Z" fill="#FFF7EE" stroke="#E8D5C4" strokeWidth="3" />
          <path d="M86 48 L80 24 L64 38 Z" fill="#FFF7EE" stroke="#E8D5C4" strokeWidth="3" />
          <circle cx="60" cy="68" r="36" fill="#FFF7EE" stroke="#E8D5C4" strokeWidth="3" />
          <path d="M44 64 L49 59 L54 64" stroke="#51443F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M66 64 L71 59 L76 64" stroke="#51443F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="42" cy="71" rx="4.5" ry="2.5" fill="#F7B2C4" />
          <ellipse cx="78" cy="71" rx="4.5" ry="2.5" fill="#F7B2C4" />
          <path d="M54 72 Q60 79 66 72" stroke="#51443F" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      }
    />
  );
}
