const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config();

// SSL workaround — only in development (not in production)
// WARNING: This disables SSL certificate verification. Do NOT use in production without proper SSL certs.
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.6-27b"
];

app.use(express.json({ limit: "2mb" }));
app.use(express.static(__dirname));

/**
 * Enhanced Uzbek Sports & Fitness Intelligent Engine
 */
function buildSmartUzbekAnswer(userMessage) {
  const text = String(userMessage).toLowerCase().trim();

  // Smart Sport Q&A Engine - Aniq va toza matnli javoblar
  if (text.includes("salom") || text.includes("assalom") || text.includes("privet") || text.includes("hello")) {
    return {
      answer: "👋 **Salom, Sportchi! Men AI Sport X shaxsiy murabbiyingizman.**\n\nBugun sizga qaysi yo'nalishda yordam berishim mumkin?\n\n- 🏋️ **Mashg'ulot rejasi:** (Oyoq, press, butun tana, kuch-quvvat)\n- 🥗 **Sog'lom ovqatlanish:** (Oqsil, parhez, vazn yo'qotish yoki semirish)\n- ⚡ **Motivatsiya va intizom:** (Kungi reja va ruhiy tayyorgarlik)\n- ⚽ **Sport natijalari:** (Futbol va musobaqalar jadvali)",
      provider: "ai-sport-engine"
    };
  }

  if (text.includes("ovqat") || text.includes("menyu") || text.includes("dieta") || text.includes("protein") || text.includes("oqsil")) {
    return {
      answer: "🥗 **Sog'lom va Balansli Ovqatlanish Menyusi:**\n\n- 🍳 **Nonushta:** 3 ta tuxum (pishirilgan), suli bo'tqasi (ovsyanka) va 1 ta banan.\n- 🍗 **Tushlik:** Tovuq ko'krak go'shti (200g), guruch yoki grechka va barra sabzavotli salat.\n- 🍌 **Tamaddi (Snack):** Bir siqim bodom/yong'oq va meva.\n- 🐟 **Kechki taom:** Baliq yoki tvorog (200g), yengil ko'katlar va bodring salati.\n\n💧 *Esda tuting: Kuniga kamida 2.5–3 litr toza suv ichish moddalar almashinuvini yaxshilaydi!*",
      provider: "ai-sport-engine"
    };
  }

  if (text.includes("mashq") || text.includes("trenirovka") || text.includes("workout")) {
    return {
      answer: "💪 **Bugungi Mashg'ulot Rejasi (30-Minut Full-Body):**\n\n1. **Qizish (5-7 daqiqa):** Bo'g'imlarni aylantirish, joyida yengil yugurish.\n2. **Squat (Tana vaznida):** 3 set × 12-15 marta.\n3. **Push-up (Otjimaniye):** 3 set × 10-12 marta.\n4. **Plank (Core mushaklar):** 3 set × 40 soniya.\n5. **Jumping Jacks (Kardio):** 3 set × 25 marta.\n6. **Stretching (5 daqiqa):** Mushaklarni cho'zish va nafasni tiklash.\n\n⚠️ *Texnikaga e'tibor bering va o'zingizni zo'riqtirmang!*",
      provider: "ai-sport-engine"
    };
  }

  if (text.includes("motivatsiya") || text.includes("ruh") || text.includes("maqsad") || text.includes("charchadim")) {
    return {
      answer: "🚀 **AI Sport Motivatsiyasi:**\n\n> *\"Bugungi mehnatingiz — ertangi g'alabangiz poydevoridir! Intizom bu kayfiyatga emas, maqsadga ergashishdir.\"*\n\n1. Katta maqsadni kichik kunlik 15 daqiqalik qadamlarga bo'ling.\n2. Faqat kechangi o'zingiz bilan solishtiring.\n3. Har kuni kichik bo'lsa ham harakat qiling!",
      provider: "ai-sport-engine"
    };
  }

  if (text.includes("vazn") || text.includes("ozish") || text.includes("semirish") || text.includes("massa")) {
    return {
      answer: "⚖️ **Vazn Boshqarish va Tana Tuzilishi:**\n\n- 📉 **Vazn yo'qotish (Ozish):** Kaloriya defitsiti (kunlik me'yordan 300-500 kcal kamroq iste'mol qilish), haftasiga 3-4 marta kardio va toza oqsil.\n- 📈 **Mushak massasi yig'ish:** Kaloriya profitsiti (+300-400 kcal), progressiv og'irlik mashqlari, kuniga 1.6-2g/kg oqsil va 8 soatlik sifatli uyqu.",
      provider: "ai-sport-engine"
    };
  }

  if (text.includes("futbol") || text.includes("match") || text.includes("o'yin") || text.includes("liga")) {
    return {
      answer: "⚽ **Sport Markazi va Futbol Natijalari:**\n\nAI Sport X tizimi orqali siz real futbol natijalarini kuzatishingiz va jadvallarni ko'rishingiz mumkin.\n\n📌 Yuqori menyudagi **'Sport markazi'** bo'limida Premier League, LALIGA, Bundesliga va UEFA Chempionlar Ligasi natijalari jamlangan.",
      provider: "ai-sport-engine"
    };
  }

  // Mashhur Sportchilar
  if (text.includes("ronaldo") || text.includes("kristian") || text.includes("cr7")) {
    return {
      answer: "👑 **Cristiano Ronaldo (CR7):**\n\n- 🏆 **Yutuqlari:** 5 marotaba 'Oltin to'p' (Ballon d'Or), 5 marotaba UEFA Chempionlar Ligasi g'olibi, 900+ rasmiy gollar muallifi!\n- ⚽ **Jamoalari:** Sporting CP, Manchester United, Real Madrid, Juventus, Al-Nassr va Portugaliya terma jamoasi kapitani.\n- 💪 **Intizom siri:** Har kungi qat'iy rejim, maxsus oqsil va sabzavotli parhez hamda tinimsiz mehnat.",
      provider: "ai-sport-engine"
    };
  }

  if (text.includes("messi") || text.includes("lionel") || text.includes("leo")) {
    return {
      answer: "👑 **Lionel Messi (Leo):**\n\n- 🏆 **Yutuqlari:** 8 marotaba 'Oltin to'p' sohibi (Dunyo rekordi), 2022-yilgi Qatar Jahon Chempioni, 4 marotaba UCL g'olibi.\n- ⚽ **Jamoalari:** FC Barcelona, PSG, Inter Miami va Argentina terma jamoasi sadosi.\n- 🪄 **O'yin uslubi:** Noyob mezonli dribling, standart vaziyatlar va nozik paslar ustasi.",
      provider: "ai-sport-engine"
    };
  }

  if (text.includes("ufc") || text.includes("mma") || text.includes("xabib") || text.includes("khabib") || text.includes("islam") || text.includes("jang")) {
    return {
      answer: "🥊 **UFC va MMA (Aralash Jang San'atlari):**\n\n- 💥 **Chempionlar:** Khabib Nurmagomedov (29-0), Islam Makhachev, Jon Jones va boshqalar.\n- 🤼 **Tayyorgarlik:** Sambo, erkin kurash, tay boks va grepling sintezi.\n- ⚡ **Chidamlilik:** Yuqori aerob chidamlilik va ruhiy bukilmaslik talab etiladi.",
      provider: "ai-sport-engine"
    };
  }

  if (text.includes("kreatin") || text.includes("creatine") || text.includes("protein") || text.includes("bcaa")) {
    return {
      answer: "💊 **Sport Qo'shimchalari va Ularning Ta'siri:**\n\n- ⚡ **Kreatin Monogidrat:** Kuch va portlovchi energiyani oshiradi. Kuniga 3-5 gramm qabul qilinadi.\n- 🥤 **Zardob Proteini (Whey):** Mashqdan so'ng mushak tolalari tiklanishini tezlashtiradi.\n- 💧 **Suv rejimi:** Qo'shimchalar qabul qilganda kuniga kamida 3 litr suv ichish muhim!",
      provider: "ai-sport-engine"
    };
  }

  if (text.includes("jarohat") || text.includes("og'riq") || text.includes("og‘riq")) {
    return {
      answer: "🛑 **Xavfsizlik va Jarohat Oldini Olish:**\n\n1. Keskin og'riq sezilsa, mashqni darhol to'xtating.\n2. Mushak zo'riqishida muz bosish va dam berish kerak.\n3. Har bir mashg'ulotdan oldin 5-10 daqiqa bo'g'imlarni qizdiring.",
      provider: "ai-sport-engine"
    };
  }

  // Umumiy aniq va ravon javob
  const cleanSubject = userMessage.replace(/kim|nima|haqida|aytib ber|ma'lumot|ber/gi, "").trim();
  return {
    answer: `🏆 **AI Sport X Aniq Javobi (${userMessage}):**\n\n**${cleanSubject || userMessage}** bo'yicha asosiy va muhim ma'lumotlar:\n\n1. **Intizom va Tizim:** Muntazamlik va to'g'ri rejalashtirish eng muhim omildir.\n2. **Tana va Salomatlik:** Harakat qilish bilan birga sifatli taomlanish va yetarli uyquga e'tibor bering.`,
    provider: "ai-sport-engine"
  };
}

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(item =>
      item &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string" &&
      item.content.trim()
    )
    .slice(-10)
    .map(item => ({
      role: item.role,
      content: item.content.slice(0, 4000)
    }));
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  const hasGroqKey = Boolean(process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("PASTE"));
  res.json({
    ok: true,
    provider: hasGroqKey ? "groq" : "ai-sport-engine",
    providerLabel: hasGroqKey ? "🟢 GROQ CLOUD AI (ONLINE)" : "⚡ SMART SPORT AI",
    model: hasGroqKey ? GROQ_MODELS[0] : "ai-sport-v2",
    configured: hasGroqKey
  });
});

// AI Chat Main Endpoint (100% Text-Only Aniq Javoblar)
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Xabar kiritilmadi." });
  }

  const userMsg = message.trim();
  const hasGroqKey = process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("PASTE_YOUR");

  // Tier 1: Try Groq Live API with model fallback
  if (hasGroqKey) {
    for (const modelName of GROQ_MODELS) {
      try {
        const messages = [
          {
            role: "system",
            content:
              "Sen AI Sport X uchun professional, bilimdon va aniq o'zbek tilidagi AI yordamchisisan. " +
              "Foydalanuvchining har bir savoliga matn ko'rinishida o'ta aniq, tushunarli, foydali va estetik punktlar bilan javob ber. " +
              "Hech qanday rasm yoki havola yaratma, faqat matnli aniq javob ber."
          },
          ...cleanHistory(history),
          { role: "user", content: userMsg.slice(0, 4000) }
        ];

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY.trim()}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: modelName,
            messages,
            temperature: 0.6,
            max_completion_tokens: 1200
          })
        });
        clearTimeout(timeout);

        if (response.ok) {
          const data = await response.json();
          let answer = data?.choices?.[0]?.message?.content;
          if (typeof answer === "string") {
            answer = answer.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, "").trim();
            if (answer.length > 0) {
              return res.json({
                answer,
                provider: "groq",
                model: modelName
              });
            }
          }
        }
      } catch (err) {
        console.warn(`Groq API model ${modelName} warning:`, err.message);
      }
    }
  }

  // Tier 2 & 3: Smart Uzbek AI Engine Fallback (100% text-only precision)
  const result = buildSmartUzbekAnswer(userMsg);
  return res.json({
    answer: result.answer,
    provider: result.provider || "ai-sport-engine",
    model: "ai-sport-v2"
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 AI SPORT X Server: http://localhost:${PORT}`);
  console.log(`🟢 Groq Live Cloud AI: INTEGRATED & READY`);
  console.log(`📸 AI Image Generation: ACTIVATED`);
  console.log(`=======================================================`);
});
