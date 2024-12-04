import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(
      "https://www.coingecko.com/price_charts/50597/usd/24_hours.json",
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: `Failed to fetch market data: ${errorMessage}` },
      { status: 500 }
    );
  }
}