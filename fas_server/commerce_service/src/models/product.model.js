import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
      maxlength: [500, "Short description cannot exceed 500 characters"],
    },
    longDescription: {
      type: String,
      required: [true, "Long description is required"],
      trim: true,
      maxlength: [5000, "Long description cannot exceed 5000 characters"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand reference is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "At least one category is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      trim: true,
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    image: {
      type: String,
      default: "",
    },

    attributes: {
      type: [
        {
          name: { type: String, required: true, trim: true },
          values: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    cachedPrice: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "VND" },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
ProductSchema.index({ category: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ "cachedPrice.min": 1, "cachedPrice.max": 1 });
ProductSchema.index({
  name: "text",
  shortDescription: "text",
  longDescription: "text",
});

ProductSchema.virtual("variants", {
  ref: "Variant",
  localField: "_id",
  foreignField: "product",
});

// Virtual hiển thị giá
ProductSchema.virtual("displayPrice").get(function () {
  if (this.cachedPrice.min === this.cachedPrice.max) {
    return `${this.cachedPrice.min.toLocaleString()}₫`;
  }
  return `${this.cachedPrice.min.toLocaleString()}₫ - ${this.cachedPrice.max.toLocaleString()}₫`;
});

// Pre-save hook tạo slug
ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  next();
});

ProductSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, isActive: true })
    .populate("brand")
    .populate("category")
    .populate("tags");
};

ProductSchema.statics.findActive = function () {
  return this.find({ isActive: true })
    .populate("brand")
    .populate("category")
    .populate("tags");
};

ProductSchema.statics.findFeatured = function () {
  return this.find({ isFeatured: true, isActive: true })
    .populate("brand")
    .populate("category")
    .populate("tags");
};

ProductSchema.statics.findByCategory = function (categoryId) {
  return this.find({ category: categoryId, isActive: true })
    .populate("brand")
    .populate("category")
    .populate("tags");
};

ProductSchema.statics.findByBrand = function (brandId) {
  return this.find({ brand: brandId, isActive: true })
    .populate("brand")
    .populate("category")
    .populate("tags");
};

ProductSchema.statics.searchProducts = function (query) {
  return this.find({
    isActive: true,
    $text: { $search: query },
  })
    .populate("brand")
    .populate("category")
    .populate("tags")
    .sort({ score: { $meta: "textScore" } });
};
ProductSchema.methods.updateCachedPrice = async function () {
  const Variant = mongoose.model("Variant");
  const variants = await Variant.find({ product: this._id, isActive: true });

  let minPrice = 0;
  let maxPrice = 0;

  if (variants.length > 0) {
    const prices = variants.map((v) => v.price);
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);
  }

  this.cachedPrice.min = minPrice;
  this.cachedPrice.max = maxPrice;

  // Dùng updateOne thay vì save() để tránh full validation
  // (tránh lỗi khi data cũ có field không hợp lệ như category dạng string)
  await mongoose.model("Product").updateOne(
    { _id: this._id },
    { $set: { "cachedPrice.min": minPrice, "cachedPrice.max": maxPrice } }
  );

  return this;
};

ProductSchema.statics.generateVariants = function (product, basePrice = 0, baseStock = 0) {
  try {
    // Đảm bảo attributes là mảng
    const attributes = Array.isArray(product.attributes)
      ? product.attributes
      : [];
    if (attributes.length === 0) {
      console.log("⚠️ No attributes found, skip variant generation");
      return [];
    }
    // Lấy tất cả giá trị của từng thuộc tính
    const valuesArrays = attributes.map((attr) =>
      Array.isArray(attr.values) ? attr.values.filter(Boolean) : []
    );

    // Nếu có attribute nào không có value → không thể tạo variant
    if (valuesArrays.some((arr) => arr.length === 0)) {
      console.log("⚠️ Some attributes have no values → skip generation");
      return [];
    }

    // ✅ Hàm tạo tích Descartes (Cartesian product)
    const cartesian = (arrays) =>
      arrays.reduce(
        (acc, curr) => acc.flatMap((a) => curr.map((c) => [...a, c])),
        [[]]
      );

    const combinations = cartesian(valuesArrays);

    // ✅ Tạo danh sách variants
    const variants = combinations.map((values) => {
      const attrs = values.map((v, i) => ({
        name: attributes[i].name,
        value: v,
      }));

      const attributesKey = attrs.map((a) => `${a.name}:${a.value}`).join("|");
      const skuCode = `${product.slug}-${attrs
        .map((a) => a.value)
        .join("-")}`.toUpperCase();

      return {
        product: product._id,
        sku: skuCode,
        attributes: attrs,
        attributesKey,
        price: Number(basePrice),
        stock: Number(baseStock),
        image: product.image,
      };
    });

    return variants;
  } catch (error) {
    throw error;
  }
};

const Product = mongoose.model("Product", ProductSchema);
export default Product;
