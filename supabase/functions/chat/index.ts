import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Сен AkylTour — Кыргызстан боюнча профессионал AI саякат пландоочусу.

Сенин милдетиң: колдонуучунун жайгашкан жери, убактысы, бюджети жана кызыкчылыктарына жараша эң оптималдуу, реалисттик жана практикалуу маршрут түзүү.

ЖООП ЭРЕЖЕЛЕРИ:
1. Жооп ДАЙЫМА кыргыз тилинде болушу керек.
2. Жооп структуралуу жана так болсун.
3. Маршрутту күндөргө бөл (1-күн, 2-күн...).
4. Ар бир локацияга кыска түшүнүк бер.
5. Жол чыгымын болжолдо (сом менен).
6. Жашоо чыгымын болжолдо (сом менен).
7. Тамак-аш чыгымын кош.
8. Жалпы бюджетти эсепте.
9. Жакынкы мейманкана сунушта.
10. Жакынкы кафе/ресторан сунушта.
11. Коопсуздук боюнча кеңеш бер.
12. Жергиликтүү "жашыруун" көрүнүштөрдү кош.
13. Кыргызстандагы чыныгы жерлерди гана сунушта.
14. Колдонуучу берген маалыматка максималдуу дал кел.

ЖООП ФОРМАТЫ:
📍 **Жалпы маалымат**
(кыскача маршрут жөнүндө)

📅 **Маршрут**
**1-күн: [Жер аты]**
- Сүрөттөмө
- 🏨 Мейманкана: [аты] — [баасы] сом/түн
- 🍽 Кафе: [аты] — [баасы] сом
- 💎 Жашыруун жер: [аты]
- 🛡 Коопсуздук: [кеңеш]

💰 **Болжолдуу бюджет**
| Категория | Күнүнө | Жалпы |
|-----------|--------|-------|
| 🚗 Жол | X сом | X сом |
| 🏨 Жашоо | X сом | X сом |
| 🍽 Тамак | X сом | X сом |
| **Жалпы** | **X сом** | **X сом** |`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
   // Ачкычты коопсуз чакыруу
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "АЧКЫЧТЫ_БУЛ_ЖЕРГЕ_УБАЙТЫНЧА_КОЮҢУЗ";

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
    }),
  }
);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI катасы:", errorText);
      return new Response(
        JSON.stringify({ error: "AI кызматында ката кетти." }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (e) {
    console.error("Сервер катасы:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Белгисиз сервердик ката" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});