'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { CertificateView } from '@/components/certificate-view';
import { formatDate } from '@/lib/utils';

export default function CertificatesPage() {
  const { data: session } = useSession();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  useEffect(() => {
    async function loadCertificates() {
      try {
        setLoading(true);
        let activeUserId = session?.user?.id;
        if (!activeUserId) {
          const uRes = await fetch('/api/users?role=TRAINEE');
          const users = await uRes.json();
          if (users.length > 0) activeUserId = users[0].id;
        }

        const res = await fetch(`/api/certificates?userId=${activeUserId}`);
        const data = await res.json();
        setCertificates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCertificates();
  }, [session?.user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Earned Competency Certificates & Credentials</h2>
        <p className="text-xs text-slate-400 mt-1">
          Officially verified organizational certificates issued upon achieving passing threshold in curriculum assessments.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <div className="text-4xl mb-2">🏆</div>
          <h3 className="text-sm font-bold text-white mb-1">No Certificates Earned Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Enroll in a course, study the curriculum materials, and complete the MCQ assessment to earn your credentials.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <Card
              key={cert.id}
              className="border-slate-800 bg-slate-900/90 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">🏆</span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    {cert.certificateNumber}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">{cert.course.title}</h3>
                <p className="text-[11px] text-indigo-400 mb-3">
                  Competency: {cert.course.competency?.name || 'Technical'}
                </p>

                <div className="text-[10px] text-slate-400 space-y-1 py-2 border-t border-slate-800">
                  <p>Instructor: {cert.course.trainer?.name || 'Certified Trainer'}</p>
                  <p>Issued on: {formatDate(cert.issuedAt)}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setSelectedCert(cert)}
                >
                  View & Print Certificate ↗
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Certificate Modal */}
      <Modal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        title="Official Verified Credential"
        maxWidth="2xl"
      >
        {selectedCert && (
          <CertificateView
            certificate={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
      </Modal>
    </div>
  );
}
