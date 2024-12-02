const GithubLink = () => {
  return (
    <a
      href="/gihu"
      className="flex items-center justify-center text-syntax-comment font-semibold gap-2 hover:underline underline-offset-2 hover:text-zinc-300 transition-all duration-300"
    >
      {/* <FaArrowRight /> */}
      <span className="text-sm">View on Github</span>
    </a>
  );
};

export default GithubLink;
