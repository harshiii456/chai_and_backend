import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ✅ Apply JWT authentication to all comment routes
router.use(verifyJWT);

// 📌 Get comments for a video / Add new comment
router
  .route("/:videoId")
  .get(getVideoComments) // Get all comments for a video
  .post(addComment); // Add a new comment

// 📌 Update or Delete a specific comment
router
  .route("/c/:commentId")
  .patch(updateComment) // Update comment
  .delete(deleteComment); // Delete comment

export default router;
