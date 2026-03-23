import axios from "axios";

const JUDGE0_HOST = "ce.judge0.com";

// Mapping for roles to Judge0 language IDs
// Python: 71, Java: 62, C: 50, C++: 54
export const LANGUAGE_IDS: Record<string, number> = {
  python: 71,
  java: 62,
  c: 50,
  cpp: 54,
};

export const submitCode = async (code: string, languageId: number) => {
  console.log(`[Judge0] Submitting code for language ID: ${languageId}`);
  try {
    const response = await axios.post(
      `https://${JUDGE0_HOST}/submissions`,
      {
        source_code: code,
        language_id: languageId,
        stdin: "",
      },
      {
        params: { base64_encoded: "false", wait: "false" },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`[Judge0] Submission successful, token: ${response.data.token}`);
    return response.data.token;
  } catch (err: any) {
    console.error("[Judge0] Submission Error:", JSON.stringify(err.response?.data, null, 2) || err.message);
    throw new Error(err.response?.data?.message || "Failed to submit code to Judge0");
  }
};

export const getResult = async (token: string) => {
  try {
    const response = await axios.get(`https://${JUDGE0_HOST}/submissions/${token}`, {
      params: { base64_encoded: "false" },
    });
    return response.data;
  } catch (err: any) {
    console.error(`[Judge0] Result Error for token ${token}:`, err.response?.data || err.message);
    throw new Error(err.response?.data?.message || "Failed to get result from Judge0");
  }
};

export const pollResult = async (token: string, maxRetries = 15): Promise<any> => {
  console.log(`[Judge0] Polling for token: ${token}`);
  for (let i = 0; i < maxRetries; i++) {
    const result = await getResult(token);
    console.log(`[Judge0] Poll ${i + 1}: Status ID ${result.status.id} (${result.status.description})`);
    
    // Status IDs: 
    // 1: In Queue
    // 2: Processing
    // 3: Accepted (Success)
    // 4: Wrong Answer
    // 5: Time Limit Exceeded
    // 6: Compilation Error
    // 7: Runtime Error (SIGXFSZ)
    // 8: Runtime Error (SIGFPE)
    // 9: Runtime Error (SIGABRT)
    // 10: Runtime Error (NZEC)
    // 11: Runtime Error (Other)
    // 12: Internal Error
    // 13: Exec Format Error
    
    if (result.status.id >= 3) {
      console.log(`[Judge0] Execution completed for token: ${token} with status: ${result.status.description}`);
      return {
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        compile_output: result.compile_output || "",
        status: result.status,
        time: result.time,
        memory: result.memory,
      };
    }
    // Wait 1 second before polling again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  console.error(`[Judge0] Execution timed out for token: ${token}`);
  throw new Error("Code execution timed out");
};
