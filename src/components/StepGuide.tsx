"use client";

interface Step {
  icon: string;
  title: string;
  description: string;
  tip?: string;
}

interface StepGuideProps {
  title?: string;
  steps: Step[];
}

export default function StepGuide({ title = "Comment commander — Étape par étape", steps }: StepGuideProps) {
  return (
    <div className="rounded-2xl overflow-hidden mb-8" style={{ border: "1px solid var(--border)" }}>
      {/* Header */}
      <div className="px-5 py-4" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
        <p className="font-black text-white text-sm">{title}</p>
      </div>

      {/* Steps */}
      <div className="divide-y" style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 px-5 py-4">
            {/* Number + icon */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
                style={{ background: i === steps.length - 1 ? "#10B981" : "var(--gold)", color: "#0A0A0A" }}>
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="w-0.5 flex-1 mt-2" style={{ background: "var(--border)", minHeight: 16 }} />
              )}
            </div>
            {/* Content */}
            <div className="pb-2 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{step.icon}</span>
                <p className="font-black text-white text-sm">{step.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {step.description}
              </p>
              {step.tip && (
                <p className="text-xs mt-1.5 px-2 py-1 rounded-lg inline-block font-semibold"
                  style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>
                  💡 {step.tip}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
