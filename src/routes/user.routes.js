import { Router } from "express";
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  refreshAccessToken, 
  changeCurrentPassword, 
  getCurrentUser, 
  updateAccountDetails, 
  updateUserAvatar, 
  updateUserCoverImage, 
  getUserChannelProfile, 
  getWatchHistory 
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // ✅ import middleware

const router = Router();

// -------------------- PUBLIC ROUTES --------------------

// Register new user (with avatar + optional cover image)
router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

// Login user
router.route("/login").post(loginUser);

// Refresh tokens
router.route("/refresh-token").post(refreshAccessToken);

// -------------------- SECURED ROUTES --------------------

// Logout user
router.route("/logout").post(verifyJWT, logoutUser);

// Change password
router.route("/change-password").post(verifyJWT, changeCurrentPassword); // ✅ should be POST, not GET

// Get current logged-in user
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Update account details
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// Update avatar
router.route("/avatar").patch(
  verifyJWT,
  upload.single("avatar"),
  updateUserAvatar
);

// Update cover image
router.route("/cover-image").patch(
  verifyJWT,
  upload.single("coverImage"),
  updateUserCoverImage
);

// Get channel profile by username
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

// Get user watch history
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
