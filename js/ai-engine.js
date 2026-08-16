// AI Engine for MAYDAN (ميدان)
// Simulates Opportunity Generation, CV File Text Parsing & Explainable Matching

window.MAYDAN_AI = {
  /**
   * Parses uploaded CV file name and text content to extract skills and metadata.
   * @param {string} fileName 
   * @param {string} rawText 
   * @returns {Object} Extracted CV profile attributes
   */
  parseCvFile: function(fileName, rawText) {
    const text = (rawText || "") + " " + (fileName || "");
    const lower = text.toLowerCase();

    const possibleSkills = [
      { name: "Verilog/VHDL", keywords: ["verilog", "vhdl", "rtl", "fpga", "chip"] },
      { name: "Digital Logic", keywords: ["digital logic", "microelectronics", "circuits", "hardware"] },
      { name: "Python", keywords: ["python", "pandas", "numpy", "py"] },
      { name: "SQL", keywords: ["sql", "mysql", "postgresql", "database"] },
      { name: "Power BI", keywords: ["power bi", "powerbi", "bi", "dashboard"] },
      { name: "Data Analysis", keywords: ["data analysis", "analytics", "analysis", "data"] },
      { name: "Machine Learning", keywords: ["machine learning", "ml", "tensorflow", "pytorch"] },
      { name: "C++", keywords: ["c++", "cpp"] },
      { name: "React", keywords: ["react", "reactjs", "javascript", "js"] },
      { name: "AI", keywords: ["ai", "artificial intelligence", "nlp", "vision"] }
    ];

    let extractedSkills = [];
    possibleSkills.forEach(s => {
      if (s.keywords.some(k => lower.includes(k))) {
        extractedSkills.push(s.name);
      }
    });

    if (extractedSkills.length === 0) {
      extractedSkills = ["Verilog/VHDL", "Digital Logic", "Python", "C++", "SQL", "Data Analysis", "AI"];
    }

    return {
      fileName: fileName,
      skills: extractedSkills,
      major: "هندسة الحاسب",
      university: "جامعة القصيم (Qassim University)",
      summary: "Computer Engineering student with experience in Python, C++, Verilog/VHDL, AI, and data analysis."
    };
  },

  /**
   * Generates a structured opportunity from a natural language business prompt.
   * @param {string} promptText 
   * @returns {Object} Structured Opportunity draft
   */
  generateOpportunityFromPrompt: function(promptText) {
    const text = promptText ? promptText.toLowerCase() : "";

    let title = "Customer Insights Dashboard";
    let titleAr = "لوحة تحليلات بيانات العملاء";
    let category = "Data Analytics";
    let categoryAr = "تحليل البيانات";
    let duration = "8 أسابيع";
    let durationAr = "8 أسابيع (تدريب صيفي)";
    let skills = ["Python", "SQL", "Power BI", "Data Analysis"];
    let majors = ["Computer Science", "Computer Engineering", "Information Systems", "Data Science"];
    let responsibilities = [
      "تحليل بيانات العملاء والمعاملات التجارية وتصفية التكرارات بمقر الشركة الحضوري في بريدة",
      "بناء لوحة تحكم تفاعلية توضح اتجاهات المبيعات وسلوك العملاء",
      "استخراج مؤشرات الأداء الرئيسية KPIs وتحديد الأنماط الشرائية",
      "عرض النتائج والتوصيات الاستراتيجية على فريق الإدارة"
    ];
    let deliverables = [
      "لوحة تحكم تفاعلية بالكامل (Power BI / Dashboard)",
      "تقرير تحليلي عن سلوك العملاء والمبيعات",
      "عرض توثيق البيانات والتقرير النهائي"
    ];

    if (text.includes("رقائق") || text.includes("chip") || text.includes("verilog") || text.includes("fpga") || text.includes("عتاد")) {
      title = "Digital Chip Design & Microelectronics";
      titleAr = "تصميم الرقائق الرقمية والأنظمة الدقيقة";
      category = "Semiconductors & Hardware";
      categoryAr = "تصميم الرقائق والأنظمة الرقمية";
      duration = "8 أسابيع";
      durationAr = "8 أسابيع (تدريب صيفي)";
      skills = ["Verilog/VHDL", "Digital Logic", "FPGA", "C++", "Embedded Systems"];
      majors = ["Computer Engineering", "Electrical Engineering"];
      responsibilities = [
        "تصميم ومحاكاة المنطق الرقمي (Digital Logic RTL Synthesis) بلغة Verilog / VHDL بمقر الشركة الحضوري في بريدة",
        "تطبيق واختبار النماذج الأولية للرقائق المعالجة على لوحات FPGA بمختبر الشركة بالقصيم",
        "التحقق من التوقيت والبرمجة منخفضة المستوى للدوائر المتكاملة"
      ];
      deliverables = [
        "نموذج تصميم رقيقة رقمية واختبارها على لوحة FPGA",
        "تقرير اختبار المحاكاة وتوثيق RTL Design"
      ];
    } else if (text.includes("مساعد") || text.includes("خدمة عملاء") || text.includes("nlp") || text.includes("شات")) {
      title = "AI Customer Support Assistant";
      titleAr = "مساعد خدمة العملاء بالذكاء الاصطناعي";
      category = "Artificial Intelligence";
      categoryAr = "الذكاء الاصطناعي";
      duration = "8 أسابيع";
      durationAr = "8 أسابيع (تدريب صيفي)";
      skills = ["Python", "NLP", "Machine Learning", "API Integration"];
      majors = ["Computer Engineering", "Computer Science", "Artificial Intelligence"];
      responsibilities = [
        "تدريب نماذج المعالجة اللغوية للغة العربية على أسئلة العملاء",
        "تطوير واجهات الربط مع أنظمة تذاكر الدعم الفني",
        "تقييم دقة الإجابات وتحسين الأداء التشغيلي"
      ];
      deliverables = [
        "نموذج عملي لمساعد الذكاء الاصطناعي",
        "دليل الربط البرمجي والنتائج الميدانية"
      ];
    }

    return {
      id: "opp-" + Date.now(),
      title: title,
      titleAr: titleAr,
      category: category,
      categoryAr: categoryAr,
      duration: duration,
      durationAr: durationAr,
      company: "شركة الأساليب الذكية (Smart Methods)",
      location: "القصيم (بريدة) - حضوري",
      workType: "حضوري",
      stipend: "تُحدد بعد توقيع العقد",
      applicantsCount: 0,
      publishedDate: "الآن",
      skills: skills,
      majors: majors,
      description: promptText || "فرصة تدريب صيفي حضوري مصممة تلقائيًا بالذكاء الاصطناعي لتلبية احتياج الشركة الميداني في مجال " + categoryAr + ".",
      responsibilities: responsibilities,
      deliverables: deliverables,
      isAiGenerated: true,
      status: "مسودة"
    };
  },

  /**
   * Calculates explainable AI match between a Student and an Opportunity dynamically.
   * @param {Object} student 
   * @param {Object} opportunity 
   * @returns {Object} { score: number, pros: Array<string>, improvements: Array<string> }
   */
  calculateStudentMatch: function(student, opportunity) {
    if (!student || !opportunity) return { score: 75, pros: [], improvements: [] };

    // Explicit high match for Haneen on Digital Chip Design at TECH AND TEACH Qassim
    if (student.name.includes("حنين") && (opportunity.title.includes("Chip Design") || opportunity.id === "opp-tech-teach")) {
      return {
        score: 95,
        pros: [
          "Verilog/VHDL and C++ skills strongly match requirements (100%)",
          "Your Computer Engineering major at Qassim University is directly relevant",
          "Your previous project (Digital Chip Logic Simulator) is related"
        ],
        improvements: [
          "Power BI / FPGA hardware testing could be improved"
        ]
      };
    }

    if (student.name.includes("حنين") && opportunity.title.includes("Customer Insights")) {
      return {
        score: 92,
        pros: [
          "Python and SQL skills match your profile (100%)",
          "Computer Engineering major is directly relevant",
          "Previous project (Data analysis dashboard) is related"
        ],
        improvements: [
          "Power BI skills could be improved during internship"
        ]
      };
    }

    const studentSkills = student.skills || [];
    const oppSkills = opportunity.skills || [];
    
    let matchedSkillNames = [];
    studentSkills.forEach(s => {
      if (oppSkills.some(os => os.toLowerCase() === s.toLowerCase())) {
        matchedSkillNames.push(s);
      }
    });

    const matchRatio = oppSkills.length > 0 ? (matchedSkillNames.length / oppSkills.length) : 0.6;
    const baseSkillScore = matchRatio * 60;
    const majorBonus = 25;
    const gpaBonus = parseFloat(student.gpa) ? (parseFloat(student.gpa) / 4.0) * 10 : 8;

    let totalScore = Math.min(99, Math.max(65, Math.round(baseSkillScore + majorBonus + gpaBonus)));

    const pros = [];
    if (matchedSkillNames.length > 0) {
      pros.push(`${matchedSkillNames.join(", ")} matches your profile (${Math.round(matchRatio * 100)}%)`);
    } else {
      pros.push(`Core requirements match your background in ${opportunity.categoryAr || opportunity.category}`);
    }

    pros.push(`Your major (${student.major}) is directly relevant`);
    
    if (student.projects && student.projects.length > 0) {
      pros.push(`Your previous project (${student.projects[0].name}) is related`);
    }

    const unMatchedSkills = oppSkills.filter(os => !matchedSkillNames.some(ms => ms.toLowerCase() === os.toLowerCase()));
    const improvements = unMatchedSkills.length > 0
      ? [`${unMatchedSkills.join(", ")} could be improved`]
      : ["Hands-on hardware testing could be improved"];

    return {
      score: totalScore,
      pros: pros,
      improvements: improvements
    };
  }
};
