"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

const infoSchema = z.object({
  value: z.string().min(1, "Value is required"),
});

type InfoFormData = z.infer<typeof infoSchema>;

const MEDIA_TYPES = {
  X_ACCOUNT: "X_ACCOUNT" as const,
  PHONE_NUMBER: "PHONE_NUMBER" as const,
  INSTAGRAM_ACCOUNT: "INSTAGRAM_ACCOUNT" as const,
} as const;

type MediaType = (typeof MEDIA_TYPES)[keyof typeof MEDIA_TYPES];

export default function InfoCard({
  type,
  label,
}: {
  type: MediaType;
  label: string;
}) {
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InfoFormData>({
    resolver: zodResolver(infoSchema),
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/info/${type}`
        );
        setInfo(res.data.data.value);
        setValue("value", res.data.data.value || "");
      } catch (err) {
        console.error("Error fetching info:", err);
        setError("Failed to fetch info");
      }
    };

    fetchInfo();
  }, [type, setValue]);

  const onSubmit = async (data: InfoFormData) => {
    try {
      setLoading(true);
      setError(null);

      await axios.post(`http://localhost:8080/api/v1/info`, {
        type,
        value: data.value,
      });

      setInfo(data.value);
    } catch (err) {
      console.error("Error submitting info:", err);
      setError("Failed to save info");
    } finally {
      setLoading(false);
    }
  };

  const renderInfoDisplay = () => {
    if (!info)
      return "There is no value set for this info Currently. you can initialize it now";

    const getIcon = () => {
      switch (type) {
        case MEDIA_TYPES.X_ACCOUNT:
          return <FontAwesomeIcon icon={faTwitter} className="mr-2" />;
        case MEDIA_TYPES.INSTAGRAM_ACCOUNT:
          return <FontAwesomeIcon icon={faInstagram} className="mr-2" />;
        case MEDIA_TYPES.PHONE_NUMBER:
          return null;
        default:
          return null;
      }
    };

    const formatValue = () => {
      switch (type) {
        case MEDIA_TYPES.X_ACCOUNT:
          const xUsername = info.replace("https://x.com/", "").replace("@", "");
          return `@${xUsername}`;
        case MEDIA_TYPES.INSTAGRAM_ACCOUNT:
          const igUsername = info
            .replace("https://instagram.com/", "")
            .replace("@", "");
          return `@${igUsername}`;
        case MEDIA_TYPES.PHONE_NUMBER:
          return info;
        default:
          return info;
      }
    };

    return (
      <div className="flex items-center">
        {getIcon()}
        <span className="text-gray-500">{formatValue()}</span>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">{label}</h2>
      <div className="text-gray-500 mb-4">{renderInfoDisplay()}</div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            id="value"
            {...register("value")}
            className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter value"
          />
          {errors.value && (
            <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "حفظ"}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
