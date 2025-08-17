// subscription.controller.js
import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Toggle subscription (subscribe/unsubscribe to a channel)
 * @route POST /api/v1/subscriptions/toggle/:channelId
 */
const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  if (req.user._id.toString() === channelId) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  // check if already subscribed
  const existingSubscription = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (existingSubscription) {
    // unsubscribe
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Unsubscribed successfully"));
  } else {
    // subscribe
    const newSubscription = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, newSubscription, "Subscribed successfully"));
  }
});

/**
 * Get all subscribers of a channel
 * @route GET /api/v1/subscriptions/channel/:channelId
 */
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channelId");
  }

  const subscribers = await Subscription.find({ channel: channelId }).populate(
    "subscriber",
    "username email"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
});

/**
 * Get all channels a user has subscribed to
 * @route GET /api/v1/subscriptions/user/:subscriberId
 */
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriberId");
  }

  const channels = await Subscription.find({ subscriber: subscriberId }).populate(
    "channel",
    "username email"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Subscribed channels fetched successfully"));
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
};
