"use client";
import Link from "next/link";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import useSVGConverter from "./use-svg-convertor";

interface SVGRendererProps {
  svgContent: string;
}

function getSVGMetadata(svgContent: string) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");

  const svgEl = svgDoc.documentElement;

  const width = parseInt(svgEl.getAttribute("width") || "300");
  const height = parseInt(svgEl.getAttribute("height") || "100");
  const name = svgEl.getAttribute("name") || "svg";

  console.log(svgEl.getAttribute("name"));

  return { width, height, name };
}

// TO render the uploaded SVG
function SVGRenderer({ svgContent }: SVGRendererProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (svgContainerRef.current) {
      svgContainerRef.current.innerHTML = svgContent;
      const svgEl = svgContainerRef.current.querySelector("svg");

      if (svgEl) {
        svgEl.setAttribute("width", "100%");
        svgEl.setAttribute("height", "100%");
      }
    }
  }, [svgContent]);

  return (
    <div className="max-w-md mx-auto">
      <div className="max-w-md mx-auto" ref={svgContainerRef}></div>
    </div>
  );
}

interface SaveAsPngButtonProps {
  svgContent: string;
  scale: number;
  fileName: string;
  metadata: {
    name: string;
    width: number;
    height: number;
  };
}

function SaveAsPngButton({
  metadata,
  scale,
  svgContent,
  fileName,
}: SaveAsPngButtonProps) {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const { convertToPNG, canvasProps } = useSVGConverter({
    canvas: canvasRef,
    imageMetadata: metadata,
    scale,
    svgContent,
    fileName,
  });
  return (
    <div>
      {/* The canvas where image will be drawn */}
      <canvas ref={setCanvasRef} {...canvasProps} hidden></canvas>
      <button
        className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        onClick={() => {
          convertToPNG();
        }}
      >
        Save as PNG
      </button>
    </div>
  );
}

interface FileUploadProps {
  svgContent: string | null;
  fileName: string;
  setSvgContent: (svgContent: string) => void;
  handleSVGChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileUploadButton({
  svgContent,
  fileName,
  handleSVGChange,
}: FileUploadProps) {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      {!svgContent && (
        <div className="flex flex-col items-center">
          <p className="text-zinc-600">No SVG Uploaded</p>
          <p className="text-zinc-600">Upload SVG to get started</p>
        </div>
      )}

      <input
        hidden
        ref={fileUploadRef}
        type="file"
        accept=".svg"
        onChange={handleSVGChange}
      />

      {/* TODO : Drag and Drop  or upload SVG */}
      {svgContent && (
        <>
          <SVGRenderer svgContent={svgContent} />
          <p className="text-sm text-zinc-400">{fileName}</p>
        </>
      )}

      <button
        ref={buttonRef}
        onClick={() => {
          fileUploadRef.current?.click();
        }}
        className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-full px-4 my-6 py-2"
      >
        {svgContent ? "Upload New SVG" : "Upload SVG"}
      </button>
    </div>
  );
}

const SVGToolCore = () => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    width: number;
    height: number;
    name: string;
  } | null>(null);

  const scales = [1, 2, 4, 8, 16, 32, 64];
  const [scale, setScale] = useState<number>(scales[1]);
  const [customScale, setCustomScale] = useState<boolean>(false);

  const [fileName, setFileName] = useState<string>("svg");

  const customScaleInputRef = useRef<HTMLInputElement>(null);
  const customButtonRef = useRef<HTMLButtonElement>(null);
  const scaleControllerRef = useRef<HTMLDivElement>(null);
  const movingDivRef = useRef<HTMLDivElement>(null);

  //  🎯  focus the custom scale input
  useImperativeHandle(
    customButtonRef,
    () =>
      ({
        focus: () => {
          customScaleInputRef.current?.focus();
        },
      } as unknown as HTMLButtonElement)
  );

  //  🚚 load metadata
  useEffect(() => {
    if (svgContent) {
      setMetadata(getSVGMetadata(svgContent));
    }
  }, [svgContent]);

  // Moving Div
  useEffect(() => {
    const currentIndex = scales.findIndex((s) => s === scale);
    const eachDivWidth = 40; // 40px
    const gap = 10; // 8px
    const offset = 8;
    if (movingDivRef.current) {
      const leftPosition =
        currentIndex * (eachDivWidth + gap) + offset - 2 * currentIndex;
      movingDivRef.current.style.left = `${leftPosition}px`;

      if (customScale) {
        movingDivRef.current!.style.display = "none";
      } else {
        movingDivRef.current!.style.display = "block";
      }
    }
  }, [scale, customScale, scales]);

  //  🕣 handle file change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        setFileName(file.name);
        setSvgContent(e.target?.result as string);
      };
    }
  };

  return (
    <div>
      <FileUploadButton
        fileName={fileName}
        svgContent={svgContent}
        setSvgContent={setSvgContent}
        handleSVGChange={handleChange}
      />

      {metadata && (
        <div className="flex items-center  gap-4 my-6 justify-center w-fit mx-auto">
          <div className="flex flex-col items-center justify-center bg-zinc-900 mt-6 p-2 px-4 w-fit mx-auto gap-1 rounded-lg">
            <p>Original</p>
            <p>
              {metadata?.width} x {metadata?.height}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-zinc-900 mt-6 p-2 px-4 w-fit mx-auto gap-1 rounded-lg">
            <p>Scaled</p>
            <p>
              {metadata &&
                metadata.width * scale + "x" + metadata.height * scale}
              {/* {metadata?.width! * scale} x {metadata?.height! * scale} */}
            </p>
          </div>
        </div>
      )}

      {/* Scale Controller */}
      {svgContent && (
        <div className="flex flex-col gap-2 items-center ">
          <p className="text-zinc-400">Scale </p>
          <div
            ref={scaleControllerRef}
            className="flex bg-[#161616]  transition-all duration-1000 ease-in-out  relative p-2 w-fit mx-auto gap-2 rounded-lg z-10 items-center justify-center"
          >
            {/* Moving Div on hover */}

            {scales.map((scaleValue) => {
              return (
                <button
                  key={scaleValue + "x"}
                  onClick={() => {
                    setCustomScale(false);
                    setScale(scaleValue);
                  }}
                  // style={{
                  //   backgroundColor:
                  //     scaleValue === scale && !customScale ? "var(--info)" : "",
                  // }}
                  className={`p-3 w-10 h-10 rounded-lg z-0 bg-zinc-950  transition-colors duration-200 relative`}
                >
                  <div className="absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {scaleValue}
                  </div>
                </button>
              );
            })}
            <div
              ref={movingDivRef}
              className="absolute  origin-left  z-10 left-2 top-3 opacity-100 w-10 h-10 rounded-lg p-3 bg-blue-600 transition-all duration-1000  "
            >
              {" "}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 delay-300 transition-all duration-1000 ease-in-out">
                {scale}
              </div>
            </div>

            <button
              className={`p-3 rounded-2xl bg-zinc-950 w-24 transition-colors duration-200  ${
                customScale ? "bg-info" : ""
              }`}
              onClick={() => {
                setCustomScale(true);
                movingDivRef.current!.style.display = "none";
                if (customScale) {
                  customButtonRef.current?.focus();
                }
              }}
            >
              Custom{" "}
            </button>

            {customScale && (
              <div className="transition-all duration-100 ease-in">
                <input
                  ref={customScaleInputRef}
                  type="number"
                  placeholder="Scale"
                  className="w-24 h-12 rounded-lg placeholder:text-sm bg-zinc-950 focus:outline-none focus:ring-2 ring-blue-600  transition-all duration-200 p-2   "
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value) {
                      setScale(value);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {svgContent && (
        <div className="flex justify-center gap-2 items-center mt-6">
          <button
            onClick={() => {
              setSvgContent(null);
              setMetadata(null);
            }}
            className="bg-red-600 rounded-full px-4 py-2  focus:ring-2 focus:ring-red-400"
          >
            Cancel
          </button>
          <SaveAsPngButton
            fileName={fileName}
            metadata={metadata ?? { name: "svg", width: 394, height: 80 }}
            scale={scale}
            svgContent={svgContent ?? ""}
          />
        </div>
      )}
    </div>
  );
};

function SVGTool() {
  return (
    <>
      <Link href="/" className="absolute top-4 left-4 hover:text-zinc-700">
        <FaArrowLeft className="w-4 h-4" />
      </Link>
      <div className="flex flex-col gap-4 h-screen w-full  justify-center">
        <SVGToolCore />
      </div>
    </>
  );
}

export default SVGTool;
