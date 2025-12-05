import { NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { name, email, phone, password } = await request.json();

    if (!email || !password || !phone || !name) {
      return NextResponse.json(
        { message: "Name, email, phone and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 },
      );
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
    });

    return NextResponse.json(
      {
        email: user.email,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("Error during signup:", error);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
