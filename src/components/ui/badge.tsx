import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'info' | 'outline';
  children: React.ReactNode;
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60 badge-glow-emerald',
    warning: 'bg-amber-950/80 text-amber-400 border-amber-800/60 badge-glow-amber',
    danger: 'bg-rose-950/80 text-rose-400 border-rose-800/60',
    purple: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60 badge-glow-indigo',
    info: 'bg-sky-950/80 text-sky-400 border-sky-800/60',
    outline: 'bg-transparent text-slate-300 border-slate-600',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
