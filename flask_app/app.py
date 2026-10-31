"""
Kinetic Clarity — Athletic Progression & Training Studio
Flask + Jinja2 Web Application with full SQLite3 CRUD operations.
Clean, lightweight, and refactored.
"""

from flask import Flask, render_template, request, redirect, url_for, flash
from datetime import datetime
from database import get_db, init_db

app = Flask(__name__)
app.secret_key = "kinetic-clarity-secret-key"

# Ensure database tables exist on startup
init_db()

ATHLETE_PROFILE = {
    "name": "Marcus Vance",
    "handle": "@vance_kinetic",
    "age": 29,
    "weight_kg": 82.5,
    "resting_hr": 45,
    "readiness": 89,
    "strain": 14.2,
    "strain_target": 16.2,
    "hrv": 74,
    "sleep_hours": 8.1,
}

DAYS = [
    {"abbr": "Mon", "day": 26, "active": False, "strain": 16.8, "status": "Done"},
    {"abbr": "Tue", "day": 27, "active": False, "strain": 14.9, "status": "Done"},
    {"abbr": "Wed", "day": 28, "active": False, "strain": 9.4, "status": "Reset"},
    {"abbr": "Thu", "day": 29, "active": False, "strain": 17.1, "status": "Done"},
    {"abbr": "Fri", "day": 30, "active": True, "strain": 14.2, "status": "Today"},
    {"abbr": "Sat", "day": 31, "active": False, "strain": 0.0, "status": "Upcoming"},
    {"abbr": "Sun", "day": 1, "active": False, "strain": 0.0, "status": "Rest"},
]

PROTOCOLS = [
    {
        "id": 1,
        "title": "Kinetic Progression: Periodized Strength",
        "level": "Advanced",
        "weeks": 12,
        "days": 4,
        "active": True,
        "desc": "Compound linear periodization for maximal strength output & posterior chain balance.",
    },
    {
        "id": 2,
        "title": "Sub-Threshold Engine: 10K Pacing",
        "level": "Intermediate",
        "weeks": 8,
        "days": 5,
        "active": False,
        "desc": "Polarized 80/20 aerobic threshold pacing with high-cadence interval surges.",
    },
    {
        "id": 3,
        "title": "Explosive Olympic Clean & Jerk",
        "level": "Elite",
        "weeks": 6,
        "days": 3,
        "active": False,
        "desc": "Rate of force development (RFD), triple extension velocity, and turnover speed.",
    },
    {
        "id": 4,
        "title": "Joint Resilience & Structural Prehab",
        "level": "All Levels",
        "weeks": 4,
        "days": 7,
        "active": False,
        "desc": "Controlled Articular Rotations (CARs) and end-range joint capsule conditioning.",
    },
]


# ==========================================
# 1. READ / INDEX (Daily Regimen)
# ==========================================
@app.route("/")
def index():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM workouts ORDER BY id DESC;")
    workouts = cursor.fetchall()

    cursor.execute("SELECT * FROM habits ORDER BY id ASC;")
    habits = cursor.fetchall()

    # Calculate dynamic total tonnage and calories
    cursor.execute("SELECT SUM(volume_kg), SUM(calories) FROM workouts WHERE status = 'Completed';")
    stats_row = cursor.fetchone()
    total_volume = stats_row[0] or 0
    total_calories = stats_row[1] or 0

    conn.close()

    return render_template(
        "index.html",
        profile=ATHLETE_PROFILE,
        days=DAYS,
        workouts=workouts,
        habits=habits,
        total_volume=total_volume,
        total_calories=total_calories,
        page="regimen",
    )


# ==========================================
# 2. WORKOUTS CRUD
# ==========================================
@app.route("/workouts/create", methods=["POST"])
@app.route("/log-session", methods=["POST"])
def create_workout():
    title = request.form.get("title", "").strip() or "Custom Kinetic Session"
    category = request.form.get("category", "Strength")
    duration = int(request.form.get("duration", 45))
    calories = int(request.form.get("calories", 400))
    volume = int(request.form.get("volume", 0))
    rpe = float(request.form.get("rpe", 8.0))
    scheduled_time = request.form.get("time", datetime.now().strftime("%H:%M"))
    notes = request.form.get("notes", "")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO workouts (title, category, duration_min, calories, volume_kg, rpe, status, scheduled_time, notes)
    VALUES (?, ?, ?, ?, ?, ?, 'Completed', ?, ?);
    """, (title, category, duration, calories, volume, rpe, scheduled_time, notes))
    conn.commit()
    conn.close()

    return redirect(url_for("index"))


@app.route("/workouts/<int:workout_id>/edit")
def edit_workout_form(workout_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workouts WHERE id = ?;", (workout_id,))
    workout = cursor.fetchone()
    conn.close()

    if not workout:
        return redirect(url_for("index"))

    return render_template("edit_workout.html", workout=workout, page="regimen")


@app.route("/workouts/<int:workout_id>/update", methods=["POST"])
def update_workout(workout_id):
    title = request.form.get("title", "").strip()
    category = request.form.get("category", "Strength")
    duration = int(request.form.get("duration", 45))
    calories = int(request.form.get("calories", 400))
    volume = int(request.form.get("volume", 0))
    rpe = float(request.form.get("rpe", 8.0))
    status = request.form.get("status", "Scheduled")
    scheduled_time = request.form.get("time", "12:00")
    notes = request.form.get("notes", "")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE workouts
    SET title = ?, category = ?, duration_min = ?, calories = ?, volume_kg = ?, rpe = ?, status = ?, scheduled_time = ?, notes = ?
    WHERE id = ?;
    """, (title, category, duration, calories, volume, rpe, status, scheduled_time, notes, workout_id))
    conn.commit()
    conn.close()

    return redirect(url_for("index"))


@app.route("/workouts/<int:workout_id>/delete", methods=["POST"])
def delete_workout(workout_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM workouts WHERE id = ?;", (workout_id,))
    conn.commit()
    conn.close()

    return redirect(url_for("index"))


@app.route("/workouts/<int:workout_id>/toggle-status", methods=["POST"])
def toggle_workout_status(workout_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT status FROM workouts WHERE id = ?;", (workout_id,))
    row = cursor.fetchone()
    if row:
        new_status = "Completed" if row["status"] != "Completed" else "In Progress"
        cursor.execute("UPDATE workouts SET status = ? WHERE id = ?;", (new_status, workout_id))
        conn.commit()
    conn.close()

    return redirect(url_for("index"))


# ==========================================
# 3. HABITS CRUD
# ==========================================
@app.route("/habits/create", methods=["POST"])
def create_habit():
    title = request.form.get("title", "").strip()
    target = request.form.get("target", "").strip() or "Daily"
    if title:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO habits (title, target, completed) VALUES (?, ?, 0);", (title, target))
        conn.commit()
        conn.close()
    return redirect(url_for("index"))


@app.route("/toggle-habit/<int:habit_id>")
@app.route("/habits/<int:habit_id>/toggle", methods=["POST", "GET"])
def toggle_habit(habit_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE habits SET completed = CASE WHEN completed = 1 THEN 0 ELSE 1 END WHERE id = ?;", (habit_id,))
    conn.commit()
    conn.close()
    return redirect(url_for("index"))


@app.route("/habits/<int:habit_id>/delete", methods=["POST"])
def delete_habit(habit_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM habits WHERE id = ?;", (habit_id,))
    conn.commit()
    conn.close()
    return redirect(url_for("index"))


# ==========================================
# 4. ACTIVE SESSION VIEW
# ==========================================
@app.route("/active")
def active():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workouts WHERE status = 'In Progress' ORDER BY id DESC LIMIT 1;")
    active_workout = cursor.fetchone()
    if not active_workout:
        cursor.execute("SELECT * FROM workouts ORDER BY id DESC LIMIT 1;")
        active_workout = cursor.fetchone()
    conn.close()

    return render_template(
        "active.html",
        profile=ATHLETE_PROFILE,
        session=active_workout,
        page="active",
    )


# ==========================================
# 5. PROTOCOLS VIEW
# ==========================================
@app.route("/protocols")
def protocols():
    return render_template(
        "protocols.html",
        profile=ATHLETE_PROFILE,
        protocols=PROTOCOLS,
        page="protocols",
    )


# ==========================================
# 6. BIOMETRICS & PERSONAL RECORDS CRUD
# ==========================================
@app.route("/biometrics")
def biometrics():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM personal_records ORDER BY id ASC;")
    records = cursor.fetchall()
    conn.close()

    return render_template(
        "analytics.html",
        profile=ATHLETE_PROFILE,
        records=records,
        page="biometrics",
    )


@app.route("/records/create", methods=["POST"])
def create_record():
    exercise_name = request.form.get("exercise_name", "").strip()
    category = request.form.get("category", "Strength 1RM")
    value = float(request.form.get("value", 0.0))
    unit = request.form.get("unit", "kg")
    improvement = request.form.get("improvement", "+0")
    date_achieved = request.form.get("date_achieved", datetime.now().strftime("%b %Y"))

    if exercise_name and value > 0:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO personal_records (exercise_name, category, value, unit, improvement, date_achieved)
        VALUES (?, ?, ?, ?, ?, ?);
        """, (exercise_name, category, value, unit, improvement, date_achieved))
        conn.commit()
        conn.close()

    return redirect(url_for("biometrics"))


@app.route("/records/<int:record_id>/delete", methods=["POST"])
def delete_record(record_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM personal_records WHERE id = ?;", (record_id,))
    conn.commit()
    conn.close()
    return redirect(url_for("biometrics"))


# ==========================================
# 7. EXERCISE CODEX CRUD
# ==========================================
@app.route("/codex")
def codex():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM exercises ORDER BY id ASC;")
    exercises = cursor.fetchall()
    conn.close()

    return render_template(
        "codex.html",
        profile=ATHLETE_PROFILE,
        exercises=exercises,
        page="codex",
    )


@app.route("/exercises/create", methods=["POST"])
def create_exercise():
    name = request.form.get("name", "").strip()
    pattern = request.form.get("pattern", "Squat")
    equipment = request.form.get("equipment", "Barbell")
    primary_muscle = request.form.get("primary_muscle", "Full Body")
    coaching_cue = request.form.get("coaching_cue", "Maintain neutral spine and full extension.")
    tempo = request.form.get("tempo", "3-1-X-0")
    pr_1rm = request.form.get("pr_1rm", "")

    if name:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
        INSERT INTO exercises (name, pattern, equipment, primary_muscle, coaching_cue, tempo, pr_1rm)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (name, pattern, equipment, primary_muscle, coaching_cue, tempo, pr_1rm))
        conn.commit()
        conn.close()

    return redirect(url_for("codex"))


@app.route("/exercises/<int:exercise_id>/delete", methods=["POST"])
def delete_exercise(exercise_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM exercises WHERE id = ?;", (exercise_id,))
    conn.commit()
    conn.close()
    return redirect(url_for("codex"))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)
