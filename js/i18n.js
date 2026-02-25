const translations = {
  zh: {
    hero: {
      greeting: "你好。",
      intro: "我叫",
      name: "HimiCos",
      bio: "只是一个探索广阔编程世界的学生，被 AI 深深吸引，这点燃了我的旅程。目前正在学习大型语言模型 (LLM)。一个安静的学习者，喜欢技术讨论。",
      role: "全栈开发者",
      tagline: "以精准编码，用心设计",
      location: "地球",
      status: "可联系",
      exp: "5+ 年经验",
    },
    skills: {
      title: "技能",
      frontend: "前端",
      backend: "后端",
      tools: "工具 & DevOps",
    },
    albums: {
      coverAlt: "专辑封面",
      photoAlt: "个人照片",
      imageError: "图片加载失败",
      giftText: "硕硕送的礼物",
    },
    music: {
      title: "我喜欢的音乐",
    },
    projects: {
      title: "项目",
      viewProject: "查看项目",
    },
    contact: {
      title: "联系方式",
      email: "邮箱",
    },
    footer: {
      rights: "保留所有权利。",
    },
  },
  en: {
    hero: {
      greeting: "Hello.",
      intro: "My name is",
      name: "HimiCos",
      bio: "Just a student exploring the vast world of programming, fascinated by AI, which ignited this journey. Currently learning large language models (LLMs). A quiet learner who enjoys technical discussions.",
      role: "Full Stack Developer",
      tagline: "Code with precision, design with purpose",
      location: "Earth",
      status: "Available",
      exp: "5+ Years",
    },
    skills: {
      title: "Skills",
      frontend: "Frontend",
      backend: "Backend",
      tools: "Tools & DevOps",
    },
    albums: {
      coverAlt: "album cover",
      photoAlt: "personal photo",
      imageError: "Image failed to load",
      giftText: "Gift from Shuoshuo",
    },
    music: {
      title: "Music I Love",
    },
    projects: {
      title: "Projects",
      viewProject: "View Project",
    },
    contact: {
      title: "Contact",
      email: "Email",
    },
    footer: {
      rights: "All rights reserved.",
    },
  },
};

let currentLang = "zh";

function initLanguage() {
  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    currentLang = savedLang;
  } else {
    const browserLang = navigator.language || navigator.userLanguage;
    currentLang = browserLang.startsWith("zh") ? "zh" : "en";
  }

  updateLanguage();
  updateLangButton();
}

function updateLanguage() {
  const elements = document.querySelectorAll("[data-i18n]");

  elements.forEach((element) => {
    const key = element.getAttribute("data-i18n");
    const keys = key.split(".");

    let translation = translations[currentLang];
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k];
      } else {
        translation = undefined;
        break;
      }
    }

    if (translation) {
      element.textContent = translation;
    }
  });

  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";

  localStorage.setItem("language", currentLang);
}

function updateLangButton() {
  const langText = document.querySelector(".lang-text");
  const langToggle = document.getElementById("langToggle");
  
  if (langText) {
    langText.textContent = currentLang === "zh" ? "EN" : "中文";
  }
  
  if (langToggle) {
    langToggle.setAttribute("aria-pressed", currentLang === "en" ? "true" : "false");
  }
}

function toggleLanguage() {
  currentLang = currentLang === "zh" ? "en" : "zh";
  updateLanguage();
  updateLangButton();

  if (typeof renderProjects === "function") {
    renderProjects();
  }

  if (typeof renderAlbums === "function") {
    renderAlbums();
  }
}

window.i18n = {
  init: initLanguage,
  toggle: toggleLanguage,
  getCurrentLang: () => currentLang,
  t: (key) => {
    const keys = key.split(".");
    let translation = translations[currentLang];
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k];
      } else {
        translation = undefined;
        break;
      }
    }
    return translation || key;
  },
};
