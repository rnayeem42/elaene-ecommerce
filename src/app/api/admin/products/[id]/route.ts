// src/app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import Product from "@/models/products";

type Params = {
  params: { id: string };
};

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    const product = await Product.findById(params.id).lean();

    if (!product) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      _id: product._id.toString(),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      category: product.category,
      inStock: product.inStock,
    });
  } catch (error) {
    console.error("GET /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl,
        category: body.category,
        inStock: body.inStock,
      },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated" });
  } catch (error) {
    console.error("PUT /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();
    await Product.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}