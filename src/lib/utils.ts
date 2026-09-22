export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function getRatingColor(value: number): string {
  if (value >= 9) return '#22c55e';
  if (value >= 8) return '#f0554a';
  if (value >= 7) return '#f59e0b';
  return '#71717a';
}

export function getRatingLabel(value: number): string {
  if (value >= 9.5) return 'Masterpiece';
  if (value >= 9) return 'Exceptional';
  if (value >= 8) return 'Great';
  if (value >= 7) return 'Good';
  if (value >= 6) return 'Decent';
  return 'Needs Work';
}
