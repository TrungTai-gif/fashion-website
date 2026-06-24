const ImageUpload = ({ miniSize, onChange }) => {
  return miniSize === true ? (
    <div className="h-20 flex items-center justify-center w-20">
      <label
        htmlFor="dropzone-file"
        className="flex items-center justify-center w-full max-w-md  border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gradient-to-br from-indigo-50 to-white hover:from-indigo-100 hover:to-indigo-50 transition-all duration-200 shadow-lg group"
      >
        <div className="flex items-center justify-center pt-6 ">
          <svg
            className="w-10 h-10 mb-4 text-gray-500 group-hover:text-indigo-600 transition-colors duration-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 16h2a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 19 9.5 5.5 5.5 0 0 0 7.207 8.021C7.137 8.017 7.071 8 7 8a4 4 0 0 0 0 8h2.167M12 20V9m0 0-2 2m2-2 2 2"
            />
          </svg>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          multiple
          onChange={onChange}
        />
      </label>
    </div>
  ) : (
    <div className="h-full flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full max-w-md  border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gradient-to-br from-indigo-50 to-white hover:from-indigo-100 hover:to-indigo-50 transition-all duration-200 shadow-lg group"
      >
        <div className="flex flex-col items-center justify-center pt-6 pb-6">
          <svg
            className="w-16 h-16 mb-4 text-gray-500 group-hover:text-indigo-600 transition-colors duration-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M16 16h2a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 19 9.5 5.5 5.5 0 0 0 7.207 8.021C7.137 8.017 7.071 8 7 8a4 4 0 0 0 0 8h2.167M12 20V9m0 0-2 2m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-base text-gray-500 font-semibold">
            Click hoặc kéo thả ảnh vào đây
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, JPEG, GIF (tối đa 5MB)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          multiple
          onChange={onChange}
        />
      </label>
    </div>
  );
};

export default ImageUpload;
