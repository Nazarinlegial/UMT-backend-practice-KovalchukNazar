// Image storage backed by Cloudinary. The rest of the app depends only on
// uploadImage()/deleteImage(), so the provider could be swapped without
// touching services or controllers.
import path from "node:path";

import cloudinary from "../config/cloudinary.js";
import { config } from "../config/env.js";

function buildPublicId(originalName) {
  const base = path.parse(originalName ?? "image").name;
  // Unique, readable id: <timestamp>-<original base name>.
  return `${Date.now()}-${base}`.replace(/[^a-zA-Z0-9-_]/g, "_");
}

// Cloudinary stores the format in the URL; we only need to recover the public id
// (folder + name, no extension) to be able to delete the asset later.
function getPublicIdFromUrl(imageUrl) {
  if (typeof imageUrl !== "string" || !imageUrl.includes("res.cloudinary.com")) {
    return null;
  }
  const match = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
  return match?.[1] ?? null;
}

// Upload an in-memory Multer file and return its secure HTTPS URL.
export async function uploadImage(file) {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: config.cloudinary.folder,
    public_id: buildPublicId(file.originalname),
    overwrite: false,
    resource_type: "image",
  });

  return result.secure_url;
}

// Delete a previously-uploaded Cloudinary image. No-op for non-Cloudinary URLs
// (e.g. seeded frontend asset paths).
export async function deleteImage(imageUrl) {
  const publicId = getPublicIdFromUrl(imageUrl);
  if (!publicId) {
    return;
  }
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}
