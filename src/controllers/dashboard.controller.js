// dashboard.controller.js
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc Get channel statistics (views, subscribers, videos, likes)
 * @route GET /api/v1/dashboard/stats
 */
const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not logged in");
  }

  // Total videos uploaded by the channel
  const totalVideos = await Video.countDocuments({ owner: userId });

  // Total subscribers to the channel
  const totalSubscribers = await Subscription.countDocuments({ channel: userId });

  // Total views across all videos
  const totalViewsAgg = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalViews: { $sum: "$views" } } },
  ]);
  const totalViews = totalViewsAgg[0]?.totalViews || 0;

  // Total likes on all videos
  const videoIds = await Video.find({ owner: userId }).distinct("_id");
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos,
        totalSubscribers,
        totalViews,
        totalLikes,
      },
      "Channel stats fetched successfully"
    )
  );
});

/**
 * @desc Get all videos uploaded by the channel
 * @route GET /api/v1/dashboard/videos
 */
const getChannelVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not logged in");
  }

  const videos = await Video.find({ owner: userId })
    .sort({ createdAt: -1 })
    .populate("owner", "username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
