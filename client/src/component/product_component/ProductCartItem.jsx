import { useContext, useEffect, useState } from "react";

import { ShopContext } from "../../context/ShopContext";

const ProductCartItem = ({ product }) => {
  const { addToCart } = useContext(ShopContext);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Helper function để lấy giá trị attribute theo tên
  const getAttributeValue = (variant, attributeName) => {
    const attr = variant.attributes?.find(
      (a) => {
        const nameLower = a.name.toLowerCase();
        const targetLower = attributeName.toLowerCase();
        if (targetLower === "color") {
          return nameLower === "màu" || nameLower === "color";
        }
        if (targetLower === "size") {
          return nameLower === "size";
        }
        return nameLower === targetLower;
      }
    );
    return attr?.value || "";
  };

  // Lấy danh sách unique colors từ TẤT CẢ variants
  const getUniqueColors = () => {
    if (!product?.variants) return [];
    const colors = product.variants
      .map((v) => getAttributeValue(v, "color"))
      .filter((value) => value !== "");
    return [...new Set(colors)];
  };

  // Lấy danh sách sizes CHỈ từ các variants có màu đang chọn
  const getAvailableSizes = (color) => {
    if (!product?.variants || !color) return [];
    const sizes = product.variants
      .filter((v) => getAttributeValue(v, "color") === color)
      .map((v) => getAttributeValue(v, "size"))
      .filter((value) => value !== "");
    return [...new Set(sizes)];
  };

  const uniqueColors = getUniqueColors();
  const availableSizes = getAvailableSizes(selectedColor);

  // Khởi tạo giá trị mặc định khi load product
  useEffect(() => {
    if (product && product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      const firstColor = getAttributeValue(firstVariant, "color");
      const firstSize = getAttributeValue(firstVariant, "size");

      setSelectedColor(firstColor);
      setSelectedSize(firstSize);
      setSelectedVariant(firstVariant);
    }
  }, [product]);

  // Khi đổi màu, tự động chọn size đầu tiên của màu đó
  useEffect(() => {
    if (selectedColor && product?.variants) {
      const sizesForColor = getAvailableSizes(selectedColor);
      if (sizesForColor.length > 0) {
        // Nếu size hiện tại không có trong màu mới, chọn size đầu tiên
        if (!sizesForColor.includes(selectedSize)) {
          setSelectedSize(sizesForColor[0]);
        }
      }
    }
  }, [selectedColor]);

  // Cập nhật variant khi chọn color hoặc size
  useEffect(() => {
    if (product?.variants && selectedColor && selectedSize) {
      const matchedVariant = product.variants.find((v) => {
        const color = getAttributeValue(v, "color");
        const size = getAttributeValue(v, "size");
        return color === selectedColor && size === selectedSize;
      });
      if (matchedVariant) {
        setSelectedVariant(matchedVariant);
      }
    }
  }, [selectedColor, selectedSize, product]);

  return product ? (
    <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-10 transition-opacity ease-in duration-300 opacity-100">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/*---------- Product Image Section */}
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] sm:w-20 lg:w-24 no-scrollbar">
              {product.variants
                ?.filter((v) => getAttributeValue(v, "color") === selectedColor)
                .map((item, index) => (
                  <img
                    onClick={() => {
                      setSelectedVariant(item);
                      setSelectedSize(getAttributeValue(item, "size"));
                    }}
                    key={index}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-cover cursor-pointer border-2 rounded-lg transition-all hover:opacity-75 ${
                      selectedVariant?._id === item._id
                        ? "border-pink-600 shadow-md"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                    src={item.image}
                    alt={`Variant ${index + 1}`}
                  />
                ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden">
              <img
                className="w-full h-auto object-cover max-h-[400px] sm:max-h-[500px] lg:max-h-[600px]"
                src={selectedVariant?.image}
                alt={product.name}
              />
            </div>
          </div>
        </div>

        {/* -------Product Info Section */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-4">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Giá sản phẩm */}
            <div className="mb-4">
              <p className="text-xl sm:text-xl font-bold text-red-500">
                {selectedVariant &&
                  new Intl.NumberFormat("vi-VN").format(selectedVariant.price) +
                    " đ"}
              </p>
            </div>

            {/* SKU & Stock */}
            <div className="flex flex-wrap items-center gap-4 mb-4 pb-4 border-b border-gray-200">
              {selectedVariant && (
                <>
                  <p className="text-sm text-gray-500">
                    SKU:{" "}
                    <span className="font-medium">{selectedVariant.sku}</span>
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      selectedVariant.stock > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedVariant.stock > 0
                      ? `✓ Còn ${selectedVariant.stock} sản phẩm`
                      : "✗ Hết hàng"}
                  </p>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 text-sm sm:text-base mb-6">
              {product.shortDescription}
            </p>

            {/* Color select */}
            {uniqueColors.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">
                  Màu sắc:{" "}
                  <span className="text-pink-600">{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {uniqueColors.map((color, idx) => (
                    <button
                      key={idx}
                      className={`px-2 py-1 border rounded-lg font-medium transition-all text-sm sm:text-base ${
                        selectedColor === color
                          ? "border-pink-600 bg-pink-50 text-pink-600 shadow-md"
                          : "border-gray-300 bg-white hover:border-pink-400 hover:bg-pink-50"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedColor(color);
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size select */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">
                  Size: <span className="text-pink-600">{selectedSize}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size, idx) => (
                    <button
                      key={idx}
                      className={`px-2 py-1 border rounded-lg font-medium transition-all text-sm sm:text-base ${
                        selectedSize === size
                          ? "border-pink-600 bg-pink-50 text-pink-600 shadow-md"
                          : "border-gray-300 bg-white hover:border-pink-400 hover:bg-pink-50"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedSize(size);
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            {selectedVariant && selectedVariant.stock > 0 && (
              <div className="mb-6">
                <p className="font-semibold text-gray-900 mb-3">Số lượng:</p>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-pink-600 font-bold text-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-md sm:text-xl font-semibold min-w-[3rem] text-center bg-gray-50 py-1 px-2 rounded-lg border border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setQuantity(
                        Math.min(selectedVariant.stock, quantity + 1)
                      );
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded-lg hover:bg-gray-100 hover:border-pink-600 font-bold text-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= selectedVariant.stock}
                  >
                    +
                  </button>
                  <span className="text-xs sm:text-sm text-gray-500">
                    Max: {selectedVariant.stock}
                  </span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                selectedVariant &&
                  addToCart(product, selectedVariant, quantity);
              }}
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className={`w-full py-1 sm:py-2 text-sm sm:text-base font-bold rounded-lg transition-all ${
                selectedVariant && selectedVariant.stock > 0
                  ? "bg-pink-600 text-white hover:bg-pink-700 active:scale-[0.98] shadow-lg hover:shadow-xl"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {selectedVariant && selectedVariant.stock > 0
                ? "THÊM VÀO GIỎ HÀNG"
                : "HẾT HÀNG"}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default ProductCartItem;
