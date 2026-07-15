import posthog from 'posthog-js';
import type { Page } from '@/app/routes';

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

const STEP_LABELS: Record<Page, string> = {
  landing: 'Landing',
  input: 'Input',
  simulation: 'Perspectives',
  'analysis-depth': 'Analysis Depth',
  insights: 'Insights',
  reasoning: 'Reasoning',
  review: 'Review',
  decision: 'Decisions',
};

const PIPELINE_STEPS: Page[] = [
  'input',
  'simulation',
  'insights',
  'reasoning',
  'review',
  'decision',
];

let enabled = false;

function capture(event: string, properties?: Record<string, unknown>) {
  if (!enabled) return;
  posthog.capture(event, properties);
}

export function initAnalytics() {
  if (!KEY) return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: false,
    capture_pageleave: true,
    persistence: 'localStorage+cookie',
    autocapture: false,
  });
  enabled = true;
}

export function trackPageView(page: Page) {
  const stepIndex = PIPELINE_STEPS.indexOf(page);
  capture('$pageview', { page, step_label: STEP_LABELS[page] });

  if (page === 'landing') {
    capture('site_visit');
    return;
  }

  capture('pipeline_step_viewed', {
    step: page,
    step_label: STEP_LABELS[page],
    step_index: stepIndex >= 0 ? stepIndex + 1 : undefined,
  });
}

export function trackCtaClicked(cta: string) {
  capture('cta_clicked', { cta });
}

export function trackFlowStarted(props?: { product_stage?: string }) {
  capture('flow_started', props);
  capture('pipeline_step_completed', {
    step: 'input',
    step_label: STEP_LABELS.input,
    step_index: 1,
    ...props,
  });
}

export function trackStepCompleted(step: Page) {
  const stepIndex = PIPELINE_STEPS.indexOf(step);
  if (stepIndex < 0) return;
  capture('pipeline_step_completed', {
    step,
    step_label: STEP_LABELS[step],
    step_index: stepIndex + 1,
  });
}

export function trackAnalysisDepthSelected(depth: 'standard' | 'deep') {
  capture('analysis_depth_selected', { depth });
}

export function trackPipelineCompleted() {
  capture('pipeline_completed', {
    step: 'decision',
    step_label: STEP_LABELS.decision,
    step_index: 6,
  });
}
