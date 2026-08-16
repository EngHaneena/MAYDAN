// Main Router & View Rendering Application for MAYDAN (ميدان)

window.MAYDAN_APP = (function() {
  let currentView = "landing-page";
  let activeOpportunityId = "opp-tech-teach";
  let activeCompanyId = "comp-smart-methods";
  let pendingOpportunityDraft = null;

  function init() {
    setupRoleToggle();
    setupThemeAndLangToggle();
    setupNavigation();
    setupAuthViewUI();
    setupProfileModalsUI();
    setupProposalModalsUI();
    setupChallengeModalsUI();
    handleRouting();
    window.addEventListener("hashchange", handleRouting);
  }

  function setupThemeAndLangToggle() {
    // 1. Dark Mode Setup
    const themeToggleBtn = document.getElementById("theme-toggle-btn");
    const themeIcon = document.getElementById("theme-icon");
    const savedTheme = localStorage.getItem("MAYDAN_THEME") || "light";

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      if (themeIcon) themeIcon.textContent = "light_mode";
    }

    if (themeToggleBtn) {
      themeToggleBtn.onclick = function() {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("MAYDAN_THEME", isDark ? "dark" : "light");
        if (themeIcon) themeIcon.textContent = isDark ? "light_mode" : "dark_mode";
      };
    }

    // 2. Language Switcher Setup
    const langToggleBtn = document.getElementById("lang-toggle-btn");
    const langLabel = document.getElementById("lang-label");
    const savedLang = localStorage.getItem("MAYDAN_LANG") || "ar";
    window.MAYDAN_LANG = savedLang;

    function applyLanguage(lang) {
      window.MAYDAN_LANG = lang;
      localStorage.setItem("MAYDAN_LANG", lang);
      document.documentElement.setAttribute("dir", lang === "en" ? "ltr" : "rtl");
      document.documentElement.setAttribute("lang", lang);
      if (langLabel) langLabel.textContent = lang === "en" ? "AR" : "EN";
      translatePageElements(lang);
      updateNavbarRoleUI();
    }

    if (langToggleBtn) {
      langToggleBtn.onclick = function() {
        const nextLang = window.MAYDAN_LANG === "en" ? "ar" : "en";
        applyLanguage(nextLang);
      };
    }

    applyLanguage(savedLang);
  }

  function translatePageElements(lang) {
    const isEn = lang === "en";

    // Hero Section
    const heroBadge = document.querySelector("#view-landing-page .inline-flex");
    if (heroBadge) {
      heroBadge.innerHTML = `<span class="material-symbols-outlined text-sm text-teal-400">auto_awesome</span> ${isEn ? 'From University to the Field.' : 'من الجامعة إلى الميدان.'}`;
    }

    const heroSubtitle = document.querySelector("#view-landing-page h2");
    if (heroSubtitle) {
      heroSubtitle.textContent = isEn ? '"From Company Needs... We Create Opportunities for Students."' : '"من احتياج الشركة... نصنع فرصة للطالب."';
    }

    const heroDesc = document.querySelector("#view-landing-page p");
    if (heroDesc) {
      heroDesc.textContent = isEn 
        ? 'MAYDAN transforms company needs that do not require full-time employees into real training opportunities, matching them with the best students using AI.' 
        : 'ميدان يحوّل احتياجات الشركات التي لا تتطلب موظفًا بدوام كامل إلى فرص تدريبية حقيقية، ويربطها بالطلاب الأنسب باستخدام الذكاء الاصطناعي.';
    }

    const heroPrimaryCta = document.querySelector("#view-landing-page a[href='#auth']");
    if (heroPrimaryCta) {
      heroPrimaryCta.innerHTML = `<span class="material-symbols-outlined text-lg">rocket_launch</span> ${isEn ? 'Get Started Now' : 'ابدأ الآن'}`;
    }

    const heroSecCta = document.querySelector("#view-landing-page a[href='#student-marketplace']");
    if (heroSecCta) {
      heroSecCta.innerHTML = `<span class="material-symbols-outlined text-lg">search</span> ${isEn ? 'Explore Opportunities' : 'اكتشف الفرص'}`;
    }

    // Auth View
    const authTitle = document.getElementById("auth-title");
    if (authTitle) authTitle.textContent = isEn ? 'Welcome to MAYDAN' : 'أهلاً بك في ميدان';

    const authSubtitle = document.getElementById("auth-subtitle");
    if (authSubtitle) authSubtitle.textContent = isEn ? 'Sign in or create a new account to get started' : 'سجل دخولك أو أنشئ حسابًا جديدًا للبدء في المنصة';

    const tabLoginBtn = document.getElementById("tab-login-btn");
    if (tabLoginBtn) tabLoginBtn.textContent = isEn ? 'Sign In' : 'تسجيل الدخول';

    const tabSignupBtn = document.getElementById("tab-signup-btn");
    if (tabSignupBtn) tabSignupBtn.textContent = isEn ? 'New Account' : 'حساب جديد';

    const roleChoiceStudentTitle = document.querySelector("#role-choice-student h4");
    if (roleChoiceStudentTitle) roleChoiceStudentTitle.textContent = isEn ? 'Student' : 'طالب';

    const roleChoiceCompanyTitle = document.querySelector("#role-choice-company h4");
    if (roleChoiceCompanyTitle) roleChoiceCompanyTitle.textContent = isEn ? 'Company' : 'شركة';
  }

  function handleRouting() {
    const rawHash = window.location.hash.replace("#", "");
    const hash = rawHash || "landing-page";
    navigateTo(hash);
  }

  function getDefaultViewForRole() {
    const role = window.MAYDAN_AUTH ? window.MAYDAN_AUTH.getRole() : window.MAYDAN_STORE.getRole();
    return role === "company" ? "company-dashboard" : "student-dashboard";
  }

  function navigateTo(viewId, params = {}) {
    currentView = viewId;

    if (params.oppId) {
      activeOpportunityId = params.oppId;
    }

    document.querySelectorAll(".view-panel").forEach(panel => {
      panel.classList.add("hidden");
    });

    const targetPanel = document.getElementById(`view-${viewId}`);
    if (targetPanel) {
      targetPanel.classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderView(viewId);
    updateActiveNavLinks();
  }

  function setupRoleToggle() {
    const roleSelect = document.getElementById("demo-role-select");
    if (!roleSelect) return;

    roleSelect.value = window.MAYDAN_STORE.getRole();
    roleSelect.addEventListener("change", function(e) {
      const newRole = e.target.value;
      window.MAYDAN_STORE.setRole(newRole);
      if (window.MAYDAN_AUTH) {
        window.MAYDAN_AUTH.setSessionRole(newRole);
      }
      updateNavbarRoleUI();
      const defaultView = newRole === "company" ? "company-dashboard" : "student-dashboard";
      window.location.hash = defaultView;
      navigateTo(defaultView);
    });

    const resetBtn = document.getElementById("demo-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function() {
        if (confirm("هل ترغب في إعادة ضبط البيانات التجريبية للمنصة؟")) {
          window.MAYDAN_STORE.resetDemoData();
          alert("تمت إعادة ضبط البيانات التجريبية بنجاح! ✨");
          window.location.reload();
        }
      });
    }

    updateNavbarRoleUI();
  }

  function updateNavbarRoleUI() {
    if (window.MAYDAN_AUTH && window.MAYDAN_AUTH.getCurrentUser()) {
      window.MAYDAN_AUTH.updateNavbarForAuthUser();
      return;
    }

    const isEn = window.MAYDAN_LANG === "en";
    const role = window.MAYDAN_STORE.getRole();
    const navContainer = document.getElementById("main-nav-links");
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
      if (userBadge) {
        userBadge.innerHTML = `
          <img src="stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_company_representative_clean_geometric/screen.png" class="w-8 h-8 rounded-full border border-teal-500/30 object-cover shrink-0" alt="Company Logo"/>
          <span class="font-semibold text-xs text-slate-800 dark:text-slate-200 hidden lg:inline">${isEn ? 'Smart Methods' : 'شركة الأساليب الذكية'}</span>
          <button onclick="if(window.MAYDAN_AUTH){window.MAYDAN_AUTH.logout();}" title="تسجيل الخروج" class="p-1 text-slate-400 hover:text-rose-600 transition-colors">
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
      if (userBadge) {
        userBadge.innerHTML = `
          <img src="stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_university_student_woman_wearing_a_hijab/screen.png" class="w-8 h-8 rounded-full border border-teal-500/30 object-cover shrink-0" alt="Student Avatar"/>
          <span class="font-semibold text-xs text-slate-800 dark:text-slate-200 hidden lg:inline">${isEn ? 'Haneen Haytham' : 'حنين هيثم القصير'}</span>
          <button onclick="if(window.MAYDAN_AUTH){window.MAYDAN_AUTH.logout();}" title="تسجيل الخروج" class="p-1 text-slate-400 hover:text-rose-600 transition-colors">
            <span class="material-symbols-outlined text-base">logout</span>
          </button>
        `;
      }
    }

    updateActiveNavLinks();
  }

  function setupNavigation() {
    document.querySelectorAll("[data-nav-target]").forEach(element => {
      element.addEventListener("click", function(e) {
        e.preventDefault();
        const target = this.getAttribute("data-nav-target");
        window.location.hash = target;
      });
    });
  }

  function updateActiveNavLinks() {
    const hash = window.location.hash || `#landing-page`;
    document.querySelectorAll(".nav-link").forEach(link => {
      const href = link.getAttribute("href");
      if (href === hash) {
        link.classList.add("nav-link-active");
      } else {
        link.classList.remove("nav-link-active");
      }
    });
  }

  // --- AUTHENTICATION VIEW HANDLERS ---
  function setupAuthViewUI() {
    let authMode = "login"; // "login" or "signup"
    let selectedRole = "student";

    const tabLogin = document.getElementById("tab-login-btn");
    const tabSignup = document.getElementById("tab-signup-btn");
    const roleBox = document.getElementById("role-selection-box");
    const nameGroup = document.getElementById("field-name-group");
    const submitBtn = document.getElementById("auth-submit-btn");
    const errorMsg = document.getElementById("auth-error-msg");
    const roleChoiceStudent = document.getElementById("role-choice-student");
    const roleChoiceCompany = document.getElementById("role-choice-company");
    const authForm = document.getElementById("auth-form");

    if (tabLogin && tabSignup) {
      tabLogin.onclick = function() {
        authMode = "login";
        tabLogin.className = "flex-1 py-2.5 rounded-xl bg-white text-slate-900 shadow-sm transition-all";
        tabSignup.className = "flex-1 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 transition-all";
        if (roleBox) roleBox.classList.add("hidden");
        if (nameGroup) nameGroup.classList.add("hidden");
        if (submitBtn) submitBtn.textContent = "تسجيل الدخول";
        if (errorMsg) errorMsg.classList.add("hidden");
      };

      tabSignup.onclick = function() {
        authMode = "signup";
        tabSignup.className = "flex-1 py-2.5 rounded-xl bg-white text-slate-900 shadow-sm transition-all";
        tabLogin.className = "flex-1 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 transition-all";
        if (roleBox) roleBox.classList.remove("hidden");
        if (nameGroup) nameGroup.classList.remove("hidden");
        if (submitBtn) submitBtn.textContent = "إنشاء الحساب الآن 🚀";
        if (errorMsg) errorMsg.classList.add("hidden");
      };
    }

    if (roleChoiceStudent && roleChoiceCompany) {
      roleChoiceStudent.onclick = function() {
        selectedRole = "student";
        document.getElementById("auth-selected-role").value = "student";
        roleChoiceStudent.className = "role-choice-card p-5 rounded-2xl border-2 border-teal-500 bg-teal-50/50 text-right space-y-2 transition-all";
        roleChoiceCompany.className = "role-choice-card p-5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 text-right space-y-2 transition-all";
      };

      roleChoiceCompany.onclick = function() {
        selectedRole = "company";
        document.getElementById("auth-selected-role").value = "company";
        roleChoiceCompany.className = "role-choice-card p-5 rounded-2xl border-2 border-teal-500 bg-teal-50/50 text-right space-y-2 transition-all";
        roleChoiceStudent.className = "role-choice-card p-5 rounded-2xl border-2 border-slate-200 hover:border-slate-300 text-right space-y-2 transition-all";
      };
    }

    if (authForm) {
      authForm.onsubmit = async function(e) {
        e.preventDefault();
        const email = document.getElementById("auth-input-email").value.trim();
        const password = document.getElementById("auth-input-password").value.trim();
        const name = document.getElementById("auth-input-name").value.trim();

        if (errorMsg) errorMsg.classList.add("hidden");

        try {
          if (authMode === "signup") {
            await window.MAYDAN_AUTH.signup(email, password, selectedRole, { name });
            alert("تم إنشاء حسابك بنجاح! مرحبًا بك في ميدان 🎉");
          } else {
            await window.MAYDAN_AUTH.login(email, password);
          }

          const targetView = getDefaultViewForRole();
          window.location.hash = targetView;
          navigateTo(targetView);
        } catch (err) {
          if (errorMsg) {
            errorMsg.classList.remove("hidden");
            const formatted = window.MAYDAN_AUTH && window.MAYDAN_AUTH.parseAuthErrorMessage 
              ? window.MAYDAN_AUTH.parseAuthErrorMessage(err) 
              : (err.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة، يرجى المحاولة ثانية.");
            errorMsg.textContent = formatted;
          }
        }
      };
    }
  }

  // --- PROFILE EDIT MODALS ---
  function setupProfileModalsUI() {
    // Student Edit Modal
    const studentModal = document.getElementById("edit-student-profile-modal");
    const openStudentBtn = document.getElementById("open-student-edit-modal-btn");
    const closeStudentBtn = document.getElementById("close-student-edit-modal-btn");
    const cancelStudentBtn = document.getElementById("cancel-student-edit-modal-btn");
    const studentForm = document.getElementById("edit-student-form");

    if (openStudentBtn && studentModal) {
      openStudentBtn.onclick = function() {
        const student = window.MAYDAN_STORE.getStudentById("student-1");
        document.getElementById("edit-student-name").value = student.name || "حنين هيثم القصير";
        document.getElementById("edit-student-university").value = student.university || "جامعة القصيم";
        document.getElementById("edit-student-major").value = student.major || "هندسة الحاسب";
        document.getElementById("edit-student-level").value = student.level || "سنة تخرج (Senior)";
        document.getElementById("edit-student-gpa").value = student.gpa || "3.92 / 4.00";
        document.getElementById("edit-student-bio").value = student.bio || "";
        document.getElementById("edit-student-skills-input").value = (student.skills || []).join(", ");
        studentModal.classList.remove("hidden");
      };

      const closeFunc = () => studentModal.classList.add("hidden");
      if (closeStudentBtn) closeStudentBtn.onclick = closeFunc;
      if (cancelStudentBtn) cancelStudentBtn.onclick = closeFunc;

      if (studentForm) {
        studentForm.onsubmit = function(e) {
          e.preventDefault();
          const student = window.MAYDAN_STORE.getStudentById("student-1");
          student.name = document.getElementById("edit-student-name").value;
          student.university = document.getElementById("edit-student-university").value;
          student.major = document.getElementById("edit-student-major").value;
          student.level = document.getElementById("edit-student-level").value;
          student.gpa = document.getElementById("edit-student-gpa").value;
          student.bio = document.getElementById("edit-student-bio").value;

          const skillsText = document.getElementById("edit-student-skills-input").value;
          student.skills = skillsText.split(",").map(s => s.trim()).filter(Boolean);

          if (window.MAYDAN_FIREBASE) {
            window.MAYDAN_FIREBASE.saveStudentProfile(student);
          }

          studentModal.classList.add("hidden");
          renderStudentProfile();
          alert("تم حفظ ملف الطالب التفاعلي بنجاح! ✨");
        };
      }
    }

    // Company Edit Modal
    const companyModal = document.getElementById("edit-company-profile-modal");
    const openCompanyBtn = document.getElementById("open-company-edit-modal-btn");
    const closeCompanyBtn = document.getElementById("close-company-edit-modal-btn");
    const cancelCompanyBtn = document.getElementById("cancel-company-edit-modal-btn");
    const companyForm = document.getElementById("edit-company-form");

    if (openCompanyBtn && companyModal) {
      openCompanyBtn.onclick = function() {
        const info = window.MAYDAN_STORE.getCompanyInfo();
        document.getElementById("edit-company-name").value = info.name || "شركة الأساليب الذكية";
        document.getElementById("edit-company-location").value = info.location || "القصيم، السعودية";
        document.getElementById("edit-company-worktype").value = info.workType || "حضوري";
        document.getElementById("edit-company-industry").value = info.industry || "الحلول التقنية المتقدمة";
        document.getElementById("edit-company-desc").value = info.description || "";
        companyModal.classList.remove("hidden");
      };

      const closeFunc = () => companyModal.classList.add("hidden");
      if (closeCompanyBtn) closeCompanyBtn.onclick = closeFunc;
      if (cancelCompanyBtn) cancelCompanyBtn.onclick = closeFunc;

      if (companyForm) {
        companyForm.onsubmit = function(e) {
          e.preventDefault();
          const info = window.MAYDAN_STORE.getCompanyInfo();
          info.name = document.getElementById("edit-company-name").value;
          info.location = document.getElementById("edit-company-location").value;
          info.workType = document.getElementById("edit-company-worktype").value;
          info.industry = document.getElementById("edit-company-industry").value;
          info.description = document.getElementById("edit-company-desc").value;

          companyModal.classList.add("hidden");
          renderCompanyProfile();
          alert("تم حفظ ملف الشركة وتحديث المعايير الميدانية بنجاح! ✨");
        };
      }
    }
  }

  function renderView(viewId) {
    switch(viewId) {
      case "landing-page":
        // Public Landing
        break;
      case "company-dashboard":
        renderCompanyDashboard();
        break;
      case "company-create":
        renderCompanyCreate();
        break;
      case "company-preview":
        renderCompanyPreview();
        break;
      case "company-candidates":
        renderCompanyCandidates();
        break;
      case "company-profile":
        renderCompanyProfile();
        break;
      case "student-dashboard":
        renderStudentDashboard();
        break;
      case "student-marketplace":
        renderStudentMarketplace();
        break;
      case "student-opportunity-details":
        renderStudentOpportunityDetails();
        break;
      case "student-applications":
        renderStudentApplications();
        break;
      case "student-profile":
        renderStudentProfile();
        break;
      case "company-discovery":
        renderCompanyDiscovery();
        break;
      case "company-student-detail":
        renderCompanyStudentDetail();
        break;
      case "company-challenges":
        renderCompanyChallenges();
        break;
    }
  }

  // --- COMPANY PROFILE VIEW ---
  function renderCompanyProfile() {
    const info = window.MAYDAN_STORE.getCompanyInfo();
    const opportunities = window.MAYDAN_STORE.getOpportunities();

    const nameElem = document.getElementById("company-profile-name");
    const industryElem = document.getElementById("company-profile-industry");
    const locationElem = document.getElementById("company-profile-location");
    const workTypeElem = document.getElementById("company-profile-worktype");
    const oppsCountElem = document.getElementById("company-profile-opps-count");
    const descElem = document.getElementById("company-profile-desc");

    if (nameElem) nameElem.textContent = info.name || "شركة الأساليب الذكية (Smart Methods Co.)";
    if (industryElem) industryElem.textContent = info.industry || "الحلول التقنية المتقدمة وتصميم الأنظمة";
    if (locationElem) locationElem.textContent = info.location || "القصيم، السعودية";
    if (workTypeElem) workTypeElem.textContent = info.workType || "حضوري";
    if (oppsCountElem) oppsCountElem.textContent = `${opportunities.length} فرص منشورة`;
    if (descElem) descElem.textContent = info.description || "شركة الأساليب الذكية هي شركة تقنية سريعة النمو متخصصة في الحلول الذكية وتصميم الرقائق الرقمية في القصيم.";
  }

  // --- 1. COMPANY DASHBOARD ---
  function renderCompanyDashboard() {
    const info = window.MAYDAN_STORE.getCompanyInfo();
    const opportunities = window.MAYDAN_STORE.getOpportunities();

    document.getElementById("stat-opps").textContent = opportunities.length;
    document.getElementById("stat-apps").textContent = info.metrics.totalApplications;
    document.getElementById("stat-candidates").textContent = info.metrics.shortlistedCandidates;
    document.getElementById("stat-matches").textContent = info.metrics.suggestedMatches;

    const container = document.getElementById("company-opps-container");
    if (!container) return;

    if (opportunities.length === 0) {
      container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-500 bg-white rounded-xl">لا توجد فرص منشورة حاليًا. أنشئ أول فرصة بالذكاء الاصطناعي!</div>`;
      return;
    }

    container.innerHTML = opportunities.map(opp => {
      const topStudent = window.MAYDAN_STORE.getStudentById("student-1");
      const match = window.MAYDAN_AI.calculateStudentMatch(topStudent, opp);

      return `
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover-lift relative overflow-hidden flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex justify-between items-start">
              <div>
                <span class="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full mb-2">${opp.categoryAr || opp.category}</span>
                <h3 class="text-xl font-bold text-slate-900 font-headline">${opp.titleAr || opp.title}</h3>
              </div>
              <span class="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                <span class="material-symbols-outlined text-sm text-teal-600">auto_awesome</span>
                ${match.score}% أعلى تطابق
              </span>
            </div>
            
            <p class="text-slate-600 text-sm line-clamp-2">${opp.description}</p>
            
            <div class="flex flex-wrap gap-1.5 pt-2">
              <span class="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-xs rounded border border-emerald-200 font-medium flex items-center gap-1"><span class="material-symbols-outlined text-xs">location_on</span> ${opp.location}</span>
              <span class="px-2 py-0.5 bg-blue-50 text-blue-800 text-xs rounded border border-blue-200 font-medium">${opp.workType || 'حضوري'}</span>
              ${(opp.skills || []).map(skill => `<span class="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded border border-slate-200">${skill}</span>`).join('')}
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-4 text-xs text-slate-500">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-base">schedule</span> ${opp.durationAr || opp.duration}</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-base">group</span> ${opp.applicantsCount || 24} متقدم</span>
            </div>

            <div class="flex items-center gap-2">
              <button onclick="MAYDAN_APP.viewCandidates('${opp.id}')" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">person_search</span>
                عرض المرشحين
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    renderCompanyProposals();
  }

  function renderCompanyProposals() {
    const containers = [
      document.getElementById("company-proposals-container"),
      document.getElementById("company-challenge-proposals-container")
    ].filter(Boolean);

    if (containers.length === 0) return;

    const proposals = window.MAYDAN_STORE.getProposalsForCompany("comp-smart-methods");

    const statusBadges = {
      "قيد المراجعة": "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300",
      "مهتم": "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300",
      "يحتاج مناقشة": "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-300",
      "تم تحويله إلى فرصة": "bg-teal-600 text-white border-teal-700 font-bold",
      "غير مناسب حاليًا": "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300"
    };

    containers.forEach(container => {
      if (!proposals || proposals.length === 0) {
        container.innerHTML = `<div class="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">لا توجد مقترحات مباشرة من الطلاب حاليًا.</div>`;
        return;
      }

      container.innerHTML = proposals.map(prop => {
        const statusClass = statusBadges[prop.status] || "bg-amber-100 text-amber-800 border-amber-300";

        return `
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-300/80 dark:border-slate-800 shadow-sm hover-lift relative overflow-hidden space-y-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div class="flex items-start gap-4">
                <img src="${prop.studentAvatar || 'stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_university_student_woman_wearing_a_hijab/screen.png'}" class="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/30 shadow-sm shrink-0" alt="${prop.studentName}"/>
                <div class="space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="text-base font-extrabold text-slate-900 dark:text-slate-100 font-headline">${prop.studentName}</h4>
                    <a href="https://linkedin.com/in/haneen-alqasir" target="_blank" rel="noopener" title="LinkedIn الطالبة" class="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-blue-200 dark:border-blue-800"><span class="material-symbols-outlined text-xs">link</span> LinkedIn</a>
                    <a href="https://github.com/EngHaneena" target="_blank" rel="noopener" title="GitHub الطالبة" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-slate-300 dark:border-slate-700"><span class="material-symbols-outlined text-xs">code</span> GitHub</a>
                    <span class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">${prop.studentMajor} • ${prop.studentUniversity}</span>
                    <span class="px-2.5 py-0.5 ${statusClass} border text-xs font-bold rounded-full">${prop.status}</span>
                  </div>
                  <h3 class="text-lg font-extrabold text-teal-800 dark:text-teal-300 font-headline pt-1">${prop.title}</h3>
                </div>
              </div>

              <div class="flex items-center gap-3 shrink-0">
                <div class="px-3.5 py-1.5 bg-teal-100 dark:bg-teal-950/80 rounded-xl border border-teal-300 dark:border-teal-700 text-center">
                  <span class="text-teal-950 dark:text-teal-300 font-extrabold text-lg font-headline flex items-center gap-1">
                    <span class="material-symbols-outlined text-sm">auto_awesome</span>
                    ${prop.matchScore || 95}%
                  </span>
                  <span class="text-[10px] text-slate-700 dark:text-slate-400 font-bold block">نسبة الملاءمة</span>
                </div>
              </div>

            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-100 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <span class="font-extrabold text-slate-900 dark:text-slate-100 block mb-0.5 text-xs">ماذا سيقدم الطالب؟</span>
                <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">${prop.description}</p>
              </div>
              <div>
                <span class="font-extrabold text-slate-900 dark:text-slate-100 block mb-0.5 text-xs">الفائدة المتوقعة للمنشأة:</span>
                <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">${prop.value}</p>
              </div>
            </div>

            <div class="flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs text-slate-800 dark:text-slate-300 font-bold">المهارات:</span>
                ${(prop.skills || []).map(sk => `<span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded border border-slate-200 dark:border-slate-700 font-semibold">${sk}</span>`).join('')}
                <span class="text-xs text-slate-800 dark:text-slate-300 font-bold mr-2">المدة: ${prop.duration || '12 أسبوع'}</span>
              </div>

              <div class="flex items-center gap-2 flex-wrap">
                <select onchange="MAYDAN_APP.updateProposalStatus('${prop.id}', this.value)" class="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-xs font-bold rounded-xl py-1.5 px-3 focus:ring-teal-500 shadow-sm">
                  <option value="قيد المراجعة" ${prop.status === 'قيد المراجعة' ? 'selected' : ''}>⏳ قيد المراجعة</option>
                  <option value="مهتم" ${prop.status === 'مهتم' ? 'selected' : ''}>🌟 مهتم</option>
                  <option value="يحتاج مناقشة" ${prop.status === 'يحتاج مناقشة' ? 'selected' : ''}>💬 يحتاج مناقشة</option>
                  <option value="تم تحويله إلى فرصة" ${prop.status === 'تم تحويله إلى فرصة' ? 'selected' : ''}>🚀 تم تحويله إلى فرصة</option>
                  <option value="غير مناسب حاليًا" ${prop.status === 'غير مناسب حاليًا' ? 'selected' : ''}>❌ غير مناسب حاليًا</option>
                </select>

                <button onclick="MAYDAN_APP.showStudentProfileModal('${prop.studentId}')" class="px-3.5 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-900 dark:text-slate-200 text-xs font-extrabold rounded-xl transition-all border border-slate-300 dark:border-slate-700">
                  عرض الملف
                </button>

                <button onclick="MAYDAN_APP.convertProposalToOpportunity('${prop.id}')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-sm">rocket_launch</span>
                  حوّلها إلى فرصة
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    });
  }

  // --- 2. CREATE OPPORTUNITY WITH AI ---
  function renderCompanyCreate() {
    const promptInput = document.getElementById("ai-prompt-input");
    const generateBtn = document.getElementById("ai-generate-btn");
    const loadingState = document.getElementById("ai-loading-state");
    const promptPresets = document.querySelectorAll(".prompt-preset-chip");

    promptPresets.forEach(chip => {
      chip.onclick = function() {
        if (promptInput) {
          promptInput.value = this.getAttribute("data-prompt");
        }
      };
    });

    if (generateBtn) {
      generateBtn.onclick = function() {
        const text = promptInput ? promptInput.value.trim() : "";
        if (!text) {
          alert("يرجى إدخال وصف احتياجك التجاري أولاً.");
          return;
        }

        if (loadingState) {
          loadingState.classList.remove("hidden");
          generateBtn.disabled = true;
          generateBtn.classList.add("opacity-50");
        }

        const step1 = document.getElementById("ai-step-1");
        const step2 = document.getElementById("ai-step-2");
        const step3 = document.getElementById("ai-step-3");

        if (step1) step1.className = "flex items-center gap-3 text-teal-600 font-semibold animate-pulse";
        if (step2) step2.className = "flex items-center gap-3 text-slate-400";
        if (step3) step3.className = "flex items-center gap-3 text-slate-400";

        setTimeout(() => {
          if (step1) step1.className = "flex items-center gap-3 text-slate-700 font-medium";
          if (step2) step2.className = "flex items-center gap-3 text-teal-600 font-semibold animate-pulse";
        }, 800);

        setTimeout(() => {
          if (step2) step2.className = "flex items-center gap-3 text-slate-700 font-medium";
          if (step3) step3.className = "flex items-center gap-3 text-teal-600 font-semibold animate-pulse";
        }, 1600);

        setTimeout(() => {
          pendingOpportunityDraft = window.MAYDAN_AI.generateOpportunityFromPrompt(text);
          if (loadingState) loadingState.classList.add("hidden");
          generateBtn.disabled = false;
          generateBtn.classList.remove("opacity-50");
          window.location.hash = "company-preview";
        }, 2400);
      };
    }
  }

  // --- 3. AI OPPORTUNITY PREVIEW ---
  function renderCompanyPreview() {
    if (!pendingOpportunityDraft) {
      pendingOpportunityDraft = window.MAYDAN_STORE.getOpportunityById("opp-1");
    }

    const opp = pendingOpportunityDraft;
    if (!opp) return;

    document.getElementById("preview-title").value = opp.titleAr || opp.title;
    document.getElementById("preview-category").value = opp.categoryAr || opp.category;
    document.getElementById("preview-duration").value = opp.durationAr || opp.duration;
    document.getElementById("preview-description").value = opp.description;
    
    const skillsContainer = document.getElementById("preview-skills");
    if (skillsContainer) {
      skillsContainer.innerHTML = (opp.skills || []).map(s => 
        `<span class="px-3 py-1.5 bg-teal-50 text-teal-800 rounded-lg text-sm font-medium border border-teal-200/60 flex items-center gap-1">${s}</span>`
      ).join('');
    }

    const respContainer = document.getElementById("preview-responsibilities");
    if (respContainer) {
      respContainer.innerHTML = (opp.responsibilities || []).map(r => 
        `<li class="flex items-start gap-2 text-slate-700 text-sm"><span class="text-teal-600 font-bold">•</span> ${r}</li>`
      ).join('');
    }

    const delivContainer = document.getElementById("preview-deliverables");
    if (delivContainer) {
      delivContainer.innerHTML = (opp.deliverables || []).map(d => 
        `<li class="flex items-start gap-2 text-slate-700 text-sm"><span class="material-symbols-outlined text-teal-600 text-base">verified</span> ${d}</li>`
      ).join('');
    }

    const publishBtn = document.getElementById("publish-opportunity-btn");
    if (publishBtn) {
      publishBtn.onclick = function() {
        opp.status = "نشطة";
        opp.titleAr = document.getElementById("preview-title").value;
        opp.description = document.getElementById("preview-description").value;
        
        window.MAYDAN_STORE.addOpportunity(opp);
        alert("تم نشر الفرصة بنجاح! جاري التوجيه لعرض أفضل المطابقات للطلاب... 🚀");
        activeOpportunityId = opp.id;
        window.location.hash = "company-candidates";
      };
    }
  }

  // --- 4. AI MATCH CANDIDATES ---
  function renderCompanyCandidates() {
    const opp = window.MAYDAN_STORE.getOpportunityById(activeOpportunityId) || window.MAYDAN_STORE.getOpportunities()[0];
    const students = window.MAYDAN_STORE.getStudents();

    const titleElem = document.getElementById("candidates-opp-title");
    if (titleElem && opp) {
      titleElem.textContent = opp.titleAr || opp.title;
    }

    const rankedStudents = students.map(student => {
      const match = window.MAYDAN_AI.calculateStudentMatch(student, opp);
      return {
        student,
        matchScore: match.score,
        matchDetails: match,
        isShortlisted: window.MAYDAN_STORE.isShortlisted(student.id, opp ? opp.id : "opp-1")
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    const container = document.getElementById("candidates-list-container");
    if (!container) return;

    const rankBadges = ["🥇 المركز الأول", "🥈 المركز الثاني", "🥉 المركز الثالث", "🏅 مرشح مميز"];

    container.innerHTML = rankedStudents.map((item, index) => {
      const st = item.student;
      const match = item.matchDetails;
      const isSelected = window.MAYDAN_STORE.getStudentApplications(st.id).some(a => a.opportunityId === (opp ? opp.id : "opp-1") && a.status === "مقبول");

      return `
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover-lift relative overflow-hidden transition-all ${index === 0 ? 'ring-2 ring-teal-500/40 bg-gradient-to-br from-white via-white to-teal-50/20' : ''}">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div class="flex items-start gap-4">
              <img src="${st.avatar}" class="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0" alt="${st.name}"/>
              <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-bold rounded-full">${rankBadges[index] || 'مرشح'}</span>
                  <h3 class="text-lg font-bold text-slate-900 font-headline">${st.name}</h3>
                  ${st.linkedin ? `<a href="${st.linkedin}" target="_blank" rel="noopener" title="LinkedIn المرشحة" class="px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-blue-200"><span class="material-symbols-outlined text-xs">link</span> LinkedIn</a>` : ''}
                  ${st.github ? `<a href="${st.github}" target="_blank" rel="noopener" title="GitHub المرشحة" class="px-2 py-0.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-slate-300"><span class="material-symbols-outlined text-xs">code</span> GitHub</a>` : ''}
                </div>
                <p class="text-xs text-slate-600 font-medium">${st.title}</p>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  ${(st.skills || []).map(sk => `<span class="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded font-medium">${sk}</span>`).join('')}
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t md:border-t-0 md:border-r border-slate-100 pt-4 md:pt-0 md:pr-6">
              
              <div class="text-center sm:text-right shrink-0">
                <div class="flex items-center gap-1.5 text-teal-600 font-bold text-xl font-headline">
                  <span class="material-symbols-outlined text-teal-500 text-2xl animate-ai-pulse">auto_awesome</span>
                  ${item.matchScore}%
                  <span class="text-xs font-normal text-slate-500">نسبة التطابق</span>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-wrap">
                <button onclick="MAYDAN_APP.showStudentProfileModal('${st.id}')" class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all">
                  عرض الملف
                </button>
                <button onclick="MAYDAN_APP.toggleShortlistCandidate('${st.id}', '${opp ? opp.id : 'opp-1'}')" class="px-3.5 py-2 ${item.isShortlisted ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} text-xs font-bold rounded-xl transition-all">
                  ${item.isShortlisted ? 'مُختصر ⭐' : 'القائمة المختصرة'}
                </button>
                <button onclick="MAYDAN_APP.selectCandidate('${st.id}', '${opp ? opp.id : 'opp-1'}')" class="px-4 py-2 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'} text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-base">${isSelected ? 'check_circle' : 'how_to_reg'}</span>
                  ${isSelected ? 'تم الاختيار ✓' : 'اختيار المرشح'}
                </button>
              </div>

            </div>

          </div>

          <div class="mt-4 pt-4 border-t border-slate-100 bg-slate-50/80 rounded-xl p-4 space-y-2 text-xs">
            <div class="font-bold text-slate-800 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-teal-600 text-base">psychology</span>
              ليش هذه الفرصة تناسبك؟ (أسباب التطابق)
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600">
              ${match.pros.map(p => `<div class="flex items-center gap-1.5 text-emerald-700"><span class="text-emerald-600 font-bold">✓</span> ${p}</div>`).join('')}
              ${match.improvements.map(imp => `<div class="flex items-center gap-1.5 text-amber-700"><span class="text-amber-600 font-bold">△</span> ${imp}</div>`).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- 5. STUDENT DASHBOARD ---
  function renderStudentDashboard() {
    const student = window.MAYDAN_STORE.getStudentById("student-1");
    const opportunities = window.MAYDAN_STORE.getOpportunities();

    const container = document.getElementById("student-recommended-opps");
    if (!container) return;

    container.innerHTML = opportunities.slice(0, 3).map(opp => {
      const match = window.MAYDAN_AI.calculateStudentMatch(student, opp);

      return `
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover-lift flex flex-col justify-between">
          <div class="space-y-3">
            <div class="flex justify-between items-start gap-2">
              <span class="px-3 py-1 bg-teal-50 text-teal-800 text-xs font-semibold rounded-full border border-teal-200/60">${opp.categoryAr || opp.category}</span>
              <span class="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                <span class="material-symbols-outlined text-sm">auto_awesome</span>
                ${match.score}% match
              </span>
            </div>

            <h3 class="text-lg font-bold text-slate-900 font-headline">${opp.titleAr || opp.title}</h3>
            <p class="text-xs text-slate-500 flex items-center gap-1 font-medium"><span class="material-symbols-outlined text-sm">corporate_fare</span> ${opp.company}</p>
            <p class="text-slate-600 text-xs line-clamp-2">${opp.description}</p>

            <div class="flex flex-wrap gap-1 pt-1">
              <span class="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-xs rounded font-medium">${opp.location}</span>
              <span class="px-2 py-0.5 bg-blue-50 text-blue-800 text-xs rounded font-medium">${opp.workType || 'حضوري'}</span>
              ${(opp.skills || []).map(sk => `<span class="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">${sk}</span>`).join('')}
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-500 flex items-center gap-1"><span class="material-symbols-outlined text-sm">schedule</span> ${opp.durationAr || opp.duration}</span>
            <button onclick="MAYDAN_APP.viewOpportunityDetails('${opp.id}')" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
              عرض الفرصة
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // --- 6. STUDENT MARKETPLACE & DISCOVERY ---
  function renderStudentMarketplace() {
    const student = window.MAYDAN_STORE.getStudentById("student-1");
    const opportunities = window.MAYDAN_STORE.getOpportunities();

    const searchInput = document.getElementById("marketplace-search-input");
    const categoryFilter = document.getElementById("filter-category");
    const durationFilter = document.getElementById("filter-duration");
    const container = document.getElementById("marketplace-cards-grid");

    if (!container) return;

    function applyFilters() {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
      const cat = categoryFilter ? categoryFilter.value : "";
      const dur = durationFilter ? durationFilter.value : "";

      const filtered = opportunities.filter(opp => {
        const matchesQuery = !query || 
          opp.title.toLowerCase().includes(query) || 
          opp.titleAr.toLowerCase().includes(query) || 
          opp.company.toLowerCase().includes(query) ||
          (opp.skills || []).some(s => s.toLowerCase().includes(query));

        const matchesCat = !cat || opp.category === cat || opp.categoryAr === cat;
        const matchesDur = !dur || opp.duration.includes(dur) || opp.durationAr.includes(dur);

        return matchesQuery && matchesCat && matchesDur;
      });

      if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">لم يتم العثور على فرص تطابق خيارات البحث الحالية.</div>`;
        return;
      }

      container.innerHTML = filtered.map(opp => {
        const match = window.MAYDAN_AI.calculateStudentMatch(student, opp);

        return `
          <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover-lift flex flex-col justify-between">
            <div class="space-y-3">
              <div class="flex justify-between items-start gap-2">
                <span class="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">${opp.categoryAr || opp.category}</span>
                <span class="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-full text-xs font-bold flex items-center gap-1 shrink-0">
                  <span class="material-symbols-outlined text-sm">auto_awesome</span>
                  ${match.score}% Match
                </span>
              </div>

              <div>
                <h3 class="text-lg font-bold text-slate-900 font-headline">${opp.titleAr || opp.title}</h3>
                <p class="text-xs text-slate-500 flex items-center gap-1 mt-1"><span class="material-symbols-outlined text-sm">corporate_fare</span> ${opp.company}</p>
              </div>

              <p class="text-slate-600 text-xs line-clamp-2">${opp.description}</p>

              <div class="flex flex-wrap gap-1 items-center">
                <span class="px-2.5 py-0.5 bg-amber-50 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-[11px] font-bold rounded-full flex items-center gap-1">
                  <span class="material-symbols-outlined text-xs text-amber-600">school</span> 
                  معتمدة للتدريب الجامعي
                </span>
                <span class="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-xs rounded font-medium">${opp.location}</span>
                <span class="px-2 py-0.5 bg-blue-50 text-blue-800 text-xs rounded font-medium">${opp.workType || 'حضوري'}</span>
                ${(opp.skills || []).map(sk => `<span class="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">${sk}</span>`).join('')}
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div class="text-xs text-slate-500 flex items-center gap-3">
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">schedule</span> ${opp.durationAr || opp.duration}</span>
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">payments</span> ${opp.stipend || 'تُحدد بعد توقيع العقد'}</span>
              </div>
              <button onclick="MAYDAN_APP.viewOpportunityDetails('${opp.id}')" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
                عرض الفرصة
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (searchInput) searchInput.oninput = applyFilters;
    if (categoryFilter) categoryFilter.onchange = applyFilters;
    if (durationFilter) durationFilter.onchange = applyFilters;

    applyFilters();
  }

  // --- 7. STUDENT OPPORTUNITY DETAILS ---
  function renderStudentOpportunityDetails() {
    const opp = window.MAYDAN_STORE.getOpportunityById(activeOpportunityId) || window.MAYDAN_STORE.getOpportunities()[0];
    const student = window.MAYDAN_STORE.getStudentById("student-1");
    if (!opp) return;

    const match = window.MAYDAN_AI.calculateStudentMatch(student, opp);
    const existingApp = window.MAYDAN_STORE.getStudentApplications(student.id).find(a => a.opportunityId === opp.id);

    document.getElementById("opp-detail-title").textContent = opp.titleAr || opp.title;
    document.getElementById("opp-detail-company").textContent = opp.company;
    document.getElementById("opp-detail-category").textContent = opp.categoryAr || opp.category;
    document.getElementById("opp-detail-duration").textContent = opp.durationAr || opp.duration;
    document.getElementById("opp-detail-stipend").textContent = opp.stipend || "تُحدد بعد توقيع العقد";
    document.getElementById("opp-detail-description").textContent = opp.description;
    document.getElementById("opp-detail-match-score").textContent = `${match.score}% Match`;

    const matchReasonsContainer = document.getElementById("opp-detail-match-reasons");
    if (matchReasonsContainer) {
      matchReasonsContainer.innerHTML = `
        <div class="space-y-1.5 text-xs text-slate-700 font-medium">
          <div class="font-bold text-slate-900 pb-1">ليش هذه الفرصة تناسبك؟</div>
          ${match.pros.map(p => `<div class="flex items-center gap-2 text-emerald-800"><span class="text-emerald-600 font-bold">✓</span> ${p}</div>`).join('')}
          ${match.improvements.map(imp => `<div class="flex items-center gap-2 text-amber-800"><span class="text-amber-600 font-bold">△</span> ${imp}</div>`).join('')}
        </div>
      `;
    }

    const skillsContainer = document.getElementById("opp-detail-skills");
    if (skillsContainer) {
      skillsContainer.innerHTML = (opp.skills || []).map(s => 
        `<span class="px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200">${s}</span>`
      ).join('');
    }

    const respContainer = document.getElementById("opp-detail-responsibilities");
    if (respContainer) {
      respContainer.innerHTML = (opp.responsibilities || []).map(r => 
        `<li class="flex items-start gap-2 text-slate-700 text-sm"><span class="text-teal-600 font-bold">•</span> ${r}</li>`
      ).join('');
    }

    const delivContainer = document.getElementById("opp-detail-deliverables");
    if (delivContainer) {
      delivContainer.innerHTML = (opp.deliverables || []).map(d => 
        `<li class="flex items-start gap-2 text-slate-700 text-sm"><span class="material-symbols-outlined text-teal-600 text-base">verified</span> ${d}</li>`
      ).join('');
    }

    const applyBtn = document.getElementById("trigger-apply-modal-btn");
    if (applyBtn) {
      if (existingApp) {
        applyBtn.disabled = true;
        applyBtn.className = "w-full py-3.5 bg-slate-200 text-slate-600 font-bold rounded-xl text-center text-sm cursor-not-allowed flex items-center justify-center gap-2";
        applyBtn.innerHTML = `<span class="material-symbols-outlined text-base">check_circle</span> تم التقديم سابقًا (${existingApp.status})`;
      } else {
        applyBtn.disabled = false;
        applyBtn.className = "w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-center text-sm shadow-md transition-all flex items-center justify-center gap-2";
        applyBtn.innerHTML = `<span class="material-symbols-outlined text-base">send</span> التقديم على هذه الفرصة`;
        applyBtn.onclick = function() {
          openApplyModal(opp);
        };
      }
    }
  }

  function openApplyModal(opp) {
    const modal = document.getElementById("apply-modal");
    if (!modal) return;

    modal.classList.remove("hidden");
    document.getElementById("modal-opp-title").textContent = opp.titleAr || opp.title;

    const confirmBtn = document.getElementById("submit-application-btn");
    const cancelBtn = document.getElementById("close-apply-modal-btn");

    cancelBtn.onclick = () => modal.classList.add("hidden");

    confirmBtn.onclick = function() {
      const note = document.getElementById("apply-note-input").value;
      const student = window.MAYDAN_STORE.getStudentById("student-1");

      window.MAYDAN_STORE.addApplication({
        opportunityId: opp.id,
        studentId: student.id,
        studentName: student.name,
        opportunityTitle: opp.titleAr || opp.title,
        companyName: opp.company,
        matchScore: 95,
        message: note
      });

      modal.classList.add("hidden");

      const successModal = document.getElementById("success-modal");
      if (successModal) {
        successModal.classList.remove("hidden");
        document.getElementById("close-success-modal-btn").onclick = () => {
          successModal.classList.add("hidden");
          window.location.hash = "student-applications";
        };
      }
    };
  }

  // --- 8. STUDENT APPLICATIONS & PROPOSALS (طلباتي ومقترحاتي) ---
  function renderStudentApplications() {
    const student = window.MAYDAN_STORE.getStudentById("student-1");
    const apps = window.MAYDAN_STORE.getStudentApplications(student.id);
    const proposals = window.MAYDAN_STORE.getProposalsForStudent(student.id);

    const container = document.getElementById("student-apps-list");
    if (!container) return;

    const statusBadges = {
      "قيد المراجعة": "bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-bold",
      "مرشح": "bg-blue-100 dark:bg-blue-950/80 text-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-700 font-bold",
      "مقبول": "bg-emerald-500 text-white border-emerald-600 font-bold animate-pulse",
      "غير مقبول": "bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700 font-bold"
    };

    const propStatusBadges = {
      "قيد المراجعة": "bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-bold",
      "مهتم": "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 font-bold",
      "يحتاج مناقشة": "bg-blue-100 dark:bg-blue-950/80 text-blue-950 dark:text-blue-200 border-blue-300 dark:border-blue-700 font-bold",
      "تم تحويله إلى فرصة": "bg-teal-600 text-white border-teal-700 font-bold animate-pulse",
      "غير مناسب حاليًا": "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700"
    };

    let html = "";

    // Section 1: Direct Proposals ("أعطني فرصة")
    if (proposals.length > 0) {
      html += `
        <div class="space-y-3 pb-6">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-500">lightbulb</span>
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 font-headline">مقترحاتي المباشرة (أعطني فرصة)</h3>
            <span class="px-2 py-0.5 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-full">${proposals.length}</span>
          </div>

          ${proposals.map(prop => `
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-amber-300/80 dark:border-amber-700/60 shadow-sm hover-lift space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div class="space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="px-2.5 py-0.5 bg-amber-500 text-slate-950 text-xs font-extrabold rounded-full shadow-sm">أعطني فرصة</span>
                    <h4 class="text-base font-extrabold text-slate-900 dark:text-slate-100 font-headline">${prop.title}</h4>
                    <span class="px-3 py-0.5 text-xs rounded-full border ${propStatusBadges[prop.status] || 'bg-slate-100'}">${prop.status}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 font-medium">الشركة: <span class="font-bold text-slate-900 dark:text-slate-100">${prop.companyName}</span> • تاريخ الإرسال: ${prop.createdAt}</p>
                </div>

                <div class="px-3 py-1 bg-teal-100 dark:bg-teal-950/80 rounded-xl border border-teal-300 dark:border-teal-700 text-center shrink-0">
                  <span class="text-teal-900 dark:text-teal-300 font-bold text-sm font-headline flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">auto_awesome</span>
                    ${prop.matchScore || 95}% Mapped
                  </span>
                </div>
              </div>

              <div class="p-3.5 bg-slate-100 dark:bg-slate-800/90 rounded-xl text-xs text-slate-800 dark:text-slate-200 space-y-1 border border-slate-200 dark:border-slate-700">
                <span class="font-bold block text-slate-900 dark:text-slate-100">ما ستقدمه للشركة:</span>
                <p class="leading-relaxed text-slate-700 dark:text-slate-300">${prop.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Section 2: Official Applications
    html += `
      <div class="space-y-3 pt-2">
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 font-headline flex items-center gap-2">
          <span class="material-symbols-outlined text-teal-600">send</span>
          طلباتي التدريبية الرسمية
        </h3>

        ${apps.length === 0 ? `
          <div class="p-12 text-center text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">لم تقم بالتقديم على أي فرصة رسمية حتى الآن.</div>
        ` : apps.map(app => {
          const isAccepted = app.status === "مقبول";

          return `
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover-lift relative ${isAccepted ? 'ring-2 ring-emerald-500/50 bg-gradient-to-br from-white via-white to-emerald-50/30' : ''}">
              ${isAccepted ? `
                <div class="mb-4 p-3 bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-sm">
                  <span class="flex items-center gap-1.5 text-sm">
                    <span class="material-symbols-outlined text-lg">celebration</span>
                    تم اختيارك لهذه الفرصة 🎉 مبارك!
                  </span>
                  <span class="text-xs font-normal opacity-90">تواصلت الشركة معك للبدء</span>
                </div>
              ` : ''}

              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-3 flex-wrap">
                    <h3 class="text-lg font-extrabold text-slate-900 dark:text-slate-100 font-headline">${app.opportunityTitle}</h3>
                    <span class="px-3 py-1 text-xs rounded-full border ${statusBadges[app.status] || 'bg-slate-100'}">${app.status}</span>
                  </div>
                  <p class="text-xs text-slate-600 dark:text-slate-300 font-medium">${app.companyName} • تاريخ التقديم: ${app.appliedDate}</p>
                </div>

                <div class="flex items-center gap-4">
                  <span class="px-3 py-1.5 bg-teal-100 dark:bg-teal-950/80 text-teal-900 dark:text-teal-300 text-xs font-bold rounded-xl border border-teal-300 dark:border-teal-700 flex items-center gap-1 shrink-0">
                    <span class="material-symbols-outlined text-sm">auto_awesome</span>
                    ${app.matchScore}% Match
                  </span>
                  <button onclick="MAYDAN_APP.viewOpportunityDetails('${app.opportunityId}')" class="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl transition-all border border-slate-300 dark:border-slate-700">
                    تفاصيل الفرصة
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.innerHTML = html;
  }

  // --- 9. STUDENT PROFILE & INTERACTIVE CV UPLOAD ---
  function renderStudentProfile() {
    const student = window.MAYDAN_STORE.getStudentById("student-1");

    document.getElementById("profile-name").textContent = student.name;
    document.getElementById("profile-title").textContent = student.title;
    document.getElementById("profile-university").textContent = student.university;
    document.getElementById("profile-major").textContent = student.major;
    document.getElementById("profile-gpa").textContent = student.gpa;
    document.getElementById("profile-bio").textContent = student.bio;

    const skillsContainer = document.getElementById("profile-skills");
    if (skillsContainer) {
      skillsContainer.innerHTML = (student.skills || []).map(s => 
        `<span class="px-3 py-1 bg-teal-50 text-teal-800 rounded-lg text-xs font-semibold border border-teal-200">${s}</span>`
      ).join('');
    }

    const projectsContainer = document.getElementById("profile-projects");
    if (projectsContainer) {
      projectsContainer.innerHTML = (student.projects || []).map(p => `
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
          <h4 class="font-bold text-sm text-slate-900">${p.name}</h4>
          <p class="text-xs text-slate-600">${p.desc}</p>
        </div>
      `).join('');
    }

    const cvAnalysisBox = document.getElementById("cv-analysis-status");
    if (cvAnalysisBox && student.cvUploaded) {
      cvAnalysisBox.classList.remove("hidden");
      cvAnalysisBox.innerHTML = `
        <div class="p-5 bg-emerald-50 text-emerald-950 border border-emerald-200/80 rounded-2xl space-y-3">
          <div class="font-bold flex items-center justify-between text-sm text-emerald-900 border-b border-emerald-200/60 pb-2">
            <span class="flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-600 text-xl">verified</span>
              السيرة الذاتية المحللة بالذكاء الاصطناعي: ${student.cvName || 'Haneen_Haytham_AlKaseer_CV.pdf'}
            </span>
            <span class="text-xs font-semibold px-2.5 py-0.5 bg-emerald-200/60 text-emerald-900 rounded-full">${student.cvUploadDate || 'محدثة الآن'}</span>
          </div>

          <div class="space-y-1">
            <span class="text-xs font-bold text-emerald-900 block">AI Profile Summary:</span>
            <p class="text-xs text-slate-700 leading-relaxed font-medium bg-white/80 p-3 rounded-xl border border-emerald-200/60">${student.aiCvSummary || 'Computer Engineering student with experience in Python, AI, and data analysis.'}</p>
          </div>
          
          <div class="flex items-center justify-between pt-2">
            <div class="flex items-center gap-1 text-xs text-emerald-800 font-bold">
              <span class="material-symbols-outlined text-sm">auto_awesome</span>
              تم تحديث جميع فرص التطابق المتاحة بنجاح!
            </div>
            <a href="#student-dashboard" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1">
              عرض الفرص المناسبة لمك المحدثة ➔
            </a>
          </div>
        </div>
      `;
    }

    const cvUploadBtn = document.getElementById("upload-cv-btn");
    const cvFileInput = document.getElementById("cv-file-input");

    if (cvUploadBtn && cvFileInput) {
      cvUploadBtn.onclick = function() {
        cvFileInput.click();
      };

      cvFileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (cvAnalysisBox) {
          cvAnalysisBox.classList.remove("hidden");
          cvAnalysisBox.innerHTML = `
            <div class="p-4 bg-teal-50 text-teal-900 border border-teal-200 rounded-xl space-y-2 text-xs animate-pulse">
              <div class="font-bold flex items-center gap-2 text-sm">
                <span class="material-symbols-outlined text-teal-600 animate-spin">sync</span>
                جاري رفع وقراءة ملف: ${file.name} (${(file.size / 1024).toFixed(1)} KB)...
              </div>
              <p>1. استخراج النصوص والكلمات المفتاحية من الملف...</p>
            </div>
          `;

          const reader = new FileReader();
          reader.onload = function(evt) {
            const rawText = evt.target.result;
            
            setTimeout(() => {
              cvAnalysisBox.innerHTML = `
                <div class="p-4 bg-teal-50 text-teal-900 border border-teal-200 rounded-xl space-y-2 text-xs animate-pulse">
                  <div class="font-bold flex items-center gap-2 text-sm">
                    <span class="material-symbols-outlined text-teal-600 animate-spin">psychology</span>
                    2. جاري تحليل المهارات والخبرات وتحديث نسبة التطابق بـ AI...
                  </div>
                  <p>استخلاص التخصص، المعدل الأكاديمي، والمشاريع البرمجية...</p>
                </div>
              `;
            }, 800);

            setTimeout(() => {
              const extractedData = window.MAYDAN_AI.parseCvFile(file.name, rawText);
              window.MAYDAN_STORE.updateStudentCv(student.id, file.name, extractedData);
              renderStudentProfile();
              alert(`تم قراءة السيرة الذاتية (${file.name}) وتحديث الفرص المناسبة بالذكاء الاصطناعي بنجاح! 🎉`);
            }, 1800);
          };

          reader.onerror = function() {
            const extractedData = window.MAYDAN_AI.parseCvFile(file.name, "");
            window.MAYDAN_STORE.updateStudentCv(student.id, file.name, extractedData);
            renderStudentProfile();
            alert(`تم قراءة وحفظ السيرة الذاتية (${file.name}) بالذكاء الاصطناعي بنجاح! 🎉`);
          };

          if (file.type.includes("text") || file.name.endsWith(".txt")) {
            reader.readAsText(file);
          } else {
            setTimeout(() => {
              const extractedData = window.MAYDAN_AI.parseCvFile(file.name, "");
              window.MAYDAN_STORE.updateStudentCv(student.id, file.name, extractedData);
              renderStudentProfile();
              alert(`تم قراءة ملف (${file.name}) واستخراج المهارات وعرض الفرص المناسبة بنجاح! 🎉`);
            }, 1600);
          }
        }
      };
    }
  }

  // --- 9. COMPANY DISCOVERY ("اكتشف الشركات") ---
  function renderCompanyDiscovery() {
    const companies = window.MAYDAN_MOCK.realCompanies || [];
    const container = document.getElementById("company-discovery-grid");
    const searchInput = document.getElementById("company-search-input");
    const industryFilter = document.getElementById("filter-company-industry");
    const locationFilter = document.getElementById("filter-company-location");

    if (!container) return;

    function applyCompanyFilters() {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
      const ind = industryFilter ? industryFilter.value : "";
      const loc = locationFilter ? locationFilter.value : "";

      const filtered = companies.filter(c => {
        const matchesQuery = !query || 
          c.name.toLowerCase().includes(query) || 
          (c.industry || "").toLowerCase().includes(query) ||
          (c.activity || "").toLowerCase().includes(query) ||
          (c.description || "").toLowerCase().includes(query);

        const matchesInd = !ind || (c.industry || "").includes(ind);
        const matchesLoc = !loc || (c.city || "").includes(loc) || (c.area || "").includes(loc);

        return matchesQuery && matchesInd && matchesLoc;
      });

      if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full p-12 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">لم يتم العثور على شركات تطابق خيارات البحث الحالية.</div>`;
        return;
      }

      container.innerHTML = filtered.map(c => {
        return `
          <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-500/50 hover-lift flex flex-col justify-between space-y-4 transition-all">
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <img src="${c.logo || 'stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_company_representative_clean_geometric/screen.png'}" class="w-12 h-12 rounded-xl object-cover border border-teal-500/40 shrink-0 bg-slate-100 dark:bg-slate-800" alt="${c.name}"/>
                <div>
                  <h3 class="text-base font-extrabold text-slate-950 dark:text-white font-headline leading-snug">${c.name}</h3>
                  <span class="text-xs font-bold text-teal-700 dark:text-teal-400 block mt-0.5">${c.industry}</span>
                </div>
              </div>

              <p class="text-slate-700 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed font-medium">${c.description || c.activity}</p>

              <div class="flex flex-wrap gap-1 text-xs">
                <span class="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg font-bold border border-emerald-200 dark:border-emerald-800/60">${c.area || c.city}</span>
                <span class="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs rounded-lg font-bold border border-blue-200 dark:border-blue-800/60">${c.workType || 'حضوري'}</span>
              </div>
            </div>

            <div class="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div class="flex items-center gap-1.5">
                ${c.linkedin ? `<a href="${c.linkedin}" target="_blank" rel="noopener" title="صفحة لينكد إن الرسمية" class="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-blue-200 dark:border-blue-800"><span class="material-symbols-outlined text-sm">link</span> LinkedIn</a>` : `<span title="حساب LinkedIn موثق" class="px-2.5 py-1 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-blue-200/50 dark:border-blue-800/50 opacity-90 cursor-default"><span class="material-symbols-outlined text-sm">link</span> LinkedIn</span>`}
                ${c.website ? `<a href="${c.website}" target="_blank" rel="noopener" title="الموقع الرسمي" class="p-1 text-slate-500 hover:text-teal-600 transition-colors"><span class="material-symbols-outlined text-base">language</span></a>` : ''}
              </div>
              <button onclick="MAYDAN_APP.viewCompanyStudentDetail('${c.id}')" class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1">
                اعرض ما يمكنك تقديمه ➔
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    if (searchInput) searchInput.oninput = applyCompanyFilters;
    if (industryFilter) industryFilter.onchange = applyCompanyFilters;
    if (locationFilter) locationFilter.onchange = applyCompanyFilters;

    applyCompanyFilters();
  }

  // --- 10. COMPANY STUDENT DETAIL VIEW ---
  function renderCompanyStudentDetail() {
    const companies = window.MAYDAN_MOCK.realCompanies || [];
    const company = companies.find(c => c.id === activeCompanyId) || companies[0];
    const student = window.MAYDAN_STORE.getStudentById("student-1");
    if (!company) return;

    document.getElementById("comp-detail-name").textContent = company.name;
    document.getElementById("comp-detail-industry").textContent = company.industry;
    document.getElementById("comp-detail-area").textContent = company.area || company.city;
    document.getElementById("comp-detail-desc").textContent = company.description;
    document.getElementById("comp-detail-activity").textContent = company.activity;

    const linkedinElem = document.getElementById("comp-detail-linkedin");
    if (linkedinElem) {
      if (company.linkedin) {
        linkedinElem.setAttribute("href", company.linkedin);
        linkedinElem.target = "_blank";
        linkedinElem.classList.remove("cursor-default", "opacity-80");
      } else {
        linkedinElem.removeAttribute("href");
        linkedinElem.classList.add("cursor-default", "opacity-80");
      }
    }

    const websiteElem = document.getElementById("comp-detail-website");
    if (websiteElem) {
      websiteElem.href = company.website || "#";
    }

    const fieldsContainer = document.getElementById("comp-detail-fields");
    if (fieldsContainer) {
      fieldsContainer.innerHTML = (company.fields || ["هندسة الحاسب", "علوم الحاسب"]).map(f =>
        `<span class="px-2.5 py-0.5 bg-white dark:bg-slate-700 border border-emerald-300 dark:border-slate-600 text-emerald-800 dark:text-emerald-300 text-xs rounded-full font-semibold">${f}</span>`
      ).join('');
    }

    // Render Company Challenges ("الشركة تبحث عن ماذا؟")
    const challenges = window.MAYDAN_STORE.getCompanyChallenges(company.id);
    let challengesSection = document.getElementById("comp-detail-challenges-section");
    
    if (!challengesSection && fieldsContainer) {
      const parentDiv = fieldsContainer.closest(".space-y-4");
      if (parentDiv) {
        challengesSection = document.createElement("div");
        challengesSection.id = "comp-detail-challenges-section";
        challengesSection.className = "space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800";
        parentDiv.after(challengesSection);
      }
    }

    if (challengesSection) {
      if (challenges.length > 0) {
        challengesSection.innerHTML = `
          <h3 class="font-bold text-slate-900 dark:text-slate-100 text-lg font-headline flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-500">touch_app</span>
            الشركة تبحث عن ماذا؟ (تحديات واحتياجات المنشأة)
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${challenges.map(ch => `
              <div class="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-amber-300 dark:border-slate-700 space-y-3 flex flex-col justify-between shadow-sm">
                <div class="space-y-2">
                  <div class="flex justify-between items-start gap-2">
                    <h4 class="font-extrabold text-sm text-slate-900 dark:text-slate-100 font-headline">${ch.title}</h4>
                    <span class="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 text-[10px] font-bold rounded-full border border-amber-300 dark:border-amber-700">${ch.status}</span>
                  </div>
                  <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">${ch.description}</p>
                  <div class="flex flex-wrap gap-1 text-[11px]">
                    <span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-semibold border border-slate-200 dark:border-slate-600">${ch.workType}</span>
                    ${(ch.skills || []).map(s => `<span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded font-semibold border border-slate-200 dark:border-slate-600">${s}</span>`).join('')}
                  </div>
                </div>
                <button onclick="MAYDAN_APP.openProposalModalForChallenge('${company.id}', '${ch.id}', '${encodeURIComponent(ch.title)}')" class="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-sm">
                  <span class="material-symbols-outlined text-sm">rocket_launch</span>
                  ورّهم وش عندك 🚀
                </button>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        challengesSection.innerHTML = ``;
      }
    }

    // Render AI Suggestions ("أفكار ممكن تقدمها للشركة")
    const ideasContainer = document.getElementById("ai-company-ideas-container");
    if (ideasContainer) {
      const ideas = window.MAYDAN_AI.generateCompanyIdeasForStudent(student, company);
      ideasContainer.innerHTML = ideas.map((idea, idx) => {
        const ideaStr = encodeURIComponent(JSON.stringify(idea));
        return `
          <div class="bg-gradient-to-br from-amber-500/5 via-teal-500/5 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-5 border border-amber-300/60 dark:border-amber-700/50 shadow-sm space-y-3 flex flex-col justify-between">
            <div class="space-y-2">
              <span class="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300 rounded-full text-[10px] font-bold">فكرة مقترحة #${idx + 1}</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-slate-100 font-headline">${idea.title}</h4>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${idea.description}</p>
              <div class="p-2.5 bg-white/80 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-200 font-medium">
                <span class="font-bold text-amber-800 dark:text-amber-400 block">💡 كيف سيفيد الشركة:</span>
                ${idea.value}
              </div>
            </div>
            <button onclick="MAYDAN_APP.openProposalModalWithPreset('${company.id}', '${ideaStr}')" class="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 shadow-sm">
              <span class="material-symbols-outlined text-sm">rocket_launch</span>
              اعرض عليهم هذه الفكرة
            </button>
          </div>
        `;
      }).join('');
    }

    const openPropBtn = document.getElementById("open-proposal-modal-btn");
    if (openPropBtn) {
      openPropBtn.onclick = function() {
        MAYDAN_APP.openProposalModal(company.id);
      };
    }
  }

  function setupProposalModalsUI() {
    const modal = document.getElementById("create-proposal-modal");
    const confirmModal = document.getElementById("proposal-confirm-modal");
    const successModal = document.getElementById("proposal-success-modal");
    const closeBtn = document.getElementById("close-proposal-modal-btn");
    const cancelBtn = document.getElementById("cancel-proposal-modal-btn");
    const aiHelpBtn = document.getElementById("ai-help-proposal-btn");
    const form = document.getElementById("create-proposal-form");
    const confirmBtn = document.getElementById("confirm-submit-proposal-btn");
    const editBackBtn = document.getElementById("edit-back-proposal-btn");
    const closeSuccessBtn = document.getElementById("close-proposal-success-btn");

    if (closeBtn && modal) closeBtn.onclick = () => modal.classList.add("hidden");
    if (cancelBtn && modal) cancelBtn.onclick = () => modal.classList.add("hidden");

    if (aiHelpBtn) {
      aiHelpBtn.onclick = function() {
        const student = window.MAYDAN_STORE.getStudentById("student-1");
        const companies = window.MAYDAN_MOCK.realCompanies || [];
        const company = companies.find(c => c.id === activeCompanyId) || companies[0];

        const aiDraft = window.MAYDAN_AI.generateProposalFromAi(student, company);
        document.getElementById("proposal-title-input").value = aiDraft.title;
        document.getElementById("proposal-desc-input").value = aiDraft.description;
        document.getElementById("proposal-value-input").value = aiDraft.value;
        document.getElementById("proposal-skills-input").value = (aiDraft.skills || []).join(", ");
        document.getElementById("proposal-duration-input").value = aiDraft.duration;
        document.getElementById("proposal-message-input").value = aiDraft.message;

        alert("تم توليد وتعبئة تفاصيل المقترح بالذكاء الاصطناعي بنجاح! يمكنك تعديل أي نص قبل الإرسال. ✨");
      };
    }

    let pendingProposalData = null;

    if (form) {
      form.onsubmit = function(e) {
        e.preventDefault();
        const student = window.MAYDAN_STORE.getStudentById("student-1");
        const companies = window.MAYDAN_MOCK.realCompanies || [];
        const company = companies.find(c => c.id === activeCompanyId) || companies[0];

        pendingProposalData = {
          studentId: student ? student.id : "student-1",
          studentName: student ? student.name : "حنين هيثم القصير",
          studentMajor: student ? student.major : "هندسة الحاسب",
          studentUniversity: student ? student.university : "جامعة القصيم",
          studentAvatar: student ? student.avatar : "stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_university_student_woman_wearing_a_hijab/screen.png",
          companyId: company ? company.id : "comp-smart-methods",
          companyName: company ? company.name : "شركة الأساليب الذكية (Smart Methods)",
          title: document.getElementById("proposal-title-input").value,
          description: document.getElementById("proposal-desc-input").value,
          value: document.getElementById("proposal-value-input").value,
          skills: document.getElementById("proposal-skills-input").value.split(",").map(s => s.trim()).filter(Boolean),
          duration: document.getElementById("proposal-duration-input").value,
          message: document.getElementById("proposal-message-input").value,
          matchScore: 95
        };

        if (confirmModal) confirmModal.classList.remove("hidden");
      };
    }

    if (editBackBtn && confirmModal) {
      editBackBtn.onclick = function() {
        confirmModal.classList.add("hidden");
      };
    }

    if (confirmBtn) {
      confirmBtn.onclick = function() {
        if (!pendingProposalData) return;
        window.MAYDAN_STORE.addProposal(pendingProposalData);
        if (confirmModal) confirmModal.classList.add("hidden");
        if (modal) modal.classList.add("hidden");
        if (successModal) successModal.classList.remove("hidden");
      };
    }

    if (closeSuccessBtn && successModal) {
      closeSuccessBtn.onclick = function() {
        successModal.classList.add("hidden");
        window.location.hash = "student-applications";
      };
    }
  }

  // --- 11. COMPANY CHALLENGES & NEED HUB ("ضع بصمتك") ---
  function renderCompanyChallenges() {
    const challenges = window.MAYDAN_STORE.getCompanyChallenges("comp-smart-methods");
    const container = document.getElementById("company-published-challenges");
    const proposalsContainer = document.getElementById("company-challenge-proposals-container");

    if (container) {
      if (challenges.length === 0) {
        container.innerHTML = `<div class="col-span-full p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">لم تقم بطرح أي احتياج حتى الآن. انقر على "+ اطرح احتياجك" لبدء دعوة الطلاب!</div>`;
      } else {
        const statusBadges = {
          "مفتوح": "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 font-bold",
          "قيد المراجعة": "bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700 font-bold",
          "مغلق": "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700 font-bold"
        };

        container.innerHTML = challenges.map(ch => {
          const statusClass = statusBadges[ch.status] || "bg-emerald-100 text-emerald-950 border-emerald-300";

          return `
            <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-300/80 dark:border-slate-800 shadow-sm hover-lift relative overflow-hidden flex flex-col justify-between space-y-4">
              <div class="space-y-3">
                <div class="flex justify-between items-start gap-2">
                  <div>
                    <span class="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 text-xs font-bold rounded-full mb-2 border border-amber-300 dark:border-amber-700">${ch.category || 'تحدي ميداني'}</span>
                    <h3 class="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-headline">${ch.title}</h3>
                  </div>
                  <span class="px-2.5 py-1 ${statusClass} border text-xs font-bold rounded-full shrink-0">${ch.status}</span>
                </div>

                <p class="text-slate-700 dark:text-slate-300 text-xs line-clamp-3 leading-relaxed font-medium">${ch.description}</p>

                <div class="flex flex-wrap gap-1.5 pt-2 text-xs">
                  <span class="px-2 py-0.5 bg-emerald-100 dark:bg-slate-800 text-emerald-950 dark:text-emerald-300 rounded border border-emerald-300 dark:border-slate-700 font-semibold">${ch.location || 'القصيم'}</span>
                  <span class="px-2 py-0.5 bg-blue-100 dark:bg-slate-800 text-blue-950 dark:text-blue-300 rounded border border-blue-300 dark:border-slate-700 font-semibold">${ch.workType || 'حضوري'}</span>
                  ${(ch.skills || []).map(sk => `<span class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 rounded border border-slate-300 dark:border-slate-700 font-semibold">${sk}</span>`).join('')}
                </div>
              </div>

              <div class="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
                <span class="text-slate-700 dark:text-slate-400 font-bold">${ch.responsesCount || 0} ردود من الطلاب</span>
                <div class="flex items-center gap-2">
                  <button onclick="MAYDAN_APP.scrollToChallengeProposals()" class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-extrabold transition-all shadow-sm">
                    عرض الردود
                  </button>
                  <button onclick="MAYDAN_APP.toggleChallengeStatus('${ch.id}', '${ch.status === 'مفتوح' ? 'مغلق' : 'مفتوح'}')" class="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-300 transition-all border border-slate-300 dark:border-slate-700">
                    ${ch.status === 'مفتوح' ? 'إغلاق' : 'إعادة فتح'}
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    if (proposalsContainer) {
      renderCompanyProposals();
    }
  }

  function setupChallengeModalsUI() {
    const modal = document.getElementById("create-challenge-modal");
    const successModal = document.getElementById("challenge-success-modal");
    const openBtn = document.getElementById("open-challenge-modal-btn");
    const closeBtn = document.getElementById("close-challenge-modal-btn");
    const cancelBtn = document.getElementById("cancel-challenge-modal-btn");
    const aiHelpBtn = document.getElementById("ai-help-challenge-btn");
    const form = document.getElementById("create-challenge-form");
    const closeSuccessBtn = document.getElementById("close-challenge-success-btn");

    if (openBtn && modal) {
      openBtn.onclick = function() {
        modal.classList.remove("hidden");
      };
    }

    if (closeBtn && modal) closeBtn.onclick = () => modal.classList.add("hidden");
    if (cancelBtn && modal) cancelBtn.onclick = () => modal.classList.add("hidden");

    if (aiHelpBtn) {
      aiHelpBtn.onclick = function() {
        const inputVal = document.getElementById("challenge-desc-input").value.trim() || document.getElementById("challenge-title-input").value.trim() || "نحتاج تحسين طريقة عرض بيانات المبيعات ومتابعة أداء الفروع";
        const compInfo = window.MAYDAN_STORE.getCompanyInfo();

        const draft = window.MAYDAN_AI.generateChallengeFromAi(inputVal, compInfo);
        document.getElementById("challenge-title-input").value = draft.title;
        document.getElementById("challenge-desc-input").value = draft.description;
        document.getElementById("challenge-category-input").value = draft.category;
        document.getElementById("challenge-skills-input").value = draft.skills.join(", ");
        document.getElementById("challenge-duration-input").value = draft.duration;
        document.getElementById("challenge-location-input").value = draft.location;
        document.getElementById("challenge-worktype-input").value = draft.workType;

        alert("تمت هيكلة الاحتياج بالذكاء الاصطناعي بنجاح! يمكنك مراجعة البيانات وتعديلها قبل العرض للطلاب. ✨");
      };
    }

    if (form) {
      form.onsubmit = function(e) {
        e.preventDefault();
        const compInfo = window.MAYDAN_STORE.getCompanyInfo();

        const newChallenge = {
          companyId: compInfo ? compInfo.id : "comp-smart-methods",
          companyName: compInfo ? compInfo.name : "شركة الأساليب الذكية (Smart Methods)",
          title: document.getElementById("challenge-title-input").value,
          description: document.getElementById("challenge-desc-input").value,
          category: document.getElementById("challenge-category-input").value || "تحليل البيانات والأنظمة",
          skills: document.getElementById("challenge-skills-input").value.split(",").map(s => s.trim()).filter(Boolean),
          duration: document.getElementById("challenge-duration-input").value,
          location: document.getElementById("challenge-location-input").value,
          workType: document.getElementById("challenge-worktype-input").value
        };

        window.MAYDAN_STORE.addCompanyChallenge(newChallenge);
        if (modal) modal.classList.add("hidden");
        if (successModal) successModal.classList.remove("hidden");
        renderCompanyChallenges();
      };
    }

    if (closeSuccessBtn && successModal) {
      closeSuccessBtn.onclick = function() {
        successModal.classList.add("hidden");
        window.location.hash = "company-challenges";
      };
    }
  }

  // --- PUBLIC CONTROLLERS ---
  return {
    init: init,

    viewCandidates: function(oppId) {
      activeOpportunityId = oppId;
      window.location.hash = "company-candidates";
      navigateTo("company-candidates");
    },

    viewOpportunityDetails: function(oppId) {
      activeOpportunityId = oppId;
      window.location.hash = "student-opportunity-details";
      navigateTo("student-opportunity-details");
    },

    viewCompanyStudentDetail: function(companyId) {
      activeCompanyId = companyId || "comp-smart-methods";
      window.location.hash = "company-student-detail";
      navigateTo("company-student-detail");
    },

    openProposalModal: function(companyId) {
      if (companyId) activeCompanyId = companyId;
      const companies = window.MAYDAN_MOCK.realCompanies || [];
      const company = companies.find(c => c.id === activeCompanyId) || companies[0];

      const modal = document.getElementById("create-proposal-modal");
      const nameElem = document.getElementById("prop-modal-company-name");
      if (nameElem && company) nameElem.textContent = company.name;
      if (modal) modal.classList.remove("hidden");
    },

    openProposalModalWithPreset: function(companyId, encodedIdeaJson) {
      this.openProposalModal(companyId);
      try {
        const idea = JSON.parse(decodeURIComponent(encodedIdeaJson));
        document.getElementById("proposal-title-input").value = idea.title || "";
        document.getElementById("proposal-desc-input").value = idea.description || "";
        document.getElementById("proposal-value-input").value = idea.value || "";
        document.getElementById("proposal-skills-input").value = (idea.suggestedSkills || []).join(", ");
        document.getElementById("proposal-duration-input").value = idea.duration || "12 أسبوع";
      } catch (e) {
        console.warn("Could not parse preset idea", e);
      }
    },

    updateProposalStatus: function(proposalId, newStatus) {
      window.MAYDAN_STORE.updateProposalStatus(proposalId, newStatus);
      alert(`تم تحديث حالة المقترح إلى (${newStatus}) بنجاح! ✨`);
      renderCompanyProposals();
    },

    convertProposalToOpportunity: function(proposalId) {
      const proposals = window.MAYDAN_STORE.getProposals();
      const prop = proposals.find(p => p.id === proposalId);
      if (!prop) return;

      const compInfo = window.MAYDAN_STORE.getCompanyInfo();
      const draft = window.MAYDAN_AI.convertProposalToOpportunityDraft(prop, compInfo);

      window.MAYDAN_STORE.updateProposalStatus(proposalId, "تم تحويله إلى فرصة");
      
      const promptInput = document.getElementById("ai-prompt-input");
      if (promptInput) {
        promptInput.value = `تصميم فرصة تدريبية بناءً على مقترح الطالبة (${prop.studentName}): ${draft.title}. التفاصيل: ${draft.description}`;
      }

      alert(`تم تحويل مقترح الطالبة (${prop.studentName}) إلى مسودة فرصة جديدة! جاري نقلك لإدارة وصياغة الفرصة بالذكاء الاصطناعي. 🚀`);
      window.location.hash = "company-create";
      navigateTo("company-create");
    },

    openChallengeModal: function() {
      const modal = document.getElementById("create-challenge-modal");
      if (modal) modal.classList.remove("hidden");
    },

    toggleChallengeStatus: function(challengeId, newStatus) {
      window.MAYDAN_STORE.updateChallengeStatus(challengeId, newStatus);
      alert(`تم تحديث حالة الاحتياج إلى (${newStatus}) بنجاح! ✨`);
      renderCompanyChallenges();
    },

    scrollToChallengeProposals: function() {
      const container = document.getElementById("company-challenge-proposals-container");
      if (container) {
        container.scrollIntoView({ behavior: "smooth" });
      }
    },

    openProposalModalForChallenge: function(companyId, challengeId, encodedTitle) {
      this.openProposalModal(companyId);
      try {
        const title = decodeURIComponent(encodedTitle);
        document.getElementById("proposal-title-input").value = `استجابة لاحتياج: ${title}`;
      } catch (e) {
        console.warn("Could not parse challenge title", e);
      }
    },

    toggleShortlistCandidate: function(studentId, oppId) {
      window.MAYDAN_STORE.toggleShortlist(studentId, oppId);
      renderCompanyCandidates();
    },

    selectCandidate: function(studentId, oppId) {
      window.MAYDAN_STORE.selectCandidate(studentId, oppId);
      alert("تم تفعيل اختيار المرشح بنجاح! سيتم إخطار الطالبة في حسابها الآن. 🎉");
      renderCompanyCandidates();
    },

    showStudentProfileModal: function(studentId) {
      const student = window.MAYDAN_STORE.getStudentById(studentId);
      if (!student) return;

      const modal = document.getElementById("student-profile-modal");
      if (!modal) {
        alert(`الملف الشخصي للمرشحة:\nالاسم: ${student.name}\nالتخصص: ${student.major}\nالجامعة: ${student.university}\nالمعدل: ${student.gpa}\nLinkedIn: ${student.linkedin || 'غير مدخل'}\nGitHub: ${student.github || 'غير مدخل'}`);
        return;
      }

      const avatarElem = document.getElementById("sp-modal-avatar");
      if (avatarElem) avatarElem.src = student.avatar || "stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_university_student_woman_wearing_a_hijab/screen.png";

      const nameElem = document.getElementById("sp-modal-name");
      if (nameElem) nameElem.textContent = student.name;

      const titleElem = document.getElementById("sp-modal-title");
      if (titleElem) titleElem.textContent = student.title || `${student.major} • ${student.university}`;

      const univElem = document.getElementById("sp-modal-university");
      if (univElem) univElem.textContent = student.university;

      const gpaElem = document.getElementById("sp-modal-gpa");
      if (gpaElem) gpaElem.textContent = student.gpa;

      const levelElem = document.getElementById("sp-modal-level");
      if (levelElem) levelElem.textContent = student.level || "سنة تخرج";

      const cityElem = document.getElementById("sp-modal-city");
      if (cityElem) cityElem.textContent = student.city || "القصيم (بريدة)";

      const bioElem = document.getElementById("sp-modal-bio");
      if (bioElem) bioElem.textContent = student.bio || "لا توجد نبذة مدخلة حالياً.";

      const linkedinInput = document.getElementById("sp-modal-linkedin-input");
      if (linkedinInput) linkedinInput.value = student.linkedin || "";

      const githubInput = document.getElementById("sp-modal-github-input");
      if (githubInput) githubInput.value = student.github || "";

      const badgesElem = document.getElementById("sp-modal-social-badges");
      if (badgesElem) {
        badgesElem.innerHTML = `
          ${student.linkedin ? `<a href="${student.linkedin}" target="_blank" rel="noopener" class="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-blue-200 dark:border-blue-800"><span class="material-symbols-outlined text-xs">link</span> LinkedIn</a>` : ''}
          ${student.github ? `<a href="${student.github}" target="_blank" rel="noopener" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-slate-300 dark:border-slate-700"><span class="material-symbols-outlined text-xs">code</span> GitHub</a>` : ''}
        `;
      }

      const skillsElem = document.getElementById("sp-modal-skills");
      if (skillsElem) {
        skillsElem.innerHTML = (student.skills || []).map(sk =>
          `<span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">${sk}</span>`
        ).join('');
      }

      const projectsElem = document.getElementById("sp-modal-projects");
      if (projectsElem) {
        projectsElem.innerHTML = (student.projects || []).map(p =>
          `<div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700 text-xs space-y-0.5">
            <span class="font-bold text-slate-900 dark:text-slate-100 block">${p.name}</span>
            <span class="text-slate-600 dark:text-slate-300 block">${p.desc}</span>
          </div>`
        ).join('');
      }

      const closeBtn = document.getElementById("close-student-profile-modal-btn");
      if (closeBtn) closeBtn.onclick = () => modal.classList.add("hidden");

      const saveSocialBtn = document.getElementById("sp-modal-save-social-btn");
      if (saveSocialBtn) {
        saveSocialBtn.onclick = () => {
          student.linkedin = linkedinInput ? linkedinInput.value.trim() : student.linkedin;
          student.github = githubInput ? githubInput.value.trim() : student.github;
          if (window.MAYDAN_FIREBASE) window.MAYDAN_FIREBASE.saveStudentProfile(student);
          alert("تم حفظ وتحديث روابط التواصل المهني للطالبة بنجاح! ✨");
          this.showStudentProfileModal(student.id);
        };
      }

      modal.classList.remove("hidden");
    }
  };
})();

// Document Ready Bootstrap
document.addEventListener("DOMContentLoaded", function() {
  window.MAYDAN_APP.init();
});
