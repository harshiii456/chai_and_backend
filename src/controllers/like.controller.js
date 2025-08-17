// like.controller.js
import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Toggle like on a video
 * @route POST /api/v1/likes/video/:videoId
 */
const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    user: req.user._id,
  });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video unliked successfully"));
  }

  await Like.create({
    video: videoId,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Video liked successfully"));
});

/**
 * Toggle like on a comment
 * @route POST /api/v1/likes/comment/:commentId
 */
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    user: req.user._id,
  });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Comment unliked successfully"));
  }

  await Like.create({
    comment: commentId,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Comment liked successfully"));
});

/**
 * Toggle like on a tweet
 * @route POST /api/v1/likes/tweet/:tweetId
 */
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    user: req.user._id,
  });

  if (existingLike) {
    await existingLike.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Tweet unliked successfully"));
  }

  await Like.create({
    tweet: tweetId,
    user: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Tweet liked successfully"));
});

/**
 * Get all liked videos of the logged-in user
 * @route GET /api/v1/likes/videos
 */
const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.find({ user: req.user._id, video: { $exists: true } })
    .populate("video");

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
};
