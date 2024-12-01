"use client";
import Link from "next/link";
import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { BsCloudUpload } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";

//  🫸🏻 Scale SVG 🫷🏻
function scaleSVG(svgContent: string, scale: number) {
  const parser = new DOMParser(); // Parse SVG
  const svgParsed = parser.parseFromString(svgContent, "image/svg+xml"); // SVG Parsed

  const svgElement = svgParsed.documentElement;
  const width = parseInt(svgElement.getAttribute("width") || "300");
  const height = parseInt(svgElement.getAttribute("height") || "100");

  //   Scaling
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  //   Apply Scaling
  svgElement.setAttribute("width", scaledWidth.toString());
  svgElement.setAttribute("height", scaledHeight.toString());

  return new XMLSerializer().serializeToString(svgParsed); // Return Scaled SVG
}

// useSVGConverter
interface SVGConvertorProps {
  canvas: HTMLCanvasElement | null;
  svgContent: string;
  scale: number;
  fileName?: string;

  imageMetadata: {
    name: string;
    width: number;
    height: number;
  };
}

/**
 * Give input of svgContent and scale and imageMetadata
 * when save to png button is clicked create a canvas and draw the svg content in the canvas adn trigger the download
 */

function useSVGConverter({
  canvas,
  imageMetadata,
  fileName,
  scale,
  svgContent,
}: SVGConvertorProps) {
  function convertToPNG() {
    const scaledSVG = scaleSVG(svgContent, scale);
    // const canvas = document.createElement("canvas");
    const context = canvas?.getContext("2d");
    if (!context) {
      throw new Error("Failed to create canvas context");
    }

    const img = new Image();

    function saveImage(fileName: string) {
      const url = canvas?.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url ?? "";

      link.download = `${fileName.replace(".svg", "")}-${scale}x.png`;
      // Finally, trigger the download
      link.click();
    }

    img.onload = () => {
      context.drawImage(img, 0, 0);
      console.log("Image drawn");
      saveImage(fileName ?? "svg_converted");
    };

    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(scaledSVG)}`;

    console.log("Image loaded", img.src);
  }

  return {
    convertToPNG,
    canvasProps: {
      width: imageMetadata.width * scale,
      height: imageMetadata.height * scale,
      name: imageMetadata.name ?? "svg_converted",
    },
  };
}

interface SVGRendererProps {
  svgContent: string;
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
      <canvas ref={setCanvasRef} {...canvasProps} hidden></canvas>
      <button
        className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-200 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
        onClick={() => {
          console.log("clicked!");
          convertToPNG();
        }}
      >
        Save as PNG
      </button>
    </div>
  );
}

interface UploadSVGButtonProps {
  svgContent: string | null;
  fileName: string;
  setSvgContent: (svgContent: string) => void;
  handleSVGChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function UploadSVGButton({
  svgContent,
  fileName,
  handleSVGChange,
}: UploadSVGButtonProps) {
  function handleDrop(e: React.DragEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const file = files[0] as File;
    console.log(file);
  }
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <input
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        type="file"
        accept=".svg"
        onChange={handleSVGChange}
      />
      {/* Drag and Drop  or upload SVG */}

      {svgContent && (
        <>
          <SVGRenderer svgContent={svgContent} />
          <p className="text-sm text-zinc-400">{fileName}</p>
        </>
      )}
    </div>
  );
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
      <UploadSVGButton
        fileName={fileName}
        svgContent={svgContent}
        setSvgContent={setSvgContent}
        handleSVGChange={handleChange}
      />

      {/* Scale Controller */}
      <div className="flex bg-zinc-800 p-2 w-fit mx-auto gap-2 rounded-lg">
        {scales.map((scaleValue) => {
          return (
            <button
              key={scaleValue + "x"}
              onClick={() => {
                setCustomScale(false);
                setScale(scaleValue);
              }}
              className={`p-3 rounded-lg bg-zinc-950 ${
                scaleValue === scale && !customScale ? "bg-info" : ""
              } transition-colors duration-200`}
            >
              {scaleValue}
            </button>
          );
        })}

        <button
          className={`p-3 rounded-lg bg-zinc-950 transition-colors duration-200  ${
            customScale ? "bg-info" : ""
          }`}
          onClick={() => {
            setCustomScale(true);
            if (customScale) {
              customButtonRef.current?.focus();
            }
          }}
        >
          Custom{" "}
        </button>
        {customScale && (
          <div>
            <input
              ref={customScaleInputRef}
              type="number"
              className="w-24 h-12 rounded-lg bg-zinc-950 focus:outline-none focus:ring-2 ring-blue-600  transition-all duration-200 p-2   "
              onChange={(e) => {
                let value = parseInt(e.target.value);
                if (value) {
                  setScale(value);
                }
              }}
            />
          </div>
        )}
      </div>

      {metadata && (
        <div className="flex items-center gap-2 justify-center">
          <div className="flex flex-col items-center justify-center bg-zinc-800 mt-6 p-2 w-fit mx-auto gap-2 rounded-lg">
            <p>Original</p>
            <p>
              {metadata?.width} x {metadata?.height}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center bg-zinc-800 mt-6 p-2 w-fit mx-auto gap-2 rounded-lg">
            <p>Original</p>
            <p>
              {metadata?.width! * scale} x {metadata?.height! * scale}
            </p>
          </div>
        </div>
      )}

      <SaveAsPngButton
        fileName={fileName}
        metadata={metadata ?? { name: "svg", width: 394, height: 80 }}
        scale={scale}
        svgContent={svgContent ?? ""}
      />
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
