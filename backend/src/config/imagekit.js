import ImageKit from "imagekit";
import dotenv from "dotenv";
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Validate credentials
if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
  console.error("Missing ImageKit credentials:", {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? "✓" : "✗",
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? "✓" : "✗",
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ? "✓" : "✗"
  });
  throw new Error("Missing ImageKit credentials in .env");
}

export default imagekit;