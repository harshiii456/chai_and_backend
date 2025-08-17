// comment.controller.js
import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @desc Get all comments for a specific video (with pagination)
 * @route GET /api/v1/comments/:videoId
 */
const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  // pagination values
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ video: videoId })
    .populate("user", "username avatar") // show commenter info
    .sort({ createdAt: -1 }) // newest first
    .skip(skip)
    .limit(parseInt(limit));

  const totalComments = await Comment.countDocuments({ video: videoId });

  return res.status(200).json(
    new ApiResponse(200, {
      comments,
      totalComments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalComments / limit),
    }, "Comments fetched successfully")
  );
});

/**
 * @desc Add a new comment to a video
 * @route POST /api/v1/comments/:videoId
 */
const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  if (!text || !text.trim()) {
    throw new ApiError(400, "Comment text is required");
  }

  const comment = await Comment.create({
    video: videoId,
    user: req.user._id, // ✅ requires auth middleware
    text,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

/**
 * @desc Update a comment
 * @route PUT /api/v1/comments/:commentId
 */
const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  if (!text || !text.trim()) {
    throw new ApiError(400, "Comment text is required");
  }

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, user: req.user._id }, // only owner can update
    { text },
    { new: true }
  );

  if (!comment) {
    throw new ApiError(404, "Comment not found or not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

/**
 * @desc Delete a comment
 * @route DELETE /api/v1/comments/:commentId
 */
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }

  const deletedComment = await Comment.findOneAndDelete({
    _id: commentId,
    user: req.user._id, // only owner can delete
  });

  if (!deletedComment) {
    throw new ApiError(404, "Comment not found or not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
