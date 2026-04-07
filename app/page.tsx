"use client";

import { useState, useCallback, useRef } from "react";
import {
  Shield, AlertTriangle, AlertOctagon, Info, ChevronDown,
  RefreshCw, Heart, Pill, Activity, CheckCircle, ExternalLink,
  Search, X, Stethoscope, BookOpen, Clock,
} from "lucide-react";
import clsx from "clsx";
import type { AnalysisOutput, UrgencyLevel } from "@/app/lib/engine";

// ── Urgency config ────────────────────────────────────────────────────────────
const URGENCY_CONFIG: Record<UrgencyLevel, {
  label: string; color: string; bg: string; border: string; Icon: typeof Shield;
}> = {
  emergency: {
    label: "Emergency — Call 911 Now",
    color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.4)",
    Icon: AlertOctagon,
  },
  urgent: {
    label: "Urgent — See a Doctor Today",
    color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.3)",
    Icon: AlertTriangle,
  },
  see_doctor: {
    label: "See a Doctor Soon",
    color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.3)",
    Icon: Stethoscope,
  },
  monitor: {
    label: "Monitor at Home",
    color: "#38bdf8", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.3)",
    Icon: Activity,
  },
  self_care: {
    label: "Self-Care Appropriate",
    color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.3)",
    Icon: CheckCircle,
  },
};

const SEVERITY_CONFIG = {
  contraindicated: { label: "CONTRAINDICATED",  color: "#f87171" },
  severe:          { label: "SEVERE",            color: "#fb923c" },
  moderate:        { label: "MODERATE",          color: "#fbbf24" },
  mild:            { label: "MILD",              color: "#94a3b8" },
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [symptoms,    setSymptoms]    = useState("");
  const [medications, setMedications] = useState("");
  const [age,         setAge]         = useState("");
  const [result,      setResult]      = useState<AnalysisOutput | null>(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleAnalyse = useCallback(async () => {
    if (!symptoms.trim() && !medications.trim()) {
      setError("Please describe your symptoms or list your medications.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms:    symptoms.trim(),
          medications: medications.trim(),
          age:         age ? Number(age) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");

      setResult(data.result);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [symptoms, medications, age]);

  const handleReset = useCallback(() => {
    setResult(null); setError(null);
    setSymptoms(""); setMedications(""); setAge("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#0f172a" }}>
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50"
        style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(10px)" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center">
              <Heart size={16} className="text-brand" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-text">MediCheck AI</h1>
              <p className="text-xs text-muted hidden sm:block">Symptom &amp; Medication Safety Checker</p>
            </div>
          </div>
          <a href="https://opengradient.ai" target="_blank" rel="noopener noreferrer"
            className="text-xs text-muted hover:text-brand transition-colors flex items-center gap-1">
            Powered by OpenGradient
            <ExternalLink size={10} />
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Hero */}
        {!result && !loading && (
          <div className="text-center space-y-3 py-4 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto">
              <Shield size={28} className="text-brand" />
            </div>
            <h2 className="text-2xl font-semibold text-text">
              Free Health Assessment
            </h2>
            <p className="text-dim text-sm max-w-md mx-auto leading-relaxed">
              Describe your symptoms, list your medications, and get an instant AI-powered
              health assessment — including dangerous drug interaction checks.
              Free, private, no signup required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              {["No signup", "100% Free", "Private", "Instant results"].map((tag) => (
                <span key={tag} className="text-xs text-muted flex items-center gap-1">
                  <CheckCircle size={11} className="text-safe" /> {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Input form */}
        {!result && (
          <div className="card space-y-5 animate-fade-up">

            {/* Symptoms */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text">
                <Activity size={14} className="text-brand" />
                Describe your symptoms
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => { setSymptoms(e.target.value); setError(null); }}
                placeholder="e.g. I have a sore throat, runny nose, and mild fever since yesterday. Also feeling very tired and my head hurts."
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted"
                rows={4}
              />
              <p className="text-xs text-muted">
                Describe how you feel in plain English. Be as specific as you can.
              </p>
            </div>

            {/* Medications */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-text">
                <Pill size={14} className="text-brand" />
                Current medications
                <span className="text-muted text-xs font-normal">(optional but important)</span>
              </label>
              <textarea
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="e.g. warfarin 5mg, ibuprofen 400mg, lisinopril 10mg, vitamin D — or type brand names like Advil, Coumadin, Tylenol"
                className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-text placeholder:text-muted"
                rows={3}
              />
              <p className="text-xs text-muted">
                Include all prescription drugs, over-the-counter medicines, and supplements.
                Brand names and generic names both work.
              </p>
            </div>

            {/* Advanced (age) */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-brand transition-colors"
              >
                <ChevronDown size={13} className={clsx("transition-transform", showAdvanced && "rotate-180")} />
                {showAdvanced ? "Hide" : "Show"} optional details
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  <label className="text-xs font-medium text-dim">Age (helps refine assessment)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 35"
                    min={1} max={120}
                    className="w-32 bg-surface border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-muted"
                  />
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger animate-fade-in">
                <AlertTriangle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleAnalyse}
              disabled={loading || (!symptoms.trim() && !medications.trim())}
              className={clsx(
                "w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all",
                loading || (!symptoms.trim() && !medications.trim())
                  ? "bg-panel text-muted border border-border cursor-not-allowed"
                  : "bg-brand text-white hover:bg-sky-400 active:scale-[0.99]"
              )}
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Analysing...
                </>
              ) : (
                <>
                  <Search size={14} />
                  Check My Symptoms
                </>
              )}
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="card space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="pulse-dot bg-brand" />
              <span className="text-sm text-dim font-medium">Running AI analysis...</span>
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="shimmer h-4" style={{ width: `${70 + i * 10}%` }} />
                <div className="shimmer h-3" style={{ width: `${50 + i * 8}%` }} />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div ref={resultRef} className="space-y-4 animate-fade-up">

            {/* Urgency banner */}
            <UrgencyBanner urgency={result.urgency} isEmergency={result.isEmergency} emergencySymptoms={result.emergencySymptoms} />

            {/* AI narrative */}
            <div className="card space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-text">
                <BookOpen size={14} className="text-brand" />
                Assessment Summary
              </div>
              <p
                className="text-sm text-dim leading-relaxed narrative"
                dangerouslySetInnerHTML={{
                  __html: result.aiNarrative.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                }}
              />
              <div className="flex items-start gap-2 p-3 rounded-lg bg-brand/5 border border-brand/15">
                <Clock size={13} className="text-brand mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-brand mb-0.5">When to seek care</p>
                  <p className="text-xs text-dim">{result.whenToSeekCare}</p>
                </div>
              </div>
            </div>

            {/* Drug interactions */}
            {result.interactions.length > 0 && (
              <InteractionSection interactions={result.interactions} />
            )}

            {/* Possible conditions */}
            {result.conditions.length > 0 && result.symptomsFound.length > 0 && (
              <ConditionsSection conditions={result.conditions} />
            )}

            {/* Self care tips */}
            {result.selfCareTips.length > 0 && result.urgency !== "emergency" && result.urgency !== "urgent" && (
              <SelfCareSection tips={result.selfCareTips} />
            )}

            {/* Detected drugs & symptoms */}
            {(result.drugsFound.length > 0 || result.symptomsFound.length > 0) && (
              <DetectedSection drugs={result.drugsFound} symptoms={result.symptomsFound} />
            )}

            {/* Disclaimer */}
            <Disclaimer />

            {/* Reset */}
            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-lg text-sm text-muted border border-border hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-2"
            >
              <X size={13} />
              Start a New Assessment
            </button>
          </div>
        )}

        {/* Example prompts */}
        {!result && !loading && (
          <ExamplePrompts
            onSelect={(sym, med) => { setSymptoms(sym); setMedications(med); }}
          />
        )}
      </main>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function UrgencyBanner({
  urgency, isEmergency, emergencySymptoms,
}: {
  urgency: UrgencyLevel; isEmergency: boolean; emergencySymptoms: string[];
}) {
  const cfg = URGENCY_CONFIG[urgency];
  const { Icon } = cfg;

  return (
    <div
      className={clsx("p-4 rounded-xl border flex items-start gap-3", isEmergency && "emergency-pulse")}
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <Icon size={20} style={{ color: cfg.color }} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm" style={{ color: cfg.color }}>
          {cfg.label}
        </p>
        {isEmergency && (
          <>
            <p className="text-xs text-dim mt-1">
              Your symptoms may indicate a life-threatening emergency. Call 911 / 999 / 112 immediately
              or have someone take you to the nearest emergency room.
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {emergencySymptoms.map((s) => (
                <span key={s} className="badge" style={{ background: "rgba(248,113,113,0.15)", color: "#f87171" }}>
                  {s}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InteractionSection({ interactions }: { interactions: AnalysisOutput["interactions"] }) {
  const worst = [...interactions].sort((a, b) => {
    const order = { contraindicated: 0, severe: 1, moderate: 2, mild: 3 };
    return order[a.interaction.severity] - order[b.interaction.severity];
  });

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-text">
        <AlertTriangle size={14} className="text-warn" />
        Drug Interaction Check
        <span className="text-xs text-muted font-normal">({interactions.length} found)</span>
      </div>

      {worst.map((item, i) => {
        const sev = SEVERITY_CONFIG[item.interaction.severity];
        return (
          <div
            key={i}
            className="p-3 rounded-lg border"
            style={{
              background: `${sev.color}10`,
              borderColor: `${sev.color}30`,
            }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-medium text-sm text-text capitalize">{item.drug1Display}</span>
              <span className="text-muted text-xs">+</span>
              <span className="font-medium text-sm text-text capitalize">{item.drug2Display}</span>
              <span
                className="badge ml-auto"
                style={{ background: `${sev.color}18`, color: sev.color }}
              >
                {sev.label}
              </span>
            </div>
            <p className="text-xs text-dim leading-relaxed">{item.interaction.description}</p>
            <p className="text-xs text-muted mt-1 italic">
              Why: {item.interaction.mechanism}
            </p>
          </div>
        );
      })}

      <p className="text-xs text-muted pt-1 border-t border-border">
        Always consult your pharmacist or doctor before starting, stopping, or changing any medication.
      </p>
    </div>
  );
}

function ConditionsSection({ conditions }: { conditions: AnalysisOutput["conditions"] }) {
  const urgencyLabel: Record<string, string> = {
    emergency: "Emergency", urgent: "Urgent", see_doctor: "See Doctor",
    monitor: "Monitor", self_care: "Self-Care",
  };
  const urgencyColor: Record<string, string> = {
    emergency: "#f87171", urgent: "#fb923c", see_doctor: "#fbbf24",
    monitor: "#38bdf8", self_care: "#34d399",
  };

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-text">
        <Stethoscope size={14} className="text-brand" />
        Possible Conditions
      </div>
      <p className="text-xs text-muted">
        Based on your symptoms — listed by likelihood and urgency.
      </p>

      {conditions.map((item, i) => {
        const urg = item.condition.urgency;
        const col = urgencyColor[urg] ?? "#94a3b8";
        return (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg border border-border bg-surface"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div
              className="w-1 flex-shrink-0 self-stretch rounded-full"
              style={{ background: col, minHeight: 16 }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-medium text-text">{item.condition.name}</span>
                <span
                  className="badge text-xs"
                  style={{ background: `${col}15`, color: col }}
                >
                  {urgencyLabel[urg]}
                </span>
                <span className="text-xs text-muted capitalize ml-auto">
                  {item.condition.probability}
                </span>
              </div>
              <p className="text-xs text-dim leading-relaxed">{item.condition.description}</p>
              {item.matchedOn.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.matchedOn.slice(0, 4).map((s) => (
                    <span key={s} className="badge" style={{ background: "rgba(148,163,184,0.1)", color: "#94a3b8" }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SelfCareSection({ tips }: { tips: string[] }) {
  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-text">
        <Heart size={14} className="text-safe" />
        Self-Care Recommendations
      </div>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-dim">
            <CheckCircle size={13} className="text-safe flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetectedSection({ drugs, symptoms }: { drugs: string[]; symptoms: string[] }) {
  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-text">
        <Info size={14} className="text-brand" />
        What Was Detected
      </div>
      {drugs.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-1.5">Medications recognised</p>
          <div className="flex flex-wrap gap-1.5">
            {drugs.map((d) => (
              <span key={d} className="badge capitalize" style={{ background: "rgba(14,165,233,0.1)", color: "#38bdf8" }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      )}
      {symptoms.length > 0 && (
        <div>
          <p className="text-xs text-muted mb-1.5">Symptom keywords matched</p>
          <div className="flex flex-wrap gap-1.5">
            {symptoms.slice(0, 12).map((s) => (
              <span key={s} className="badge" style={{ background: "rgba(148,163,184,0.1)", color: "#94a3b8" }}>
                {s}
              </span>
            ))}
            {symptoms.length > 12 && (
              <span className="text-xs text-muted">+{symptoms.length - 12} more</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="p-3 rounded-lg border border-border bg-surface text-xs text-muted leading-relaxed">
      <strong className="text-dim">Medical Disclaimer:</strong> This tool provides general
      health information for educational purposes only and is not a substitute for professional
      medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider
      for medical decisions. In an emergency, call your local emergency services immediately.
    </div>
  );
}

function ExamplePrompts({ onSelect }: { onSelect: (sym: string, med: string) => void }) {
  const examples = [
    {
      label: "Cold/Flu symptoms",
      sym: "I have a runny nose, sore throat, mild fever, and I feel very tired. Started 2 days ago.",
      med: "",
    },
    {
      label: "Medication interaction check",
      sym: "",
      med: "warfarin 5mg daily, ibuprofen 400mg, aspirin 81mg",
    },
    {
      label: "Headache + anxiety",
      sym: "Severe headache for 2 days, feeling anxious and my heart is racing. Hard to sleep.",
      med: "sertraline 50mg, tramadol for pain",
    },
    {
      label: "Stomach issues",
      sym: "Nausea, diarrhea, stomach cramps since last night. Vomited twice.",
      med: "metformin 500mg, omeprazole 20mg",
    },
  ];

  return (
    <div className="card space-y-3">
      <p className="text-xs font-medium text-muted uppercase tracking-wider">Try an example</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {examples.map((ex) => (
          <button
            key={ex.label}
            onClick={() => onSelect(ex.sym, ex.med)}
            className="text-left p-3 rounded-lg border border-border hover:border-brand/50 hover:bg-brand/5 transition-all text-xs text-dim group"
          >
            <span className="block font-medium text-dim group-hover:text-brand transition-colors mb-1">
              {ex.label}
            </span>
            <span className="text-muted line-clamp-2">
              {ex.sym || ex.med}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
