import React from 'react';
import { Play, Check, ChevronRight, Flame, Heart, Moon, Zap, ArrowUpRight, Clock, Dumbbell } from 'lucide-react';
import { DayRegimen, WorkoutSession } from '../types/kinetic';

interface DailyRegimenProps {
  days: DayRegimen[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onStartSession: (session: WorkoutSession) => void;
  onToggleHabit: (date: string, habitId: string) => void;
  onOpenQuickLog: () => void;
}

export const DailyRegimen: React.FC<DailyRegimenProps> = ({
  days,
  selectedDate,
  onSelectDate,
  onStartSession,
  onToggleHabit,
  onOpenQuickLog,
}) => {
  const currentDay = days.find((d) => d.date === selectedDate) || days[4]; // default to Fri Oct 30

  // Calculate circular dial stroke values
  const strainRatio = Math.min(currentDay.actualStrain / (currentDay.strainTarget || 1), 1);
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - strainRatio * circumference;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header & Periodization Phase Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c6c6cd]/30 dark:border-[#213145] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#006398] dark:text-[#6ffbbe] mb-1">
            <span>Cycle 04 · Kinetic Periodization</span>
            <span aria-hidden="true">·</span>
            <span>Microcycle 3 of 4</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0b1c30] dark:text-[#ffffff] text-balance">
            Athletic Regimen & Readiness
          </h1>
        </div>

        {/* Quick Date Indicator */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-[#45464d] dark:text-[#bec6e0]">Selected Regimen Day</div>
            <div className="text-sm font-semibold text-[#0b1c30] dark:text-[#ffffff] tabular-nums">
              {currentDay.dayAbbr}, October {currentDay.dayNumber}, 2026
            </div>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Date Scroller (Thumb-friendly & responsive) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {days.map((day) => {
          const isSelected = day.date === selectedDate;
          const completedCount = day.sessions.filter((s) => s.status === 'completed').length;
          const hasSession = day.sessions.length > 0;

          return (
            <button
              key={day.date}
              onClick={() => onSelectDate(day.date)}
              className={`min-w-[68px] sm:min-w-[80px] p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-between transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006398] ${
                isSelected
                  ? 'bg-[#000000] dark:bg-[#ffffff] text-white dark:text-[#0b1c30] border-transparent shadow-md'
                  : 'bg-[#ffffff] dark:bg-[#131b2e] text-[#0b1c30] dark:text-[#eaf1ff] border-[#c6c6cd]/40 dark:border-[#213145] hover:border-[#006398]/50'
              }`}
            >
              <span className={`text-[11px] font-semibold tracking-wider uppercase ${
                isSelected ? 'text-[#bec6e0] dark:text-[#45464d]' : 'text-[#76777d] dark:text-[#7c839b]'
              }`}>
                {day.dayAbbr}
              </span>
              <span className="text-xl sm:text-2xl font-bold tabular-nums my-1">
                {day.dayNumber}
              </span>

              {/* Status Indicator */}
              <div className="flex items-center gap-1 mt-0.5">
                {day.isToday && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-white/20 dark:bg-black/10 text-white dark:text-black'
                      : 'bg-[#eff4ff] dark:bg-[#0b1c30] text-[#006398] dark:text-[#6ffbbe]'
                  }`}>
                    TODAY
                  </span>
                )}
                {!day.isToday && hasSession && (
                  <span className={`text-[10px] tabular-nums ${
                    completedCount === day.sessions.length
                      ? 'text-[#009668] dark:text-[#4edea3]'
                      : 'text-[#76777d]'
                  }`}>
                    {completedCount}/{day.sessions.length}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Primary Kinetic Metric Anchor (Readiness & Strain Gauge) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Readiness Dial Card (5 Cols) */}
        <div className="lg:col-span-5 bg-[#ffffff] dark:bg-[#131b2e] p-6 rounded-2xl border border-[#c6c6cd]/40 dark:border-[#213145] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-[#76777d] dark:text-[#7c839b] uppercase">
              Biometric Readiness
            </span>
            <span className="text-xs font-semibold text-[#006398] dark:text-[#6ffbbe] uppercase">
              {currentDay.recoveryStatus} Phase
            </span>
          </div>

          {/* SVG Gauge & Core Numbers */}
          <div className="my-6 flex flex-col sm:flex-row items-center justify-around gap-6">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 110 110">
                {/* Background Ring */}
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  className="stroke-[#eff4ff] dark:stroke-[#213145]"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Strain Progress Ring */}
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  className="stroke-[#006398] dark:stroke-[#6ffbbe] transition-all duration-700 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-[#76777d] dark:text-[#7c839b] font-medium">STRAIN</span>
                <span className="text-2xl font-bold tabular-nums text-[#0b1c30] dark:text-[#ffffff]">
                  {currentDay.actualStrain.toFixed(1)}
                </span>
                <span className="text-[10px] text-[#76777d] tabular-nums">
                  / {currentDay.strainTarget.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Sub-Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
              <div className="p-3 bg-[#eff4ff] dark:bg-[#0b1c30] rounded-xl border border-[#c6c6cd]/20 dark:border-[#213145]">
                <div className="flex items-center gap-1.5 text-xs text-[#76777d] dark:text-[#7c839b] mb-1">
                  <Heart className="w-3.5 h-3.5 text-[#ba1a1a]" />
                  <span>HRV</span>
                </div>
                <div className="text-lg font-bold tabular-nums text-[#0b1c30] dark:text-[#ffffff]">
                  {currentDay.hrvMs} <span className="text-xs font-normal text-[#76777d]">ms</span>
                </div>
              </div>

              <div className="p-3 bg-[#eff4ff] dark:bg-[#0b1c30] rounded-xl border border-[#c6c6cd]/20 dark:border-[#213145]">
                <div className="flex items-center gap-1.5 text-xs text-[#76777d] dark:text-[#7c839b] mb-1">
                  <Zap className="w-3.5 h-3.5 text-[#006398] dark:text-[#6ffbbe]" />
                  <span>Resting HR</span>
                </div>
                <div className="text-lg font-bold tabular-nums text-[#0b1c30] dark:text-[#ffffff]">
                  {currentDay.restingHr} <span className="text-xs font-normal text-[#76777d]">bpm</span>
                </div>
              </div>

              <div className="p-3 bg-[#eff4ff] dark:bg-[#0b1c30] rounded-xl border border-[#c6c6cd]/20 dark:border-[#213145]">
                <div className="flex items-center gap-1.5 text-xs text-[#76777d] dark:text-[#7c839b] mb-1">
                  <Moon className="w-3.5 h-3.5 text-[#565e74] dark:text-[#bec6e0]" />
                  <span>Sleep</span>
                </div>
                <div className="text-lg font-bold tabular-nums text-[#0b1c30] dark:text-[#ffffff]">
                  {currentDay.sleepHours} <span className="text-xs font-normal text-[#76777d]">h</span>
                </div>
              </div>

              <div className="p-3 bg-[#eff4ff] dark:bg-[#0b1c30] rounded-xl border border-[#c6c6cd]/20 dark:border-[#213145]">
                <div className="flex items-center gap-1.5 text-xs text-[#76777d] dark:text-[#7c839b] mb-1">
                  <Flame className="w-3.5 h-3.5 text-[#006398]" />
                  <span>Readiness</span>
                </div>
                <div className="text-lg font-bold tabular-nums text-[#009668] dark:text-[#4edea3]">
                  {currentDay.readinessScore}%
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#c6c6cd]/20 dark:border-[#213145] text-xs text-[#45464d] dark:text-[#bec6e0] flex items-center justify-between">
            <span>CNS Status: Fully Recovered</span>
            <span className="font-semibold text-[#006398] dark:text-[#6ffbbe]">Clear for High Intensity</span>
          </div>
        </div>

        {/* Featured Hero Session Card (7 Cols) */}
        <div className="lg:col-span-7 bg-[#ffffff] dark:bg-[#131b2e] rounded-2xl border border-[#c6c6cd]/40 dark:border-[#213145] overflow-hidden flex flex-col justify-between">
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
            <img
              src="/src/assets/images/hero_athlete_training_1793426832617.jpg"
              alt="Athlete training in modern gym"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-85 hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30] via-[#0b1c30]/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6ffbbe] bg-[#002113]/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
                  Primary Session · Today
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5 text-balance">
                  Phase II · Hypertrophy & Posterior Chain
                </h3>
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-white/90 bg-black/40 px-2 py-1 rounded backdrop-blur-sm tabular-nums">
                Target Vol: 8,400 kg
              </span>
            </div>
          </div>

          <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-[#45464d] dark:text-[#bec6e0] w-full sm:w-auto">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#76777d]" />
                60 min
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-medium">
                <Dumbbell className="w-3.5 h-3.5 text-[#76777d]" />
                3 Compound Movements
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-[#006398] dark:text-[#6ffbbe]">Target RPE 8.5</span>
            </div>

            <button
              onClick={() => {
                const sessionToStart = currentDay.sessions.find(s => s.id === 'sess-today-2') || currentDay.sessions[0];
                if (sessionToStart) onStartSession(sessionToStart);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#000000] dark:bg-[#6ffbbe] text-white dark:text-[#0b1c30] text-xs font-bold tracking-wide flex items-center justify-center gap-2 hover:bg-[#131b2e] dark:hover:bg-[#4edea3] transition-all shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006398] shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Execution</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Day's Prescribed Training Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0b1c30] dark:text-[#ffffff] tracking-tight">
            Prescribed Sessions ({currentDay.sessions.length})
          </h2>
          <button
            onClick={onOpenQuickLog}
            className="text-xs font-semibold text-[#006398] dark:text-[#6ffbbe] hover:underline flex items-center gap-1"
          >
            <span>+ Log Custom Session</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {currentDay.sessions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#ffffff] dark:bg-[#131b2e] border border-[#c6c6cd]/30 dark:border-[#213145]">
            <p className="text-sm text-[#45464d] dark:text-[#bec6e0]">No formal workouts scheduled for this day.</p>
            <p className="text-xs text-[#76777d] mt-1">Focus on active recovery, nutrition, and restorative mobility.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentDay.sessions.map((session) => {
              const isCompleted = session.status === 'completed';
              const isInProgress = session.status === 'in-progress';

              return (
                <div
                  key={session.id}
                  className="p-5 rounded-2xl bg-[#ffffff] dark:bg-[#131b2e] border border-[#c6c6cd]/40 dark:border-[#213145] hover:border-[#006398]/50 transition-colors flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold uppercase tracking-wider text-[#76777d] dark:text-[#7c839b]">
                        {session.scheduledTime} · {session.category}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        isCompleted
                          ? 'bg-[#eff4ff] dark:bg-[#002113] text-[#009668] dark:text-[#4edea3]'
                          : isInProgress
                          ? 'bg-[#eff4ff] dark:bg-[#131b2e] text-[#006398] dark:text-[#6ffbbe]'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {session.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#0b1c30] dark:text-[#ffffff] leading-snug">
                      {session.title}
                    </h3>
                    <p className="text-xs text-[#76777d] dark:text-[#7c839b] mt-1">
                      {session.phase}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#c6c6cd]/20 dark:border-[#213145] flex items-center justify-between text-xs">
                    <div className="text-[#45464d] dark:text-[#bec6e0] tabular-nums">
                      <span>{session.durationMin}m</span>
                      {session.caloriesBurned && (
                        <>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span>{session.caloriesBurned} kcal</span>
                        </>
                      )}
                      {session.actualVolumeKg && (
                        <>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span>{session.actualVolumeKg.toLocaleString()} kg</span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => onStartSession(session)}
                      className="px-3 py-1.5 rounded-lg bg-[#eff4ff] dark:bg-[#0b1c30] hover:bg-[#dce9ff] dark:hover:bg-[#213145] text-[#006398] dark:text-[#6ffbbe] font-semibold text-xs transition-colors flex items-center gap-1 active:scale-95"
                    >
                      <span>{isCompleted ? 'View Log' : 'Start'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Daily Athletic Disciplines / Habit Mastery */}
      <div className="bg-[#ffffff] dark:bg-[#131b2e] p-6 rounded-2xl border border-[#c6c6cd]/40 dark:border-[#213145]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#0b1c30] dark:text-[#ffffff] tracking-tight">
              Athletic Disciplines & Bio-Habits
            </h2>
            <p className="text-xs text-[#76777d] dark:text-[#7c839b]">
              Daily physiological fundamentals required for optimal kinetic output.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#006398] dark:text-[#6ffbbe] tabular-nums">
            {currentDay.disciplines.filter(d => d.completed).length} of {currentDay.disciplines.length} completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentDay.disciplines.map((habit) => (
            <button
              key={habit.id}
              onClick={() => onToggleHabit(currentDay.date, habit.id)}
              className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006398] ${
                habit.completed
                  ? 'bg-[#eff4ff] dark:bg-[#002113]/40 border-[#009668]/30 dark:border-[#009668]/50'
                  : 'bg-[#f8f9ff] dark:bg-[#0b1c30] border-[#c6c6cd]/30 dark:border-[#213145] hover:border-[#006398]/40'
              }`}
            >
              <div>
                <span className="text-xs font-semibold text-[#0b1c30] dark:text-[#eaf1ff] block">
                  {habit.title}
                </span>
                <span className="text-[11px] text-[#76777d] dark:text-[#7c839b] tabular-nums">
                  Target: {habit.target} {habit.current !== 'Pending' && `· Actual: ${habit.current}`}
                </span>
              </div>

              <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${
                habit.completed
                  ? 'bg-[#009668] text-white'
                  : 'border border-[#c6c6cd] dark:border-[#45464d] text-transparent'
              }`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
