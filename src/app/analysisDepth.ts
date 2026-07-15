export type AnalysisDepth = 'standard' | 'deep';

export function getNavSteps(depth: AnalysisDepth | null): { page: import('./routes').Page; label: string }[] {
  if (depth === 'deep') {
    return [
      { page: 'input', label: 'Input' },
      { page: 'simulation', label: 'Perspectives' },
      { page: 'insights', label: 'Insights' },
      { page: 'reasoning', label: 'Reasoning' },
      { page: 'review', label: 'Review' },
      { page: 'decision', label: 'Decisions' },
    ];
  }

  if (depth === 'standard') {
    return [
      { page: 'input', label: 'Input' },
      { page: 'simulation', label: 'Perspectives' },
      { page: 'insights', label: 'Insights' },
      { page: 'decision', label: 'Decisions' },
    ];
  }

  return [
    { page: 'input', label: 'Input' },
    { page: 'simulation', label: 'Perspectives' },
  ];
}
