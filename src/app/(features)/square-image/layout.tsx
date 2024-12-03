import GithubLink from "@/components/GithubLink";

const SquareImageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <GithubLink />
      </div>
    </div>
  );
};

export default SquareImageLayout;
