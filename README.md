# CAPACITY CONNECT — Intelligent Organizational Capacity Building Platform 🚀

> **A Next-Generation Capacity Intelligence Platform**  
> Moving beyond generic LMSs to establish a real-time, closed-loop organizational capacity framework:  
> **Competency Gap → Course Recommendation → Trainer Matching → Learning → Assessment → Competency Improvement → Organization Analytics**

---

## 🌟 Core Innovation — Competency Intelligence Engine

1. **5-Tier Competency Taxonomy:**
   $$\text{Beginner (0–20)} \longrightarrow \text{Developing (21–40)} \longrightarrow \text{Proficient (41–60)} \longrightarrow \text{Advanced (61–80)} \longrightarrow \text{Expert (81–100)}$$

2. **Multi-Factor Competency Scoring Formula:**
   $$\text{Competency Score} = 0.50 \times \text{Assessment Avg} + 0.25 \times \text{Progress} + 0.15 \times \text{Skill Relevance} + 0.10 \times \text{Experience}$$

3. **Automated Gap Detection:** Real-time variance tracking against the organizational benchmark ($70\%$). Severity classified into `HIGH (>40%)`, `MEDIUM (20–40%)`, and `LOW (<20%)`.

4. **Explainable AI Trainer Matching Algorithm:**
   $$\text{Match Score} = 0.30 \times \text{Expertise} + 0.20 \times \text{Experience} + 0.15 \times \text{Qualifications} + 0.15 \times \text{Rating} + 0.10 \times \text{Certs} + 0.10 \times \text{Availability}$$
   *Every trainer match provides an interactive "Why Recommended" breakdown of the mathematical factors.*

---

## 👥 User Roles & Features

### 🧑‍🎓 Trainee
* **Competency Radar:** Dynamic radar chart comparing current skills vs 70% organizational target.
* **Skill Gap Identification:** Highlighting priority skill deficits.
* **Smart Course Recommendations:** Relevant curriculums curated to close skill deficits.
* **Explainable Trainer Match:** Transparent match score with factor breakdown.
* **Curriculum Study Center:** Video streams, PDF guides, presentation slide decks.
* **MCQ Assessments:** Timed quizzes with live countdown clock and instant evaluation.
* **Automatic Level Upgrade:** Competency scores update immediately upon passing.
* **Verified Certificates:** Official printable credential with unique certificate ID.

### 🎓 Trainer
* **Instructional Leadership Panel:** Trainees reached, completion velocity, student ratings.
* **Curriculum Studio:** Create courses targeted to specific competencies and difficulty levels.
* **Learning Materials Upload:** Add videos, PDFs, and slide decks to course syllabi.
* **Assessment Studio:** Author timed MCQ questionnaires with correct keys and weights.
* **Student Participation Monitoring:** Real-time progress and completion tracking.
* **Rating & Feedback Intelligence:** Inspect trainee reviews that directly feed the matching engine.

### ⚡ Admin
* **Executive Organization Analytics:** Macro telemetry, competency deficit bar chart, skill tier distribution.
* **Trainer Utilization & Capacity:** Track instructor reach, efficiency, and ratings.
* **User & Role Governance (RBAC):** 1-click approvals/rejections for pending registrations and role reassignment.
* **Course Catalog Management:** Oversight and publish/unpublish toggles.
* **Competency Taxonomy Framework:** Live editor for organizational competencies.
* **Announcements & Broadcasts:** Publish organization-wide alerts and learner achievement celebrations.

---

## 🔑 Demo Credentials (Pre-Seeded)

| Role | Email | Password | Pre-loaded Data |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@capacityconnect.com` | `admin123` | Full org telemetry, user approvals, competency matrix |
| **Trainer** | `priya.sharma@example.com` | `trainer123` | Lead Data Scientist, 4.8 rating, 156 reviews, 12 yrs exp |
| **Trainee** | `rahul.kumar@example.com` | `trainee123` | Active courses, radar chart, certificates |

*(The sidebar also features a quick-switch toolbar allowing instant one-click role switching during demos).*

---

## 🛠️ Technology Stack

* **Frontend & Backend:** Next.js 14/16 (App Router), React 19, TypeScript
* **Styling & UI:** Tailwind CSS, Glassmorphic enterprise dark theme
* **Database & ORM:** SQLite via Prisma ORM (zero-config, portable)
* **Authentication:** NextAuth.js (Role-based JWT sessions)
* **Data Visualization:** Recharts (Radar charts, Bar charts, Donut charts)

---

## 🚀 Quick Start Guide

```bash
# 1. Clone the repository
git clone https://github.com/jaswanth0108/CAPACITY-CONNECT.git
cd CAPACITY-CONNECT

# 2. Install dependencies
npm install

# 3. Setup database schema & seed demo data
npx prisma db push
npx tsx prisma/seed.ts

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or port displayed) in your browser.
