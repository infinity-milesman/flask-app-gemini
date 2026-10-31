import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { MobileTabBar } from './components/MobileTabBar';
import { DailyRegimen } from './components/DailyRegimen';
import { ActiveSession } from './components/ActiveSession';
import { ProtocolsView } from './components/ProtocolsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { QuickLogModal } from './components/QuickLogModal';
import { SettingsModal } from './components/SettingsModal';
import {
  INITIAL_PROFILE,
  INITIAL_DAYS,
  INITIAL_PROTOCOLS,
  INITIAL_RECORDS,
  CODEX_EXERCISES,
} from './data/initialData';
import { WorkoutSession, DayRegimen, TrainingProtocol, PersonalRecord, AthleteProfile, Exercise } from './types/kinetic';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('regimen');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-30');
  const [days, setDays] = useState<DayRegimen[]>(INITIAL_DAYS);
  const [protocols, setProtocols] = useState<TrainingProtocol[]>(INITIAL_PROTOCOLS);
  const [records, setRecords] = useState<PersonalRecord[]>(INITIAL_RECORDS);
  const [codexExercises, setCodexExercises] = useState<Omit<Exercise, 'sets'>[]>(CODEX_EXERCISES);
  const [profile, setProfile] = useState<AthleteProfile>(INITIAL_PROFILE);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Active workout execution session
  const defaultTodaySession = INITIAL_DAYS[4].sessions[1]; // Phase II Hypertrophy session
  const [activeSession, setActiveSession] = useState<WorkoutSession>(defaultTodaySession);

  // Modals
  const [isQuickLogOpen, setIsQuickLogOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleStartSession = (session: WorkoutSession) => {
    setActiveSession(session);
    setCurrentTab('active');
  };

  const handleUpdateActiveSession = (updated: WorkoutSession) => {
    setActiveSession(updated);

    // Also update in today's sessions list
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.date === selectedDate) {
          return {
            ...d,
            sessions: d.sessions.map((s) => (s.id === updated.id ? updated : s)),
          };
        }
        return d;
      })
    );
  };

  const handleFinishActiveSession = (finished: WorkoutSession) => {
    setActiveSession(finished);

    // Mark as completed in regimen
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.date === selectedDate) {
          const updatedSessions = d.sessions.map((s) =>
            s.id === finished.id ? finished : s
          );
          return {
            ...d,
            sessions: updatedSessions,
            actualStrain: Math.min(21.0, d.actualStrain + 4.2),
          };
        }
        return d;
      })
    );

    setCurrentTab('regimen');
  };

  const handleToggleHabit = (date: string, habitId: string) => {
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.date === date) {
          return {
            ...d,
            disciplines: d.disciplines.map((h) =>
              h.id === habitId ? { ...h, completed: !h.completed } : h
            ),
          };
        }
        return d;
      })
    );
  };

  const handleSaveQuickLog = (newSession: WorkoutSession) => {
    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d.date === selectedDate) {
          return {
            ...d,
            sessions: [newSession, ...d.sessions],
            actualStrain: Math.min(21.0, d.actualStrain + 3.5),
          };
        }
        return d;
      })
    );
  };

  const handleSelectActiveProtocol = (protocolId: string) => {
    setProtocols((prev) =>
      prev.map((p) => ({
        ...p,
        isActive: p.id === protocolId,
      }))
    );
  };

  const handleAddCustomExercise = (newEx: Omit<Exercise, 'sets'>) => {
    setCodexExercises((prev) => [newEx, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1c30] text-[#0b1c30] dark:text-[#eaf1ff] transition-colors flex flex-col font-sans">
      {/* Top Bar Contract Navigation */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenQuickLog={() => setIsQuickLogOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        hasActiveSession={activeSession.status === 'in-progress'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'regimen' && (
          <DailyRegimen
            days={days}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onStartSession={handleStartSession}
            onToggleHabit={handleToggleHabit}
            onOpenQuickLog={() => setIsQuickLogOpen(true)}
          />
        )}

        {currentTab === 'active' && (
          <ActiveSession
            session={activeSession}
            onUpdateSession={handleUpdateActiveSession}
            onFinishSession={handleFinishActiveSession}
            onBackToRegimen={() => setCurrentTab('regimen')}
          />
        )}

        {currentTab === 'protocols' && (
          <ProtocolsView
            protocols={protocols}
            onSelectActiveProtocol={handleSelectActiveProtocol}
          />
        )}

        {currentTab === 'biometrics' && (
          <AnalyticsView records={records} />
        )}

        {currentTab === 'codex' && (
          <ExerciseLibrary
            exercises={codexExercises}
            onAddCustomExercise={handleAddCustomExercise}
          />
        )}
      </main>

      {/* Fixed Bottom Tab Bar for Mobile Thumb Ergonomics */}
      <MobileTabBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        hasActiveSession={activeSession.status === 'in-progress'}
      />

      {/* Modals */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        onSaveSession={handleSaveQuickLog}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onUpdateProfile={setProfile}
      />
    </div>
  );
}
