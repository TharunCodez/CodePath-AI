import { Router } from "express";
import * as codeController from "../controllers/codeController.js";

const router = Router();

router.post("/run-code", codeController.runCode);

export default router;
