import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

export const getAIExplanation = async (code: string, language: string) => {
  const ai = getAI();
  const prompt = `
    You are an expert coding mentor. Explain the following ${language} code line-by-line in simple terms for a beginner.
    Focus on WHY each line is used. Use a friendly and encouraging tone.
    
    Code:
    ${code}
    
    Format the response in Markdown.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  return response.text;
};

export const getAIErrorAnalysis = async (code: string, error: string, problem: string, language: string) => {
  const ai = getAI();
  const prompt = `
    You are an expert coding mentor. I am solving this problem: "${problem}".
    My ${language} code is:
    ${code}
    
    The error/output I received is:
    ${error}
    
    Please analyze:
    1. WHAT is wrong? (Identify the specific error)
    2. WHY is it wrong? (Explain the concept behind the error)
    3. WHAT needs to change? (Suggest a fix or direction, but do NOT give the full solution unless it's a very minor syntax error).
    
    Be helpful and encouraging. Format the response in Markdown.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  return response.text;
};

export const getAIHint = async (code: string, problem: string, language: string) => {
  const ai = getAI();
  const prompt = `
    You are an expert coding mentor. I am working on this problem: "${problem}".
    My current ${language} code is:
    ${code}
    
    Give me a step-by-step hint to move forward. 
    Do NOT reveal the full solution. Focus on the next logical step I should take.
    
    Format the response in Markdown.
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  
  return response.text;
};
