import { db } from "@/lib/db";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      console.error('No session found');
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const whereClause = session.user.role === "ADMIN"
      ? {}
      : { id: session.user.id };

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const totalRecords = await db.user.count({ where: whereClause });

    const totalPages = Math.ceil(totalRecords / limit);

    const users = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      skip: (page - 1) * limit,
      take: limit
    });

    return NextResponse.json({
      users,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('User Route Error:', error);
    return NextResponse.json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
