import React, { useState } from 'react';
import { Layers, CheckCircle2, Calendar, Target, Zap, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { TrainingProtocol } from '../types/kinetic';

interface ProtocolsViewProps {
  protocols: TrainingProtocol[];
  onSelectActiveProtocol: (protocolId: string) => void;
}

export const ProtocolsView: React.FC<ProtocolsViewProps> = ({
  protocols,
  onSelectActiveProtocol,
}) => {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>(
    protocols.find((p) => p.isActive)?.id || protocols[0].id
  );

  const selectedProtocol = protocols.find((p) => p.id === selectedProtocolId) || protocols[0];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header */}
      <div className="border-b border-[#c6c6cd]/30 dark:border-[#213145] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#006398] dark:text-[#6ffbbe] mb-1">
            <span>Periodized Programming</span>
            <span aria-hidden="true">·</span>
            <span>Sports Science Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0b1c30] dark:text-[#ffffff] text-balance">
            Athletic Protocols & Macrocycles
          </h1>
        </div>
        <p className="text-xs text-[#76777d] dark:text-[#7c839b] max-w-sm">
          Evidence-based periodization structures designed to maximize neuromuscular adaptation and prevent overtraining.
        </p>
      </div>

      {/* 2. Protocols Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {protocols.map((proto) => {
          const isSelected = proto.id === selectedProtocolId;
          const isActive = proto.isActive;

          return (
            <div
              key={proto.id}
              onClick={() => setSelectedProtocolId(proto.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                isSelected
                  ? 'bg-white dark:bg-[#131b2e] border-[#006398] dark:border-[#6ffbbe] shadow-md ring-1 ring-[#006398] dark:ring-[#6ffbbe]'
                  : 'bg-white dark:bg-[#131b2e] border-[#c6c6cd]/40 dark:border-[#213145] hover:border-[#006398]/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-[#006398] dark:text-[#6ffbbe] uppercase tracking-wider">
                    {proto.level}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#eff4ff] dark:bg-[#002113] text-[#009668] dark:text-[#4edea3]">
                      ACTIVE
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#0b1c30] dark:text-white leading-snug">
                  {proto.title}
                </h3>
                <p className="text-xs text-[#76777d] dark:text-[#7c839b] mt-1 line-clamp-2">
                  {proto.subtitle}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-[#c6c6cd]/20 dark:border-[#213145]">
                <div className="flex items-center justify-between text-xs text-[#45464d] dark:text-[#bec6e0] tabular-nums">
                  <span>{proto.durationWeeks} Weeks</span>
                  <span aria-hidden="true">·</span>
                  <span>{proto.daysPerWeek} Days/Wk</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-bold text-[#006398] dark:text-[#6ffbbe]">RPE {proto.intensityScore}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#eff4ff] dark:bg-[#0b1c30] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#006398] dark:bg-[#6ffbbe] h-full rounded-full transition-all"
                    style={{ width: `${proto.completionRate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Deep Protocol Inspector */}
      {selectedProtocol && (
        <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-[#c6c6cd]/40 dark:border-[#213145] p-6 sm:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#c6c6cd]/20 dark:border-[#213145]">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs text-[#006398] dark:text-[#6ffbbe] font-semibold uppercase tracking-wider">
                <span>Program Blueprint</span>
                <span aria-hidden="true">·</span>
                <span>Week {selectedProtocol.currentWeek} of {selectedProtocol.durationWeeks}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1c30] dark:text-white">
                {selectedProtocol.title}
              </h2>
              <p className="text-sm text-[#45464d] dark:text-[#bec6e0] max-w-2xl leading-relaxed">
                {selectedProtocol.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              {!selectedProtocol.isActive ? (
                <button
                  onClick={() => onSelectActiveProtocol(selectedProtocol.id)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#000000] dark:bg-[#6ffbbe] text-white dark:text-[#0b1c30] text-xs font-bold tracking-wide hover:bg-[#131b2e] dark:hover:bg-[#4edea3] transition-all shadow-sm active:scale-95"
                >
                  Activate Protocol
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#009668] dark:text-[#4edea3] bg-[#eff4ff] dark:bg-[#002113] px-4 py-2.5 rounded-xl border border-[#009668]/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Currently Active Microcycle</span>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Schedule Matrix */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0b1c30] dark:text-white tracking-tight">
                Microcycle Schedule Matrix (Week {selectedProtocol.currentWeek})
              </h3>
              <span className="text-xs text-[#76777d] tabular-nums">
                {selectedProtocol.weeklySchedule.length} Prescribed Sessions
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedProtocol.weeklySchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#f8f9ff] dark:bg-[#0b1c30] border border-[#c6c6cd]/30 dark:border-[#213145] space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0b1c30] dark:text-white">{item.day}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      item.intensity === 'Maximal'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : item.intensity === 'High'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : item.intensity === 'Moderate'
                        ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {item.intensity}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-[#0b1c30] dark:text-[#eaf1ff] block leading-snug">
                      {item.focus}
                    </span>
                    <span className="text-[11px] text-[#76777d] tabular-nums mt-1 block">
                      Target Duration: {item.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Biomechanical Adaptation Principles */}
          <div className="p-5 rounded-xl bg-[#eff4ff] dark:bg-[#0b1c30]/60 border border-[#c6c6cd]/20 dark:border-[#213145] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-bold text-[#0b1c30] dark:text-white block mb-1">
                Progressive Overload Rule
              </span>
              <p className="text-[#45464d] dark:text-[#bec6e0]">
                Increments of 2.5% load applied upon successful completion of all top sets with RPE $\le 8.5$.
              </p>
            </div>
            <div>
              <span className="font-bold text-[#0b1c30] dark:text-white block mb-1">
                Deload Week Timing
              </span>
              <p className="text-[#45464d] dark:text-[#bec6e0]">
                Mandatory active restoration on Week {Math.floor(selectedProtocol.durationWeeks / 2)}: volume reduced by 40%, intensity maintained.
              </p>
            </div>
            <div>
              <span className="font-bold text-[#0b1c30] dark:text-white block mb-1">
                Kinetic Readiness Gate
              </span>
              <p className="text-[#45464d] dark:text-[#bec6e0]">
                If daily readiness score falls below 65%, compound top sets are auto-regulated down by 10%.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
