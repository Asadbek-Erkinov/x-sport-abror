// AI Sport X — Health Check Handler
// Works as: Vercel serverless function (module.exports) OR CLI diagnostic (node health.js)
require("dotenv").config();

const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b",
  "qwen/qwen3.6-27b"
];

// Vercel serverless handler
module.exports = function handler(req, res) {
  const key = process.env.GROQ_API_KEY || "";
  const hasGroqKey = Boolean(key && !key.includes("PASTE_YOUR"));
  res.status(200).json({
    ok: true,
    provider: hasGroqKey ? "groq" : "ai-sport-engine",
    providerLabel: hasGroqKey ? "🟢 GROQ CLOUD AI (ONLINE)" : "⚡ SMART SPORT AI",
    model: hasGroqKey ? GROQ_MODELS[0] : "ai-sport-v2",
    configured: hasGroqKey
  });
};

// CLI diagnostic — only runs when executed directly
if (require.main === module) {
  const key = process.env.GROQ_API_KEY || "";
  console.log("GROQ_API_KEY:", key ? "BOR" : "YOQ");
  console.log("KEY LENGTH:", key.length || 0);
  console.log("ACTIVE MODELS:", GROQ_MODELS.join(", "));
}
