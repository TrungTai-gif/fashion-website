import mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Tag name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
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

TagSchema.index({ createdAt: -1 });

TagSchema.virtual("displayName").get(function () {
  return this.name;
});

TagSchema.pre("save", function (next) {
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

TagSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug, isActive: true });
};

TagSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

TagSchema.methods.softDelete = function () {
  this.isActive = false;
  return this.save();
};

TagSchema.methods.restore = function () {
  this.isActive = true;
  return this.save();
};

const Tag = mongoose.model("Tag", TagSchema);
export default Tag;
