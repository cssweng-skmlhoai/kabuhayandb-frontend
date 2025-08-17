import imageCompression from "browser-image-compression";
import { toast } from "sonner";

// buffer to base64 converter
export const bufferToBase64Image = (bufferData) => {
  if (!bufferData) return null;

  const uint8Array = new Uint8Array(bufferData);

  const header = uint8Array.slice(0, 4).join(",");

  let mime = "image/png";
  if (header === "255,216,255,224" || header === "255,216,255,225") {
    mime = "image/jpeg";
  } else if (header === "137,80,78,71") {
    mime = "image/png";
  }

  const binary = uint8Array.reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ""
  );
  const base64 = btoa(binary);
  return `data:${mime};base64,${base64}`;
};

// compress image
export const compressImage = async (file, maxSize, maxWH) => {
  const options = {
    maxSizeMB: maxSize,
    maxWidthOrHeight: maxWH,
    useWebWorker: true,
  };
  try {
    return await imageCompression(file, options);
  } catch (error) {
    toast.error("Compression failed:", error);
    return file;
  }
};

// convert base64 to file
export const base64ToFile = (base64String, filename) => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
