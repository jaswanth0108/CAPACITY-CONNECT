import React from 'react';
import { Badge } from './ui/badge';

interface CompetencyBadgeProps {
  level: string; // BEGINNER | DEVELOPING | PROFICIENT | ADVANCED | EXPERT
  score?: number;
  showScore?: boolean;
}

export function CompetencyBadge({ level, score, showScore = false }: CompetencyBadgeProps) {
  const getVariant = (lvl: string) => {
    switch (lvl.toUpperCase()) {
      case 'EXPERT':
        return 'success';
      case 'ADVANCED':
        return 'purple';
      case 'PROFICIENT':
        return 'info';
      case 'DEVELOPING':
        return 'warning';
      case 'BEGINNER':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getLabel = (lvl: string) => {
    switch (lvl.toUpperCase()) {
      case 'EXPERT':
        return 'Expert';
      case 'ADVANCED':
        return 'Advanced';
      case 'PROFICIENT':
        return 'Proficient';
      case 'DEVELOPING':
        return 'Developing';
      case 'BEGINNER':
        return 'Beginner';
      default:
        return lvl;
    }
  };

  return (
    <Badge variant={getVariant(level)}>
      <span className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
        <span>{getLabel(level)}</span>
        {showScore && score !== undefined && (
          <span className="font-bold opacity-80">({score}%)</span>
        )}
      </span>
    </Badge>
  );
}
