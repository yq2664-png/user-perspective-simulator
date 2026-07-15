interface Props {
  phase: 'perspectives' | 'insights';
}

export default function ResearchPhaseBar({ phase }: Props) {
  const items = [
    { id: 'perspectives' as const, label: 'User Perspectives', question: 'How would users see it?' },
    { id: 'insights' as const, label: 'Behavioral Insights', question: 'Why would users think that way?' },
  ];

  return (
    <div className="flex items-center gap-2 mb-8">
      {items.map((item, i) => {
        const isActive = phase === item.id;
        const isDone = phase === 'insights' && item.id === 'perspectives';
        return (
          <div key={item.id} className="flex items-center gap-2">
            {i > 0 && <div className="w-6 h-px" style={{ background: '#D2D2D7' }} />}
            <div
              className="px-3 py-1.5 rounded-full"
              style={{
                background: isActive ? '#127A74' : isDone ? '#FBFAF6' : 'transparent',
                border: isActive ? 'none' : '1px solid #D2D2D7',
              }}
            >
              <span
                className="text-[10px] tracking-[0.12em] uppercase font-medium"
                style={{ color: isActive ? 'white' : isDone ? '#1D1D1F' : '#A1A1A6' }}
              >
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
