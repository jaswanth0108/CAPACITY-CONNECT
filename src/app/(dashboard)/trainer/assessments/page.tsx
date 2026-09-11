'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface QuestionDraft {
  questionText: string;
  options: string[];
  correctOption: number;
  points: number;
}

export default function TrainerAssessmentsStudio() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [passingScore, setPassingScore] = useState(65);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(25);
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    {
      questionText: 'What is the primary role of this architectural pattern?',
      options: ['Resource isolation', 'Horizontal scaling', 'Memory management', 'Network routing'],
      correctOption: 1,
      points: 10,
    },
    {
      questionText: 'Which command or protocol handles asynchronous state synchronization?',
      options: ['HTTP GET', 'WebSocket', 'FTP', 'DNS'],
      correctOption: 1,
      points: 10,
    },
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        let trainerId = session?.user?.id;
        if (!trainerId) {
          const uRes = await fetch('/api/users?role=TRAINER');
          const trainers = await uRes.json();
          if (trainers.length > 0) trainerId = trainers[0].id;
        }

        const [cRes, aRes] = await Promise.all([
          fetch(`/api/courses?trainerId=${trainerId}`),
          fetch('/api/assessments'),
        ]);

        const [cData, aData] = await Promise.all([cRes.json(), aRes.json()]);
        setCourses(Array.isArray(cData) ? cData : []);
        setAssessments(Array.isArray(aData) ? aData : []);
        if (cData.length > 0) setSelectedCourseId(cData[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [session?.user?.id]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctOption: 0,
        points: 10,
      },
    ]);
  };

  const handleUpdateQuestionText = (index: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index].questionText = text;
      return copy;
    });
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].options[optIndex] = text;
      return copy;
    });
  };

  const handleSetCorrectOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].correctOption = optIndex;
      return copy;
    });
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourseId,
          title,
          passingScore: Number(passingScore),
          timeLimitMinutes: Number(timeLimitMinutes),
          questions,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setAssessments((prev) => [created, ...prev]);
        setShowCreateModal(false);
        setTitle('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Assessment Studio & Questionnaire Builder</h2>
          <p className="text-xs text-slate-400 mt-1">
            Build timed MCQ questionnaires with instant evaluation to validate competency upgrades.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowCreateModal(true)}>
          + Create New MCQ Questionnaire
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((a) => (
            <Card key={a.id} className="border-slate-800 bg-slate-900/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    {a.course?.competency?.name || 'Competency'}
                  </span>
                  <Badge variant="success">Published</Badge>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{a.title}</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Course: <strong className="text-slate-300">{a.course?.title}</strong>
                </p>

                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] mb-3">
                  <div>
                    <span className="text-slate-500 block">Passing Mark</span>
                    <span className="text-slate-200 font-bold">{a.passingScore}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Time Limit</span>
                    <span className="text-slate-200 font-bold">{a.timeLimitMinutes} Mins</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Total MCQs</span>
                    <span className="text-slate-200 font-bold">{a.questions?.length || 0} Questions</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Total Attempts: {a.attempts?.length || 0}</span>
                <span className="text-indigo-400 font-semibold">Active in Engine ✓</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Interactive Assessment Builder Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create MCQ Assessment Questionnaire"
        description="Configure evaluation parameters and define multiple choice questions with correct keys"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateAssessment} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Assessment Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cloud Security & VPC Mastery Evaluation"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Passing Threshold (%)</label>
              <input
                type="number"
                min="40"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Time Limit (Minutes)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={timeLimitMinutes}
                onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Questions Studio */}
          <div className="pt-3 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Questions Builder ({questions.length})
              </h4>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                + Add Question
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">Question #{qIndex + 1}</span>
                  <span className="text-[10px] text-slate-400">10 Points</span>
                </div>

                <input
                  type="text"
                  required
                  value={q.questionText}
                  onChange={(e) => handleUpdateQuestionText(qIndex, e.target.value)}
                  placeholder="Enter question text..."
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none"
                />

                <div className="space-y-1.5 pt-1">
                  <p className="text-[10px] text-slate-400 font-semibold">Options (Select radio for correct answer):</p>
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${qIndex}`}
                        checked={q.correctOption === optIndex}
                        onChange={() => handleSetCorrectOption(qIndex, optIndex)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleUpdateOption(qIndex, optIndex, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        className="flex-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" variant="primary" className="w-full mt-4" isLoading={submitting}>
            Publish Assessment & Activate in Engine →
          </Button>
        </form>
      </Modal>
    </div>
  );
}
