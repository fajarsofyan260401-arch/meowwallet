import prisma from "./prisma";

export async function createAtomicTransaction({
  userId,
  accountId,
  destinationAccountId,
  categoryId,
  type,
  amount,
  title,
  note,
  date,
}) {
  const nominal = Math.round(Number(amount));
  if (nominal <= 0) throw new Error("Nominal harus lebih besar dari Rp0");

  return await prisma.$transaction(async (tx) => {
    const sourceAccount = await tx.account.findUnique({ where: { id: accountId } });
    if (!sourceAccount) throw new Error("Rekening sumber tidak ditemukan");

    if (type === "INCOME") {
      await tx.account.update({
        where: { id: accountId },
        data: { currentBalance: { increment: nominal } },
      });
    } else if (type === "EXPENSE") {
      if (sourceAccount.currentBalance < nominal) {
        throw new Error("Saldo rekening tidak mencukupi");
      }
      await tx.account.update({
        where: { id: accountId },
        data: { currentBalance: { decrement: nominal } },
      });
    } else if (type === "TRANSFER") {
      if (!destinationAccountId || accountId === destinationAccountId) {
        throw new Error("Rekening tujuan transfer tidak valid");
      }
      if (sourceAccount.currentBalance < nominal) {
        throw new Error("Saldo rekening asal tidak mencukupi");
      }
      await tx.account.update({
        where: { id: accountId },
        data: { currentBalance: { decrement: nominal } },
      });
      await tx.account.update({
        where: { id: destinationAccountId },
        data: { currentBalance: { increment: nominal } },
      });
    }

    return await tx.transaction.create({
      data: {
        userId,
        accountId,
        destinationAccountId: type === "TRANSFER" ? destinationAccountId : null,
        categoryId: type === "TRANSFER" ? null : categoryId,
        type,
        amount: nominal,
        title,
        note,
        date: date ? new Date(date) : new Date(),
      },
    });
  });
}

export async function deleteAtomicTransaction(transactionId) {
  return await prisma.$transaction(async (tx) => {
    const trx = await tx.transaction.findUnique({ where: { id: transactionId } });
    if (!trx) throw new Error("Transaksi tidak ditemukan");

    if (trx.type === "INCOME") {
      await tx.account.update({
        where: { id: trx.accountId },
        data: { currentBalance: { decrement: trx.amount } },
      });
    } else if (trx.type === "EXPENSE") {
      await tx.account.update({
        where: { id: trx.accountId },
        data: { currentBalance: { increment: trx.amount } },
      });
    } else if (trx.type === "TRANSFER" && trx.destinationAccountId) {
      await tx.account.update({
        where: { id: trx.accountId },
        data: { currentBalance: { increment: trx.amount } },
      });
      await tx.account.update({
        where: { id: trx.destinationAccountId },
        data: { currentBalance: { decrement: trx.amount } },
      });
    }

    await tx.transaction.delete({ where: { id: transactionId } });
  });
}

export async function processSavingsTransfer({
  savingsGoalId,
  accountId,
  type,
  amount,
  note,
}) {
  const nominal = Math.round(Number(amount));
  if (nominal <= 0) throw new Error("Nominal harus lebih besar dari Rp0");

  return await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUnique({ where: { id: accountId } });
    const goal = await tx.savingsGoal.findUnique({ where: { id: savingsGoalId } });

    if (!account || !goal) throw new Error("Rekening atau target tabungan tidak ditemukan");

    if (type === "DEPOSIT") {
      if (account.currentBalance < nominal) {
        throw new Error("Saldo rekening tidak mencukupi untuk menabung");
      }
      await tx.account.update({
        where: { id: accountId },
        data: { currentBalance: { decrement: nominal } },
      });
      await tx.savingsGoal.update({
        where: { id: savingsGoalId },
        data: { currentAmount: { increment: nominal } },
      });
    } else if (type === "WITHDRAW") {
      if (goal.currentAmount < nominal) {
        throw new Error("Saldo tabungan tidak mencukupi untuk ditarik");
      }
      await tx.savingsGoal.update({
        where: { id: savingsGoalId },
        data: { currentAmount: { decrement: nominal } },
      });
      await tx.account.update({
        where: { id: accountId },
        data: { currentBalance: { increment: nominal } },
      });
    }

    const record = await tx.savingsTransaction.create({
      data: {
        savingsGoalId,
        accountId,
        type,
        amount: nominal,
        note,
      },
    });

    const updated = await tx.savingsGoal.findUnique({ where: { id: savingsGoalId } });
    return { record, goalReached: updated.currentAmount >= updated.targetAmount };
  });
}