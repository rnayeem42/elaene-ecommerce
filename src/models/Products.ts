import mongoose, { Schema, model, models } from "mongoose";
import { ProductDocument, VariantsDocument } from "@/types/types";

const VariantsSchema = new Schema<VariantsDocument>({
  priceId: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
});

const ProductSchema = new Schema<ProductDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    variants: {
      type: [VariantsSchema],
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);