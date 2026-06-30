// Cloudinary SDK initialised from environment configuration. Image bytes never
// touch the API's own disk — Multer buffers them in memory and they are streamed
// straight to Cloudinary (see src/uploads/cloudinaryStorage.js).
import { v2 as cloudinary } from "cloudinary";

import { config } from "./env.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export default cloudinary;
