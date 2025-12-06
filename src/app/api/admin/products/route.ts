// src/app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import Product from "@/models/Products";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    const serialized = products.map((doc: any) => ({
      _id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      price: doc.price,
      imageUrl: doc.imageUrl,
      category: doc.category,
      inStock: doc.inStock,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    await connectToDatabase();

    const product = await Product.create({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price,
      imageUrl: body.imageUrl,
      category: body.category,
      inStock: body.inStock ?? true,
    });

    return NextResponse.json(
      { message: "Product created", id: product._id.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 }
    );
  }
}
