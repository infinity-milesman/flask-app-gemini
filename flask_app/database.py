"""
Database configuration and SQLite3 helper utilities for Kinetic Clarity.
Full CRUD support for Workouts, Habits, Exercises, and Personal Records.
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'kinetic.db')


def get_db():
    """Returns a SQLite connection with Row factory enabled for dictionary-like access."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initializes tables and seeds initial athletic records if not present."""
    conn = get_db()
    cursor = conn.cursor()

    # 1. Workouts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        duration_min INTEGER DEFAULT 45,
        calories INTEGER DEFAULT 400,
        volume_kg INTEGER DEFAULT 0,
        rpe REAL DEFAULT 8.0,
        status TEXT DEFAULT 'Scheduled',
        scheduled_time TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Habits Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        target TEXT,
        completed INTEGER DEFAULT 0
    );
    """)

    # 3. Exercises Table (Codex)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        pattern TEXT NOT NULL,
        equipment TEXT NOT NULL,
        primary_muscle TEXT,
        coaching_cue TEXT,
        tempo TEXT DEFAULT '3-1-X-0',
        pr_1rm TEXT
    );
    """)

    # 4. Personal Records Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS personal_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_name TEXT NOT NULL,
        category TEXT,
        value REAL NOT NULL,
        unit TEXT NOT NULL,
        improvement TEXT,
        date_achieved TEXT
    );
    """)

    conn.commit()

    # Seed data if empty
    cursor.execute("SELECT COUNT(*) FROM workouts;")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO workouts (title, category, duration_min, calories, volume_kg, rpe, status, scheduled_time, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, [
            ("Zone 2 Aerobic Base & Cadence", "Aerobic", 45, 410, 0, 6.0, "Completed", "06:45", "Smooth 180 SPM cadence on track"),
            ("Phase II · Hypertrophy & Posterior Chain", "Strength", 60, 580, 8400, 8.5, "In Progress", "17:30", "Heavy high-bar squat waves + dumbbell RDLs"),
            ("Downregulation & Tissue Mobilization", "Mobility", 20, 80, 0, 3.0, "Scheduled", "20:30", "Diaphragmatic breathing and 90/90 hip flow"),
            ("Threshold 6x800m Track Intervals", "Interval", 50, 520, 0, 8.5, "Completed", "07:00", "Lactate threshold testing"),
        ])

    cursor.execute("SELECT COUNT(*) FROM habits;")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO habits (title, target, completed)
        VALUES (?, ?, ?);
        """, [
            ("Target Hydration", "3.5 L", 1),
            ("Protein Target", "180 g", 1),
            ("Joint Prehab CARs", "15 min", 1),
            ("Cold Immersion / Contrast", "4 min @ 8°C", 0),
            ("Sleep Hygiene Routine", ">8h sleep", 0),
        ])

    cursor.execute("SELECT COUNT(*) FROM exercises;")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO exercises (name, pattern, equipment, primary_muscle, coaching_cue, tempo, pr_1rm)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """, [
            ("Barbell High-Bar Back Squat", "Squat", "Barbell", "Quadriceps", "Drive mid-foot through floor, maintain thoracic extension.", "3-1-X-0", "185 kg"),
            ("Conventional Deadlift", "Hinge", "Barbell", "Hamstrings", "Remove slack from bar before knee push-away. Lockout glutes.", "2-1-X-0", "225 kg"),
            ("Romanian Deadlift (Dumbbell)", "Hinge", "Dumbbell", "Hamstrings", "Hips glide back horizontally, soft knees, deep stretch.", "3-1-1-0", "48 kg/side"),
            ("Chest-Supported Row", "Pull", "Dumbbell", "Rhomboids", "Drive elbows back at 45 degrees, full contraction pause.", "2-0-1-1", "42 kg/side"),
            ("Clean & Push Press", "Push", "Barbell", "Full Chain", "Explosive triple extension into active shoulder overhead drive.", "Explosive", "120 kg"),
            ("Concept2 500m Repeats", "Conditioning", "Ergometer", "Lactate Base", "Legs 60%, hips 20%, arms 20%. Smooth recovery slide.", "1:38 /500m", "1:24.2"),
        ])

    cursor.execute("SELECT COUNT(*) FROM personal_records;")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO personal_records (exercise_name, category, value, unit, improvement, date_achieved)
        VALUES (?, ?, ?, ?, ?, ?);
        """, [
            ("Barbell High-Bar Back Squat", "Strength 1RM", 185.0, "kg", "+7.5 kg", "Oct 2026"),
            ("Conventional Deadlift", "Strength 1RM", 225.0, "kg", "+10.0 kg", "Sep 2026"),
            ("Clean & Push Press", "Strength 1RM", 120.0, "kg", "+5.0 kg", "Oct 2026"),
            ("5,000m Track Time Trial", "Endurance", 18.42, "min", "-24 sec", "Oct 2026"),
            ("Weekly Volume Tonnage", "Volume", 38450.0, "kg", "+4.2%", "Week 42"),
        ])

    conn.commit()
    conn.close()


# Initialize database automatically when imported
if not os.path.exists(DB_PATH):
    init_db()
