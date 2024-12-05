import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Coinpayments } from "coinpayments";
import { NextRequest, NextResponse } from "next/server";

const COINPAYMENTS_API_KEY = process.env.COINPAYMENTS_API_KEY;
const COINPAYMENTS_API_SECRET = process.env.COINPAYMENTS_API_SECRET;

if (!COINPAYMENTS_API_KEY || !COINPAYMENTS_API_SECRET) {
  throw new Error("CoinPayments API credentials not configured");
}

const client = new Coinpayments({
  key: COINPAYMENTS_API_KEY,
  secret: COINPAYMENTS_API_SECRET,
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const txn_id = searchParams.get('txnid');
    const session = await auth()

    if (!session) {
      console.error('No session found');
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!txn_id) {
      return NextResponse.json({ success: false, error: "Transaction ID is required" }, { status: 400 });
    }

    const status = await client.getTx({ txid: txn_id });

    const txStatus = status.status === 1 ? "SUCCESS" : status.status === 0 ? "PENDING" : "REJECTED";

    await db.transaction.updateMany({
      where: { txnId: txn_id },
      data: { status: txStatus },
    });

    const updatedTransaction = await db.transaction.findFirst({
      where: { userId: session.user.id },
    });

    if (!updatedTransaction) {
      return NextResponse.json({ success: false, error: "Transaction not found in database" }, { status: 404 });
    }

    const response = {
      success: true,
      data: {
        transaction: {
          id: updatedTransaction.id,
          txnId: updatedTransaction.txnId,
          status: updatedTransaction.status,
          createdAt: updatedTransaction.createdAt,
        },
        coinpaymentsStatus: {
          status: status.status,
          statusText: status.status_text,
          coin: status.coin,
          amountf: status.amountf,
          receivedAmount: status.received,
          receivedConfirms: status.recv_confirms,
        }
      }
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    }, { status: 500 });
  }
}

