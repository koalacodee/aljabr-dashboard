"use client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEventHandler, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function Codes() {
  const codes = [
    "EBEF7EC621",
    "1BB9F4F94D",
    "8EEC4D411D",
    "ECBB3FF42D",
    "7716A56090",
    "81AF8A777C",
    "7C96075490",
    "8B4BF65302",
    "5076CA62AC",
    "3C272E47CB",
    "DF7D7E4490",
    "86DD2A3BEF",
    "72A6735EDE",
    "907298FD36",
    "40624DF091",
    "FF7C8BBDA8",
    "B5DC6B44AB",
    "D79989286B",
    "D9A0AAFAED",
    "F09D335D09",
    "68F9D080F9",
    "37BD05B19B",
    "458FE04A48",
    "FD5F31AD51",
    "2AD6CD5E94",
    "837DB5BD31",
    "AA91200E62",
    "3F7C97E825",
    "1DDAB759B2",
    "A47F00B6AF",
    "0DE1249758",
    "571ECB04C8",
    "AF97F26A09",
    "DEB35693BB",
    "AFFA627FBA",
    "DA30675D62",
    "E8CFF17901",
    "A6095D0D10",
    "A591641EBA",
    "DF49C0AD80",
    "C209CAD42D",
    "6B82433AB9",
    "2D3542328F",
    "174A329ADC",
    "66E9A9EB3E",
    "7F8BB98C0D",
    "13E5512781",
    "372E67FFA9",
    "C9CCA81C79",
    "A448F07D0F",
  ];
  const [showForm, setShowForm] = useState(false);

  const handleExcelExport: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/codes/export-all"
      );

      const link = document.createElement("a");
      link.href = res.data.data.download; // File URL
      link.download = "nice-file.xlsx"; // Suggested filename
      link.style.display = "none"; // Hide the link

      document.body.appendChild(link);
      link.click(); // Trigger download
      document.body.removeChild(link);
    } catch (error) {}
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold m-4 mb-6">الاكواد</h1>
      <ul className="grid grid-cols-3 m-2">
        {codes.map((code) => (
          <li key={code} className="text-center border p-3 border-gray-200">
            {code}
          </li>
        ))}
      </ul>
      <button
        onClick={(e) => setShowForm(true)}
        className="flex items-center gap-2 fixed bottom-4 right-4 text-white bg-green-600 p-2 rounded hover:bg-green-700 duration-300 cursor-pointer"
      >
        <span>اضافة اكواد جديدة</span>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <button
        onClick={handleExcelExport}
        className="flex items-center gap-2 fixed bottom-4 left-4 text-white bg-blue-600 p-2 rounded hover:bg-blue-700 duration-300 cursor-pointer"
      >
        <span>
          تصدير الى <wbr />
          Excel
        </span>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      {showForm && <FormWithOverlay onFormCancel={(e) => setShowForm(false)} />}
    </div>
  );
}

const generateCodesSchema = z.object({
  count: z
    .number()
    .min(1, "عدد الاكواد يجب أن يكون على الأقل 1")
    .int("يجب أن يكون عدد الاكواد رقماً صحيحاً"),
  exportToExcel: z.boolean().optional(),
});

const FormSchema = z.object({
  count: z
    .number()
    .min(1, "Count must be at least 1")
    .int("Count must be an integer"),
  exportToExcel: z.boolean().optional(),
});

type GenerateCodesForm = z.infer<typeof FormSchema>;

function FormWithOverlay({
  onFormCancel,
}: {
  onFormCancel: MouseEventHandler<HTMLButtonElement>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GenerateCodesForm>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      count: 1,
      exportToExcel: false,
    },
  });

  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const onSubmit = async (data: GenerateCodesForm) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/codes/generate",
        data
      );

      const link = document.createElement("a");
      link.href = `http://localhost:8080/public/${response.data.data.excelFile}`; // File URL
      link.download = "nice-file.pdf"; // Suggested filename
      link.style.display = "none"; // Hide the link

      document.body.appendChild(link);
      link.click(); // Trigger download
      document.body.removeChild(link);

      toast.success("تم إنشاء الأكواد بنجاح");
      cancelButtonRef.current?.click();
      reset();
      // You might want to refresh the codes list here
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "فشل في إنشاء الأكواد");
      } else {
        toast.error("حدث خطأ");
      }
    }
  };

  return (
    <>
      <div className="absolute h-screen w-screen top-0 left-0 bg-black/50 z-50"></div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="absolute rounded-sm top-1/2 left-1/2 p-4 bg-blue-600 z-50 w-100 -translate-1/2"
      >
        <div className="space-y-2">
          <label
            htmlFor="count"
            className="text-lg text-white flex justify-between"
          >
            <span>عدد الاكواد</span>
            <span>Codes Count</span>
          </label>
          <input
            type="number"
            id="count"
            className="w-full py-2 px-4 rounded-lg text-black/80 bg-white"
            {...register("count", { valueAsNumber: true })}
          />
          {errors.count && (
            <p className="text-red-500 text-sm mt-1">{errors.count.message}</p>
          )}
        </div>
        <div className="flex space-x-2 my-2 gap-2 items-center">
          <input
            type="checkbox"
            id="export"
            className="text-white"
            {...register("exportToExcel")}
          />
          <label htmlFor="export" className="text-white">
            تصدير الى <wbr />
            Excel
          </label>
        </div>
        <div className="flex justify-end gap-2 text-white">
          <button
            type="button"
            ref={cancelButtonRef}
            onClick={onFormCancel}
            className="bg-gray-600 p-2 rounded hover:bg-gray-700 duration-300 cursor-pointer"
          >
            اغلاق
          </button>
          <button
            type="submit"
            className="bg-green-600 p-2 rounded hover:bg-green-700 duration-300 cursor-pointer"
          >
            حفظ
          </button>
        </div>
      </form>
    </>
  );
}
