interface ReasoningStep {
  label: string;
  content: string;
  emphasis?: boolean;
}

export function ReasoningChain({ steps }: { steps: ReasoningStep[] }) {
  return (
    <div>
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center w-4 shrink-0 pt-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: i === steps.length - 1 ? '#127A74' : '#A1A1A6' }}
            />
            {i < steps.length - 1 && (
              <div className="w-px flex-1 my-1" style={{ background: '#D2D2D7', minHeight: 20 }} />
            )}
          </div>
          <div className={`flex-1 min-w-0 ${i < steps.length - 1 ? 'pb-4' : ''}`}>
            <p className="text-[9px] tracking-[0.14em] uppercase mb-1" style={{ color: '#8E8E93' }}>
              {step.label}
            </p>
            <p
              className={`text-sm leading-relaxed ${step.emphasis ? 'font-medium' : ''}`}
              style={{ color: step.emphasis ? '#1D1D1F' : '#6E6E73' }}
            >
              {step.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReasoningConnector() {
  return (
    <div className="flex items-center gap-2 py-3">
      <div className="h-px flex-1" style={{ background: '#EDE9E0' }} />
      <span className="text-[9px] tracking-[0.16em] uppercase shrink-0" style={{ color: '#A1A1A6' }}>
        connects to
      </span>
      <div className="h-px flex-1" style={{ background: '#EDE9E0' }} />
    </div>
  );
}
