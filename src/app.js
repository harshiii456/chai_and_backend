import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ✅ Enable CORS
// - origin: only allow requests from your frontend (stored in env)
// - credentials: true allows cookies (important for auth)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // fallback for dev
    credentials: true,
  })
);

// ✅ Middlewares
app.use(express.json({ limit: "16kb" })); // handle JSON requests
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // handle form data
app.use(express.static("public")); // serve static files (images, css, js)
app.use(cookieParser()); // parse cookies from client

// ✅ Import routes
import userRouter from "./routes/user.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// ✅ Declare routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);          // 👉 http://localhost:8000/api/v1/users/register
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlists", playlistRouter);  // small fix: plural naming (good practice)
app.use("/api/v1/dashboard", dashboardRouter);

// ✅ Export app for server.js to use
export { app };
