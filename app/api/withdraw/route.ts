// app/api/withdraw/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "../prisma";
import { getUserBalance } from "@/lib/balance";


export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id || !session?.user?.role) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.log("session data", session.user.role)
    
    const { id, role } = session.user as { id: string, role: string };
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const type = "WITHDRAW";

    const pageNumber = parseInt(page.toString(), 10);
    const pageLimit = parseInt(limit.toString(), 10);

    const whereClause = {
      ...(role === "ADMIN" ? {} : { userId: id }),
      type: type as string,
    };

    const totalRecords = await prisma.transaction.count({ where: whereClause });
    const totalPages = Math.ceil(totalRecords / pageLimit);

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
      skip: (pageNumber - 1) * pageLimit,
      take: pageLimit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      transactions,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    try {
      const session = await auth();
      
      if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const { id } = session.user as { id: string };
      const { amount } = await req.json();  // Parsing the JSON body
      
      if (!amount || amount <= 0) {
        return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
      }
  
      const balance = await getUserBalance(session.user.email as string);
      if (balance < amount) {
        return NextResponse.json({ error: 'Not enough balance' }, { status: 400 });
      }
  
      const withdraw = await prisma.transaction.create({
        data: {
          userId: id,
          txnId: "",
          txHash: "",
          value: amount,
          type: "WITHDRAW",
          status: "PENDING",
          reference: "",
          valueToken: 0,
        },
      });
  
      return NextResponse.json(withdraw, { status: 201 });
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      return NextResponse.json({ error: 'Failed to create withdrawal' }, { status: 500 });
    }
  }
