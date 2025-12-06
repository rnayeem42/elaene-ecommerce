"use server";

import mongoose from "mongoose";
import { connectDB } from "@/libs/mongodb";
import Product from "@/models/products";   // <-- FIXED import
import { EnrichedProducts } from "@/types/types";

export const getAllProducts = async () => {
  try {
    await connectDB();
    const products: EnrichedProducts[] = await Product.find().lean();
    return products;
  } catch (error) {
    console.error("Error getting products:", error);
    throw new Error("Failed to fetch products");
  }
};

export const getCategoryProducts = async (category: string) => {
  try {
    await connectDB();
    const products: EnrichedProducts[] = await Product.find({ category });
    return products;
  } catch (error) {
    console.error("Error getting category products:", error);
    throw new Error("Failed to fetch category products");
  }
};

export const getRandomProducts = async (productId: string) => {
  const shuffleArray = (array: EnrichedProducts[]) => {
    const clone = [...array];
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  };

  try {
    await connectDB();
    const allProducts: EnrichedProducts[] = await Product.find().lean();
    const shuffled = shuffleArray(allProducts);
    return shuffled
      .filter((p) => p._id.toString() !== productId)
      .slice(0, 6);
  } catch (error) {
    console.error("Error getting random products:", error);
    throw new Error("Failed to fetch random products");
  }
};

export const getProduct = async (_id: string) => {
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return null;
    }

    const product = await Product.findById(_id).lean();
    return product;
  } catch (error) {
    console.error("Error getting product:", error);
    return null;
  }
};