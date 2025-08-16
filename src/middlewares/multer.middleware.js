import multer from "multer";
import fs from "fs";

// ensure temp folder exists
const tempDir = "./public/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    // unique filename to avoid conflicts
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// export multer upload instance
export const upload = multer({ storage });
