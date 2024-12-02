import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <section className="w-full h-screen bg-background text-foreground font-mono  ">
      <div className="w-full  h-full flex flex-col justify-center items-center my-auto gap-4">
        <h1 className="text-4xl font-bold">Swift Pic</h1>
        <p className="text-lg max-w-lg text-balance text-center leading-loose  rounded-mdd px-4 py-4 text-[#888888] ">
          One stop to convert
          <Link
            href={"/svg-to-png"}
            className="bg-syntax-string my-2 py-px px-1 text-background rounded-mdd ml-1  transform hover:-rotate-6 inline-block transition-all duration-300"
          >
            SVG to PNG
          </Link>
          , JPG, WEBP.
          <Link
            href={"/resize"}
            className="bg-syntax-number py-px px-1 text-background rounded-mdd ml-1 transform hover:rotate-6 inline-block transition-all duration-300"
          >
            Resize or Rescale or compress.
          </Link>
          Rounded Corners you name it!
        </p>
      </div>
    </section>
  );
};

export default page;
