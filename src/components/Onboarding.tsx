"use client";

import { useState } from "react";

const slides = [
  {
    emoji: "♻️",
    title: "Welcome to BottleCollect",
    desc: "The easiest way to recycle bottles and cans — or earn money collecting them.",
  },
  {
    emoji: "📍",
    title: "Create a request",
    desc: "Pin your location, choose the type and amount of items. A driver will come pick them up.",
  },
  {
    emoji: "💰",
    title: "Earn or declutter",
    desc: "Drivers earn per collected item. Clients get rid of bottles hassle-free. Everyone wins!",
  },
];

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  const isLast = step === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[300] bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-6">
      <div className="text-center animate-fade-in" key={step}>
        <div className="text-6xl mb-6">{slides[step].emoji}</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{slides[step].title}</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">{slides[step].desc}</p>
      </div>

      <div className="flex gap-2 mt-10 mb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === step ? "bg-green-600" : "bg-gray-300 dark:bg-gray-700"
            }`}
          />
        ))}
      </div>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={() => {
            if (isLast) {
              localStorage.setItem("bottlecollect_onboarded", "1");
              onDone();
            } else {
              setStep(step + 1);
            }
          }}
          className="w-full bg-green-600 text-white text-lg font-semibold py-4 rounded-2xl active:bg-green-700 active:scale-[0.98] transition-all"
        >
          {isLast ? "Get Started" : "Next"}
        </button>
        {!isLast && (
          <button
            onClick={() => {
              localStorage.setItem("bottlecollect_onboarded", "1");
              onDone();
            }}
            className="w-full text-gray-400 text-sm py-2"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
