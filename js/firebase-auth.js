// Firebase Auth & Role Management for MAYDAN (ميدان)
// Handles Login, Signup with Role Selection (Student / Company), and User Persistence in Firestore (project ID: maydan-b04ca)

window.MAYDAN_AUTH = (function() {
  let currentUser = null;
  let userProfile = null;

  function parseAuthErrorMessage(error) {
    if (!error) return "حدث خطأ غير متوقع. يرجى المحاولة ثانية.";
    const code = error.code || "";
    switch (code) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "البريد الإلكتروني أو كلمة المرور غير صحيحة. إذا لم يكن لديك حساب، يرجى اختيار 'إنشاء حساب جديد'.";
      case "auth/email-already-in-use":
        return "هذا البريد الإلكتروني مسجل بالفعل. يرجى اختيار 'تسجيل الدخول' بدلاً من إنشاء حساب جديد.";
      case "auth/weak-password":
        return "كلمة المرور ضعيفة. يرجى استخدام 6 أحرف على الأقل.";
      case "auth/invalid-email":
        return "صيغة البريد الإلكتروني غير صحيحة. يرجى كتابة بريد إلكتروني صالح (مثال: name@example.com).";
      case "auth/network-request-failed":
        return "تعذر الاتصال بالخادم. يرجى التأكد من الاتصال بالإنترنت والمحاولة مجدداً.";
      case "auth/too-many-requests":
        return "تم تجاوز عدد المحاولات المسموح بها. يرجى الانتظار قليلاً ثم المحاولة ثانية.";
      default:
        return error.message || "حدث خطأ أثناء المصادقة، يرجى التأكد من البيانات والمحاولة ثانية.";
    }
  }

  function init() {
    if (typeof firebase !== "undefined" && firebase.auth) {
      firebase.auth().onAuthStateChanged(async function(user) {
        if (user) {
          currentUser = user;
          try {
            await fetchUserProfile(user.uid);
          } catch (err) {
            console.warn("Auth state profile fetch notice:", err);
            if (err && (err.code === "auth/invalid-credential" || err.code === "auth/user-token-expired")) {
              console.warn("Stale or expired credentials detected. Clearing session...");
              await firebase.auth().signOut();
              return;
            }
          }
          
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
    const isEn = window.MAYDAN_LANG === "en";
    const role = window.MAYDAN_STORE ? window.MAYDAN_STORE.getRole() : (userProfile ? userProfile.role : "company");
    const navContainer = document.getElementById("main-nav-links");
    const mobileNavContainer = document.getElementById("mobile-nav-links");
    const userBadge = document.getElementById("nav-user-badge");

    if (role === "company") {
      if (navContainer) {
        navContainer.innerHTML = `
          <a href="#company-dashboard" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Home' : 'الرئيسية'}</a>
          <a href="#company-challenges" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-colors flex items-center gap-1 font-bold">
            <span class="material-symbols-outlined text-amber-500 text-sm">touch_app</span>
            ${isEn ? 'Leave Your Mark' : 'ضع بصمتك'}
          </a>
          <a href="#company-create" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-teal-500 text-base">auto_awesome</span>
            ${isEn ? 'Create Opportunity' : 'إنشاء فرصة'}
          </a>
          <a href="#company-candidates" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Candidates' : 'المرشحون المطابقون'}</a>
          <a href="#company-profile" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Company Profile' : 'ملف الشركة'}</a>
        `;
      }
      if (mobileNavContainer) {
        mobileNavContainer.innerHTML = `
          <a href="#company-dashboard" class="mobile-nav-item">
            <span class="material-symbols-outlined text-xl mb-0.5">home</span>
            <span>${isEn ? 'Home' : 'الرئيسية'}</span>
          </a>
          <a href="#company-challenges" class="mobile-nav-item">
            <span class="material-symbols-outlined text-xl mb-0.5 text-amber-500">touch_app</span>
            <span>${isEn ? 'Challenges' : 'ضع بصمتك'}</span>
          </a>
          <a href="#company-create" class="mobile-nav-item">
            <span class="material-symbols-outlined text-xl mb-0.5 text-teal-500">add_circle</span>
            <span>${isEn ? 'Create' : 'إنشاء فرصة'}</span>
          </a>
          <a href="#company-candidates" class="mobile-nav-item">
            <span class="material-symbols-outlined text-xl mb-0.5">group</span>
            <span>${isEn ? 'Candidates' : 'المرشحون'}</span>
          </a>
          <a href="#company-profile" class="mobile-nav-item">
            <span class="material-symbols-outlined text-xl mb-0.5">corporate_fare</span>
            <span>${isEn ? 'Profile' : 'الملف'}</span>
          </a>
        `;
      }
      if (userBadge) {
        userBadge.innerHTML = `
          <img src="stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_company_representative_clean_geometric/screen.png" class="w-8 h-8 rounded-full border border-teal-500/30 object-cover shrink-0" alt="Company Logo"/>
          <span class="font-semibold text-xs text-slate-800 dark:text-slate-200 hidden lg:inline">${userProfile ? userProfile.name : (isEn ? 'Smart Methods' : 'شركة الأساليب الذكية')}</span>
          <button onclick="MAYDAN_AUTH.logout()" title="تسجيل الخروج" class="p-1 text-slate-400 hover:text-rose-600 transition-colors">
            <span class="material-symbols-outlined text-base">logout</span>
          </button>
        `;
      }
    } else {
      if (navContainer) {
        navContainer.innerHTML = `
          <a href="#student-dashboard" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Home' : 'الرئيسية'}</a>
          <a href="#student-marketplace" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Explore Opportunities' : 'استكشاف الفرص'}</a>
          <a href="#company-discovery" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-colors flex items-center gap-1 font-bold">
            <span class="material-symbols-outlined text-amber-500 text-sm">lightbulb</span>
            ${isEn ? 'Give Me A Chance' : 'أعطني فرصة'}
          </a>
          <a href="#student-applications" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Applications & Proposals' : 'طلباتي ومقترحاتي'}</a>
          <a href="#student-profile" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Profile' : 'الملف الشخصي'}</a>
        `;
      }
      if (mobileNavContainer) {
        mobileNavContainer.innerHTML = `
          <a href="#student-dashboard" class="mobile-nav-item">
            <span class="material-symbols-outlined text-xl mb-0.5">home</span>
            <span>${isEn ? 'Home' : 'الرئيسية'}</span>
          </a>
          <a href="#student-marketplace" class="mobile-nav-item">
            <span class="material-symbols-outlined text-xl mb-0.5">search</span>
            <span>${isEn ? 'Explore' : 'استكشاف'}</span>
          </a>
          <a href="#company-discovery" class="mobile-nav-item">
            <span class="material-symbols-outlined text-xl mb-0.5 text-amber-500">lightbulb</span>
            <span>${isEn ? 'Chance' : 'أعطني فرصة'}</span>
          </a>
          <a href="#student-applications" class="mobile-nav-item">
            <span class="material-symbols-outlined text-xl mb-0.5">assignment</span>
            <span>${isEn ? 'Applications' : 'طلباتي'}</span>
          </a>
          <a href="#student-profile" class="mobile-nav-item">
            <span class="material-symbols-outlined text-xl mb-0.5">person</span>
            <span>${isEn ? 'Profile' : 'الملف'}</span>
          </a>
        `;
      }
      if (userBadge) {
        userBadge.innerHTML = `
          <img src="stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_university_student_woman_wearing_a_hijab/screen.png" class="w-8 h-8 rounded-full border border-teal-500/30 object-cover shrink-0" alt="Student Avatar"/>
          <span class="font-semibold text-xs text-slate-800 dark:text-slate-200 hidden lg:inline">${userProfile ? userProfile.name : (isEn ? 'Haneen Haytham' : 'حنين هيثم القصير')}</span>
          <button onclick="MAYDAN_AUTH.logout()" title="تسجيل الخروج" class="p-1 text-slate-400 hover:text-rose-600 transition-colors">
            <span class="material-symbols-outlined text-base">logout</span>
          </button>
        `;
      }
    }
  }

  function updateNavbarForGuest() {
    const isEn = window.MAYDAN_LANG === "en";
    const navContainer = document.getElementById("main-nav-links");
    const mobileNavContainer = document.getElementById("mobile-nav-links");
    const userBadge = document.getElementById("nav-user-badge");

    if (navContainer) {
      navContainer.innerHTML = `
        <a href="#landing-page" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'About Maydan' : 'عن ميدان'}</a>
        <a href="#student-marketplace" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Explore Opportunities' : 'استكشاف الفرص'}</a>
        <a href="#company-discovery" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-colors flex items-center gap-1 font-bold">
          <span class="material-symbols-outlined text-amber-500 text-sm">lightbulb</span>
          ${isEn ? 'Give Me A Chance' : 'أعطني فرصة'}
        </a>
        <a href="#company-challenges" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-colors flex items-center gap-1 font-bold">
          <span class="material-symbols-outlined text-amber-500 text-sm">touch_app</span>
          ${isEn ? 'Leave Your Mark' : 'ضع بصمتك'}
        </a>
        <a href="#auth" class="nav-link nav-link-pill text-teal-600 font-bold hover:text-teal-700 transition-colors">${isEn ? 'Login / Register' : 'تسجيل الدخول'}</a>
      `;
    }

    if (mobileNavContainer) {
      mobileNavContainer.innerHTML = `
        <a href="#landing-page" class="mobile-nav-item">
          <span class="material-symbols-outlined text-xl mb-0.5">home</span>
          <span>${isEn ? 'Home' : 'الرئيسية'}</span>
        </a>
        <a href="#student-marketplace" class="mobile-nav-item">
          <span class="material-symbols-outlined text-xl mb-0.5">search</span>
          <span>${isEn ? 'Explore' : 'استكشاف'}</span>
        </a>
        <a href="#company-discovery" class="mobile-nav-item">
          <span class="material-symbols-outlined text-xl mb-0.5 text-amber-500">lightbulb</span>
          <span>${isEn ? 'Chance' : 'أعطني فرصة'}</span>
        </a>
        <a href="#company-challenges" class="mobile-nav-item">
          <span class="material-symbols-outlined text-xl mb-0.5 text-amber-500">touch_app</span>
          <span>${isEn ? 'Challenges' : 'ضع بصمتك'}</span>
        </a>
        <a href="#auth" class="mobile-nav-item">
          <span class="material-symbols-outlined text-xl mb-0.5 text-teal-600">login</span>
          <span>${isEn ? 'Login' : 'دخول'}</span>
        </a>
      `;
    }

    if (userBadge) {
      userBadge.innerHTML = `
        <a href="#auth" class="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-full text-xs transition-all shadow-sm flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">login</span>
          ${isEn ? 'Get Started' : 'ابدأ الآن'}
        </a>
      `;
    }
  }

  return {
    init: init,
    signup: signup,
    login: login,
    logout: logout,
    parseAuthErrorMessage: parseAuthErrorMessage,
    getCurrentUser: function() { return currentUser; },
    getUserProfile: function() { return userProfile; },
    getRole: function() { return window.MAYDAN_STORE ? window.MAYDAN_STORE.getRole() : (userProfile ? userProfile.role : "company"); },
    setSessionRole: function(role) {
      if (userProfile) userProfile.role = role;
      updateNavbarForAuthUser();
    },
    updateNavbarForAuthUser: updateNavbarForAuthUser
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  window.MAYDAN_AUTH.init();
});
