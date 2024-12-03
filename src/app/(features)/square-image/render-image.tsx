import React, { useEffect, useLayoutEffect, useState } from "react";
import { Metadata } from "./types";
import { default as NextImage } from "next/image";
import { BiLoader } from "react-icons/bi";

interface RenderImageProps {
  uploadedImage: File;
  metadata: Metadata;
  backgroundColor: string;
  setUploadedImage: (image: File | null) => void;
}

const RenderImage = ({
  uploadedImage,
  setUploadedImage,
  metadata,
  backgroundColor,
}: RenderImageProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useLayoutEffect(() => {
    const squareImage = () => {
      setIsLoading(true);
      const width = metadata.width;
      const height = metadata.height;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = Math.max(width, height);
      canvas.height = canvas.width;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();

      img.onload = () => {
        ctx.drawImage(
          img,
          canvas.width / 2 - metadata.width / 2,
          canvas.height / 2 - metadata.height / 2,
          metadata.width,
          metadata.height
        );
        setImage(canvas.toDataURL());
        setIsLoading(false);
      };
      img.src = URL.createObjectURL(uploadedImage);
    };

    if (uploadedImage) {
      squareImage();
    }

    return () => {
      setImage(null);
    };
  }, [uploadedImage, backgroundColor, metadata]);

  const downloadImage = () => {
    const link = document.createElement("a");
    if (!image) return;
    link.href = image;
    link.download = `${metadata.name.split(".")[0]}-square.${
      metadata.type.split("/")[1]
    }`;

    console.log(link.username);

    console.log(link.download);

    // file is renaming to Sqaure IMage even though it is not
    // fix it

    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center ">
        <BiLoader className="text-4xl animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {image && (
        <div className="flex flex-col items-center my-6 justify-center">
          <NextImage
            src={image}
            alt="square image"
            // preview should me a medium size
            width={metadata.width / 2}
            height={metadata.width / 2}
            className="max-w-lg max-h-lg"
          />
          <p>{metadata.name}-square</p>
        </div>
      )}

      {image && (
        <div>
          {" "}
          <div className="flex items-center  gap-4 my-6 justify-center w-fit mx-auto">
            <div className="flex flex-col items-center justify-center bg-zinc-900 mt-6 p-2 px-4 w-fit mx-auto gap-1 rounded-lg">
              <p>Original</p>
              <p>
                {metadata?.width} x {metadata?.height}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center bg-zinc-900 mt-6 p-2 px-4 w-fit mx-auto gap-1 rounded-lg">
              <p>Squared</p>
              <p>
                {Math.max(metadata?.width, metadata?.height)} x{" "}
                {Math.max(metadata?.width, metadata?.height)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row-reverse items-center justify-center gap-4">
        <button
          className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
          onClick={downloadImage}
        >
          Download
        </button>

        <button
          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
          onClick={() => {
            setImage(null);
            setUploadedImage(null);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RenderImage;
