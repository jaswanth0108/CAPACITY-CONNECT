'use client';

import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { formatDate } from '@/lib/utils';

interface CertificateProps {
  certificate: {
    id: string;
    certificateNumber: string;
    issuedAt: string | Date;
    user: {
      name: string;
      email: string;
    };
    course: {
      title: string;
      durationHours: number;
      competency?: {
        name: string;
        category: string;
      };
      trainer?: {
        name: string;
        trainerProfile?: {
          specialization?: string;
        };
      };
    };
  };
  onClose?: () => void;
}

export function CertificateView({ certificate, onClose }: CertificateProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex justify-end gap-2 no-print">
        <Button variant="secondary" size="sm" onClick={handlePrint}>
          🖨️ Print / Download PDF
        </Button>
        {onClose && (
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      {/* Official Certificate Canvas */}
      <div className="relative border-4 border-double border-amber-500/40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 rounded-2xl text-center shadow-2xl overflow-hidden">
        {/* Decorative corner borders */}
        <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-amber-500/60" />
        <div className="absolute top-3 right-3 w-12 h-12 border-t-2 border-r-2 border-amber-500/60" />
        <div className="absolute bottom-3 left-3 w-12 h-12 border-b-2 border-l-2 border-amber-500/60" />
        <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-amber-500/60" />

        {/* Certificate Emblem */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 text-2xl font-black shadow-lg mb-4">
          🏆
        </div>

        {/* Header */}
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold mb-1">
          Capacity Connect Platform
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide mb-4">
          Certificate of Competency Mastery
        </h2>

        <p className="text-xs text-slate-400 italic mb-6">
          This is proudly presented to certify that
        </p>

        {/* Recipient */}
        <h3 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-200 to-amber-300 border-b border-amber-500/30 pb-3 max-w-md mx-auto mb-6">
          {certificate.user.name}
        </h3>

        {/* Course details */}
        <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
          has successfully satisfied all rigorous curriculum modules and passed the comprehensive assessment for
          <br />
          <strong className="text-base text-white block mt-1">
            &ldquo;{certificate.course.title}&rdquo;
          </strong>
          {certificate.course.competency && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/60 text-blue-300 border border-blue-800/60">
              Competency Domain: {certificate.course.competency.name}
            </span>
          )}
        </p>

        {/* Signatures & Verification Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 text-xs items-end max-w-2xl mx-auto">
          {/* Trainer Signature */}
          <div className="text-center">
            <div className="font-serif italic text-sm text-indigo-300 border-b border-slate-700 pb-1 mb-1">
              {certificate.course.trainer?.name || 'Lead Trainer'}
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Certified Instructor</p>
          </div>

          {/* Verification Code */}
          <div className="text-center bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">Credential ID</p>
            <p className="font-mono text-[11px] font-bold text-amber-400">{certificate.certificateNumber}</p>
            <p className="text-[9px] text-slate-500 mt-1">Issued: {formatDate(certificate.issuedAt)}</p>
          </div>

          {/* Academic Director */}
          <div className="text-center">
            <div className="font-serif italic text-sm text-indigo-300 border-b border-slate-700 pb-1 mb-1">
              Academic Council
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Capacity Connect Director</p>
          </div>
        </div>
      </div>
    </div>
  );
}
