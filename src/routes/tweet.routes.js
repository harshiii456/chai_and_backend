import { Router } from "express";
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔒 Protect all tweet routes
router.use(verifyJWT);

/**
 * @route   POST /api/v1/tweets
 * @desc    Create a new tweet
 * @access  Private
 */
router.post("/", createTweet);

/**
 * @route   GET /api/v1/tweets/user/:userId
 * @desc    Get all tweets of a user
 * @access  Private
 */
router.get("/user/:userId", getUserTweets);

/**
 * @route   PATCH /api/v1/tweets/:tweetId
 * @desc    Update a tweet
 * @access  Private
 *
 * @route   DELETE /api/v1/tweets/:tweetId
 * @desc    Delete a tweet
 * @access  Private
 */
router
    .route("/:tweetId")
    .patch(updateTweet)
    .delete(deleteTweet);

export default router;
