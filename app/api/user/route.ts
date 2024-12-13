import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      console.error("No session found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";

    // Adjust the where clause based on the user role
    const whereClause = session.user.role === "ADMIN"
      ? { role: { not: UserRole.ADMIN } } // Exclude ADMIN role for total records and user list
      : { id: session.user.id };

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Count total records excluding ADMIN role
    const totalRecords = await db.user.count({
      where: { role: { not: "ADMIN" } },
    });

    const totalPages = Math.ceil(totalRecords / limit);

    // Fetch users with the same exclusion rule
    const users = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      users,
      totalPages,
      currentPage: page,
      ...(isAdmin && { totalRecords }),
    });
  } catch (error) {
    console.error("User Route Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
