import multer from 'multer';
import express from 'express';
import { isAuth } from '../utils.js';

const uploadRouter = express.Router();

// Upload files from the desktop 
const storage = multer.diskStorage({
    // Places file in the uploads folder
    destination(req, file, callback) {
        callback(null, "uploads/")
    },
    // Sets the filename to the timestamp(current date)
    filename(req, file, callback) {
        // callback(null, `${file.fieldname}-${Date.now()}`);
        callback(null, `${Date.now()}`);
    }
});

const upload = multer({ storage });

// Allows only authenticated users to upload
// a single file at a time named image
uploadRouter.post("/", isAuth, upload.single("image"), (req, res) => {
    res.send(`/${req.file.path}`);
});

export default uploadRouter;