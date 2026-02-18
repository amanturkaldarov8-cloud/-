import { useState } from "react";
import { MapPin, Calendar, Wallet, Heart, Send } from "lucide-react";

interface TravelFormProps {
  onSubmit: (data: TravelData) => void;
  isLoading: boolean;
}

export interface TravelData {
  location: string;
  days: number;
  budget: string;
  interests: string[];
}

const INTERESTS = [
  { id: "mountains", label: "🏔 Тоолор", },
  { id: "lakes", label: "🏖 Көлдөр", },
  { id: "history", label: "🏛 Тарых", },
  { id: "food", label: "🍖 Тамак-аш", },
  { id: "adventure", label: "🧗 Укмуш", },
  { id: "culture", label: "🎭 Маданият", },
  { id: "nature", label: "🌿 Жаратылыш", },
  { id: "horse", label: "🐴 Ат мингүү", },
];

const TravelForm = ({ onSubmit, isLoading }: TravelFormProps) => {
  const [location, setLocation] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("medium");
  const [interests, setInterests] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ location, days, budget, interests });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent" />
          Азыркы жайгашкан жериңиз
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Мисалы: Бишкек"
          className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          required
        />
      </div>

      {/* Days */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4 text-accent" />
          Канча күн? — {days} күн
        </label>
        <input
          type="range"
          min={1}
          max={14}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 күн</span>
          <span>14 күн</span>
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Wallet className="w-4 h-4 text-accent" />
          Бюджет
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "low", label: "💵 Үнөмдүү", desc: "~5000 сом/күн" },
            { value: "medium", label: "💰 Орточо", desc: "~10000 сом/күн" },
            { value: "high", label: "💎 Премиум", desc: "~20000+ сом/күн" },
          ].map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => setBudget(b.value)}
              className={`p-3 rounded-lg border text-center transition-all text-sm ${
                budget === b.value
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-accent/50"
              }`}
            >
              <div className="font-medium">{b.label}</div>
              <div className="text-xs mt-1 opacity-70">{b.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Heart className="w-4 h-4 text-accent" />
          Кызыкчылыктарыңыз
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest.id}
              type="button"
              onClick={() => toggleInterest(interest.id)}
              className={`px-3 py-2 rounded-full text-sm transition-all ${
                interests.includes(interest.id)
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {interest.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !location}
        className="w-full py-3.5 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Маршрут түзүү
          </>
        )}
      </button>
    </form>
  );
};

export default TravelForm;
