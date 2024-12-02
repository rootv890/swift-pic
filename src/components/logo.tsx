import Image from "next/image";

const Logo = ({ color }: { color: "white" | "black" }) => {
  return (
    <div>
      {color === "white" ? (
        <Image alt="logo" src={"/logo-w.svg"} width={110} height={130} />
      ) : (
        <Image alt="logo" src={"/logo-b.svg"} width={10} height={10} />
      )}
    </div>
  );
};

export default Logo;
