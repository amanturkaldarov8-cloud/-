import React, { useEffect, useState } from "react";
import { Trash2, MapPin, Fuel, Banknote, History, ArrowUpRight } from "lucide-react";

const SavedPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // localStorage'дан маалымат алуу
    try {
      const data = JSON.parse(localStorage.getItem("travel_history") || "[]");
      setHistory(data);
    } catch (e) {
      console.error("Маалыматты окууда ката кетти");
    }
  }, []);

  const deleteItem = (id: number) => {
    const newData = history.filter((item: any) => item.id !== id);
    setHistory(newData);
    localStorage.setItem("travel_history", JSON.stringify(newData));
  };

  // Жалпы чыгымды эсептөө
  const totalSpend = history.reduce((acc, item: any) => acc + Number(item.cost || 0), 0);

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-32 pt-8 px-4 font-sans">
      <div className="max-w-md mx-auto">
        
        {/* 🏆 Жогорку Баланс Картасы */}
        <div className="bg-gradient-to-br from-blue-700 to-indigo-600 rounded-[30px] p-6 mb-8 shadow-xl shadow-blue-200 relative overflow-hidden text-white">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-blue-100 text-sm font-medium">Жалпы чыгым</span>
              <History size={20} className="opacity-50" />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-black">{totalSpend}</h2>
              <span className="text-lg font-bold text-blue-200">СОМ</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Журнал жаңыртылды
            </div>
          </div>
          {/* Дизайн үчүн тегеректер */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        <h3 className="text-lg font-black text-slate-800 mb-4 px-2">Акыркы багыттар</h3>

        {/* 📋 Тизме */}
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((item: any) => (
              <div 
                key={item.id} 
                className="bg-white rounded-[24px] p-4 shadow-sm border border-white hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 leading-tight">{item.to}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">{item.date}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* Статистика бөлүмү */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Аралык</p>
                    <p className="text-sm font-black text-slate-700">{item.distance} км</p>
                  </div>
                  
                  <div className="flex-1 bg-green-50/50 p-3 rounded-2xl border border-green-100/50">
                    <div className="flex items-center gap-1 mb-1 text-green-600">
                      <Fuel size={12} />
                      <p className="text-[9px] font-black uppercase">Бензин</p>
                    </div>
                    <p className="text-sm font-black text-green-700">{item.fuel} л</p>
                  </div>

                  <div className="flex-1 bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
                    <div className="flex items-center gap-1 mb-1 text-blue-600">
                      <Banknote size={12} />
                      <p className="text-[9px] font-black uppercase">Чыгым</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black text-blue-700">{item.cost} с</p>
                      <ArrowUpRight size={12} className="text-blue-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[30px] py-16 px-6 text-center border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="text-slate-200" size={32} />
              </div>
              <p className="text-slate-400 font-bold">Азырынча эч нерсе сактала элек</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedPage;