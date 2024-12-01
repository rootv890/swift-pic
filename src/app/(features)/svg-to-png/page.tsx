import SVGTool from "./svg-tool";

export const metadata = {
  title: "SVG to PNG converter - SwiftPic",
  description: "Convert SVGs to PNGs. Also makes them bigger.",
};

const page = () => {
  return (
    <div className="">
      <SVGTool />
    </div>
  );
};

export default page;
