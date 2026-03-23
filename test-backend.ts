import "dotenv/config";
import * as judge0 from "./backend/services/judge0";

async function test() {
  console.log("Testing Judge0 with Python...");
  const code = 'print("Hello World")';
  const languageId = 71; // Python
  
  try {
    const token = await judge0.submitCode(code, languageId);
    const result = await judge0.pollResult(token);
    console.log("Result:", result);
    if (result.stdout.trim() === "Hello World") {
      console.log("TEST PASSED!");
    } else {
      console.log("TEST FAILED: Unexpected output");
    }
  } catch (err: any) {
    console.error("TEST FAILED with error:", err.message);
  }
}

test();
