import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../../prisma";

export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/");
  const id = segments[segments.length - 1]; // Extract the user ID from the URL

  if (!id) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email || undefined },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { role } = user;
    if (user.id !== id && role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Only admins can update other users." }, { status: 403 });
    }

    const body = await req.json();
    const { addressWallet } = body;

    if (!addressWallet) {
      return NextResponse.json({ error: "Invalid addressWallet" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { addressWallet },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
