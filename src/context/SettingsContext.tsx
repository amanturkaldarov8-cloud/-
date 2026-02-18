import React, { createContext, useContext, useState, useEffect } from "react";

// Тилдердин базасы
const translations = {
  ky: {
    heroTitle: "Кыргызстан боюнча акылдуу гид",
    heroSub: "Бюджетиңизге жана убактыңызга ылайык маршрут түзүңүз",
    quickPlan: "Тез пландоо",
    budget: "Бюджет (сом)",
    days: "Күндөр",
    createRoute: "Маршрут түзүү",
    listening: "Угуп жатам...",
    pressMic: "Микрофонду басыңыз",
    writeQuestion: "Суроо жазыңыз...",
    newChat: "Жаңы чат",
    interests: {
      mountains: "🏔 Тоолор", lakes: "🏖 Көлдөр", history: "🏛 Тарых",
      food: "🍖 Тамак-аш", culture: "🎭 Маданият", horse: "🐴 Ат минүү", nature: "🌿 Жаратылыш"
    }
  },
  ru: {
    heroTitle: "Умный гид по Кыргызстану",
    heroSub: "Создайте маршрут исходя из вашего бюджета и времени",
    quickPlan: "Быстрое планирование",
    budget: "Бюджет (сом)",
    days: "Дни",
    createRoute: "Создать маршрут",
    listening: "Слушаю...",
    pressMic: "Нажмите микрофон",
    writeQuestion: "Напишите вопрос...",
    newChat: "Новый чат",
    interests: {
      mountains: "🏔 Горы", lakes: "🏖 Озера", history: "🏛 История",
      food: "🍖 Еда", culture: "🎭 Культура", horse: "🐴 Верховая езда", nature: "🌿 Природа"
    }
  },
  en: {
    heroTitle: "AI Guide for Kyrgyzstan",
    heroSub: "Create a route based on your budget and time",
    quickPlan: "Quick Planning",
    budget: "Budget (som)",
    days: "Days",
    createRoute: "Create Route",
    listening: "Listening...",
    pressMic: "Press microphone",
    writeQuestion: "Write a question...",
    newChat: "New Chat",
    interests: {
      mountains: "🏔 Mountains", lakes: "🏖 Lakes", history: "🏛 History",
      food: "🍖 Food", culture: "🎭 Culture", horse: "🐴 Horseback", nature: "🌿 Nature"
    }
  }
};

const SettingsContext = createContext<any>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState(localStorage.getItem("lang") || "ky");
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
  }, [lang, isDark]);

  const t = translations[lang as keyof typeof translations] || translations.ky;

  return (
    <SettingsContext.Provider value={{ lang, setLang, isDark, setIsDark, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);