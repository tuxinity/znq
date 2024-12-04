import { db } from "@/lib/db";
import { Coinpayments } from "coinpayments";
import { NextRequest, NextResponse } from "next/server";

// CoinPayments API credentials
const COINPAYMENTS_API_KEY = process.env.COINPAYMENTS_API_KEY;
const COINPAYMENTS_API_SECRET = process.env.COINPAYMENTS_API_SECRET;

if (!COINPAYMENTS_API_KEY || !COINPAYMENTS_API_SECRET) {
  throw new Error("CoinPayments API credentials not configured");
}

const client = new Coinpayments({
  key: COINPAYMENTS_API_KEY,
  secret: COINPAYMENTS_API_SECRET,
});

// API handler for the transaction status check
export async function GET(req: NextRequest) {
  const txn_id = req.nextUrl.pathname.split('/').pop();

  if (!txn_id || typeof txn_id !== "string") {
    return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
  }

  try {
    const status = await client.getTx({ txid: txn_id });

    const txStatus = status.status === 1 ? "SUCCESS" : status.status === 0 ? "PENDING" : "REJECTED"

    await db.transaction.updateMany({
      where: { txnId: txn_id },
      data: { status: txStatus },
    });

    return NextResponse.json(status, { status: 200 });
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
