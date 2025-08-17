import { Router } from "express";
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔒 Protect all routes with JWT
router.use(verifyJWT);

/**
 * @route   POST /api/v1/likes/toggle/v/:videoId
 * @desc    Toggle like on a video
 * @access  Private
 */
router.post("/toggle/v/:videoId", toggleVideoLike);

/**
 * @route   POST /api/v1/likes/toggle/c/:commentId
 * @desc    Toggle like on a comment
 * @access  Private
 */
router.post("/toggle/c/:commentId", toggleCommentLike);

/**
 * @route   POST /api/v1/likes/toggle/t/:tweetId
 * @desc    Toggle like on a tweet
 * @access  Private
 */
router.post("/toggle/t/:tweetId", toggleTweetLike);

/**
 * @route   GET /api/v1/likes/videos
 * @desc    Get all liked videos of the logged-in user
 * @access  Private
 */
router.get("/videos", getLikedVideos);

export default router;
