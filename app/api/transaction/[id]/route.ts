import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/");
  const id = segments[segments.length - 1];

  if (!id) {
    return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 });
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

    const { role, id: userId } = user;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    if (role !== "ADMIN" && transaction.userId !== userId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(transaction, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const segments = pathname.split("/");
  const id = segments[segments.length - 1];

  if (!id) {
    return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 });
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

    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Only admins can update transaction status." }, { status: 403 });
    }

    const body = await req.json();
    const { txHash } = body;

    if (!txHash) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: { txHash },
    });

    return NextResponse.json(updatedTransaction, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
