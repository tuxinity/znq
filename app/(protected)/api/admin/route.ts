import { NextResponse } from "next/server";
import { getCurrentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function GET() {
  const role = await getCurrentRole();

  if (role === UserRole.ADMIN) {
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 403 });
}
