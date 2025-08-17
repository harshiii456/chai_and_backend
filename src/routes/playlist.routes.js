import { Router } from "express";
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔒 Protect all routes with JWT
router.use(verifyJWT);

/**
 * @route   POST /api/v1/playlists
 * @desc    Create a new playlist
 * @access  Private
 */
router.post("/", createPlaylist);

/**
 * @route   GET /api/v1/playlists/:playlistId
 * @desc    Get a playlist by ID
 * @access  Private
 */
router.get("/:playlistId", getPlaylistById);

/**
 * @route   PATCH /api/v1/playlists/:playlistId
 * @desc    Update a playlist (name/description)
 * @access  Private
 */
router.patch("/:playlistId", updatePlaylist);

/**
 * @route   DELETE /api/v1/playlists/:playlistId
 * @desc    Delete a playlist
 * @access  Private
 */
router.delete("/:playlistId", deletePlaylist);

/**
 * @route   PATCH /api/v1/playlists/add/:playlistId/:videoId
 * @desc    Add a video to a playlist
 * @access  Private
 */
router.patch("/add/:playlistId/:videoId", addVideoToPlaylist);

/**
 * @route   PATCH /api/v1/playlists/remove/:playlistId/:videoId
 * @desc    Remove a video from a playlist
 * @access  Private
 */
router.patch("/remove/:playlistId/:videoId", removeVideoFromPlaylist);

/**
 * @route   GET /api/v1/playlists/user/:userId
 * @desc    Get all playlists of a user
 * @access  Private
 */
router.get("/user/:userId", getUserPlaylists);

export default router;
