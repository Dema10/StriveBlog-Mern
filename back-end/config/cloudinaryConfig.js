import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import 'dotenv/config';

cloudinary.config ({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    apy_key: process.env.CLOUDINARY_APY_KEY,
    apy_secret: process.env.CLOUDINARY_APY_SECRET,
});

const storage = new CloudinaryStorage ({
    cloudinary: cloudinary,
    params: {
        folder: 'blog_covers',
        allowed_formats: ['jpeg', 'png', 'jpg', 'gif']
    }
});

const cloudinaryUploader = multer ({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default cloudinaryUploader;