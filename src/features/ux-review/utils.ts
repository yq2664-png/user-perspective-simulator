import type { UXReviewIssue, HeuristicGroup } from './types';

export function groupIssuesByHeuristic(issues: UXReviewIssue[]): HeuristicGroup[] {
  const map = new Map<number, HeuristicGroup>();

  for (const issue of issues) {
    const existing = map.get(issue.heuristicNumber);
    if (existing) {
      existing.issues.push(issue);
    } else {
      map.set(issue.heuristicNumber, {
        heuristic: issue.heuristic,
        heuristicNumber: issue.heuristicNumber,
        issues: [issue],
      });
    }
  }

  return [...map.values()]
    .sort((a, b) => a.heuristicNumber - b.heuristicNumber)
    .map(group => ({
      ...group,
      issues: [...group.issues].sort(
        (a, b) => severityRank(b.severity) - severityRank(a.severity)
      ),
    }));
}

function severityRank(severity: string): number {
  if (severity === 'High') return 3;
  if (severity === 'Medium') return 2;
  return 1;
}
