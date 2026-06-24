import { useState, useEffect } from "react";
import { assets } from "../../../assets/assets";
import ImageUpload from "./ImageUpload";

const ImageForm = ({ images, setImages, maxI }) => {
  const [maxImage, setMaxImage] = useState(1);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (maxI != 1) {
      setMaxImage(maxI);
    }
  });

  useEffect(() => {
    if (images && images.length > 0) {
      const previews = images.map((file) => {
        if (typeof file === "string") {
          return file;
        }
        return URL.createObjectURL(file);
      });
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }

    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [images]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const remainingSlots = maxImage - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    setImages((prev) => [...prev, ...filesToAdd]);
  };

  const handleRemoveImage = (index) => {
    if (imagePreviews[index] && imagePreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  return (
    <div className=" flex gap-5 flex-col ">
      {/* if there is at least one item */}
      {imagePreviews[0] && (
        <>
          <div
            key={0}
            className="relative max-w-54  flex mx-5 h-auto justify-center items-center bg-gray-200  overflow-hidden"
          >
            <button
              type="button"
              className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 hover:text-white rounded-full p-1 shadow transition z-10"
              onClick={() => handleRemoveImage(0)}
              title="Xóa ảnh này"
            >
              <img src={assets.close} alt="X" className="w-4 h-4" />
            </button>{" "}
            <img
              src={imagePreviews[0]}
              alt="Model wearing plain white basic tee."
              className="w-full overflow-hidden "
            />
          </div>
        </>
      )}
      <div className="flex flex-row flex-wrap gap-4 max-w-full py-2">
        {/* show all items */}
        {imagePreviews.length > 0 &&
          imagePreviews.slice(1).map((preview, index) => (
            <div
              key={index + 1}
              className="relative  w-18 h-18 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow"
            >
              <button
                type="button"
                className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 hover:text-white rounded-full p-1 shadow transition z-10"
                onClick={() => handleRemoveImage(index + 1)}
                title="Xóa ảnh này"
              >
                <img src={assets.close} alt="X" className="w-4 h-4" />
              </button>
              <img
                src={preview}
                alt={`Preview ${index + 2}`}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        {imagePreviews.length > 0 && imagePreviews.length < maxImage ? (
          <div className="w-16 h-16 flex items-center justify-center">
            <ImageUpload miniSize={true} onChange={handleImageChange} />
          </div>
        ) : null}
      </div>
      {/* if no items */}
      {imagePreviews.length === 0 ? (
        <div className="flex max-w-64 h-auto">
          <ImageUpload onChange={handleImageChange} />
        </div>
      ) : null}
    </div>
  );
};

export default ImageForm;
