// LocalStorage Persistent Store with Firebase Integration for MAYDAN (ميدان)

window.MAYDAN_STORE = (function() {
  const STORAGE_KEY = "MAYDAN_APP_STATE_V26";

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
        // Ensure student count and names match latest mock data
        if (window.MAYDAN_MOCK && (!state.students || state.students.length < window.MAYDAN_MOCK.students.length)) {
          resetToDefaultSeed();
        }
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
    const mock = window.MAYDAN_MOCK;
    state = {
      role: "company",
      companyInfo: JSON.parse(JSON.stringify(mock.companyInfo || {})),
      students: JSON.parse(JSON.stringify(mock.students || [])),
      opportunities: JSON.parse(JSON.stringify(mock.initialOpportunities || mock.opportunities || [])),
      applications: JSON.parse(JSON.stringify(mock.initialApplications || mock.applications || [])),
      proposals: JSON.parse(JSON.stringify(mock.initialProposals || mock.proposals || [])),
      challenges: JSON.parse(JSON.stringify(mock.initialCompanyChallenges || mock.challenges || [])),
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
      if (window.MAYDAN_MOCK && window.MAYDAN_MOCK.students) {
        state.students = JSON.parse(JSON.stringify(window.MAYDAN_MOCK.students));
      }
      return state.students || [];
    },

    getStudentById: function(studentId) {
      const students = this.getStudents();
      return students.find(s => s.id === studentId) || students[0];
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
    },

    // --- PROPOSALS API ("أعطني فرصة") ---
    getProposals: function() {
      if (!state.proposals || state.proposals.length === 0) {
        state.proposals = JSON.parse(JSON.stringify(window.MAYDAN_MOCK.initialProposals || []));
        saveState();
      }
      return state.proposals;
    },

    getProposalsForCompany: function(companyId) {
      const all = this.getProposals();
      return all.filter(p => !companyId || p.companyId === companyId || p.companyId === "comp-smart-methods" || companyId === "comp-smart-methods");
    },

    getProposalsForStudent: function(studentId) {
      const all = this.getProposals();
      return all.filter(p => !studentId || p.studentId === studentId || p.studentId === "student-1");
    },

    addProposal: function(data) {
      if (!state.proposals) state.proposals = [];
      const newProp = {
        id: "prop-" + Date.now(),
        studentId: data.studentId || "student-1",
        studentName: data.studentName || "حنين هيثم القصير",
        studentMajor: data.studentMajor || "هندسة الحاسب",
        studentUniversity: data.studentUniversity || "جامعة القصيم",
        studentAvatar: data.studentAvatar || "stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_university_student_woman_wearing_a_hijab/screen.png",
        companyId: data.companyId || "comp-smart-methods",
        companyName: data.companyName || "شركة الأساليب الذكية (Smart Methods)",
        title: data.title || "مقترح فرصة تدريبية جديدة",
        description: data.description || "",
        value: data.value || "",
        skills: data.skills || ["Python", "SQL", "Data Analysis"],
        duration: data.duration || "12 أسبوع",
        message: data.message || "",
        matchScore: data.matchScore || 92,
        status: "قيد المراجعة",
        createdAt: new Date().toISOString().split("T")[0]
      };

      state.proposals.unshift(newProp);
      saveState();

      if (window.MAYDAN_FIREBASE) {
        window.MAYDAN_FIREBASE.saveProposal(newProp);
      }

      return newProp;
    },

    updateProposalStatus: function(proposalId, newStatus) {
      const all = this.getProposals();
      const prop = all.find(p => p.id === proposalId);
      if (prop) {
        prop.status = newStatus;
        saveState();
        if (window.MAYDAN_FIREBASE) {
          window.MAYDAN_FIREBASE.saveProposal(prop);
        }
      }
      return prop;
    },

    // --- COMPANY CHALLENGES API ("ضع بصمتك") ---
    getCompanyChallenges: function(companyId) {
      if (!state.challenges || state.challenges.length === 0) {
        state.challenges = JSON.parse(JSON.stringify(window.MAYDAN_MOCK.initialCompanyChallenges || []));
        saveState();
      }
      if (!companyId) return state.challenges;
      return state.challenges.filter(c => c.companyId === companyId || c.companyId === "comp-smart-methods" || companyId === "comp-smart-methods");
    },

    addCompanyChallenge: function(data) {
      if (!state.challenges) state.challenges = [];
      const newChallenge = {
        id: "ch-" + Date.now(),
        companyId: data.companyId || "comp-smart-methods",
        companyName: data.companyName || "شركة الأساليب الذكية (Smart Methods)",
        companyLogo: data.companyLogo || "stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_company_representative_clean_geometric/screen.png",
        title: data.title || "احتياج جديد للمنشأة",
        description: data.description || "",
        category: data.category || "تحليل البيانات والأنظمة",
        skills: data.skills || ["Python", "Data Analysis"],
        duration: data.duration || "12 أسبوع",
        location: data.location || "القصيم - حضوري",
        workType: data.workType || "حضوري",
        status: "مفتوح",
        responsesCount: 0,
        createdAt: new Date().toISOString().split("T")[0]
      };

      state.challenges.unshift(newChallenge);
      saveState();

      if (window.MAYDAN_FIREBASE) {
        window.MAYDAN_FIREBASE.saveCompanyChallenge(newChallenge);
      }

      return newChallenge;
    },

    updateChallengeStatus: function(challengeId, newStatus) {
      const all = this.getCompanyChallenges();
      const ch = all.find(c => c.id === challengeId);
      if (ch) {
        ch.status = newStatus;
        saveState();
        if (window.MAYDAN_FIREBASE) {
          window.MAYDAN_FIREBASE.saveCompanyChallenge(ch);
        }
      }
      return ch;
    }
  };
})();
