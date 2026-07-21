import type { Page } from './routes';

export const NAV_STEPS: { page: Page; label: string }[] = [
  { page: 'input', label: 'Input' },
  { page: 'simulation', label: 'Perspectives' },
  { page: 'insights', label: 'Insights' },
  { page: 'reasoning', label: 'Reasoning' },
  { page: 'decision', label: 'Decisions' },
];

export function getNavSteps() {
  return NAV_STEPS;
}
