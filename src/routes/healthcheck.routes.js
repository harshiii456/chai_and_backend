import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = Router();

/**
 * @route   GET /api/v1/healthcheck
 * @desc    Check if server is running
 * @access  Public
 */
router.get("/", healthcheck);

export default router;
