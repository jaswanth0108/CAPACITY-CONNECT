'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { getDifficultyColor, parseJSON } from '@/lib/utils';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    durationHours: number;
    tags?: string | string[];
    trainer?: {
      name: string;
      trainerProfile?: {
        rating: number;
      };
    };
    competency?: {
      name: string;
      icon: string;
    };
    enrollments?: Array<{
      status: string;
      progress: number;
      userId?: string;
    }>;
  };
  currentUserId?: string;
  onEnroll?: (courseId: string) => void;
  isEnrolling?: boolean;
}

export function CourseCard({ course, currentUserId, onEnroll, isEnrolling }: CourseCardProps) {
  const tags: string[] = typeof course.tags === 'string' ? parseJSON(course.tags, []) : (course.tags || []);
  
  // Find current user's enrollment if available
  const userEnrollment = currentUserId && course.enrollments
    ? course.enrollments.find((e) => e.userId === currentUserId)
    : course.enrollments && course.enrollments.length > 0
    ? course.enrollments[0]
    : null;

  const isEnrolled = !!userEnrollment;
  const progress = userEnrollment?.progress || 0;
  const isCompleted = userEnrollment?.status === 'COMPLETED' || progress === 100;

  return (
    <Card hover className="flex flex-col justify-between h-full bg-slate-900/80 border-slate-800">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {course.competency && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-950/70 text-blue-300 border border-blue-800/50">
              <span>{course.competency.icon || '🎯'}</span>
              <span>{course.competency.name}</span>
            </span>
          )}
          <Badge
            variant={
              course.difficulty === 'BEGINNER'
                ? 'success'
                : course.difficulty === 'INTERMEDIATE'
                ? 'warning'
                : 'danger'
            }
          >
            {course.difficulty}
          </Badge>
        </div>

        {/* Title & Description */}
        <h4 className="text-base font-bold text-white mb-2 line-clamp-1 hover:text-blue-400 transition">
          <Link href={`/trainee/courses/${course.id}`}>{course.title}</Link>
        </h4>
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {course.description}
        </p>

        {/* Trainer & Duration Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 py-2.5 border-t border-slate-800/80 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
              {course.trainer?.name?.charAt(0) || 'T'}
            </div>
            <span className="text-slate-300 font-medium">{course.trainer?.name || 'Lead Trainer'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>⏱️ {course.durationHours} hrs</span>
            {course.trainer?.trainerProfile?.rating && (
              <span className="text-amber-400 font-semibold">
                ⭐ {course.trainer.trainerProfile.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Action */}
      <div className="pt-2">
        {isEnrolled ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Progress</span>
              <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-blue-400'}`}>
                {isCompleted ? 'Completed (100%)' : `${progress}%`}
              </span>
            </div>
            <Progress
              value={progress}
              size="sm"
              color={isCompleted ? 'emerald' : 'blue'}
            />
            <Link href={`/trainee/courses/${course.id}`} className="block w-full mt-2">
              <Button variant={isCompleted ? 'outline' : 'primary'} size="sm" className="w-full">
                {isCompleted ? 'Review Course & Assessment' : 'Continue Learning →'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href={`/trainee/courses/${course.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                View Syllabus
              </Button>
            </Link>
            {onEnroll && (
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                isLoading={isEnrolling}
                onClick={() => onEnroll(course.id)}
              >
                Enroll Free
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
