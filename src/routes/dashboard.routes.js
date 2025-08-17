import { Router } from "express";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ✅ Protect all dashboard routes
router.use(verifyJWT);

/**
 * @route   GET /api/v1/dashboard/stats
 * @desc    Get channel statistics (views, subscribers, likes, etc.)
 * @access  Private
 */
router.get("/stats", getChannelStats);

/**
 * @route   GET /api/v1/dashboard/videos
 * @desc    Get all videos uploaded by the logged-in user (channel owner)
 * @access  Private
 */
router.get("/videos", getChannelVideos);

export default router;
