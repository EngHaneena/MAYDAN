// Main Router & View Rendering Application for MAYDAN (ميدان)

window.MAYDAN_APP = (function() {
  let currentView = "landing-page";
  let activeOpportunityId = "opp-tech-teach";
  let pendingOpportunityDraft = null;

  function init() {
    setupRoleToggle();
    setupThemeAndLangToggle();
    setupNavigation();
    setupAuthViewUI();
    setupProfileModalsUI();
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
        `;
      }
    } else {
      if (navContainer) {
        navContainer.innerHTML = `
          <a href="#student-dashboard" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Home' : 'الرئيسية'}</a>
          <a href="#student-marketplace" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Explore Opportunities' : 'استكشاف الفرص'}</a>
          <a href="#student-applications" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Applications' : 'طلباتي'}</a>
          <a href="#student-profile" class="nav-link nav-link-pill text-slate-700 dark:text-slate-200 hover:text-teal-600 transition-colors">${isEn ? 'Profile' : 'الملف الشخصي'}</a>
        `;
      }
      if (userBadge) {
        userBadge.innerHTML = `
          <img src="stitch_maydan_ai_powered_co_op_platform/ultra_minimalist_faceless_avatar_of_a_university_student_woman_wearing_a_hijab/screen.png" class="w-8 h-8 rounded-full border border-teal-500/30 object-cover shrink-0" alt="Student Avatar"/>
          <span class="font-semibold text-xs text-slate-800 dark:text-slate-200 hidden lg:inline">${isEn ? 'Haneen Haytham (95%)' : 'حنين هيثم القصير (95% Match)'}</span>
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
        } catch (err) {
          if (errorMsg) {
            errorMsg.classList.remove("hidden");
            errorMsg.textContent = err.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة، يرجى المحاولة ثانية.";
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

              <div class="flex flex-wrap gap-1">
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

  // --- 8. STUDENT APPLICATIONS (طلباتي) ---
  function renderStudentApplications() {
    const student = window.MAYDAN_STORE.getStudentById("student-1");
    const apps = window.MAYDAN_STORE.getStudentApplications(student.id);

    const container = document.getElementById("student-apps-list");
    if (!container) return;

    if (apps.length === 0) {
      container.innerHTML = `<div class="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">لم تقم بالتقديم على أي فرصة حتى الآن. استكشف الفرص وقدم الآن!</div>`;
      return;
    }

    const statusBadges = {
      "قيد المراجعة": "bg-blue-50 text-blue-800 border-blue-200",
      "مرشح": "bg-amber-50 text-amber-800 border-amber-200",
      "مقبول": "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold animate-pulse",
      "غير مقبول": "bg-rose-50 text-rose-800 border-rose-200"
    };

    container.innerHTML = apps.map(app => {
      const isAccepted = app.status === "مقبول";

      return `
        <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover-lift relative ${isAccepted ? 'ring-2 ring-emerald-500/50 bg-gradient-to-br from-white via-white to-emerald-50/30' : ''}">
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
                <h3 class="text-lg font-bold text-slate-900 font-headline">${app.opportunityTitle}</h3>
                <span class="px-3 py-1 text-xs rounded-full border ${statusBadges[app.status] || 'bg-slate-100'}">${app.status}</span>
              </div>
              <p class="text-xs text-slate-500 font-medium">${app.companyName} • تاريخ التقديم: ${app.appliedDate}</p>
            </div>

            <div class="flex items-center gap-4">
              <span class="px-3 py-1.5 bg-teal-50 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 flex items-center gap-1 shrink-0">
                <span class="material-symbols-outlined text-sm">auto_awesome</span>
                ${app.matchScore}% Match
              </span>
              <button onclick="MAYDAN_APP.viewOpportunityDetails('${app.opportunityId}')" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all">
                تفاصيل الفرصة
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
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

  // --- PUBLIC CONTROLLERS ---
  return {
    init: init,

    viewCandidates: function(oppId) {
      activeOpportunityId = oppId;
      window.location.hash = "company-candidates";
    },

    viewOpportunityDetails: function(oppId) {
      activeOpportunityId = oppId;
      window.location.hash = "student-opportunity-details";
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

      alert(`الملف الشخصي للمرشحة:\nالاسم: ${student.name}\nالتخصص: ${student.major}\nالجامعة: ${student.university}\nالمعدل: ${student.gpa}\nالمهارات: ${student.skills.join(", ")}`);
    }
  };
})();

// Document Ready Bootstrap
document.addEventListener("DOMContentLoaded", function() {
  window.MAYDAN_APP.init();
});
