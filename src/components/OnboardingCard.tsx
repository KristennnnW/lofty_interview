import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Globe, Upload, Brain, ArrowRight } from "lucide-react";
import { CASE_NAME } from "../data/caseData";

interface OnboardingCardProps {
  onStart: () => void;
}

export function OnboardingCard({ onStart }: OnboardingCardProps) {
  const [inputType, setInputType] = useState<"phone" | "ip" | "cdr">("phone");
  const [value, setValue] = useState("");

  const placeholders = {
    phone: "+1 (312) 555-0142",
    ip: "198.51.100.47",
    cdr: "carrier_cdrs_may2024.csv",
  };

  const options = [
    { type: "phone" as const, label: "Phone Number", icon: Smartphone },
    { type: "ip" as const, label: "IP Address", icon: Globe },
    { type: "cdr" as const, label: "Upload CDR", icon: Upload },
  ];

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      {/* Background with subtle grid */}
      <div className="absolute inset-0 bg-[#0a0a0f]/97 backdrop-blur-sm" />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `linear-gradient(#1e1e2e 1px, transparent 1px), linear-gradient(90deg, #1e1e2e 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26, delay: 0.1 }}
        className="relative z-10 w-full max-w-[440px] mx-4"
      >
        <div className="glass-card rounded-2xl border border-[#1e1e2e] p-8 shadow-2xl shadow-black/70">
          {/* Logo + title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/15 border border-[#3b82f6]/30 flex items-center justify-center flex-shrink-0">
              <Brain size={20} className="text-[#3b82f6]" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-[15px] font-semibold text-slate-100 leading-tight">
                Start your investigation
              </h1>
              <p className="text-[11px] text-slate-500 mt-0.5 font-mono truncate">
                {CASE_NAME}
              </p>
            </div>
          </div>

          {/* AI tagline */}
          <div className="flex items-start gap-2 mb-6 pl-3 border-l-2 border-[#3b82f6]/40">
            <p className="text-[12px] text-[#93c5fd]/80 leading-relaxed">
              Give me a starting point and I'll build the investigation map for you.
            </p>
          </div>

          {/* Input type selector */}
          <div className="flex gap-2 mb-4">
            {options.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setInputType(type)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-[11px] font-medium transition-all duration-200 ${
                  inputType === type
                    ? "border-[#3b82f6]/50 bg-[#3b82f6]/10 text-[#93c5fd]"
                    : "border-[#1e1e2e] bg-[#0d0d14] text-slate-500 hover:border-slate-600 hover:text-slate-400"
                }`}
              >
                <Icon size={15} strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </div>

          {/* Input field */}
          {inputType !== "cdr" ? (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholders[inputType]}
              className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm font-mono text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-[#3b82f6]/50 transition-colors mb-4"
              onKeyDown={(e) => e.key === "Enter" && onStart()}
              autoFocus
            />
          ) : (
            <div
              onClick={onStart}
              className="w-full bg-[#0d0d14] border border-dashed border-[#1e1e2e] rounded-lg px-3 py-5 text-center cursor-pointer hover:border-slate-600 transition-colors mb-4"
            >
              <Upload size={16} className="mx-auto mb-1.5 text-slate-600" />
              <p className="text-[11px] text-slate-600">Drop a CDR file here or click to browse</p>
              <p className="text-[10px] text-slate-700 mt-0.5">Supports .csv, .xlsx</p>
            </div>
          )}

          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium transition-colors"
          >
            Begin Investigation
            <ArrowRight size={14} />
          </button>

          <p className="text-center text-[10px] text-slate-600 mt-3">
            Or load example case →{" "}
            <button
              onClick={onStart}
              className="text-[#3b82f6]/60 hover:text-[#3b82f6] underline underline-offset-2 transition-colors"
            >
              Operation Nightfall
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
