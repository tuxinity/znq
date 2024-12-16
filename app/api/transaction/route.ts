import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { TransactionType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      console.error("No session found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";

    // Where clause for filtering deposit transactions
    const depositWhereClause = {
      userId: session.user.id,
      type: TransactionType.DEPOSIT,
    };

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Count total deposit transactions for pagination
    const totalRecords = await db.transaction.count({
      where: depositWhereClause,
    });

    const totalPages = Math.ceil(totalRecords / limit);

    // Calculate total transaction value for all deposit transactions
    const totalTransactionValue = isAdmin
      ? await db.transaction.aggregate({
          _sum: {
            value: true,
          },
          where: depositWhereClause,
        })
      : null;

    // Fetch deposit transactions with pagination
    const transactions = await db.transaction.findMany({
      where: depositWhereClause,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      transactions,
      totalPages,
      currentPage: page,
      ...(isAdmin && {
        totalTransactionValue: totalTransactionValue?._sum.value || 0,
      }),
    });
  } catch (error) {
    console.error("Transactions Route Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
