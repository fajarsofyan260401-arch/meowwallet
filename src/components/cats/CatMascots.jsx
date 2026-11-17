import React from "react";

export function sharkCat({ className = "w-28 h-28" }) {
  return <img src="/images/shark-cat.png" alt="Shark Cat" className={`${className} object-contain`} />;
}

export function strawberryCat({ className = "w-28 h-28" }) {
  return <img src="/images/strawberry-cat.png" alt="Strawberry Cat" className={`${className} object-contain`} />;
}

export function shrimpCat({ className = "w-24 h-24" }) {
  return <img src="/images/shrimp-cat.png" alt="Shrimp Cat" className={`${className} object-contain`} />;
}

export function sleepingCat({ className = "w-32 h-32" }) {
  return <img src="/images/sleeping-cat.png" alt="Sleeping Cat" className={`${className} object-contain`} />;
}

export function happyCat({ className = "w-20 h-20" }) {
  return <img src="/images/happy-cat.png" alt="Happy Cat" className={`${className} object-contain`} />;
}
