import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Сен AkylTour — Кыргызстан боюнча профессионал AI саякат пландоочусусуң.
Жоопту ДАЙЫМА кыргыз тилинде, структуралуу жана так бер. Маршрутту күндөргө бөл, чыгымдарды сом менен эсепте.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Groq ачкычын Supabase Secrets'тен алат
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Бул Groq'тогу бекер модель
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ content: reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
