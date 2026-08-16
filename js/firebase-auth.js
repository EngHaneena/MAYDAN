// Firebase Auth & Role Management for MAYDAN (ميدان)
// Handles Login, Signup with Role Selection (Student / Company), and User Persistence in Firestore (project ID: maydan-b04ca)

window.MAYDAN_AUTH = (function() {
  let currentUser = null;
  let userProfile = null;

  function init() {
    if (typeof firebase !== "undefined" && firebase.auth) {
      firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
          currentUser = user;
          await fetchUserProfile(user.uid);
          
          if (!userProfile) {
            // Auto-bootstrap profile document in users/{user.uid} if not found
            const fallbackRole = window.MAYDAN_STORE ? window.MAYDAN_STORE.getRole() : "student";
            userProfile = {
              uid: user.uid,
              email: user.email,
              role: fallbackRole,
              name: fallbackRole === "company" ? "شركة الأساليب الذكية (Smart Methods)" : "حنين هيثم القصير",
              university: "جامعة القصيم (Qassim University)",
              major: "هندسة الحاسب",
              location: "القصيم، السعودية",
              workType: "حضوري",
              createdAt: new Date().toISOString()
            };
            try {
              await firebase.firestore().collection("users").doc(user.uid).set(userProfile, { merge: true });
            } catch (e) {
              console.warn("User profile initial set notice:", e.message || e);
            }
          }

          if (window.MAYDAN_FIREBASE) {
            window.MAYDAN_FIREBASE.syncInitialDataToFirestore();
          }

          updateNavbarForAuthUser();
          console.log("🔒 Logged in user:", user.email, "UID:", user.uid, "Role:", userProfile ? userProfile.role : 'unknown');
        } else {
          currentUser = null;
          userProfile = null;
          updateNavbarForGuest();
          console.log("🔒 User signed out / Guest session");
        }
      });
    }
  }

  async function fetchUserProfile(uid) {
    if (window.MAYDAN_FIREBASE && window.MAYDAN_FIREBASE.isInitialized()) {
      try {
        const doc = await firebase.firestore().collection("users").doc(uid).get();
        if (doc.exists) {
          userProfile = doc.data();
          if (userProfile && userProfile.role && window.MAYDAN_STORE) {
            window.MAYDAN_STORE.setRole(userProfile.role);
          }
          return userProfile;
        }
      } catch (e) {
        console.warn("Could not fetch user profile from Firestore:", e.message || e);
      }
    }
    return null;
  }

  async function signup(email, password, role, profileData) {
    if (typeof firebase === "undefined" || !firebase.auth) {
      // Mock fallback if offline/no internet
      userProfile = {
        uid: "user-" + Date.now(),
        email: email,
        role: role,
        name: profileData.name || (role === "student" ? "حنين هيثم القصير" : "شركة الأساليب الذكية"),
        createdAt: new Date().toISOString(),
        ...profileData
      };
      if (window.MAYDAN_STORE) window.MAYDAN_STORE.setRole(role);
      return userProfile;
    }

    try {
      const userCred = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCred.user;
      
      userProfile = {
        uid: user.uid,
        email: email,
        role: role,
        name: profileData.name || (role === "student" ? "حنين هيثم القصير" : "شركة الأساليب الذكية"),
        university: profileData.university || "جامعة القصيم (Qassim University)",
        major: profileData.major || "هندسة الحاسب",
        location: profileData.location || "القصيم، السعودية",
        workType: profileData.workType || "حضوري",
        createdAt: new Date().toISOString(),
        skills: profileData.skills || ["Python", "C++", "SQL", "Digital Logic", "Data Analysis", "AI"],
        projects: profileData.projects || [{ name: "Digital Chip Logic Simulator", desc: "محاكي منطقي للرقائق الرقمية" }],
        certificates: profileData.certificates || ["AWS Certified Cloud Practitioner"]
      };

      // Save to Firestore users collection using authenticated user UID
      await firebase.firestore().collection("users").doc(user.uid).set(userProfile, { merge: true });
      if (window.MAYDAN_STORE) window.MAYDAN_STORE.setRole(role);

      return userProfile;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async function login(email, password) {
    if (typeof firebase === "undefined" || !firebase.auth) {
      // Mock fallback if offline
      const role = email.includes("company") || email.includes("smart") ? "company" : "student";
      userProfile = {
        uid: "user-demo",
        email: email,
        role: role,
        name: role === "company" ? "شركة الأساليب الذكية (Smart Methods)" : "حنين هيثم القصير"
      };
      if (window.MAYDAN_STORE) window.MAYDAN_STORE.setRole(role);
      return userProfile;
    }

    try {
      const userCred = await firebase.auth().signInWithEmailAndPassword(email, password);
      currentUser = userCred.user;
      await fetchUserProfile(currentUser.uid);
      return userProfile;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    if (typeof firebase !== "undefined" && firebase.auth) {
      await firebase.auth().signOut();
    }
    currentUser = null;
    userProfile = null;
    window.location.hash = "landing-page";
  }

  function updateNavbarForAuthUser() {
    const role = userProfile ? userProfile.role : window.MAYDAN_STORE.getRole();
    const navContainer = document.getElementById("main-nav-links");
    const userBadge = document.getElementById("nav-user-badge");

    if (role === "company") {
      if (navContainer) {
        navContainer.innerHTML = `
          <a href="#company-dashboard" class="nav-link text-slate-600 hover:text-teal-600 transition-colors py-1">الرئيسية</a>
          <a href="#company-create" class="nav-link text-slate-600 hover:text-teal-600 transition-colors py-1 flex items-center gap-1">
            <span class="material-symbols-outlined text-teal-500 text-base">auto_awesome</span>
            إنشاء فرصة
          </a>
          <a href="#company-candidates" class="nav-link text-slate-600 hover:text-teal-600 transition-colors py-1">المرشحون المطابقون</a>
          <a href="#company-profile" class="nav-link text-slate-600 hover:text-teal-600 transition-colors py-1">ملف الشركة</a>
        `;
      }
      if (userBadge) {
        userBadge.innerHTML = `
          <img src="stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_company_representative_clean_geometric/screen.png" class="w-8 h-8 rounded-full border border-teal-500/30 object-cover shrink-0" alt="Company Logo"/>
          <span class="font-semibold text-xs text-slate-800 hidden lg:inline">${userProfile ? userProfile.name : 'شركة الأساليب الذكية'}</span>
          <button onclick="MAYDAN_AUTH.logout()" title="تسجيل الخروج" class="p-1 text-slate-400 hover:text-rose-600 transition-colors">
            <span class="material-symbols-outlined text-base">logout</span>
          </button>
        `;
      }
    } else {
      if (navContainer) {
        navContainer.innerHTML = `
          <a href="#student-dashboard" class="nav-link text-slate-600 hover:text-teal-600 transition-colors py-1">الرئيسية</a>
          <a href="#student-marketplace" class="nav-link text-slate-600 hover:text-teal-600 transition-colors py-1">استكشاف الفرص</a>
          <a href="#student-applications" class="nav-link text-slate-600 hover:text-teal-600 transition-colors py-1">طلباتي</a>
          <a href="#student-profile" class="nav-link text-slate-600 hover:text-teal-600 transition-colors py-1">الملف الشخصي</a>
        `;
      }
      if (userBadge) {
        userBadge.innerHTML = `
          <img src="stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_university_student_woman_wearing_a_hijab/screen.png" class="w-8 h-8 rounded-full border border-teal-500/30 object-cover shrink-0" alt="Student Avatar"/>
          <span class="font-semibold text-xs text-slate-800 hidden lg:inline">${userProfile ? userProfile.name : 'حنين هيثم القصير'}</span>
          <button onclick="MAYDAN_AUTH.logout()" title="تسجيل الخروج" class="p-1 text-slate-400 hover:text-rose-600 transition-colors">
            <span class="material-symbols-outlined text-base">logout</span>
          </button>
        `;
      }
    }
  }

  function updateNavbarForGuest() {
    const navContainer = document.getElementById("main-nav-links");
    const userBadge = document.getElementById("nav-user-badge");

    if (navContainer) {
      navContainer.innerHTML = `
        <a href="#landing-page" class="nav-link text-slate-600 hover:text-teal-600 transition-colors py-1">عن ميدان</a>
        <a href="#student-marketplace" class="nav-link text-slate-600 hover:text-teal-600 transition-colors py-1">استكشاف الفرص</a>
        <a href="#auth" class="nav-link text-teal-600 font-bold hover:text-teal-700 transition-colors py-1">تسجيل الدخول</a>
      `;
    }

    if (userBadge) {
      userBadge.innerHTML = `
        <a href="#auth" class="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full text-xs transition-all shadow-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">login</span>
          ابدأ الآن
        </a>
      `;
    }
  }

  return {
    init: init,
    signup: signup,
    login: login,
    logout: logout,
    getCurrentUser: function() { return currentUser; },
    getUserProfile: function() { return userProfile; },
    getRole: function() { return userProfile ? userProfile.role : window.MAYDAN_STORE.getRole(); }
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  window.MAYDAN_AUTH.init();
});
