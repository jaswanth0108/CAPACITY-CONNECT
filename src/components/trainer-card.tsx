'use client';

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

export interface TrainerFactor {
  score: number;
  weight: number;
  details: string;
}

export interface TrainerMatchProps {
  trainer: {
    trainerId: string;
    trainerName: string;
    trainerEmail: string;
    specialization: string;
    matchScore: number;
    factors: {
      expertiseRelevance: TrainerFactor;
      experience: TrainerFactor;
      qualificationMatch: TrainerFactor;
      certificationMatch: TrainerFactor;
      traineeRating: TrainerFactor;
      availability: TrainerFactor;
    };
    rating: number;
    totalReviews: number;
    expertise: string[];
    certifications: string[];
    experienceYears: number;
    available: boolean;
  };
  gapCompetency?: string;
  onSelectTrainer?: (trainerId: string) => void;
}

export function TrainerCard({ trainer, gapCompetency, onSelectTrainer }: TrainerMatchProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  const factorItems = [
    { label: 'Domain Expertise', weight: '30%', data: trainer.factors.expertiseRelevance, icon: '🎯' },
    { label: 'Years of Experience', weight: '20%', data: trainer.factors.experience, icon: '⏳' },
    { label: 'Qualifications', weight: '15%', data: trainer.factors.qualificationMatch, icon: '🎓' },
    { label: 'Trainee Rating', weight: '15%', data: trainer.factors.traineeRating, icon: '⭐' },
    { label: 'Certifications', weight: '10%', data: trainer.factors.certificationMatch, icon: '📜' },
    { label: 'Availability', weight: '10%', data: trainer.factors.availability, icon: '🟢' },
  ];

  return (
    <Card className="border-slate-800 bg-slate-900/90 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/20">
            {trainer.trainerName.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">{trainer.trainerName}</h4>
              {trainer.available ? (
                <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center text-[10px] text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded">
                  Busy
                </span>
              )}
            </div>
            <p className="text-xs text-indigo-400 font-medium">{trainer.specialization}</p>
          </div>
        </div>

        {/* AI Match Badge */}
        <div className="text-right">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold text-sm shadow-md">
            <span>✨</span>
            <span>{trainer.matchScore}% Match</span>
          </div>
          {gapCompetency && (
            <p className="text-[10px] text-slate-400 mt-1">for {gapCompetency}</p>
          )}
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs mb-4">
        <div>
          <span className="text-slate-400 block text-[10px]">Experience</span>
          <span className="text-slate-200 font-semibold">{trainer.experienceYears} Years</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Rating</span>
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            ⭐ {trainer.rating.toFixed(1)} <span className="text-slate-500 font-normal">({trainer.totalReviews})</span>
          </span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Certifications</span>
          <span className="text-slate-200 font-semibold">{trainer.certifications.length} Credentials</span>
        </div>
      </div>

      {/* Expertise & Credentials Chips */}
      <div className="space-y-2 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {trainer.expertise.slice(0, 3).map((exp, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-950/40 text-indigo-300 border border-indigo-800/40">
              {exp}
            </span>
          ))}
          {trainer.certifications.slice(0, 2).map((cert, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-950/30 text-emerald-300 border border-emerald-800/30">
              ✓ {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Why Recommended Explainable Section */}
      <div className="pt-2 border-t border-slate-800/80">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="flex items-center justify-between w-full text-xs font-semibold text-blue-400 hover:text-blue-300 transition py-1"
        >
          <span className="flex items-center gap-1.5">
            <span>🧠 Explainable AI Match Analysis</span>
          </span>
          <span>{showExplanation ? 'Hide Details ▲' : 'Show Why Recommended ▼'}</span>
        </button>

        {showExplanation && (
          <div className="mt-3 space-y-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
            <div className="text-[11px] text-slate-300 font-medium pb-1 border-b border-slate-800">
              Matching Algorithm Breakdown for <span className="text-white font-semibold">{trainer.trainerName}</span>:
            </div>
            {factorItems.map((factor, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <span>{factor.icon}</span>
                    <span>{factor.label}</span>
                    <span className="text-[10px] text-slate-500">({factor.weight})</span>
                  </span>
                  <span className="font-semibold text-indigo-400">{factor.data.score}%</span>
                </div>
                <Progress value={factor.data.score} size="sm" color="purple" />
                <p className="text-[10px] text-slate-400 pl-4">{factor.data.details}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action */}
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {showExplanation ? 'Close Breakdown' : 'Inspect Match Factor'}
        </Button>
        {onSelectTrainer && (
          <Button
            variant="primary"
            size="sm"
            className="w-full text-xs"
            onClick={() => onSelectTrainer(trainer.trainerId)}
          >
            Connect with Trainer
          </Button>
        )}
      </div>
    </Card>
  );
}
