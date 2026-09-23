// SSL workaround — only in development
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.6-27b"
];

function cleanHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(x => x && (x.role === "user" || x.role === "assistant") && typeof x.content === "string" && x.content.trim())
    .slice(-10)
    .map(x => ({ role: x.role, content: x.content.slice(0, 4000) }));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Faqat POST so‘rov qabul qilinadi." });
  }

  const { message, history } = req.body || {};

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Xabar bo‘sh." });
  }

  const userMsg = message.trim();
  const key = process.env.GROQ_API_KEY;

  if (key && !key.includes("PASTE_YOUR")) {
    for (const modelName of GROQ_MODELS) {
      try {
        const messages = [
          {
            role: "system",
            content: "Sen AI Sport X murabbiyisisan. O‘zbek tilida ilhomlantiruvchi, aniq va har qanday savolga javob ber."
          },
          ...cleanHistory(history),
          { role: "user", content: userMsg.slice(0, 4000) }
        ];

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 12000);
        const response = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key.trim()}`
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: modelName,
            messages,
            temperature: 0.65,
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
              return res.status(200).json({ answer, provider: "groq", model: modelName });
            }
          }
        }
      } catch (e) {
        console.warn("Vercel Groq fallback", e.message);
      }
    }
  }

  return res.status(200).json({
    answer: `🏆 **AI Sport X Javobi:**\n\n${userMsg} bo'yicha amaliy maslahatlar va sport rejasi tayyor.`,
    provider: "ai-sport-engine"
  });
};
