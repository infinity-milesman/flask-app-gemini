import React, { useState } from 'react';
import { BarChart2, TrendingUp, Award, Calculator, Activity, ArrowUpRight } from 'lucide-react';
import { PersonalRecord } from '../types/kinetic';

interface AnalyticsViewProps {
  records: PersonalRecord[];
  onAddRecord?: (record: PersonalRecord) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ records }) => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | 'Season'>('30D');

  // 1RM Calculator states
  const [calcWeight, setCalcWeight] = useState<number>(145);
  const [calcReps, setCalcReps] = useState<number>(5);

  // Epley formula: 1RM = Weight * (1 + Reps / 30)
  const estimated1RM = Math.round(calcWeight * (1 + calcReps / 30) * 10) / 10;

  // Mock weekly volume chart data (kg)
  const weeklyVolume = [
    { week: 'W38', tonnage: 28400, strain: 14.8 },
    { week: 'W39', tonnage: 31200, strain: 15.6 },
    { week: 'W40', tonnage: 33800, strain: 16.2 },
    { week: 'W41 (Deload)', tonnage: 21500, strain: 11.4 },
    { week: 'W42', tonnage: 35600, strain: 16.9 },
    { week: 'W43 (Current)', tonnage: 38450, strain: 17.4 },
  ];

  const maxTonnage = Math.max(...weeklyVolume.map((w) => w.tonnage));

  // Percentage table
  const percentages = [
    { pct: 95, reps: '1-2 Reps' },
    { pct: 90, reps: '3-4 Reps' },
    { pct: 85, reps: '5-6 Reps' },
    { pct: 80, reps: '7-8 Reps' },
    { pct: 75, reps: '9-10 Reps' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header & Timeframe selector */}
      <div className="border-b border-[#c6c6cd]/30 dark:border-[#213145] pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#006398] dark:text-[#6ffbbe] mb-1">
            <span>Biometric Analytics</span>
            <span aria-hidden="true">·</span>
            <span>Progression Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0b1c30] dark:text-[#ffffff] text-balance">
            Athletic Progression & Kinetic Load
          </h1>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-[#eff4ff] dark:bg-[#131b2e] rounded-xl border border-[#c6c6cd]/30 dark:border-[#213145] shrink-0">
          {(['7D', '30D', '90D', 'Season'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                timeframe === t
                  ? 'bg-white dark:bg-[#000000] text-[#0b1c30] dark:text-white shadow-sm'
                  : 'text-[#45464d] dark:text-[#bec6e0] hover:text-[#0b1c30]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Key Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/40 dark:border-[#213145]">
          <span className="text-[10px] uppercase font-semibold text-[#76777d] dark:text-[#7c839b] block">Monthly Volume Tonnage</span>
          <div className="text-2xl font-bold tabular-nums text-[#0b1c30] dark:text-white my-1">
            188,950 <span className="text-xs font-normal text-[#76777d]">kg</span>
          </div>
          <span className="text-xs font-semibold text-[#009668] dark:text-[#4edea3] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +8.4% vs last period
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/40 dark:border-[#213145]">
          <span className="text-[10px] uppercase font-semibold text-[#76777d] dark:text-[#7c839b] block">Avg. Session Strain</span>
          <div className="text-2xl font-bold tabular-nums text-[#0b1c30] dark:text-white my-1">
            15.8 <span className="text-xs font-normal text-[#76777d]">/ 21.0</span>
          </div>
          <span className="text-xs font-semibold text-[#006398] dark:text-[#6ffbbe]">
            Optimal adaptation zone
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/40 dark:border-[#213145]">
          <span className="text-[10px] uppercase font-semibold text-[#76777d] dark:text-[#7c839b] block">Estimated VO2 Max</span>
          <div className="text-2xl font-bold tabular-nums text-[#0b1c30] dark:text-white my-1">
            58.4 <span className="text-xs font-normal text-[#76777d]">ml/kg/min</span>
          </div>
          <span className="text-xs font-semibold text-[#009668] dark:text-[#4edea3]">
            Top 2% in age group
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/40 dark:border-[#213145]">
          <span className="text-[10px] uppercase font-semibold text-[#76777d] dark:text-[#7c839b] block">Mean Parasympathetic HRV</span>
          <div className="text-2xl font-bold tabular-nums text-[#0b1c30] dark:text-white my-1">
            74 <span className="text-xs font-normal text-[#76777d]">ms</span>
          </div>
          <span className="text-xs font-semibold text-[#009668] dark:text-[#4edea3]">
            +5 ms 30-day baseline
          </span>
        </div>
      </div>

      {/* 3. Weekly Volume Tonnage & Strain Progression Chart */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/40 dark:border-[#213145] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white tracking-tight">
              Weekly Volume Load Progression
            </h2>
            <p className="text-xs text-[#76777d] dark:text-[#7c839b]">
              Barbell & auxiliary volume accumulated across microcycles (kg lifted).
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#76777d] tabular-nums">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#006398] dark:bg-[#6ffbbe]" />
              Volume Tonnage
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#000000] dark:bg-white" />
              Strain Index
            </span>
          </div>
        </div>

        {/* SVG/CSS Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-3 sm:gap-6 pt-6 border-b border-[#c6c6cd]/20 dark:border-[#213145]">
          {weeklyVolume.map((item, idx) => {
            const heightPercent = Math.round((item.tonnage / maxTonnage) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="text-[10px] font-mono font-bold text-[#76777d] mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  {item.tonnage.toLocaleString()}
                </div>
                <div
                  className="w-full max-w-[48px] rounded-t-lg bg-[#006398] dark:bg-[#6ffbbe] group-hover:bg-[#131b2e] dark:group-hover:bg-[#4edea3] transition-all relative"
                  style={{ height: `${heightPercent}%` }}
                >
                  {/* Subtle Strain Tag */}
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-[#0b1c30] dark:text-white tabular-nums hidden sm:block">
                    {item.strain}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-[#76777d] dark:text-[#7c839b] mt-3 whitespace-nowrap">
                  {item.week}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Personal Record (PR) Board + Interactive 1RM Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PR Board (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131b2e] p-6 rounded-2xl border border-[#c6c6cd]/40 dark:border-[#213145] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-[#006398] dark:text-[#6ffbbe]" />
              Personal Record Codex
            </h2>
            <span className="text-xs text-[#76777d]">All-Time Verified PRs</span>
          </div>

          <div className="divide-y divide-[#c6c6cd]/20 dark:divide-[#213145]">
            {records.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#0b1c30] dark:text-white text-sm block">
                    {rec.exerciseName}
                  </span>
                  <span className="text-[#76777d] dark:text-[#7c839b]">
                    {rec.category} · Achieved {rec.dateAchieved}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-base text-[#0b1c30] dark:text-white tabular-nums">
                    {rec.value} <span className="text-xs font-normal text-[#76777d]">{rec.unit}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#009668] dark:text-[#4edea3] tabular-nums">
                    {rec.improvement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive 1RM Calculator Tool (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#131b2e] p-6 rounded-2xl border border-[#c6c6cd]/40 dark:border-[#213145] space-y-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#006398] dark:text-[#6ffbbe] uppercase tracking-wider mb-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>Biomechanical Tool</span>
            </div>
            <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white tracking-tight">
              1-Rep Max Predictor
            </h2>
            <p className="text-xs text-[#76777d] dark:text-[#7c839b] mt-0.5">
              Calibrated with the Epley & Lombardi kinetic formula.
            </p>
          </div>

          {/* Calculator Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#76777d] block mb-1">
                Lift Weight (kg)
              </label>
              <input
                type="number"
                step="2.5"
                value={calcWeight}
                onChange={(e) => setCalcWeight(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] font-mono font-bold text-[#0b1c30] dark:text-white text-base tabular-nums focus:ring-2 focus:ring-[#006398]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#76777d] block mb-1">
                Reps to Failure
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={calcReps}
                onChange={(e) => setCalcReps(Math.max(1, Math.min(15, parseInt(e.target.value, 10) || 1)))}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] font-mono font-bold text-[#0b1c30] dark:text-white text-base tabular-nums focus:ring-2 focus:ring-[#006398]"
              />
            </div>
          </div>

          {/* Result Banner */}
          <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#0b1c30] border border-[#c6c6cd]/20 dark:border-[#213145] text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#76777d] dark:text-[#7c839b]">
              Estimated 1-Rep Max
            </span>
            <div className="text-3xl font-extrabold font-mono text-[#006398] dark:text-[#6ffbbe] tabular-nums mt-0.5">
              {estimated1RM} <span className="text-sm font-normal text-[#76777d]">kg</span>
            </div>
          </div>

          {/* Prescribed Training Percentages */}
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-[#76777d] block text-[11px] mb-1">Working Set Percentage Matrix</span>
            {percentages.map((p) => {
              const weightAtPct = Math.round(estimated1RM * (p.pct / 100) * 2) / 2;
              return (
                <div key={p.pct} className="flex items-center justify-between py-1 border-b border-[#c6c6cd]/10 dark:border-[#213145] text-xs">
                  <span className="font-semibold text-[#0b1c30] dark:text-white tabular-nums">
                    {p.pct}% 1RM
                  </span>
                  <span className="text-[#76777d]">{p.reps}</span>
                  <span className="font-mono font-bold text-[#0b1c30] dark:text-white tabular-nums">
                    {weightAtPct} kg
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
