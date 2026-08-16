// LocalStorage Persistent Store with Firebase Integration for MAYDAN (ميدان)

window.MAYDAN_STORE = (function() {
  const STORAGE_KEY = "MAYDAN_APP_STATE_V10"; // Updated to V10 for Landing Page, Auth & Editable Profile persistence

  let state = {
    role: "company", // "company" or "student"
    companyInfo: null,
    students: [],
    opportunities: [],
    applications: [],
    shortlisted: [] // list of { studentId, opportunityId }
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        state = JSON.parse(saved);
        return;
      }
    } catch (e) {
      console.warn("Could not load local storage, initializing fresh seed state.", e);
    }
    resetToDefaultSeed();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Could not save to local storage", e);
    }
  }

  function resetToDefaultSeed() {
    if (!window.MAYDAN_MOCK) return;
    state = {
      role: "company",
      companyInfo: JSON.parse(JSON.stringify(window.MAYDAN_MOCK.companyInfo)),
      students: JSON.parse(JSON.stringify(window.MAYDAN_MOCK.students)),
      opportunities: JSON.parse(JSON.stringify(window.MAYDAN_MOCK.opportunities)),
      applications: JSON.parse(JSON.stringify(window.MAYDAN_MOCK.initialApplications)),
      shortlisted: [
        { studentId: "student-1", opportunityId: "opp-tech-teach" },
        { studentId: "student-1", opportunityId: "opp-1" }
      ]
    };
    saveState();
  }

  // Initialize immediately
  loadState();

  return {
    init: function() {
      loadState();
    },

    resetDemoData: function() {
      resetToDefaultSeed();
    },

    getRole: function() {
      return state.role || "company";
    },

    setRole: function(newRole) {
      state.role = newRole;
      saveState();
    },

    getCompanyInfo: function() {
      return state.companyInfo;
    },

    getStudents: function() {
      return state.students || [];
    },

    getStudentById: function(studentId) {
      return (state.students || []).find(s => s.id === studentId) || state.students[0];
    },

    updateStudentCv: function(studentId, fileName, extractedData) {
      const student = this.getStudentById(studentId);
      if (student) {
        student.cvUploaded = true;
        student.cvName = fileName;
        student.cvUploadDate = new Date().toLocaleDateString("ar-SA") + " " + new Date().toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' });
        
        if (extractedData && extractedData.skills) {
          const mergedSkills = new Set([...(student.skills || []), ...extractedData.skills]);
          student.skills = Array.from(mergedSkills);
        }
        
        if (extractedData && extractedData.summary) {
          student.aiCvSummary = extractedData.summary;
        }

        saveState();

        if (window.MAYDAN_FIREBASE) {
          window.MAYDAN_FIREBASE.saveStudentProfile(student);
        }
      }
      return student;
    },

    getOpportunities: function() {
      return state.opportunities || [];
    },

    getOpportunityById: function(oppId) {
      return (state.opportunities || []).find(o => o.id === oppId);
    },

    addOpportunity: function(opp) {
      state.opportunities.unshift(opp);
      if (state.companyInfo && state.companyInfo.metrics) {
        state.companyInfo.metrics.publishedOpportunities += 1;
      }
      saveState();

      if (window.MAYDAN_FIREBASE) {
        window.MAYDAN_FIREBASE.saveOpportunity(opp);
      }
    },

    getApplications: function() {
      return state.applications || [];
    },

    getStudentApplications: function(studentId) {
      return (state.applications || []).filter(a => a.studentId === studentId);
    },

    getOpportunityApplications: function(oppId) {
      return (state.applications || []).filter(a => a.opportunityId === oppId);
    },

    addApplication: function(applicationData) {
      const existing = state.applications.find(
        a => a.opportunityId === applicationData.opportunityId && a.studentId === applicationData.studentId
      );
      if (existing) {
        existing.status = "قيد المراجعة";
        existing.appliedDate = new Date().toISOString().split("T")[0];
        saveState();
        if (window.MAYDAN_FIREBASE) {
          window.MAYDAN_FIREBASE.saveApplication(existing);
        }
        return existing;
      }

      const newApp = {
        id: "app-" + Date.now(),
        opportunityId: applicationData.opportunityId,
        studentId: applicationData.studentId || "student-1",
        studentName: applicationData.studentName || "حنين هيثم القصير",
        opportunityTitle: applicationData.opportunityTitle,
        companyName: applicationData.companyName || "شركة الأساليب الذكية (Smart Methods)",
        matchScore: applicationData.matchScore || 95,
        appliedDate: new Date().toISOString().split("T")[0],
        status: "قيد المراجعة",
        message: applicationData.message || ""
      };

      state.applications.unshift(newApp);

      if (state.companyInfo && state.companyInfo.metrics) {
        state.companyInfo.metrics.totalApplications += 1;
      }
      const opp = state.opportunities.find(o => o.id === applicationData.opportunityId);
      if (opp) {
        opp.applicantsCount = (opp.applicantsCount || 0) + 1;
      }

      saveState();

      if (window.MAYDAN_FIREBASE) {
        window.MAYDAN_FIREBASE.saveApplication(newApp);
      }

      return newApp;
    },

    updateApplicationStatus: function(appId, newStatus) {
      const app = state.applications.find(a => a.id === appId);
      if (app) {
        app.status = newStatus;
        saveState();
        if (window.MAYDAN_FIREBASE) {
          window.MAYDAN_FIREBASE.saveApplication(app);
        }
      }
    },

    isShortlisted: function(studentId, oppId) {
      return state.shortlisted.some(s => s.studentId === studentId && (s.opportunityId === oppId || !oppId));
    },

    toggleShortlist: function(studentId, oppId) {
      const idx = state.shortlisted.findIndex(s => s.studentId === studentId && (s.opportunityId === oppId || !oppId));
      if (idx >= 0) {
        state.shortlisted.splice(idx, 1);
      } else {
        state.shortlisted.push({ studentId, opportunityId: oppId || "opp-1" });
      }
      saveState();
    },

    selectCandidate: function(studentId, oppId) {
      let app = state.applications.find(a => a.studentId === studentId && a.opportunityId === oppId);
      const student = this.getStudentById(studentId);
      const opp = this.getOpportunityById(oppId);

      if (!app) {
        app = this.addApplication({
          opportunityId: oppId,
          studentId: studentId,
          studentName: student ? student.name : "حنين هيثم القصير",
          opportunityTitle: opp ? opp.title : "Digital Chip Design & Microelectronics",
          companyName: opp ? opp.company : "شركة تيك آند تيتش (TECH AND TEACH)",
          matchScore: studentId === "student-1" ? 95 : 85
        });
      }

      app.status = "مقبول";
      saveState();
      if (window.MAYDAN_FIREBASE) {
        window.MAYDAN_FIREBASE.saveApplication(app);
      }
    }
  };
})();
