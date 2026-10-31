import React, { useState } from 'react';
import { X, Check, Flame, Clock, Dumbbell } from 'lucide-react';
import { WorkoutSession, WorkoutCategory } from '../types/kinetic';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSession: (session: WorkoutSession) => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  onSaveSession,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WorkoutCategory>('strength');
  const [durationMin, setDurationMin] = useState<number>(50);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(450);
  const [volumeKg, setVolumeKg] = useState<number>(6800);
  const [rpe, setRpe] = useState<number>(8.0);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newSession: WorkoutSession = {
      id: `manual-sess-${Date.now()}`,
      title: title.trim(),
      category,
      phase: 'Manual Kinetic Log',
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMin,
      caloriesBurned,
      actualVolumeKg: category === 'strength' || category === 'olympic' ? volumeKg : undefined,
      status: 'completed',
      rpeTarget: rpe,
      actualRpe: rpe,
      notes: notes.trim(),
      exercises: [],
    };

    onSaveSession(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#131b2e] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-[#c6c6cd]/40 dark:border-[#213145] shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white">
              Log Athletic Session
            </h3>
            <p className="text-xs text-[#76777d]">Record finished workout into your kinetic journal.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0b1c30] flex items-center justify-center text-[#76777d] hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#76777d] block mb-1">Session Title</label>
            <input
              type="text"
              required
              placeholder="e.g. 5x5 Heavy Squats & RDLs"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white text-sm focus:ring-2 focus:ring-[#006398]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#76777d] block mb-1">Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white"
              >
                <option value="strength">Strength</option>
                <option value="interval">Interval Conditioning</option>
                <option value="aerobic">Aerobic Endurance</option>
                <option value="olympic">Olympic Weightlifting</option>
                <option value="mobility">Restorative Mobility</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-[#76777d] block mb-1">Duration (min)</label>
              <input
                type="number"
                min="5"
                max="360"
                value={durationMin}
                onChange={(e) => setDurationMin(parseInt(e.target.value, 10) || 45)}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#76777d] block mb-1">Estimated Calories</label>
              <input
                type="number"
                value={caloriesBurned}
                onChange={(e) => setCaloriesBurned(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white"
              />
            </div>

            <div>
              <label className="font-semibold text-[#76777d] block mb-1">Exertion (RPE 1-10)</label>
              <select
                value={rpe}
                onChange={(e) => setRpe(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white"
              >
                <option value="6.0">6.0 (Light Aerobic)</option>
                <option value="7.0">7.0 (Moderate Strain)</option>
                <option value="8.0">8.0 (Hard Work)</option>
                <option value="8.5">8.5 (Heavy Target)</option>
                <option value="9.0">9.0 (Near Limit)</option>
                <option value="10.0">10.0 (Max Exertion)</option>
              </select>
            </div>
          </div>

          {(category === 'strength' || category === 'olympic') && (
            <div>
              <label className="font-semibold text-[#76777d] block mb-1">Total Volume Lifted (kg)</label>
              <input
                type="number"
                step="50"
                value={volumeKg}
                onChange={(e) => setVolumeKg(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white font-mono"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-[#76777d] block mb-1">Notes & Biomechanical Feedback</label>
            <textarea
              rows={2}
              placeholder="Felt strong out of the hole, bar path smooth..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-[#c6c6cd]/50 font-semibold text-[#76777d]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-[#000000] dark:bg-[#6ffbbe] text-white dark:text-[#0b1c30] font-bold text-xs"
            >
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
