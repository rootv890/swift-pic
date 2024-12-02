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

export default function useSVGConverter({
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
