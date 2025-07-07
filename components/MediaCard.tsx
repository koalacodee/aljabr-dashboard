"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
// Helper function to get file extension from URL
const getFileExtension = (url: string): string => {
  const filename = url.split("/").pop() || "";
  return filename.split(".").pop() || "";
};

const imageMIMETypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/bmp",
  "image/tiff",
  "image/x-icon",
  "image/svg+xml",
  "image/heic", // used by Apple devices
  "image/heif", // high efficiency image format
];

const videoMIMETypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/x-msvideo", // AVI
  "video/x-matroska", // MKV
  "video/3gpp", // 3GP
  "video/3gpp2", // 3G2
  "video/x-flv", // Flash Video
  "video/mpeg",
  "video/quicktime", // MOV
];

const audioMIMETypes = [
  "audio/mp3", // MP3
  "audio/wav",
  "audio/ogg",
  "audio/webm",
  "audio/flac",
  "audio/aac",
  "audio/m4a",
  "audio/x-m4a",
];

const MEDIA_TYPES = {
  HEADER_LOGO: "HEADER_LOGO" as const,
  LANDING_VIDEO: "LANDING_VIDEO" as const,
  TERMS_LOGO: "TERMS_LOGO" as const,
  START_AUDIO: "START_AUDIO" as const,
  END_AUDIO: "END_AUDIO" as const,
  SPONSORS_LOGOS: "SPONSORS_LOGOS" as const,
} as const;

type MediaType = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];

interface MediaCardProps {
  label: string;
  type: MediaType;
}

export default function MediaCard({ label, type }: MediaCardProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/media/${type}`
        );
        setImage(response.data.data?.url);
      } catch (error) {
        console.error(`Error fetching ${type} image:`, error);
        setImage(null);
      }
    };

    fetchImage();
  }, [type]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await axios.post(
        `http://localhost:8080/api/v1/media/${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImage(response.data.data?.url);
      toast.success("تم رفع الملف بنجاح");
    } catch (error) {
      toast.error("فشل في رفع الملف");
    } finally {
      setIsUploading(false);
    }
  };

  const renderViewComponent = () => {
    if (!image) {
      return <p>There is no Media Currently to show you can add your own</p>;
    }

    if (imageMIMETypes.includes(`image/${getFileExtension(image)}`)) {
      return <Image src={image} alt="Some Media" width={300} height={200} />;
    } else if (videoMIMETypes.includes(`video/${getFileExtension(image)}`)) {
      return <video autoPlay loop muted src={image} crossOrigin="anonymous" />;
    } else if (audioMIMETypes.includes(`audio/${getFileExtension(image)}`)) {
      return (
        <audio controls crossOrigin="anonymous">
          <source src={image} type={`audio/${getFileExtension(image)}`} />
          Your browser does not support the audio element
        </audio>
      );
    }

    return (
      <p>
        This Media cannot be previews since it is not an image, video, or audio
      </p>
    );
  };

  return (
    <div className="relative p-3 bg-gray-200 rounded-sm h-fit">
      <h2 className="text-xl text-end">{label}</h2>
      <div className="flex items-center justify-center my-4">
        {renderViewComponent()}
      </div>
      <form>
        <label htmlFor={`${type}-file`}>
          <div
            className={`w-fit px-4 py-2 rounded-sm transition-colors duration-300 cursor-pointer text-white ${
              isUploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isUploading ? "جاري الرفع..." : "تغيير"}
          </div>
          <input
            type="file"
            id={`${type}-file`}
            hidden
            onChange={handleFileChange}
          />
        </label>
      </form>
    </div>
  );
}
