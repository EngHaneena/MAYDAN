# MAYDAN | ميدان — AI-Powered Co-Op Matching Platform 🚀

> **"من الجامعة إلى الميدان."**
> ميدان يحوّل احتياجات الشركات إلى فرص تعاونية حقيقية، ويربطها بالطلاب الأنسب باستخدام الذكاء الاصطناعي.

---

## 🌟 Key Features

1. **🚀 MAYDAN Landing Page (`#view-landing-page`)**:
   - Hero section showcasing platform value proposition and 4-step interactive journey: *Company Need → AI Opportunity → AI Matching → Application & Selection*.
   - Primary CTA (`ابدأ الآن`) and Secondary CTA (`اكتشف الفرص`).

2. **🔐 Firebase Authentication & Role Signup (`#view-auth`)**:
   - Role-based registration: **"وش نوع حسابك؟"** (🎓 `طالب` vs 🏢 `شركة`).
   - Integrated with Firebase Auth and Firestore `users` collection.

3. **👤 Editable Student & Company Profiles**:
   - **Student Profile**: Personal Info (**حنين هيثم القصير**), University (**جامعة القصيم**), Major (**هندسة الحاسب**), GPA (`3.92 / 4.00`), Skills, Projects, Certificates, and CV Upload with **`AI Profile Summary`** extraction.
   - **Company Profile**: Name (**شركة الأساليب الذكية**), Industry, Description, Location (**القصيم، السعودية**), Work Type (**حضوري**).

4. **🧠 Explainable AI Match Scoring**:
   - Matches students with company opportunities based on skills, academic major, and previous projects.
   - Provides explainable reasons (**`ليش هذه الفرصة تناسبك؟`**):
     - `✓ Verilog/VHDL and C++ skills strongly match requirements (100%)`
     - `✓ Your Computer Engineering major at Qassim University is directly relevant`
     - `✓ Your previous project (Digital Chip Logic Simulator) is related`
     - `△ Power BI / hardware testing could be improved`

5. **📍 Location & Work Type Matching & Filters**:
   - Features opportunity filters by Category, Location (`القصيم`, `الرياض`), and Work Type (`حضوري`, `عن بعد`, `هجين`).

6. **🔥 Firebase Project `maydan-b04ca` Firestore Integration**:
   - Complete Firestore Security Rules (`firestore.rules`) enforcing authentication, document ownership, and role-based permissions across `users`, `opportunities`, and `applications`.

---

## 📁 Repository Structure

```text
├── index.html              # Main Single Page Application (SPA) entrypoint
├── firestore.rules         # Production Firestore Security Rules
├── css/
│   └── custom.css          # Custom styling and glassmorphism UI components
└── js/
    ├── firebase-config.js  # Firebase Project & Firestore SDK initialization
    ├── firebase-auth.js    # Auth, Signup with Role Selection & Firestore Persistence
    ├── mock-data.js        # Seed data (Haneen Al-Kaseer, Qassim Univ, Smart Methods)
    ├── ai-engine.js        # AI CV Parser & Explainable Match Calculator
    ├── store.js            # Reactive state management with localStorage & Firestore sync
    └── app.js              # Single Page Application Router & Controllers
```

---

## ⚡ Quick Start

Open `index.html` in any web browser or serve locally:

```bash
# Simply double click index.html or open via local server
python -m http.server 8000
```

Access in browser at `http://localhost:8000`.

---

## 🛡️ License

© 2026 MAYDAN (ميدان) — All rights reserved.
