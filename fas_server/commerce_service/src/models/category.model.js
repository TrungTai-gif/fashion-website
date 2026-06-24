import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

CategorySchema.index({ createdAt: -1 });

CategorySchema.virtual("displayName").get(function () {
  return this.name;
});

CategorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    console.log(`Generated slug: ${this.slug} from name: ${this.name}`);
  }
  next();
});

CategorySchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

CategorySchema.methods.softDelete = function () {
  this.isActive = false;
  return this.save();
};

CategorySchema.methods.restore = function () {
  this.isActive = true;
  return this.save();
};

const Category = mongoose.model("Category", CategorySchema);
export default Category;
