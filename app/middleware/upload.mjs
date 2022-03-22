import multer from "multer";
import path from "path";
const __dirname = path.resolve();

const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/public/images/"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
});

export default upload
