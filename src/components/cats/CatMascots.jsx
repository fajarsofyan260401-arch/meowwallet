import React from "react";

export function SharkCat({ className = "w-28 h-28" }) {
  return <img src="/images/shark-cat.png" alt="Shark Cat" className={`${className} object-contain`} />;
}

export function StrawberryCat({ className = "w-28 h-28" }) {
  return <img src="/images/strawberry-cat.png" alt="Strawberry Cat" className={`${className} object-contain`} />;
}

export function ShrimpCat({ className = "w-24 h-24" }) {
  return <img src="/images/shrimp-cat.png" alt="Shrimp Cat" className={`${className} object-contain`} />;
}

export function SleepingCat({ className = "w-32 h-32" }) {
  return <img src="/images/sleeping-cat.png" alt="Sleeping Cat" className={`${className} object-contain`} />;
}

export function HappyCat({ className = "w-20 h-20" }) {
  return <img src="/images/happy-cat.png" alt="Happy Cat" className={`${className} object-contain`} />;
}