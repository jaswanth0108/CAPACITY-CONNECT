'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';

export default function AdminCompetenciesPage() {
  const [competencies, setCompetencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technical');
  const [icon, setIcon] = useState('📊');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/api/competencies');
        const data = await res.json();
        setCompetencies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddCompetency = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/competencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, category, icon }),
      });
      if (res.ok) {
        const created = await res.json();
        setCompetencies((prev) => [...prev, created]);
        setShowAddModal(false);
        setName('');
        setDescription('');
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
          <h2 className="text-2xl font-black text-white">Competency Taxonomy & Skill Framework</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure organizational competency domains that power the Competency Intelligence Engine.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
          + Add New Competency
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competencies.map((c) => (
          <Card key={c.id} className="border-slate-800 bg-slate-900/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{c.icon || '📊'}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {c.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">{c.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{c.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{c.courses?.length || 0} Targeted Curriculums</span>
              <span className="text-emerald-400 font-semibold">Active in Engine ✓</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Competency Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Define New Organizational Competency"
        description="Add a competency domain for gap tracking, assessment, and trainer matching"
      >
        <form onSubmit={handleAddCompetency} className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Emoji Icon</label>
              <input
                type="text"
                required
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full text-center text-xl px-2 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Competency Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Generative AI Engineering"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Technical">Technical</option>
              <option value="Management">Management</option>
              <option value="Soft Skills">Soft Skills</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description & Expected Behaviors</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what proficiency in this competency entails..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={submitting}>
            Create Competency & Sync Framework →
          </Button>
        </form>
      </Modal>
    </div>
  );
}
