import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Check, Plus, Heart, ChevronLeft, ChevronRight, Award, Flame, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { WorkoutSession, Exercise, ExerciseSet } from '../types/kinetic';

interface ActiveSessionProps {
  session: WorkoutSession;
  onUpdateSession: (updatedSession: WorkoutSession) => void;
  onFinishSession: (finishedSession: WorkoutSession) => void;
  onBackToRegimen: () => void;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({
  session,
  onUpdateSession,
  onFinishSession,
  onBackToRegimen,
}) => {
  // Timer States
  const [elapsedSec, setElapsedSec] = useState<number>(1420); // starts around 23m in
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  
  // Rest Timer State
  const [restRemainingSec, setRestRemainingSec] = useState<number>(0);
  const [restInitialSec, setRestInitialSec] = useState<number>(90);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Live Simulated Heart Rate
  const [liveHr, setLiveHr] = useState<number>(148);
  const [showFinishModal, setShowFinishModal] = useState<boolean>(false);

  // Current Exercise
  const exercises = session.exercises && session.exercises.length > 0 ? session.exercises : [];
  const currentExercise: Exercise | undefined = exercises[activeExerciseIndex];

  // Elapsed Workout Timer
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Rest Countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (restRemainingSec > 0) {
      interval = setInterval(() => {
        setRestRemainingSec((prev) => {
          if (prev <= 1) {
            // Beep simulation or alert
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restRemainingSec]);

  // Heart Rate Simulation fluctuation
  useEffect(() => {
    const hrInterval = setInterval(() => {
      setLiveHr((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(110, Math.min(178, prev + delta));
      });
    }, 4000);
    return () => clearInterval(hrInterval);
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Toggle set completion
  const handleToggleSet = (exerciseIdx: number, setId: string) => {
    const updatedExercises = [...exercises];
    const targetEx = updatedExercises[exerciseIdx];
    if (!targetEx) return;

    const setIndex = targetEx.sets.findIndex((s) => s.id === setId);
    if (setIndex === -1) return;

    const currentSet = targetEx.sets[setIndex];
    const willComplete = !currentSet.completed;

    targetEx.sets[setIndex] = {
      ...currentSet,
      completed: willComplete,
      actualWeight: currentSet.actualWeight ?? currentSet.targetWeight,
      actualReps: currentSet.actualReps ?? currentSet.targetReps,
      rpe: currentSet.rpe ?? 8.0,
    };

    // If completed, trigger rest timer
    if (willComplete) {
      const restDuration = currentSet.restSec || 90;
      setRestInitialSec(restDuration);
      setRestRemainingSec(restDuration);
    }

    // Recalculate session actual volume
    let totalVol = 0;
    updatedExercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed) {
          totalVol += (s.actualWeight || s.targetWeight) * (s.actualReps || s.targetReps);
        }
      });
    });

    const updatedSession: WorkoutSession = {
      ...session,
      exercises: updatedExercises,
      actualVolumeKg: totalVol,
    };

    onUpdateSession(updatedSession);
  };

  const handleUpdateSetValue = (
    exerciseIdx: number,
    setId: string,
    field: 'actualWeight' | 'actualReps' | 'rpe',
    value: number
  ) => {
    const updatedExercises = [...exercises];
    const targetEx = updatedExercises[exerciseIdx];
    if (!targetEx) return;

    const setIndex = targetEx.sets.findIndex((s) => s.id === setId);
    if (setIndex === -1) return;

    targetEx.sets[setIndex] = {
      ...targetEx.sets[setIndex],
      [field]: value,
    };

    let totalVol = 0;
    updatedExercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed) {
          totalVol += (s.actualWeight || s.targetWeight) * (s.actualReps || s.targetReps);
        }
      });
    });

    onUpdateSession({
      ...session,
      exercises: updatedExercises,
      actualVolumeKg: totalVol,
    });
  };

  const handleAddSet = (exerciseIdx: number) => {
    const updatedExercises = [...exercises];
    const targetEx = updatedExercises[exerciseIdx];
    if (!targetEx) return;

    const lastSet = targetEx.sets[targetEx.sets.length - 1];
    const newSet: ExerciseSet = {
      id: `s-${Date.now()}`,
      setNumber: targetEx.sets.length + 1,
      targetWeight: lastSet ? lastSet.targetWeight : 100,
      targetReps: lastSet ? lastSet.targetReps : 6,
      actualWeight: lastSet ? lastSet.targetWeight : 100,
      actualReps: lastSet ? lastSet.targetReps : 6,
      rpe: 8.0,
      completed: false,
      restSec: 120,
    };

    targetEx.sets.push(newSet);
    onUpdateSession({
      ...session,
      exercises: updatedExercises,
    });
  };

  // Heart rate zone calculation
  const getHrZone = (hr: number) => {
    if (hr < 125) return { zone: 1, label: 'Zone 1 · Active Recovery', color: 'text-sky-500' };
    if (hr < 142) return { zone: 2, label: 'Zone 2 · Aerobic Base', color: 'text-emerald-500' };
    if (hr < 158) return { zone: 3, label: 'Zone 3 · Aerobic Power', color: 'text-amber-500' };
    if (hr < 172) return { zone: 4, label: 'Zone 4 · Threshold', color: 'text-orange-500' };
    return { zone: 5, label: 'Zone 5 · Anaerobic Peak', color: 'text-rose-500' };
  };

  const hrZoneInfo = getHrZone(liveHr);

  const completedSetsCount = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const totalSetsCount = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Active Session Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#c6c6cd]/30 dark:border-[#213145] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToRegimen}
            className="w-9 h-9 rounded-xl bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/40 dark:border-[#213145] flex items-center justify-center text-[#0b1c30] dark:text-[#ffffff] hover:bg-[#eff4ff] dark:hover:bg-[#213145] transition-colors"
            title="Return to Regimen Overview"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#006398] dark:text-[#6ffbbe]">
              <span className="w-2 h-2 rounded-full bg-[#006398] dark:bg-[#6ffbbe] animate-pulse" />
              <span>Live Execution Protocol</span>
              <span aria-hidden="true">·</span>
              <span>{session.category}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0b1c30] dark:text-[#ffffff]">
              {session.title}
            </h1>
          </div>
        </div>

        {/* Stopwatch & Action Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-[#ffffff] dark:bg-[#131b2e] border border-[#c6c6cd]/40 dark:border-[#213145] px-4 py-2 rounded-xl flex items-center gap-3 shadow-sm">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="text-[#006398] dark:text-[#6ffbbe] hover:opacity-80 transition-opacity"
              title={isRunning ? 'Pause Timer' : 'Resume Timer'}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <span className="text-xl font-bold tabular-nums text-[#0b1c30] dark:text-[#ffffff] tracking-wider">
              {formatTime(elapsedSec)}
            </span>
            <button
              onClick={() => setElapsedSec(0)}
              className="text-[#76777d] hover:text-[#0b1c30] dark:hover:text-white transition-colors"
              title="Reset Stopwatch"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowFinishModal(true)}
            className="px-4 py-2 rounded-xl bg-[#000000] dark:bg-[#ffffff] text-white dark:text-[#0b1c30] font-semibold text-xs tracking-wide shadow-sm hover:bg-[#131b2e] transition-all active:scale-95 whitespace-nowrap"
          >
            Complete Session
          </button>
        </div>
      </div>

      {/* 2. Live Telemetry Strip (Rest Timer + Live Heart Rate + Volume Lifted) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Rest Countdown Timer */}
        <div className={`p-4 rounded-2xl border transition-all ${
          restRemainingSec > 0
            ? 'bg-[#eff4ff] dark:bg-[#002113] border-[#006398] dark:border-[#6ffbbe]'
            : 'bg-white dark:bg-[#131b2e] border-[#c6c6cd]/30 dark:border-[#213145]'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#76777d] dark:text-[#7c839b] mb-1">
            <span className="font-semibold uppercase tracking-wider">Inter-Set Rest Timer</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Rest Alert' : 'Enable Rest Alert'}
              className="hover:text-[#0b1c30] dark:hover:text-white"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-[#76777d]" />}
            </button>
          </div>
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-bold tabular-nums tracking-tight ${
              restRemainingSec > 0 ? 'text-[#006398] dark:text-[#6ffbbe]' : 'text-[#76777d]'
            }`}>
              {restRemainingSec > 0 ? formatTime(restRemainingSec) : '00:00'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setRestRemainingSec((prev) => prev + 30)}
                className="text-[11px] font-semibold px-2 py-1 rounded bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/40 dark:border-[#213145] text-[#0b1c30] dark:text-white hover:bg-slate-100"
              >
                +30s
              </button>
              {restRemainingSec > 0 && (
                <button
                  onClick={() => setRestRemainingSec(0)}
                  className="text-[11px] font-semibold px-2 py-1 rounded bg-[#000000] text-white hover:bg-slate-800"
                >
                  Skip
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Heart Rate & Kinetic Zone */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/30 dark:border-[#213145]">
          <div className="flex items-center justify-between text-xs text-[#76777d] dark:text-[#7c839b] mb-1">
            <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#ba1a1a] fill-[#ba1a1a]" />
              Live Telemetry
            </span>
            <span className={`font-semibold ${hrZoneInfo.color}`}>
              {hrZoneInfo.label}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tabular-nums text-[#0b1c30] dark:text-[#ffffff]">
                {liveHr}
              </span>
              <span className="text-xs font-semibold text-[#76777d]">BPM</span>
            </div>
            {/* 5-segment Zone Bar */}
            <div className="flex items-center gap-1 w-24">
              {[1, 2, 3, 4, 5].map((z) => (
                <div
                  key={z}
                  className={`h-2 flex-1 rounded-sm ${
                    z <= hrZoneInfo.zone
                      ? z === 5 ? 'bg-rose-500' : z === 4 ? 'bg-orange-500' : z === 3 ? 'bg-amber-500' : z === 2 ? 'bg-emerald-500' : 'bg-sky-500'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Total Volume Accumulated */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/30 dark:border-[#213145]">
          <div className="flex items-center justify-between text-xs text-[#76777d] dark:text-[#7c839b] mb-1">
            <span className="font-semibold uppercase tracking-wider">Volume Accumulated</span>
            <span className="font-semibold text-[#006398] dark:text-[#6ffbbe] tabular-nums">
              {completedSetsCount} / {totalSetsCount} Sets
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tabular-nums text-[#0b1c30] dark:text-[#ffffff]">
                {(session.actualVolumeKg || 0).toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-[#76777d]">KG</span>
            </div>
            <span className="text-xs text-[#76777d] tabular-nums">
              Target: {session.targetVolumeKg ? session.targetVolumeKg.toLocaleString() : '8,400'} kg
            </span>
          </div>
        </div>
      </div>

      {/* 3. Exercise Carousel / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {exercises.map((ex, idx) => {
          const isActive = idx === activeExerciseIndex;
          const completedCount = ex.sets.filter((s) => s.completed).length;

          return (
            <button
              key={ex.id}
              onClick={() => setActiveExerciseIndex(idx)}
              className={`px-4 py-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all whitespace-nowrap shrink-0 active:scale-95 ${
                isActive
                  ? 'bg-[#000000] dark:bg-[#ffffff] text-white dark:text-[#0b1c30] border-transparent shadow-sm'
                  : 'bg-white dark:bg-[#131b2e] text-[#0b1c30] dark:text-[#eaf1ff] border-[#c6c6cd]/40 dark:border-[#213145] hover:border-[#006398]'
              }`}
            >
              <span className="text-xs font-bold tabular-nums">
                {idx + 1}.
              </span>
              <span className="text-xs font-semibold">{ex.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono tabular-nums ${
                isActive
                  ? 'bg-white/20 dark:bg-black/10 text-white dark:text-black'
                  : 'bg-slate-100 dark:bg-slate-800 text-[#76777d]'
              }`}>
                {completedCount}/{ex.sets.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Active Exercise Execution Workbench */}
      {currentExercise && (
        <div className="bg-white dark:bg-[#131b2e] rounded-2xl border border-[#c6c6cd]/40 dark:border-[#213145] overflow-hidden">
          {/* Exercise Hero & Coaching Cue */}
          <div className="p-5 sm:p-6 border-b border-[#c6c6cd]/20 dark:border-[#213145] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              {currentExercise.imagePath && (
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#c6c6cd]/30 dark:border-[#213145]">
                  <img
                    src={currentExercise.imagePath}
                    alt={currentExercise.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#006398] dark:text-[#6ffbbe] uppercase tracking-wider mb-1">
                  <span>{currentExercise.movementPattern}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentExercise.equipment}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#0b1c30] dark:text-white">{currentExercise.primaryMuscle}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] dark:text-[#ffffff]">
                  {currentExercise.name}
                </h2>
                <p className="text-xs text-[#76777d] dark:text-[#7c839b] mt-1 max-w-xl">
                  {currentExercise.coachingCue}
                </p>
              </div>
            </div>

            {/* Tempo & PR Specifications */}
            <div className="flex items-center gap-4 text-xs shrink-0 bg-[#eff4ff] dark:bg-[#0b1c30] p-3 rounded-xl border border-[#c6c6cd]/20 dark:border-[#213145]">
              <div>
                <span className="text-[#76777d] block text-[10px] uppercase font-semibold">Prescribed Tempo</span>
                <span className="font-mono font-bold text-sm text-[#0b1c30] dark:text-white">{currentExercise.tempo}</span>
              </div>
              <div className="h-6 w-[1px] bg-[#c6c6cd]/40 dark:bg-[#213145]" />
              <div>
                <span className="text-[#76777d] block text-[10px] uppercase font-semibold">Personal Record</span>
                <span className="font-mono font-bold text-sm text-[#009668] dark:text-[#4edea3]">{currentExercise.pr1RM || '—'}</span>
              </div>
            </div>
          </div>

          {/* Set Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#76777d] dark:text-[#7c839b] uppercase tracking-wider font-semibold border-b border-[#c6c6cd]/20 dark:border-[#213145]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Set</th>
                  <th className="py-3 px-4">Previous</th>
                  <th className="py-3 px-4">Target (kg)</th>
                  <th className="py-3 px-4">Target Reps</th>
                  <th className="py-3 px-4">Actual (kg)</th>
                  <th className="py-3 px-4">Actual Reps</th>
                  <th className="py-3 px-4">RPE</th>
                  <th className="py-3 px-4 text-center w-24">Complete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c6c6cd]/20 dark:divide-[#213145]">
                {currentExercise.sets.map((set) => {
                  const isDone = set.completed;
                  return (
                    <tr
                      key={set.id}
                      className={`transition-colors ${
                        isDone
                          ? 'bg-[#eff4ff]/60 dark:bg-[#002113]/20'
                          : 'hover:bg-slate-50 dark:hover:bg-[#131b2e]'
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-bold tabular-nums text-sm">
                        {set.setNumber}
                      </td>
                      <td className="py-3 px-4 text-[#76777d] tabular-nums">
                        {set.prevBest || '—'}
                      </td>
                      <td className="py-3 px-4 font-semibold tabular-nums text-sm">
                        {set.targetWeight} kg
                      </td>
                      <td className="py-3 px-4 font-semibold tabular-nums text-sm">
                        {set.targetReps}
                      </td>

                      {/* Actual Weight Input */}
                      <td className="py-2 px-4">
                        <input
                          type="number"
                          step="0.5"
                          value={set.actualWeight ?? set.targetWeight}
                          onChange={(e) =>
                            handleUpdateSetValue(
                              activeExerciseIndex,
                              set.id,
                              'actualWeight',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          disabled={isDone}
                          className="w-20 px-2 py-1.5 rounded-lg border border-[#c6c6cd]/50 dark:border-[#213145] bg-white dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white font-mono font-semibold tabular-nums text-sm focus:ring-1 focus:ring-[#006398] disabled:opacity-70"
                        />
                      </td>

                      {/* Actual Reps Input */}
                      <td className="py-2 px-4">
                        <input
                          type="number"
                          value={set.actualReps ?? set.targetReps}
                          onChange={(e) =>
                            handleUpdateSetValue(
                              activeExerciseIndex,
                              set.id,
                              'actualReps',
                              parseInt(e.target.value, 10) || 0
                            )
                          }
                          disabled={isDone}
                          className="w-16 px-2 py-1.5 rounded-lg border border-[#c6c6cd]/50 dark:border-[#213145] bg-white dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white font-mono font-semibold tabular-nums text-sm focus:ring-1 focus:ring-[#006398] disabled:opacity-70"
                        />
                      </td>

                      {/* RPE Selector */}
                      <td className="py-2 px-4">
                        <select
                          value={set.rpe ?? 8.0}
                          onChange={(e) =>
                            handleUpdateSetValue(
                              activeExerciseIndex,
                              set.id,
                              'rpe',
                              parseFloat(e.target.value)
                            )
                          }
                          disabled={isDone}
                          className="px-2 py-1.5 rounded-lg border border-[#c6c6cd]/50 dark:border-[#213145] bg-white dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white font-mono text-xs tabular-nums focus:ring-1 focus:ring-[#006398] disabled:opacity-70"
                        >
                          <option value="6.5">6.5 (Easy)</option>
                          <option value="7.0">7.0 (3 RIR)</option>
                          <option value="7.5">7.5 (2-3 RIR)</option>
                          <option value="8.0">8.0 (2 RIR)</option>
                          <option value="8.5">8.5 (1-2 RIR)</option>
                          <option value="9.0">9.0 (1 RIR)</option>
                          <option value="9.5">9.5 (Heavy)</option>
                          <option value="10.0">10.0 (Max Effort)</option>
                        </select>
                      </td>

                      {/* Check Complete Button */}
                      <td className="py-2 px-4 text-center">
                        <button
                          onClick={() => handleToggleSet(activeExerciseIndex, set.id)}
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all mx-auto active:scale-95 ${
                            isDone
                              ? 'bg-[#009668] text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-[#0b1c30] border border-[#c6c6cd]/40 dark:border-[#213145] text-transparent hover:text-slate-400 hover:border-[#006398]'
                          }`}
                          title={isDone ? 'Mark Set Incomplete' : 'Complete Set & Trigger Rest'}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Set Footer */}
          <div className="p-4 bg-[#f8f9ff] dark:bg-[#0b1c30]/50 border-t border-[#c6c6cd]/20 dark:border-[#213145] flex items-center justify-between">
            <button
              onClick={() => handleAddSet(activeExerciseIndex)}
              className="text-xs font-semibold text-[#006398] dark:text-[#6ffbbe] flex items-center gap-1.5 hover:underline"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Prescribed Set</span>
            </button>

            {activeExerciseIndex < exercises.length - 1 ? (
              <button
                onClick={() => setActiveExerciseIndex(activeExerciseIndex + 1)}
                className="text-xs font-semibold text-[#0b1c30] dark:text-white flex items-center gap-1 hover:underline"
              >
                <span>Next Movement</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowFinishModal(true)}
                className="text-xs font-bold text-[#009668] dark:text-[#4edea3] flex items-center gap-1 hover:underline"
              >
                <span>All Movements Complete · Finish</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. Complete Session Summary Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#c6c6cd]/40 dark:border-[#213145] shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-[#eff4ff] dark:bg-[#002113] text-[#006398] dark:text-[#6ffbbe] flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-[#0b1c30] dark:text-white">
                Session Finished & Synchronized
              </h3>
              <p className="text-xs text-[#76777d] dark:text-[#7c839b]">
                {session.title} · {session.phase}
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8f9ff] dark:bg-[#0b1c30] p-4 rounded-2xl border border-[#c6c6cd]/20 dark:border-[#213145]">
              <div className="text-center">
                <span className="text-[10px] text-[#76777d] uppercase font-semibold">Duration</span>
                <div className="text-lg font-bold tabular-nums text-[#0b1c30] dark:text-white">
                  {formatTime(elapsedSec)}
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-[#76777d] uppercase font-semibold">Tonnage</span>
                <div className="text-lg font-bold tabular-nums text-[#0b1c30] dark:text-white">
                  {(session.actualVolumeKg || 8400).toLocaleString()} kg
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-[#76777d] uppercase font-semibold">Sets Logged</span>
                <div className="text-lg font-bold tabular-nums text-[#0b1c30] dark:text-white">
                  {completedSetsCount}/{totalSetsCount}
                </div>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-[#76777d] uppercase font-semibold">Est. Strain</span>
                <div className="text-lg font-bold tabular-nums text-[#006398] dark:text-[#6ffbbe]">
                  +14.8
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowFinishModal(false);
                  onFinishSession({
                    ...session,
                    status: 'completed',
                    durationMin: Math.round(elapsedSec / 60),
                  });
                }}
                className="w-full py-3 rounded-xl bg-[#000000] dark:bg-[#6ffbbe] text-white dark:text-[#0b1c30] font-bold text-sm tracking-wide hover:bg-[#131b2e] transition-colors shadow-sm"
              >
                Save to Kinetic Journal
              </button>
              <button
                onClick={() => setShowFinishModal(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#76777d] hover:text-[#0b1c30] dark:hover:text-white transition-colors"
              >
                Continue Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
