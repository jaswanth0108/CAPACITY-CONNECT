'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { parseJSON } from '@/lib/utils';

export default function AssessmentAttemptPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();

  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`/api/assessments/${id}`);
        const data = await res.json();
        setAssessment(data);
        if (data.timeLimitMinutes) {
          setTimeLeft(data.timeLimitMinutes * 60);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0 || result) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, result]);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (result) return; // Prevent changing after submission
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let activeUserId = session?.user?.id;
    if (!activeUserId) {
      const uRes = await fetch('/api/users?role=TRAINEE');
      const users = await uRes.json();
      if (users.length > 0) activeUserId = users[0].id;
    }

    if (!activeUserId) return;

    try {
      const timeSpent = assessment?.timeLimitMinutes ? assessment.timeLimitMinutes * 60 - timeLeft : 300;
      const res = await fetch(`/api/assessments/${id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId,
          answers,
          timeTakenSeconds: timeSpent,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error submitting assessment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Assessment not found</p>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const questions = assessment.questions || [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header & Sticky Timer */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 sticky top-20 z-20 shadow-xl">
        <div>
          <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
            {assessment.course?.competency?.name || 'Competency Evaluation'}
          </span>
          <h2 className="text-base font-bold text-white">{assessment.title}</h2>
        </div>

        {!result && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs">⏱️</span>
            <span
              className={`font-mono text-sm font-bold ${
                timeLeft < 180 ? 'text-rose-400 animate-pulse' : 'text-slate-200'
              }`}
            >
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Result Card if Submitted */}
      {result && (
        <Card className={`border-2 p-6 text-center ${result.passed ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-rose-500/50 bg-rose-950/20'}`}>
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-3xl mb-3 shadow-xl">
            {result.passed ? '🏆' : '⚠️'}
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            {result.passed ? 'Assessment Passed! Competency Upgraded' : 'Assessment Not Passed'}
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto mb-4">
            {result.passed
              ? 'Your score has been registered. The Competency Intelligence Engine has updated your competency score and issued your certificate!'
              : `You scored ${result.score}%. The passing threshold is ${result.passingScore}%. You can review the material and retake the test.`}
          </p>

          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-xl bg-slate-950/90 border border-slate-800 mb-6">
            <div>
              <span className="text-[10px] text-slate-400 block">Your Score</span>
              <span className={`text-2xl font-black ${result.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {result.score}%
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block">Passing Mark</span>
              <span className="text-2xl font-black text-slate-200">{result.passingScore}%</span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-[10px] text-slate-400 block">Points</span>
              <span className="text-2xl font-black text-indigo-400">
                {result.earnedPoints}/{result.totalPoints}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {result.passed && (
              <Link href="/trainee/certificates">
                <Button variant="success" size="md">
                  View Verified Certificate 🏆
                </Button>
              </Link>
            )}
            <Link href="/trainee/competencies">
              <Button variant="primary" size="md">
                Check Updated Competency Score →
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Questions Form */}
      <div className="space-y-4">
        {questions.map((q: any, qIndex: number) => {
          const options: string[] = parseJSON(q.options, []);
          const selected = answers[q.id];
          const evaluatedAnswer = result?.evaluatedAnswers?.find((ea: any) => ea.questionId === q.id);

          return (
            <Card key={q.id} className="border-slate-800 bg-slate-900/80">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h4 className="text-sm font-semibold text-white leading-relaxed">
                  <span className="text-indigo-400 font-bold mr-2">Q{qIndex + 1}.</span>
                  {q.questionText}
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                  {q.points} pts
                </span>
              </div>

              {/* Options */}
              <div className="space-y-2 mt-4">
                {options.map((opt: string, optIndex: number) => {
                  const isSelected = selected === optIndex;
                  const isCorrect = optIndex === q.correctOption;

                  let optionStyle = 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (result) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-950/40 border-emerald-600/80 text-emerald-300 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-950/40 border-rose-600/80 text-rose-300 line-through';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-blue-950/60 border-blue-500 text-white font-semibold shadow-md';
                  }

                  return (
                    <div
                      key={optIndex}
                      onClick={() => handleSelect(q.id, optIndex)}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition text-xs ${optionStyle}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                          isSelected
                            ? 'bg-blue-600 border-blue-400 text-white'
                            : 'border-slate-700 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIndex)}
                      </div>
                      <span className="flex-1">{opt}</span>
                      {result && isCorrect && (
                        <span className="text-emerald-400 text-xs font-bold">✓ Correct</span>
                      )}
                      {result && isSelected && !isCorrect && (
                        <span className="text-rose-400 text-xs font-bold">✗ Selected</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Action Footer */}
      {!result && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Answered: <strong className="text-white">{Object.keys(answers).length}</strong> of{' '}
            {questions.length} questions
          </div>
          <Button
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            disabled={Object.keys(answers).length === 0}
            onClick={handleSubmit}
          >
            Submit Assessment & Upgrade Competency →
          </Button>
        </div>
      )}
    </div>
  );
}
