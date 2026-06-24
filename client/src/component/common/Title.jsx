const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-pink-500 font-bold text-2xl">
        {text1}
        <span className="text-pink-600  text-2xl"> {text2}</span>
      </p>
      <p className="w-18 sm:w-22 h-[1px sm:h-[2px] bg-pink-400"></p>
    </div>
  );
};

export default Title;
