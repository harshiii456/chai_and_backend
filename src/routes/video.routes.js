import { Router } from "express";
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// 🔒 Protect all video routes
router.use(verifyJWT);

/**
 * @route   GET /api/v1/videos
 * @desc    Get all videos (with filters, pagination, sorting)
 * @access  Private
 *
 * @route   POST /api/v1/videos
 * @desc    Upload and publish a new video
 * @access  Private
 */
router
    .route("/")
    .get(getAllVideos)
    .post(
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
        publishAVideo
    );

/**
 * @route   GET /api/v1/videos/:videoId
 * @desc    Get video by ID
 * @access  Private
 *
 * @route   PATCH /api/v1/videos/:videoId
 * @desc    Update video details (title, description, thumbnail)
 * @access  Private
 *
 * @route   DELETE /api/v1/videos/:videoId
 * @desc    Delete a video
 * @access  Private
 */
router
    .route("/:videoId")
    .get(getVideoById)
    .patch(upload.single("thumbnail"), updateVideo)
    .delete(deleteVideo);

/**
 * @route   PATCH /api/v1/videos/toggle/publish/:videoId
 * @desc    Toggle publish/unpublish status of a video
 * @access  Private
 */
router.patch("/toggle/publish/:videoId", togglePublishStatus);

export default router;
