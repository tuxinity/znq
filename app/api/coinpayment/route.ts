import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Coinpayments } from "coinpayments";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  amount: number;
  valueToken: number;
  paymentMethod: string;
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
    }

    const rawBody = await req.text();
    if (!rawBody) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    let body: RequestBody;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError); // Log the parsing error
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { amount, valueToken, paymentMethod } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    if (!valueToken || typeof valueToken !== "number" || valueToken <= 0) {
      return NextResponse.json({ error: "Invalid token value" }, { status: 400 });
    }

    const COINPAYMENTS_API_KEY = process.env.COINPAYMENTS_API_KEY;
    const COINPAYMENTS_API_SECRET = process.env.COINPAYMENTS_API_SECRET;
    const OWNER_USDT_ADDRESS = process.env.OWNER_USDT_ADDRESS;
    const OWNER_TRC_ADDRESS = process.env.OWNER_TRC_ADDRESS;

    if (!COINPAYMENTS_API_KEY || !COINPAYMENTS_API_SECRET || !OWNER_USDT_ADDRESS || !OWNER_TRC_ADDRESS) {
      return NextResponse.json({ error: "Payment configuration incomplete" }, { status: 500 });
    }

    const client = new Coinpayments({
      key: COINPAYMENTS_API_KEY,
      secret: COINPAYMENTS_API_SECRET,
    });

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const OWNER_ADDRESS = paymentMethod === "USDT.TRC20" ? OWNER_TRC_ADDRESS : OWNER_USDT_ADDRESS

    const transaction = await client.createTransaction({
      currency1: paymentMethod,
      currency2: paymentMethod,
      amount: amount,
      address: OWNER_ADDRESS,
      buyer_email: session.user.email,
    });

    if (!transaction?.status_url) {
      throw new Error("Invalid transaction response");
    }

    await db.transaction.create({
      data: {
        userId: user.id,
        txnId: transaction.txn_id,
        value: amount,
        valueToken,
        type: "DEPOSIT",
        status: "PENDING",
        reference: transaction.status_url,
      },
    });

    return NextResponse.json({
      txnId: transaction.txn_id,
      qrCode: transaction.qrcode_url,
      timeout: transaction.timeout,
      amount: transaction.amount,
      address: transaction.address,
      status: transaction.status_url,
      email: session.user.email,
    });

  } catch (error) {
    console.error("CoinPayments transaction error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transaction failed" },
      { status: 500 }
    );
  }
}