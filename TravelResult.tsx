import { MapPin, Hotel, UtensilsCrossed, Shield, Gem, Wallet } from "lucide-react";
import type { TravelData } from "./TravelForm";

interface TravelResultProps {
  data: TravelData;
}

// Kyrgyzstan travel data
const ROUTES: Record<string, { name: string; desc: string; secret: string; hotel: string; cafe: string; safety: string }[]> = {
  default: [
    { name: "Ала-Арча улуттук паркы", desc: "Бишкектен 40 км аралыкта, укмуштуудай тоо пейзажы. Трекинг жана жаратылыш менен таанышуу.", secret: "Ак-Сай шаркыратмасы — аз адам билген, бирок укмуштуу жер.", hotel: "Ала-Арча гостиница — 2500-5000 сом/түн", cafe: "Парк ичиндеги кафе — 500-800 сом", safety: "Тоого жөнөөрдөн мурун аба ырайын текшериңиз." },
    { name: "Ысык-Көл, Чолпон-Ата", desc: "Дүйнөдөгү эң чоң тоо көлдөрүнүн бири. Пляж, музей жана петроглифтер.", secret: "Рух Ордо маданий борбору — көлдүн жанындагы сулуу жер.", hotel: "Raduga Hotel — 3000-7000 сом/түн", cafe: "Бишкек кафеси — 600-1200 сом", safety: "Суудан сак болуңуз, агымы күчтүү жерлер бар." },
    { name: "Каракол шаары", desc: "Тарыхый мечит, чиркөө жана Каракол базары менен таанышуу.", secret: "Жети-Өгүз — жети кызыл аска, сүрөттүү жер.", hotel: "Green Yard Hotel — 2000-5000 сом/түн", cafe: "Каракол ашканасы — 400-900 сом", safety: "Кышында жолдор муздак, дайым даяр болуңуз." },
    { name: "Сон-Көл көлү", desc: "3016 метр бийиктикте жайгашкан жайлоо көлү. Жүргүнчүлөр боз үйдө жашай алат.", secret: "Жергиликтүү малчылардын боз үйүндө түнөп, кымыз ичиңиз.", hotel: "Боз үй кэмп — 1500-3000 сом/түн", cafe: "Жергиликтүү тамак — 300-600 сом", safety: "Бийиктикке көнүүгө убакыт бериңиз." },
    { name: "Арсланбоб", desc: "Дүйнөдөгү эң чоң жаңгак токою. Шаркыратмалар жана жаратылыш.", secret: "Чоң шаркыратма — 80 метрлик укмуштуу шаркыратма.", hotel: "CBT Арсланбоб — 1500-3000 сом/түн", cafe: "Арсланбоб чайканасы — 300-700 сом", safety: "Жолдор тик, ыңгайлуу бут кийим кийиңиз." },
    { name: "Таш-Рабат караван-сарайы", desc: "15-кылымдагы таш имарат, Улуу Жибек Жолунун эстелиги.", secret: "Жылдыздарды байкоо үчүн эң сонун жер — жарык жарыгы жок.", hotel: "Боз үй кэмп — 1000-2000 сом/түн", cafe: "Жергиликтүү тамак — 300-500 сом", safety: "Түнкүсүн абдан суук, жылуу кийим алыңыз." },
  ],
};

const getBudgetMultiplier = (budget: string) => {
  switch (budget) {
    case "low": return 0.7;
    case "high": return 1.8;
    default: return 1;
  }
};

const TravelResult = ({ data }: TravelResultProps) => {
  const spots = ROUTES.default;
  const routeSpots = spots.slice(0, Math.min(data.days, spots.length));
  const mult = getBudgetMultiplier(data.budget);

  const dailyTransport = Math.round(1500 * mult);
  const dailyHotel = Math.round(3000 * mult);
  const dailyFood = Math.round(1200 * mult);
  const dailyTotal = dailyTransport + dailyHotel + dailyFood;
  const totalBudget = dailyTotal * data.days;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          📍 Жалпы маалымат
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {data.location} шаарынан баштап {data.days} күндүк маршрут.{" "}
          {data.interests.length > 0 && `Кызыкчылыктар: ${data.interests.join(", ")}`}
        </p>
      </div>

      {/* Daily Route */}
      <div className="space-y-4">
        <h3 className="font-display text-lg font-semibold text-foreground">📅 Маршрут</h3>
        {routeSpots.map((spot, i) => (
          <div key={i} className="p-4 rounded-xl bg-card border border-border space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <div>
                <h4 className="font-display font-semibold text-foreground">{spot.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">{spot.desc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Hotel className="w-3.5 h-3.5 text-primary" />
                {spot.hotel}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UtensilsCrossed className="w-3.5 h-3.5 text-accent" />
                {spot.cafe}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-meadow" />
                {spot.safety}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Gem className="w-3.5 h-3.5 text-secondary" />
                {spot.secret}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Budget */}
      <div className="p-4 rounded-xl bg-card border border-border space-y-3">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Wallet className="w-5 h-5 text-accent" />
          💰 Болжолдуу бюджет
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-xs text-muted-foreground">🚗 Жол</div>
            <div className="font-semibold text-foreground">{dailyTransport.toLocaleString()} сом/күн</div>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-xs text-muted-foreground">🏨 Жашоо</div>
            <div className="font-semibold text-foreground">{dailyHotel.toLocaleString()} сом/күн</div>
          </div>
          <div className="p-3 rounded-lg bg-muted">
            <div className="text-xs text-muted-foreground">🍽 Тамак</div>
            <div className="font-semibold text-foreground">{dailyFood.toLocaleString()} сом/күн</div>
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-accent/10 border border-accent/20">
          <div className="text-sm text-muted-foreground">Жалпы ({data.days} күн)</div>
          <div className="text-2xl font-display font-bold text-gradient-gold">
            {totalBudget.toLocaleString()} сом
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelResult;
