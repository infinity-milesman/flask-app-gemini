import React from 'react';
import { X, Check, Sliders, User, Bell, Shield, Gauge } from 'lucide-react';
import { AthleteProfile } from '../types/kinetic';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: AthleteProfile;
  onUpdateProfile: (updatedProfile: AthleteProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#131b2e] w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-[#c6c6cd]/40 dark:border-[#213145] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#c6c6cd]/20 dark:border-[#213145] pb-4">
          <div>
            <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white">
              Athlete Rig & Bio-Settings
            </h3>
            <p className="text-xs text-[#76777d]">Personal physiological benchmarks and training presets.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0b1c30] flex items-center justify-center text-[#76777d] hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Athlete Bio Profile */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#006398] dark:text-[#6ffbbe] block">
            Physiological Parameters
          </span>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[#76777d] block mb-1">Athlete Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onUpdateProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/40 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white font-semibold"
              />
            </div>
            <div>
              <label className="text-[#76777d] block mb-1">Body Mass (kg)</label>
              <input
                type="number"
                step="0.5"
                value={profile.weightKg}
                onChange={(e) => onUpdateProfile({ ...profile, weightKg: parseFloat(e.target.value) || 75 })}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/40 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white font-mono font-semibold"
              />
            </div>

            <div>
              <label className="text-[#76777d] block mb-1">Resting Heart Rate (bpm)</label>
              <input
                type="number"
                value={profile.restingHr}
                onChange={(e) => onUpdateProfile({ ...profile, restingHr: parseInt(e.target.value, 10) || 50 })}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/40 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white font-mono font-semibold"
              />
            </div>

            <div>
              <label className="text-[#76777d] block mb-1">Max Heart Rate (bpm)</label>
              <input
                type="number"
                value={profile.maxHr}
                onChange={(e) => onUpdateProfile({ ...profile, maxHr: parseInt(e.target.value, 10) || 190 })}
                className="w-full px-3 py-2 rounded-xl border border-[#c6c6cd]/40 dark:border-[#213145] bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-white font-mono font-semibold"
              />
            </div>
          </div>
        </div>

        {/* 2. Units & Preferences */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#006398] dark:text-[#6ffbbe] block">
            System & Training Defaults
          </span>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9ff] dark:bg-[#0b1c30] border border-[#c6c6cd]/30 dark:border-[#213145] text-xs">
            <div>
              <span className="font-bold text-[#0b1c30] dark:text-white block">Measurement System</span>
              <span className="text-[#76777d]">Kilograms (kg) and kilometers (km)</span>
            </div>
            <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#131b2e] rounded-lg border border-[#c6c6cd]/30">
              <button
                onClick={() => onUpdateProfile({ ...profile, unitPreference: 'metric' })}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  profile.unitPreference === 'metric' ? 'bg-[#000000] text-white dark:bg-white dark:text-black' : 'text-[#76777d]'
                }`}
              >
                Metric
              </button>
              <button
                onClick={() => onUpdateProfile({ ...profile, unitPreference: 'imperial' })}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  profile.unitPreference === 'imperial' ? 'bg-[#000000] text-white dark:bg-white dark:text-black' : 'text-[#76777d]'
                }`}
              >
                Imperial
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9ff] dark:bg-[#0b1c30] border border-[#c6c6cd]/30 dark:border-[#213145] text-xs">
            <div>
              <span className="font-bold text-[#0b1c30] dark:text-white block">Default Rest Interval</span>
              <span className="text-[#76777d]">Auto-countdown between working sets</span>
            </div>
            <select
              value={profile.defaultRestSec}
              onChange={(e) => onUpdateProfile({ ...profile, defaultRestSec: parseInt(e.target.value, 10) })}
              className="px-3 py-1.5 rounded-lg border border-[#c6c6cd]/40 dark:border-[#213145] bg-white dark:bg-[#131b2e] font-mono text-xs font-semibold text-[#0b1c30] dark:text-white"
            >
              <option value="60">60 seconds</option>
              <option value="90">90 seconds</option>
              <option value="120">120 seconds</option>
              <option value="180">180 seconds</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f9ff] dark:bg-[#0b1c30] border border-[#c6c6cd]/30 dark:border-[#213145] text-xs">
            <div>
              <span className="font-bold text-[#0b1c30] dark:text-white block">Acoustic Interval Cues</span>
              <span className="text-[#76777d]">Auditory alerts on rest countdown finish</span>
            </div>
            <button
              onClick={() => onUpdateProfile({ ...profile, soundAlerts: !profile.soundAlerts })}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                profile.soundAlerts ? 'bg-[#009668]' : 'bg-[#c6c6cd] dark:bg-slate-700'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                profile.soundAlerts ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#000000] dark:bg-[#6ffbbe] text-white dark:text-[#0b1c30] font-bold text-xs tracking-wide hover:bg-[#131b2e] transition-colors shadow-sm"
        >
          Save & Synchronize Rig
        </button>
      </div>
    </div>
  );
};
