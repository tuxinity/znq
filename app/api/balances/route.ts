import { db } from '@/lib/db';
import { auth } from "@/auth";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const transactions = await db.transaction.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        type: true,
        value: true,
        valueToken: true,
        status: true,
        createdAt: true
      }
    });

    const balances = transactions.reduce((acc, txn) => {
      if (txn.status === 'SUCCESS') {
        acc.totalValue += txn.value;
        acc.totalValueToken += txn.valueToken;
      }
      return acc;
    }, {
      totalValue: 0,
      totalValueToken: 0,
      transactions: transactions
    });

    return NextResponse.json(balances);
  } catch (error) {
    console.error('Error fetching user balances:', error);
    return NextResponse.json({
      message: 'Error fetching balances',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}