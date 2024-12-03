"use client";
import { useRef, useState } from "react";
import { Metadata } from "./types";
import RenderImage from "./render-image";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

// File Uploader
function FileUploader({
  setMetadata,
  metadata,
  uploadedImage,
  setUploadedImage,
}: {
  setMetadata: (metadata: Metadata) => void;
  metadata: Metadata;
  uploadedImage: File | null;
  setUploadedImage: (uploadedImage: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const image = new Image();
    image.onload = () => {
      setMetadata({
        name: file?.name ?? "",
        width: image.width,
        height: image.height,
        type: file?.type ?? "image/jpeg",
      });
    };

    image.src = URL.createObjectURL(file);

    setUploadedImage(file);
  };

  return (
    <div className=" items-center justify-center flex flex-col gap-4">
      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={handleImageChange}
      />

      {uploadedImage ? (
        <p className="text-xl text-zinc-500 max-w-lg text-center text-balance">
          {metadata.name}
        </p>
      ) : (
        <p className="text-xl text-zinc-500 max-w-lg text-center text-balance">
          Upload an image to convert it to a square image
        </p>
      )}

      <button
        className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-full px-4 my-6 py-2"
        ref={buttonRef}
        onClick={() => {
          console.log("clicked");
          inputRef.current?.click();
        }}
      >
        Upload
      </button>

      {/* Orignal Image */}
      {/* {uploadedImage && (
        <div className=" max-h-[200px] max-w-[200px]">
          <p>Original Image</p>
          <NextImage
            alt="image"
            src={URL.createObjectURL(uploadedImage)}
            width={metadata.width}
            height={metadata.width}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
          <p>{metadata.name}</p>
        </div>
      )} */}
    </div>
  );
}

const SquareImageTool = () => {
  const [metadata, setMetadata] = useState<Metadata>({
    name: "",
    width: 0,
    height: 0,
    type: "",
  });

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Link href="/" className="absolute top-4 left-4 hover:text-zinc-700">
        <FaArrowLeft className="w-4 h-4" />
      </Link>

      {!uploadedImage && (
        <FileUploader
          setMetadata={setMetadata}
          metadata={metadata}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
        />
      )}

      <div className="flex items-center gap-2 group cursor-pointer">
        <input
          type="color"
          id="color-picker"
          className=" size-10 rounded-lg cursor-pointer"
          value={backgroundColor}
          onChange={(e) => {
            console.log(e.target.value);
            setBackgroundColor(e.target.value);
          }}
        />
        <label
          htmlFor="color-picker"
          className=" cursor-pointer group-hover:text-zinc-700 transition-all duration-200"
        >
          {backgroundColor}
        </label>
      </div>

      {uploadedImage && (
        <RenderImage
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          metadata={metadata}
          backgroundColor={backgroundColor}
        />
      )}
    </div>
  );
};

export default SquareImageTool;
