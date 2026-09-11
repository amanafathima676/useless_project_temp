/**
 * Oru Average Malayali — LLM API Client with 5-Second Timeout
 * Connects to Google Gemini API (or compatible LLM endpoint).
 * Enforces a strict 4.5-second race timeout (FR1.5).
 * Automatically falls back to the Fallback Bank on timeout/network failure (NFR3).
 */

const API_TIMEOUT_MS = 4500; // 4.5 seconds to guarantee under 5s judge experience

/**
 * Storage helpers for API Key & Model Configuration
 */
const STORAGE_KEYS = {
  GEMINI_API_KEY: "oru_average_malayali_gemini_key",
  MODEL_NAME: "oru_average_malayali_model",
};

function getStoredApiKey() {
  return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || "";
}

function setStoredApiKey(key) {
  if (key) {
    localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
  }
}

function getStoredModel() {
  return localStorage.getItem(STORAGE_KEYS.MODEL_NAME) || "gemini-2.5-flash";
}

function setStoredModel(model) {
  localStorage.setItem(STORAGE_KEYS.MODEL_NAME, model);
}

/**
 * Clean and extract JSON from model text (handles ```json fences)
 */
function cleanJsonOutput(text) {
  if (!text) return null;
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim();
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt regex extraction if there are surrounding characters
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw err;
  }
}

/**
 * Calls Gemini REST API directly with given API key
 */
async function callGeminiApi(apiKey, model, systemInstruction, userPrompt, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }]
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.8,
      response_mime_type: "application/json"
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API Error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text content returned from Gemini API");
    }

    return cleanJsonOutput(text);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Master Evaluation Function
 * Tries LLM first with timeout. If no key, timeout, or error, uses Fallback Bank.
 * Returns: { verdict: object, source: "llm" | "fallback", durationMs: number }
 */
async function evaluateCareerVerdict(answers, candidateName = "") {
  const startTime = performance.now();
  const apiKey = getStoredApiKey();
  const model = getStoredModel();

  // If no API key configured, use fallback bank immediately (<10ms)
  if (!apiKey) {
    console.info("[Act 1] No Gemini API key provided. Using Fallback Response Bank.");
    const verdict = getFallbackVerdict(answers);
    const durationMs = Math.round(performance.now() - startTime);
    return { verdict, source: "fallback", durationMs, note: "Offline Fallback (No API Key)" };
  }

  // Attempt live LLM evaluation with strict timeout
  try {
    console.info(`[Act 1] Calling Gemini API (${model})...`);
    const systemPrompt = AMMAVAN_SYSTEM_INSTRUCTION;
    const userPrompt = buildCareerPrompt(answers, candidateName);

    const verdict = await callGeminiApi(apiKey, model, systemPrompt, userPrompt, API_TIMEOUT_MS);
    const durationMs = Math.round(performance.now() - startTime);
    console.info(`[Act 1] Gemini response received in ${durationMs}ms:`, verdict.career_verdict);

    // Validate expected fields exist
    if (!verdict.career_verdict || !verdict.relative_logic) {
      throw new Error("Invalid schema from Gemini model output");
    }

    return { verdict, source: "llm", durationMs };
  } catch (error) {
    const durationMs = Math.round(performance.now() - startTime);
    console.warn(`[Act 1] LLM call failed or timed out after ${durationMs}ms (${error.message}). Activating Fallback Bank.`);
    const fallbackVerdict = getFallbackVerdict(answers);
    return {
      verdict: fallbackVerdict,
      source: "fallback",
      durationMs,
      note: error.name === "AbortError" ? "5-Second Timeout Exceeded" : "API Connection Fallback"
    };
  }
}

// Export for Node and browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    evaluateCareerVerdict,
    getStoredApiKey,
    setStoredApiKey,
    getStoredModel,
    setStoredModel
  };
}
