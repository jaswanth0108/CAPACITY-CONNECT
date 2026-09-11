'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Modal } from '@/components/ui/modal';
import { parseJSON } from '@/lib/utils';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [userEnrollment, setUserEnrollment] = useState<any>(null);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${id}`);
        const data = await res.json();
        setCourse(data);

        // Check if user is enrolled
        if (data.enrollments && session?.user?.id) {
          const enr = data.enrollments.find((e: any) => e.userId === session.user.id);
          if (enr) {
            setIsEnrolled(true);
            setUserEnrollment(enr);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadCourse();
  }, [id, session?.user?.id]);

  const handleEnroll = async () => {
    let activeUserId = session?.user?.id;
    if (!activeUserId) {
      const uRes = await fetch('/api/users?role=TRAINEE');
      const users = await uRes.json();
      if (users.length > 0) activeUserId = users[0].id;
    }

    if (!activeUserId) return;

    try {
      const res = await fetch(`/api/courses/${id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: activeUserId, progress: 25 }),
      });
      if (res.ok) {
        const enr = await res.json();
        setIsEnrolled(true);
        setUserEnrollment(enr);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResourceProgress = async (resourceIndex: number, totalResources: number) => {
    if (!isEnrolled || !session?.user?.id) return;

    // Calculate approximate progress
    const newProgress = Math.min(100, Math.round(((resourceIndex + 1) / totalResources) * 90));
    try {
      const res = await fetch(`/api/courses/${id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          progress: Math.max(newProgress, userEnrollment?.progress || 0),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUserEnrollment(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    let activeUserId = session?.user?.id;
    if (!activeUserId) {
      const uRes = await fetch('/api/users?role=TRAINEE');
      const users = await uRes.json();
      if (users.length > 0) activeUserId = users[0].id;
    }

    if (!activeUserId) return;

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId,
          courseId: id,
          rating,
          comment,
        }),
      });
      if (res.ok) {
        setFeedbackSuccess(true);
        setTimeout(() => {
          setShowFeedbackModal(false);
          setFeedbackSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Course not found</p>
      </div>
    );
  }

  const tags: string[] = parseJSON(course.tags, []);
  const assessments = course.assessments || [];
  const resources = course.resources || [];
  const progress = userEnrollment?.progress || 0;
  const isCompleted = userEnrollment?.status === 'COMPLETED' || progress === 100;

  return (
    <div className="space-y-8">
      {/* Course Hero Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="purple">{course.competency?.name || 'Competency'}</Badge>
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
          <span className="text-xs text-slate-400">• {course.durationHours} Total Hours</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-white mb-3">{course.title}</h1>
        <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed mb-6">
          {course.description}
        </p>

        {/* Trainer banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              {course.trainer?.name?.charAt(0) || 'T'}
            </div>
            <div>
              <p className="text-xs font-bold text-white">{course.trainer?.name}</p>
              <p className="text-[11px] text-indigo-400">
                ⭐ {course.trainer?.trainerProfile?.rating?.toFixed(1) || '4.8'} •{' '}
                {course.trainer?.trainerProfile?.specialization || 'Certified Instructor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEnrolled ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFeedbackModal(true)}
                >
                  ⭐ Rate Trainer & Course
                </Button>
                {assessments.length > 0 && (
                  <Link href={`/trainee/assessments/${assessments[0].id}`}>
                    <Button variant="primary" size="sm">
                      {isCompleted ? 'Review Assessment 📝' : 'Take Final MCQ Assessment 📝'}
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Button variant="primary" size="md" onClick={handleEnroll}>
                Enroll in Course Free →
              </Button>
            )}
          </div>
        </div>

        {/* Progress bar if enrolled */}
        {isEnrolled && (
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">Curriculum Completion Progress:</span>
              <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-blue-400'}`}>
                {isCompleted ? 'Completed & Certified! (100%)' : `${progress}%`}
              </span>
            </div>
            <Progress value={progress} color={isCompleted ? 'emerald' : 'blue'} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Learning Resources (Videos, PDFs, Presentations) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-slate-900/90 border-slate-800">
            <CardHeader>
              <div>
                <CardTitle>Curriculum Resources & Study Materials</CardTitle>
                <CardDescription>
                  Access high-definition video modules, technical guides, and slide decks
                </CardDescription>
              </div>
              <span className="text-xs text-slate-400">{resources.length} Modules</span>
            </CardHeader>

            {resources.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Study resources being prepared by trainer.
              </p>
            ) : (
              <div className="space-y-2.5">
                {resources.map((res: any, idx: number) => {
                  const typeIcon =
                    res.type === 'VIDEO'
                      ? '🎥'
                      : res.type === 'PDF'
                      ? '📄'
                      : res.type === 'PRESENTATION'
                      ? '📊'
                      : '📁';

                  return (
                    <div
                      key={res.id}
                      onClick={() => {
                        setSelectedResource(res);
                        handleResourceProgress(idx, resources.length);
                      }}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        selectedResource?.id === res.id
                          ? 'bg-blue-950/40 border-blue-500/50'
                          : 'bg-slate-950 hover:bg-slate-900/90 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{typeIcon}</span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{res.title}</h4>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                            {res.type} {res.durationMinutes ? `• ${res.durationMinutes} mins` : ''}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Launch Material ↗
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Interactive Resource Viewer Modal / Drawer */}
          {selectedResource && (
            <Card className="bg-slate-900/90 border-indigo-800/50 p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-400 font-bold">Now Viewing:</span>
                  <span className="text-white text-xs font-semibold">{selectedResource.title}</span>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕ Close Viewer
                </button>
              </div>

              <div className="bg-slate-950 rounded-xl p-8 text-center border border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-2xl mx-auto mb-3">
                  {selectedResource.type === 'VIDEO' ? '▶️' : '📑'}
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{selectedResource.title}</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Interactive simulated resource view for {selectedResource.type} format.
                </p>
                <a
                  href={selectedResource.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block"
                >
                  <Button variant="primary" size="sm">
                    Open Resource File in Full Window ↗
                  </Button>
                </a>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Assessment & Feedback */}
        <div className="lg:col-span-4 space-y-4">
          {/* Assessment Card */}
          <Card className="bg-slate-900/90 border-slate-800">
            <CardHeader>
              <div>
                <CardTitle>Competency MCQ Assessment</CardTitle>
                <CardDescription>Required to upgrade your competency level & earn certificate</CardDescription>
              </div>
            </CardHeader>

            {assessments.length === 0 ? (
              <p className="text-xs text-slate-400">No assessment published yet.</p>
            ) : (
              <div className="space-y-3">
                {assessments.map((a: any) => (
                  <div key={a.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-white">{a.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Passing Score: {a.passingScore}%</span>
                      <span>⏱️ {a.timeLimitMinutes} mins</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Questions: {a.questions?.length || 5} multiple choice questions
                    </p>

                    <Link href={`/trainee/assessments/${a.id}`} className="block pt-1">
                      <Button variant="primary" size="sm" className="w-full text-xs">
                        Start Assessment Quiz →
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Feedback & Reviews List */}
          <Card className="bg-slate-900/90 border-slate-800">
            <CardHeader>
              <div>
                <CardTitle>Trainee Feedback</CardTitle>
                <CardDescription>Ratings from past graduates</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-2.5 max-h-60 overflow-y-auto">
              {(!course.feedbacks || course.feedbacks.length === 0) ? (
                <p className="text-xs text-slate-500 py-3 text-center">Be the first to review!</p>
              ) : (
                course.feedbacks.map((f: any, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">{f.user?.name || 'Anonymous Trainee'}</span>
                      <span className="text-amber-400 font-bold">⭐ {f.rating}/5</span>
                    </div>
                    {f.comment && <p className="text-[11px] text-slate-400">{f.comment}</p>}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Feedback Modal */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        title="Submit Course & Trainer Review"
        description="Your feedback directly influences trainer matching algorithms and course rankings"
      >
        {feedbackSuccess ? (
          <div className="py-6 text-center">
            <span className="text-3xl">🎉</span>
            <p className="text-sm font-bold text-white mt-2">Thank you for your feedback!</p>
            <p className="text-xs text-slate-400">Your review has been recorded.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${
                      rating >= star ? 'text-amber-400 scale-110' : 'text-slate-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Comment & Suggestions</label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was the trainer instruction? Did the resources help close your competency gap?"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Submit Review →
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
