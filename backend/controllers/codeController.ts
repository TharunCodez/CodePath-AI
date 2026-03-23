import { Request, Response } from "express";
import * as judge0 from "../services/judge0.js";

export const runCode = async (req: Request, res: Response) => {
  const { code, language_id } = req.body;
  console.log(`[API] POST /run-code | language_id: ${language_id}`);
  console.log(`[API] Code snippet: ${code.substring(0, 50)}${code.length > 50 ? "..." : ""}`);

  if (!code || !language_id) {
    console.warn("[API] Missing code or language_id");
    return res.status(400).json({ error: "Code and language_id are required" });
  }

  try {
    console.log("[API] Submitting to Judge0...");
    const token = await judge0.submitCode(code, language_id);
    console.log(`[API] Received token: ${token}. Starting polling...`);
    const result = await judge0.pollResult(token);
    console.log("[API] /run-code success");
    res.json(result);
  } catch (err: any) {
    console.error("[API] /run-code error:", err.message);
    if (err.response) {
      console.error("[API] Judge0 Response Error:", err.response.data);
    }
    res.status(500).json({
      error: err.message,
      details: err.response?.data || "No additional details"
    });
  }
};
