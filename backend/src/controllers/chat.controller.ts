import type { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";
import type { AuthenticatedRequest } from "../types/index.js";

const SYSTEM_PROMPT = `You are KalaSetu Business Helper — a friendly, knowledgeable AI assistant that helps Indian artisans understand business and legal terms in simple language.

Your areas of expertise:
- GST (Goods & Services Tax) registration, filing, HSN codes for handicrafts
- MSME / Udyam registration and benefits
- Export documentation (IEC code, shipping bills, certificates of origin)
- Pricing strategies for handmade products
- GI (Geographical Indication) tags and how to apply
- Government schemes for artisans (PM Vishwakarma, SFURTI, etc.)
- Basic accounting and bookkeeping terms
- E-commerce marketplace rules (Amazon Karigar, Flipkart Samarth, etc.)
- Intellectual property basics (trademarks, design patents)
- Banking and finance (Mudra loans, working capital)

Guidelines:
- Always explain in simple, easy-to-understand language
- Use examples relevant to Indian artisans and handicrafts
- When discussing legal/tax matters, recommend consulting a professional for specific cases
- Be encouraging and supportive of artisan entrepreneurship
- Keep responses concise but thorough (2-4 paragraphs max)
- Use bullet points for lists
- Respond in the same language the user writes in (Hindi, English, or Hinglish)`;

/**
 * POST /api/chat
 * Send a message to Gemini AI and get a response.
 * Body: { message: string, history?: Array<{ role: string, parts: string }> }
 */
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    throw new ApiError(401, "Authentication required");
  }

  const { message, history } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ApiError(400, "Message is required");
  }

  if (!env.geminiApiKey) {
    throw new ApiError(503, "AI service is not configured. Please set GEMINI_API_KEY.");
  }

  const genAI = new GoogleGenerativeAI(env.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Build chat history from previous messages
  const chatHistory = (history || []).map((msg: { role: string; parts: string }) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.parts }],
  }));

  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "Understood! I'm KalaSetu Business Helper, ready to help Indian artisans with business terms, government schemes, GST, exports, and more. How can I help you today?" }] },
      ...chatHistory,
    ],
  });

  const result = await chat.sendMessage(message.trim());
  const response = result.response.text();

  res
    .status(200)
    .json(
      new ApiResponse(200, { reply: response }, "Message processed successfully")
    );
});
