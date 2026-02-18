import React, { useState } from "react";
import { User, Settings, Info, Star, Sun, Moon, Globe, Camera, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "../context/SettingsContext";

const ProfilePage = () => {
  const { lang, setLang, isDark, setIsDark, t } = useSettings();
  const [avatar, setAvatar] = useState<string | null>(localStorage.getItem("user_avatar"));
  
  // "Жөнүндө" терезесин башкаруу үчүн state
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setAvatar(base64);
        localStorage.setItem("user_avatar", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Баа берүү функциясы (Шилтемеге багыттайт)
  const handleRateApp = () => {
    // Бул жерге өзүңүздүн шилтемени коюңуз
    window.open("https://play.google.com/store/apps", "_blank");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-900 text-white" : "bg-gray-50 text-slate-900"} pb-24 px-4 pt-6`}>
      <div className="max-w-lg mx-auto">
        
        <h1 className="font-bold text-xl mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-500" />
          {t.profile || "Профиль"}
        </h1>

        {/* Аватар бөлүмү */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center text-center mb-8"
        >
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-blue-600 overflow-hidden bg-gray-200 flex items-center justify-center shadow-xl">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg border-2 border-white dark:border-slate-900">
              <Camera className="w-4 h-4 text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <h2 className="mt-4 font-bold text-lg">{t.user || "Саякатчы"}</h2>
          <p className="text-sm opacity-60">{t.status || "AkylTour колдонуучусу"}</p>
        </motion.div>

        {/* Жөндөөлөр менюсу */}
        <div className="space-y-4">
          
          {/* Тилди тандоо */}
          <div className={`flex items-center justify-between p-4 rounded-[2rem] border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"} shadow-sm`}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <span className="font-semibold">{t.lang || "Тил"}</span>
            </div>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent outline-none text-sm font-bold cursor-pointer text-blue-500"
            >
              <option value="ky" className={isDark ? "bg-slate-800" : ""}>Кыргызча</option>
              <option value="ru" className={isDark ? "bg-slate-800" : ""}>Русский</option>
              <option value="en" className={isDark ? "bg-slate-800" : ""}>English</option>
            </select>
          </div>

          {/* Теманы алмаштыруу */}
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`w-full flex items-center justify-between p-4 rounded-[2rem] border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"} shadow-sm active:scale-95 transition-all`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDark ? "bg-yellow-400/10" : "bg-orange-500/10"}`}>
                {isDark ? <Moon className="w-5 h-5 text-yellow-400" /> : <Sun className="w-5 h-5 text-orange-500" />}
              </div>
              <span className="font-semibold">{t.theme || "Тема"}</span>
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-500">
              {isDark ? (t.dark || "Кара") : (t.light || "Ак")}
            </span>
          </button>

          {/* Бааңыз баскычы */}
          <button
            onClick={handleRateApp}
            className={`w-full flex items-center gap-4 p-4 rounded-[2rem] border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"} shadow-sm text-left active:scale-95 transition-all`}
          >
            <div className="p-2 rounded-xl bg-amber-500/10">
              <Star className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="font-semibold">{t.rate || "Бааңыз"}</p>
              <p className="text-[10px] opacity-50 font-medium uppercase tracking-tighter">App Store & Play Market</p>
            </div>
          </button>

          {/* Жөнүндө баскычы */}
          <button
            onClick={() => setIsAboutOpen(true)}
            className={`w-full flex items-center gap-4 p-4 rounded-[2rem] border ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100"} shadow-sm text-left active:scale-95 transition-all`}
          >
            <div className="p-2 rounded-xl bg-emerald-500/10">
              <Info className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="font-semibold">{t.about || "Жөнүндө"}</p>
              <p className="text-[10px] opacity-50 font-medium uppercase tracking-tighter">AkylTour v1.0</p>
            </div>
          </button>
        </div>

        <p className="text-center text-[10px] opacity-30 mt-12 tracking-[0.3em] font-bold uppercase">
          © 2026 Kaldarov
        </p>
      </div>

      {/* --- Жөнүндө (About) Modal терезеси --- */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAboutOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl ${isDark ? "bg-slate-800 text-white" : "bg-white text-slate-900"}`}
            >
              <button 
                onClick={() => setIsAboutOpen(false)}
                className="absolute top-4 right-4 p-2 opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="p-4 bg-blue-500/10 rounded-3xl mb-4">
                  <Info className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-2xl font-black mb-2">AkylTour</h3>
                <p className="text-sm opacity-70 leading-relaxed mb-6">
                  Бул колдонмо саякатчыларга ыңгайлуу маршрут түзүү жана Кыргызстандын кооз жерлерин табууга жардам берүү үчүн иштелип чыккан.
                </p>
                <div className="w-full pt-6 border-t border-gray-100 dark:border-slate-700">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Версия: 1.0.0</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-1">Иштеп чыккан: Kaldarov Amantur Azyrovich</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;