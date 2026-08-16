// Firebase Integration Module for MAYDAN (ميدان)
// Connected Project ID: maydan-b04ca

window.MAYDAN_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDBsLSPHLdxmJon6T4o0xX_uqoEA0PAsgk",
  authDomain: "maydan-b04ca.firebaseapp.com",
  projectId: "maydan-b04ca",
  storageBucket: "maydan-b04ca.firebasestorage.app",
  messagingSenderId: "109878720641",
  appId: "1:109878720641:web:8ac16f7e053c73e0797580",
  measurementId: "G-5LMV8EMSLQ"
};

window.MAYDAN_FIREBASE = (function() {
  let initialized = false;
  let db = null;

  function init() {
    if (typeof firebase !== "undefined" && !initialized) {
      try {
        if (!firebase.apps.length) {
          firebase.initializeApp(window.MAYDAN_FIREBASE_CONFIG);
        }
        db = firebase.firestore();
        initialized = true;
        console.log("🔥 Successfully connected MAYDAN to Firebase Project: maydan-b04ca");
      } catch (e) {
        console.warn("Firebase initialization notice:", e);
      }
    }
  }

  async function syncInitialDataToFirestore() {
    if (!initialized || !db) return;
    const user = firebase.auth().currentUser;
    if (!user) return; // Only sync when an authenticated session is active

    const profile = window.MAYDAN_AUTH ? window.MAYDAN_AUTH.getUserProfile() : null;
    const role = profile ? profile.role : (window.MAYDAN_STORE ? window.MAYDAN_STORE.getRole() : "student");

    // Only companies are allowed to write/sync company opportunities to Firestore
    if (role === "company") {
      try {
        const opps = window.MAYDAN_STORE ? window.MAYDAN_STORE.getOpportunities() : [];
        for (const opp of opps) {
          const payload = { ...opp, companyId: opp.companyId || user.uid };
          await db.collection("opportunities").doc(opp.id).set(payload, { merge: true });
        }
        console.log("🔥 Company opportunities synced to Cloud Firestore.");
      } catch (e) {
        console.warn("Company opportunities sync notice:", e.message || e);
      }
    }
  }

  async function saveOpportunity(opportunityData) {
    if (initialized && db && opportunityData) {
      try {
        const user = firebase.auth().currentUser;
        const payload = { ...opportunityData };
        if (user) payload.companyId = user.uid;

        await db.collection("opportunities").doc(opportunityData.id).set(payload, { merge: true });
      } catch (e) {
        console.warn("Firestore opportunity save:", e.message || e);
      }
    }
  }

  async function saveApplication(applicationData) {
    if (initialized && db && applicationData) {
      try {
        const user = firebase.auth().currentUser;
        const payload = { ...applicationData };
        if (user) payload.studentId = user.uid;
        if (!payload.status) payload.status = "pending";

        await db.collection("applications").doc(applicationData.id).set(payload, { merge: true });
      } catch (e) {
        console.warn("Firestore application save:", e.message || e);
      }
    }
  }

  async function saveStudentProfile(studentData) {
    if (initialized && db && studentData) {
      try {
        const user = firebase.auth().currentUser;
        const uid = user ? user.uid : studentData.id;
        
        await db.collection("students").doc(studentData.id).set(studentData, { merge: true });
        if (user) {
          await db.collection("users").doc(uid).set(studentData, { merge: true });
        }
      } catch (e) {
        console.warn("Firestore student profile save:", e.message || e);
      }
    }
  }

  async function saveProposal(proposalData) {
    if (initialized && db && proposalData) {
      try {
        const user = firebase.auth().currentUser;
        const payload = { ...proposalData };
        if (user && !payload.studentId) payload.studentId = user.uid;

        await db.collection("proposals").doc(proposalData.id).set(payload, { merge: true });
      } catch (e) {
        console.warn("Firestore proposal save:", e.message || e);
      }
    }
  }

  return {
    init: init,
    isInitialized: function() { return initialized; },
    getProjectId: function() { return window.MAYDAN_FIREBASE_CONFIG.projectId; },
    syncInitialDataToFirestore: syncInitialDataToFirestore,
    saveOpportunity: saveOpportunity,
    saveApplication: saveApplication,
    saveStudentProfile: saveStudentProfile,
    saveProposal: saveProposal
  };
})();

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
  window.MAYDAN_FIREBASE.init();
});
