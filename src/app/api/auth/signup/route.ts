import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password, phone } = await req.json();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashed,
      phone,
    });

    return NextResponse.json(
      { email: user.email },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Signup failed" }, { status: 500 });
  }
}
