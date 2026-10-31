import React, { useState } from 'react';
import { Search, Plus, Filter, BookOpen, X, Check, Dumbbell, Zap } from 'lucide-react';
import { Exercise } from '../types/kinetic';

interface ExerciseLibraryProps {
  exercises: Omit<Exercise, 'sets'>[];
  onAddCustomExercise: (newEx: Omit<Exercise, 'sets'>) => void;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  exercises,
  onAddCustomExercise,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPattern, setSelectedPattern] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [activeModalExercise, setActiveModalExercise] = useState<Omit<Exercise, 'sets'> | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New exercise form states
  const [newExName, setNewExName] = useState('');
  const [newExPattern, setNewExPattern] = useState<'Squat' | 'Hinge' | 'Push' | 'Pull' | 'Lunge' | 'Carry' | 'Conditioning' | 'Prehab'>('Squat');
  const [newExEquipment, setNewExEquipment] = useState<'Barbell' | 'Dumbbell' | 'Kettlebell' | 'Ergometer' | 'Bodyweight' | 'Cable'>('Barbell');
  const [newExPrimaryMuscle, setNewExPrimaryMuscle] = useState('');
  const [newExCue, setNewExCue] = useState('');
  const [newExTempo, setNewExTempo] = useState('3-1-X-0');

  const patterns = ['All', 'Squat', 'Hinge', 'Push', 'Pull', 'Conditioning', 'Prehab'];
  const equipments = ['All', 'Barbell', 'Dumbbell', 'Bodyweight', 'Ergometer'];

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPattern = selectedPattern === 'All' || ex.movementPattern === selectedPattern;
    const matchesEquip = selectedEquipment === 'All' || ex.equipment === selectedEquipment;
    return matchesSearch && matchesPattern && matchesEquip;
  });

  const handleCreateExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim() || !newExPrimaryMuscle.trim()) return;

    const newExercise: Omit<Exercise, 'sets'> = {
      id: `custom-ex-${Date.now()}`,
      name: newExName.trim(),
      category: 'strength',
      movementPattern: newExPattern,
      equipment: newExEquipment,
      primaryMuscle: newExPrimaryMuscle.trim(),
      secondaryMuscles: ['Core'],
      coachingCue: newExCue.trim() || 'Execute with full range of motion and core bracing.',
      tempo: newExTempo || '3-1-X-0',
      pr1RM: 'Testing Pending',
    };

    onAddCustomExercise(newExercise);
    setShowAddModal(false);
    // Reset form
    setNewExName('');
    setNewExPrimaryMuscle('');
    setNewExCue('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header & Actions */}
      <div className="border-b border-[#c6c6cd]/30 dark:border-[#213145] pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#006398] dark:text-[#6ffbbe] mb-1">
            <span>Movement Codex</span>
            <span aria-hidden="true">·</span>
            <span>Biomechanical Standards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0b1c30] dark:text-[#ffffff] text-balance">
            Athletic Movement Library
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-10 px-5 rounded-xl bg-[#000000] dark:bg-[#6ffbbe] text-white dark:text-[#0b1c30] text-xs font-bold tracking-wide flex items-center gap-2 hover:bg-[#131b2e] dark:hover:bg-[#4edea3] transition-all shadow-sm active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Custom Movement</span>
        </button>
      </div>

      {/* 2. Filters & Search Strip */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#76777d]" />
          <input
            type="text"
            placeholder="Search movements or target muscles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c6c6cd]/40 dark:border-[#213145] bg-white dark:bg-[#131b2e] text-sm text-[#0b1c30] dark:text-white placeholder-[#76777d] focus:outline-none focus:ring-2 focus:ring-[#006398]"
          />
        </div>

        {/* Pattern Filter Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {patterns.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPattern(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedPattern === p
                  ? 'bg-[#000000] dark:bg-[#ffffff] text-white dark:text-[#0b1c30] shadow-sm'
                  : 'bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/30 dark:border-[#213145] text-[#45464d] dark:text-[#bec6e0] hover:text-[#0b1c30]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((ex) => (
          <div
            key={ex.id}
            onClick={() => setActiveModalExercise(ex)}
            className="p-5 rounded-2xl bg-white dark:bg-[#131b2e] border border-[#c6c6cd]/40 dark:border-[#213145] hover:border-[#006398] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#76777d] dark:text-[#7c839b] mb-2 font-semibold uppercase tracking-wider">
                <span>{ex.movementPattern} · {ex.equipment}</span>
                {ex.pr1RM && (
                  <span className="text-[#009668] dark:text-[#4edea3] font-mono tabular-nums">
                    PR {ex.pr1RM}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-[#0b1c30] dark:text-white group-hover:text-[#006398] dark:group-hover:text-[#6ffbbe] transition-colors leading-snug">
                {ex.name}
              </h3>

              <p className="text-xs text-[#45464d] dark:text-[#bec6e0] mt-2 line-clamp-2">
                {ex.coachingCue}
              </p>
            </div>

            <div className="pt-3 border-t border-[#c6c6cd]/20 dark:border-[#213145] flex items-center justify-between text-xs text-[#76777d]">
              <span>Target: <strong className="font-semibold text-[#0b1c30] dark:text-white">{ex.primaryMuscle}</strong></span>
              <span className="font-mono tabular-nums">Tempo {ex.tempo}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Exercise Detail Modal */}
      {activeModalExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#c6c6cd]/40 dark:border-[#213145] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#006398] dark:text-[#6ffbbe]">
                  {activeModalExercise.movementPattern} · {activeModalExercise.equipment}
                </span>
                <h3 className="text-2xl font-bold text-[#0b1c30] dark:text-white mt-1">
                  {activeModalExercise.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalExercise(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0b1c30] flex items-center justify-center text-[#76777d] hover:text-black dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If has image */}
            {activeModalExercise.imagePath && (
              <div className="w-full h-48 rounded-2xl overflow-hidden border border-[#c6c6cd]/30 dark:border-[#213145]">
                <img
                  src={activeModalExercise.imagePath}
                  alt={activeModalExercise.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Cues & Mechanics */}
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-[#0b1c30] dark:text-white uppercase tracking-wider text-[11px] block mb-1">
                  Kinetic Coaching Cue
                </span>
                <p className="text-[#45464d] dark:text-[#bec6e0] leading-relaxed bg-[#f8f9ff] dark:bg-[#0b1c30] p-3.5 rounded-xl border border-[#c6c6cd]/20 dark:border-[#213145]">
                  {activeModalExercise.coachingCue}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#f8f9ff] dark:bg-[#0b1c30] rounded-xl border border-[#c6c6cd]/20 dark:border-[#213145]">
                  <span className="text-[10px] text-[#76777d] uppercase font-semibold block">Primary Muscle</span>
                  <span className="text-sm font-bold text-[#0b1c30] dark:text-white">{activeModalExercise.primaryMuscle}</span>
                </div>
                <div className="p-3 bg-[#f8f9ff] dark:bg-[#0b1c30] rounded-xl border border-[#c6c6cd]/20 dark:border-[#213145]">
                  <span className="text-[10px] text-[#76777d] uppercase font-semibold block">Prescribed Tempo</span>
                  <span className="text-sm font-mono font-bold text-[#006398] dark:text-[#6ffbbe]">{activeModalExercise.tempo}</span>
                </div>
              </div>

              {activeModalExercise.secondaryMuscles && (
                <div>
                  <span className="font-bold text-[#0b1c30] dark:text-white uppercase tracking-wider text-[11px] block mb-1">
                    Secondary Stabilizers
                  </span>
                  <p className="text-[#76777d]">
                    {activeModalExercise.secondaryMuscles.join(' · ')}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveModalExercise(null)}
              className="w-full py-3 rounded-xl bg-[#000000] dark:bg-[#6ffbbe] text-white dark:text-[#0b1c30] font-bold text-xs tracking-wide hover:bg-[#131b2e] transition-colors"
            >
              Close Movement Details
            </button>
          </div>
        </div>
      )}

      {/* 5. Add Custom Movement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#131b2e] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-[#c6c6cd]/40 dark:border-[#213145] shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white">
                Add Custom Athletic Movement
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0b1c30] flex items-center justify-center text-[#76777d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExercise} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#76777d] block mb-1">Movement Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deficit Trap Bar Deadlift"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white text-sm focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#76777d] block mb-1">Pattern</label>
                  <select
                    value={newExPattern}
                    onChange={(e: any) => setNewExPattern(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white"
                  >
                    <option value="Squat">Squat</option>
                    <option value="Hinge">Hinge</option>
                    <option value="Push">Push</option>
                    <option value="Pull">Pull</option>
                    <option value="Lunge">Lunge</option>
                    <option value="Conditioning">Conditioning</option>
                    <option value="Prehab">Prehab</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#76777d] block mb-1">Equipment</label>
                  <select
                    value={newExEquipment}
                    onChange={(e: any) => setNewExEquipment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white"
                  >
                    <option value="Barbell">Barbell</option>
                    <option value="Dumbbell">Dumbbell</option>
                    <option value="Kettlebell">Kettlebell</option>
                    <option value="Bodyweight">Bodyweight</option>
                    <option value="Ergometer">Ergometer</option>
                    <option value="Cable">Cable</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#76777d] block mb-1">Primary Target Muscle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Posterior Chain & Glutes"
                  value={newExPrimaryMuscle}
                  onChange={(e) => setNewExPrimaryMuscle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white text-sm focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#76777d] block mb-1">Coaching Form Cue</label>
                <textarea
                  rows={2}
                  placeholder="Key technical cue for optimal kinetic efficiency..."
                  value={newExCue}
                  onChange={(e) => setNewExCue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/50 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white text-sm focus:ring-2 focus:ring-[#006398]"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-[#c6c6cd]/50 font-semibold text-[#76777d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-[#000000] dark:bg-[#6ffbbe] text-white dark:text-[#0b1c30] font-bold text-xs"
                >
                  Save Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
