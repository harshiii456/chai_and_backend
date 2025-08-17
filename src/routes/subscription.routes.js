import { Router } from "express";
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔒 Protect all subscription routes
router.use(verifyJWT);

/**
 * @route   POST /api/v1/subscriptions/:channelId
 * @desc    Toggle subscription (subscribe/unsubscribe) to a channel
 * @access  Private
 */
router.post("/:channelId", toggleSubscription);

/**
 * @route   GET /api/v1/subscriptions/channel/:channelId
 * @desc    Get all subscribers of a channel
 * @access  Private
 */
router.get("/channel/:channelId", getUserChannelSubscribers);

/**
 * @route   GET /api/v1/subscriptions/user/:subscriberId
 * @desc    Get all channels a user has subscribed to
 * @access  Private
 */
router.get("/user/:subscriberId", getSubscribedChannels);

export default router;
