# Kinetic Clarity — Flask & SQLite3 Edition

A clean, refactored, lightweight athletic training application built with Python, Flask, Jinja2 templating, and native SQLite3 database with complete CRUD operations.

---

## Features & CRUD Architecture

### 1. Workouts (`workouts` table)
- **Create**: Add new workouts via modal or `POST /workouts/create` (title, category, duration, calories, volume, RPE, time, notes).
- **Read**: Listed on the Regimen dashboard (`GET /`), dynamic volume tonnage and calorie totals.
- **Update**: Edit existing workout details (`GET /workouts/<id>/edit`, `POST /workouts/<id>/update`) or toggle status (`POST /workouts/<id>/toggle-status`).
- **Delete**: Remove workout records (`POST /workouts/<id>/delete`).

### 2. Daily Athletic Disciplines (`habits` table)
- **Create**: Quick add form at the bottom of the regimen (`POST /habits/create`).
- **Read**: Live checklist cards.
- **Update**: Tap to toggle completed state (`GET /toggle-habit/<id>`).
- **Delete**: Quick delete button (`POST /habits/<id>/delete`).

### 3. Personal Records Codex (`personal_records` table)
- **Create**: Log verified PR with weight/time and improvement delta (`POST /records/create`).
- **Read**: Biometrics & Progression studio (`GET /biometrics`).
- **Delete**: Remove PR (`POST /records/<id>/delete`).

### 4. Movement Codex (`exercises` table)
- **Create**: Add custom exercises with pattern, equipment, and coaching cue (`POST /exercises/create`).
- **Read**: Filterable movement library (`GET /codex`).
- **Delete**: Remove exercise from codex (`POST /exercises/<id>/delete`).

---

## Local Setup & Execution

1. Navigate to the `flask_app` directory:
```bash
cd flask_app
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Launch the application:
```bash
python app.py
```

4. Open your browser:
Navigate to `http://localhost:3000` (or `http://localhost:5000`).

The SQLite3 database `kinetic.db` is initialized and seeded automatically on first launch.
