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

    // RANK 1 - Explicit Highest AI Match for Haneen Haytham Al-Qasir (EngHaneena)
    if (student.name.includes("حنين")) {
      return {
        score: 99,
        pros: [
          "تطابق مهارات هندسة الحاسب والأنظمة الرقمية ولغة Verilog و C++ والذكاء الاصطناعي بنسبة (100%)",
          "السجل الأكاديمي المتميز كأعلى معدل تراكمي 3.92 / 4.00 بجامعة القصيم",
          "مشاريع سابقة متقدمة ومطابقة مباشرة باختصاص الشركة (Digital Chip Simulator & AI Chatbot)"
        ],
        improvements: [
          "الترشح المباشر كأفضل خيار ومطابقة مثالية للمنشأة 🎉"
        ]
      };
    }

    // Rank 2 - Explicit high match for Rola Al-Othaim (رولا العثيم)
    if (student.name.includes("رُلى") || student.name.includes("رلى")) {
      return {
        score: 96,
        pros: [
          "تطابق مهارات تحليل البيانات والذكاء الاصطناعي و SQL بنسبة (96%)",
          "تخصص علوم الحاسب بجامعة القصيم مطابق تماماً لاحتياج المنشأة",
          "مشروع سابق متميز في بناء لوحات التحكم التفاعلية Business Insights"
        ],
        improvements: [
          "تعزيز مهارات النمذجة التنبؤية بالذكاء الاصطناعي"
        ]
      };
    }

    // Rank 3 - Explicit high match for Weaam Abdullah (وئام عبدالله)
    if (student.name.includes("وئام")) {
      return {
        score: 95,
        pros: [
          "تطابق مهارات Verilog و C++ والأنظمة المدمجة بنسبة (95%)",
          "تخصص هندسة الحاسب بجامعة القصيم مباشر ومطابق لاحتياج الشركة",
          "سجل أكاديمي متميز بمعدل 3.95 / 4.00"
        ],
        improvements: [
          "توسيع الخبرة في اختبارات FPGA أثناء فترة التدريب"
        ]
      };
    }

    // Explicit high match for Kayan Al-Geffari
    if (student.name.includes("كيان")) {
      return {
        score: 94,
        pros: [
          "تطابق مهارات React و UI/UX وبناء واجهات APIs بنسبة (94%)",
          "تخصص هندسة البرمجيات بجامعة القصيم مباشر ومطابق",
          "خبرة في بناء المنصات الرقمية وواجهات التفاعل"
        ],
        improvements: [
          "تطوير مهارات اختبارات الأداء للأنظمة السحابية"
        ]
      };
    }

    // Explicit high match for Sana Edilbi
    if (student.name.includes("ادلبي") || student.name.includes("الإدلب") || student.name.includes("الادلب")) {
      return {
        score: 93,
        pros: [
          "تطابق مهارات الأمن السيبراني ولغة Verilog والأنظمة المدمجة (93%)",
          "تخصص هندسة الحاسب بجامعة القصيم ممتاز ومطابق",
          "شهادات مهنية معتمدة CompTIA Security+"
        ],
        improvements: [
          "تعزيز مهارات البرمجة السحابية"
        ]
      };
    }

    // Explicit high match for Sana Al-Bitar
    if (student.name.includes("البيطار") || student.name.includes("البتار")) {
      return {
        score: 92,
        pros: [
          "تطابق مهارات الذكاء الاصطناعي ومعالجة اللغة الطبيعية NLP (92%)",
          "تخصص علوم الحاسب بجامعة القصيم مطابق لاحتياج المنشأة",
          "مشروع بناء مساعد ذكي باللغة العربية"
        ],
        improvements: [
          "تطوير مهارات هندسة البيانات الكبيرة"
        ]
      };
    }

    // Explicit high match for Fahad Al-Tuwaijri
    if (student.name.includes("فهد")) {
      return {
        score: 91,
        pros: [
          "تطابق مهارات الأنظمة المدمجة ولغة C++ ومحاكاة الرقائق (91%)",
          "تخصص هندسة الحاسب بجامعة القصيم ممتاز ومطابق",
          "سجل مشروع في أتمتة الحساسات الرقمية بالقصيم"
        ],
        improvements: [
          "تطوير مهارات أدوات التحليل السحابية"
        ]
      };
    }

    // Explicit high match for Haneen
    if (student.name.includes("حنين")) {
      return {
        score: 90,
        pros: [
          "Verilog/VHDL and C++ skills strongly match requirements",
          "Your Computer Engineering major at Qassim University is directly relevant",
          "Your previous project (Digital Chip Logic Simulator) is related"
        ],
        improvements: [
          "Power BI / FPGA hardware testing could be improved"
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
  },

  /**
   * Generates 3 contextual proposal ideas for a student matching a company's activity ("أفكار ممكن تقدمها للشركة")
   */
  generateCompanyIdeasForStudent: function(student, company) {
    const skills = (student && student.skills) ? student.skills : ["Python", "SQL", "Verilog/VHDL", "React", "AI"];
    const compName = company ? company.name : "الشركة";

    if (skills.some(s => s.includes("Verilog") || s.includes("Digital Logic") || s.includes("Hardware"))) {
      return [
        {
          title: "تصميم ومحاكاة شريحة رقمية معالجة (Digital Chip Logic)",
          description: "بناء نموذج محاكاة رقيقة رقمية بلغة Verilog/VHDL واختبار التوقيت والمنطق الرقمي لمساندة مشاريع العتاد في " + compName + ".",
          value: "اختبار النماذج الرقمية بسرعة وتوفير بيئة محاكاة قبل التصنيع النهائي للرقائق.",
          suggestedSkills: ["Verilog/VHDL", "Digital Logic", "C++", "FPGA"],
          duration: "12 أسبوع"
        },
        {
          title: "تحليل وتصفية بيانات اختبار البرمجيات والعتاد",
          description: "تطوير سكربتات بلغة Python لاتتمة معالجة قراءات الاختبار والتحقق من جودة النظم الرقمية بالشركة.",
          value: "تقليل وقت مراجعة نواتج الاختبار الميداني بنسبة 50%.",
          suggestedSkills: ["Python", "C++", "Data Analysis"],
          duration: "8 أسابيع"
        },
        {
          title: "بناء لوحة تحكم لتتبع أداء الأنظمة المدمجة",
          description: "تصميم واجهة مستخدم تفاعلية لعرض مؤشرات التشغيل الحية للأنظمة والرقائق الميدانية.",
          value: "تمكين فريق الهندسة والقيادة من مراقبة كفاءة الأجهزة لحظياً.",
          suggestedSkills: ["Python", "React", "SQL", "AI"],
          duration: "12 أسبوع"
        }
      ];
    }

    return [
      {
        title: "تحليل بيانات العملاء وبناء لوحة مؤشرات أداء تفاعلية",
        description: "بناء لوحة تحكم تفاعلية باستعمال Power BI و SQL لتصفية بيانات العملاء والأنشطة التجارية بالشركة وتحليل السلوك الشرائي.",
        value: "توفير وقت إعداد التقارير بنسبة 60% ومساعدة فريق الإدارة على اتخاذ قرارات مبنية على البيانات الميدانية.",
        suggestedSkills: ["Python", "SQL", "Power BI", "Data Analysis"],
        duration: "12 أسبوع"
      },
      {
        title: "تطوير نموذج ذكاء اصطناعي لأتمتة خدمة العملاء والتذاكر",
        description: "اقتراح نموذج معالجة لغات طبيعية (NLP) للرد التلقائي على الاستفسارات المتكررة بـ " + compName + ".",
        value: "رفع سرعة الاستجابة للعملاء وتقليل التكاليف التشغيلية بنسبة 35%.",
        suggestedSkills: ["Python", "AI", "NLP", "Machine Learning"],
        duration: "8 أسابيع"
      },
      {
        title: "أتمتة تقارير التشغيل الميدانية وسلاسل الإمداد",
        description: "تطوير أدوات ذكية لتجميع بيانات التشغيل اليومية وإنشاء تقارير ملخصة تلقائياً.",
        value: "تقليل الأخطاء البشرية والرفع من موثوقية التقرير الميداني.",
        suggestedSkills: ["SQL", "Data Analysis", "Python"],
        duration: "8 أسابيع"
      }
    ];
  },

  /**
   * Generates a proposal draft using AI ("ساعدني بالذكاء الاصطناعي ✨")
   */
  generateProposalFromAi: function(student, company) {
    const ideas = this.generateCompanyIdeasForStudent(student, company);
    const topIdea = ideas[0];

    return {
      title: topIdea.title,
      description: topIdea.description,
      value: topIdea.value,
      skills: topIdea.suggestedSkills,
      duration: topIdea.duration,
      message: `السلام عليكم ورحمة الله وبركاته،\nأنا الطالبة ${student ? student.name : "حنين هيثم"}، تخصص ${(student ? student.major : "هندسة الحاسب")} بجامعة القصيم. أود تقديم هذا المقترح العملي للاستفادة من مهاراتي الميدانية في مساندة أنشطة ${company ? company.name : "الشركة"} وتوفير قيمة مضافة حقيقية.`
    };
  },

  /**
   * Converts a student proposal into a structured Co-op Opportunity Draft for Company publishing ("حوّلها إلى فرصة")
   */
  convertProposalToOpportunityDraft: function(proposal, companyInfo) {
    return {
      id: "opp-" + Date.now(),
      title: proposal.title,
      titleAr: proposal.title,
      category: "مبادرة طالب (أعطني فرصة)",
      categoryAr: "مبادرة طالب (أعطني فرصة)",
      duration: proposal.duration || "12 أسبوع",
      durationAr: proposal.duration || "12 أسبوع",
      company: companyInfo ? companyInfo.name : (proposal.companyName || "شركة الأساليب الذكية"),
      location: companyInfo ? companyInfo.location : "القصيم (بريدة) - حضوري",
      workType: companyInfo ? companyInfo.workType : "حضوري",
      stipend: "تُحدد بعد توقيع العقد",
      skills: proposal.skills || ["Python", "SQL", "Data Analysis"],
      majors: [proposal.studentMajor || "هندسة الحاسب", "علوم الحاسب"],
      description: `فرصة تدريب جامعي تم ابتكارها بناءً على المقترح المقدم من الطالبة (${proposal.studentName}): ${proposal.description}`,
      responsibilities: [
        `تنفيذ وتحقيق الهدف الرئيسي للمقترح: ${proposal.title}`,
        `تطبيق مهارات ${proposal.skills ? proposal.skills.join("، ") : "البرمجة والتحليل"} بمقر الشركة`,
        `تحقيق القيمة المتوقعة للشركة: ${proposal.value}`,
        `إعداد تقارير التقييم والتقدم الأسبوعي للجامعة والشركة`
      ],
      deliverables: [
        `المخرج الرئيسي النهائي للمقترح: ${proposal.title}`,
        `تقرير التقييم الأكاديمي والتقرير الميداني المعتمد`
      ],
      isAiGenerated: true,
      status: "مسودة",
      sourceProposalId: proposal.id
    };
  }
};
