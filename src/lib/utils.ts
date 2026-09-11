import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getCompetencyLevel(score: number): string {
  if (score >= 81) return 'EXPERT';
  if (score >= 61) return 'ADVANCED';
  if (score >= 41) return 'PROFICIENT';
  if (score >= 21) return 'DEVELOPING';
  return 'BEGINNER';
}

export function getCompetencyColor(level: string): string {
  switch (level) {
    case 'EXPERT': return '#10b981';
    case 'ADVANCED': return '#3b82f6';
    case 'PROFICIENT': return '#8b5cf6';
    case 'DEVELOPING': return '#f59e0b';
    case 'BEGINNER': return '#ef4444';
    default: return '#6b7280';
  }
}

export function getGapSeverity(gap: number): { label: string; color: string } {
  if (gap > 40) return { label: 'HIGH', color: '#ef4444' };
  if (gap > 20) return { label: 'MEDIUM', color: '#f59e0b' };
  return { label: 'LOW', color: '#10b981' };
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateCertificateNumber(prefix: string): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CC-${prefix}-${year}-${random}`;
}

export function parseJSON<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty) {
    case 'BEGINNER': return '#10b981';
    case 'INTERMEDIATE': return '#f59e0b';
    case 'ADVANCED': return '#ef4444';
    default: return '#6b7280';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'COMPLETED': return '#10b981';
    case 'IN_PROGRESS': return '#3b82f6';
    case 'ENROLLED': return '#8b5cf6';
    case 'DROPPED': return '#ef4444';
    case 'APPROVED': return '#10b981';
    case 'PENDING': return '#f59e0b';
    case 'REJECTED': return '#ef4444';
    default: return '#6b7280';
  }
}
