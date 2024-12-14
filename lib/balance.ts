import { prisma } from "@/app/api/prisma";

export const getUserBalance = async (email: string): Promise<number> => {
  try {
   
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const depositTransactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        type: "DEPOSIT",
        status: "SUCCESS", 
      },
    });

    
    const totalBalance = depositTransactions.reduce(
      (acc, tx) => acc + (tx.valueToken || 0), 
      0
    );

    return totalBalance;
  } catch (error) {
        console.error("Error fetching user balance:", error);
    
    return 0;
  }
};
